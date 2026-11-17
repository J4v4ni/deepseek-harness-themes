/**
 * Theme pack plugin registration: the sidebar launcher entry, the override
 * layer lifecycle, the Appearance drift signal, and pack import/removal.
 */
import { Context, type Fiber } from '@deepseek-ai/cordis'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SlotRegistry } from '@deepseek-ai/dsh-client-ui-renderer/client'
import type { PropsRenderSlots } from '@deepseek-ai/dsh-client-ui-slots'
import { LocaleRuntime } from '@deepseek-ai/dsh-client-locale/client'
import type { ThemePreference, ThemeSnapshot, ThemeTokenOverrides } from '@deepseek-ai/dsh-client-ui-theme/client'
import { apply, inject } from '@deepseek-ai/dsh-client-ui-themes/client'
import { apply as hostApply } from '../src/index.ts'
import { ThemeStudio, type ThemeStudioInjected } from '../src/client/ThemeStudio.tsx'
import { BUILTIN_PACKS, PACK_LAYER_SOURCE } from '../src/client/themes.ts'
import { importedPack } from '../src/client/packs.ts'
import type { PackStorage } from '../src/client/packs.ts'

const owners = new Set<Fiber>()
afterEach(async () => {
  try {
    for (const owner of owners) await owner.dispose()
  } finally {
    owners.clear()
    vi.unstubAllGlobals()
  }
})

/** In-memory storage double. */
function memoryStorage(initial: Record<string, string> = {}): PackStorage & { entries: Map<string, string> } {
  const entries = new Map(Object.entries(initial))
  return {
    entries,
    getItem: key => entries.get(key) ?? null,
    setItem: (key, value) => { entries.set(key, value) },
  }
}

/**
 * Theme service double: one layer per source, a preference, and the same
 * `theme/change` publications the real runtime emits for both writes.
 */
function fakeTheme(ctx: Context) {
  const layers = new Map<string, ThemeTokenOverrides>()
  let preference: ThemePreference = 'system'
  const snapshot = (): ThemeSnapshot => ({
    preference,
    fontSizes: { text: 14, code: 11, terminal: 13 },
    fontFamilies: { text: '', code: '', terminal: '' },
    active: { id: 'light', colorScheme: 'light', tokens: {} },
    themes: [],
    revision: 0,
  })
  const emit = (): void => { ctx.emit('theme/change', snapshot()) }
  return {
    layers,
    preference: () => preference,
    service: {
      overrideTokens(source: string, tokens: ThemeTokenOverrides): () => void {
        const dispose = (): void => {
          if (layers.get(source) === tokens) layers.delete(source)
        }
        layers.set(source, tokens)
        emit()
        return dispose
      },
      setTheme(id: ThemePreference): void {
        preference = id
        emit()
      },
      getTheme: snapshot,
    },
    /** Simulate the user choosing another Appearance option. */
    choose(next: ThemePreference): void {
      preference = next
      emit()
    },
  }
}

/** Root frame that consumes the footer seat, authorizing the declaration. */
function FooterFrame({ renderSlot }: PropsRenderSlots<'sidebar.footer.action'>) {
  return renderSlot('sidebar.footer.action', { wide: true })
}

async function bench({ declare = true, storage }: { declare?: boolean; storage?: PackStorage } = {}) {
  if (storage !== undefined) vi.stubGlobal('localStorage', storage)
  const root = new Context()
  let ctx: Context | undefined
  const owner = root.plugin((owned: Context) => { ctx = owned })
  owners.add(owner)
  await owner.await()
  if (ctx === undefined) throw new Error('the theme fixture owner did not activate')
  await ctx.plugin(SlotRegistry).await()
  ctx.provide('locale', new LocaleRuntime(ctx))
  const theme = fakeTheme(ctx)
  ctx.provide('theme', theme.service as never)
  const slots = ctx.get('slots') as SlotRegistry
  if (declare) {
    slots.register({
      name: 'root',
      children: { 'sidebar.footer.action': { kind: 'list', scope: 'root' } },
    }, FooterFrame)
  }
  return { ctx, slots, theme }
}

/** Mount the plugin and return its sidebar-face registration. */
async function mount(b: Awaited<ReturnType<typeof bench>>) {
  const fiber = b.ctx.plugin({ inject: [...inject], apply })
  await fiber.await()
  const entry = b.slots.entries('sidebar.footer.action')[0]
  if (entry === undefined) throw new Error('the theme launcher did not register')
  return { fiber, entry, face: (entry.inject as () => ThemeStudioInjected)() }
}

/** One importable pack file. */
function packText(name = 'Harbor dusk'): string {
  return JSON.stringify({
    name,
    description: 'Slate surfaces.',
    colorScheme: 'dark',
    tokens: { '--dsw-alias-bg-base': '#101820' },
  })
}

describe('ui-themes apply', () => {
  it('keeps the host Loader entry inert', () => {
    expect(hostApply).not.toThrow()
  })

  it('declares only the services it uses', () => {
    expect(inject).toEqual(['slots', 'locale', 'theme'])
  })

  it('registers the paintbrush launcher in the sidebar footer seat', async () => {
    const b = await bench()
    const { entry } = await mount(b)
    expect(b.slots.entries('sidebar.footer.action')).toHaveLength(1)
    expect(entry.component).toBe(ThemeStudio)
    expect(entry.options).toMatchObject({ id: 'theme-studio', order: 10 })
    expect(entry.locale).toBe('sidebar.themes')
    expect(Object.keys((entry.inject as () => ThemeStudioInjected)())).toEqual(['selectPack', 'importFile', 'removePack', 'hooks'])
  })

  it('starts on the default appearance with no stored selection', async () => {
    const storage = memoryStorage()
    const b = await bench({ storage })
    const { face } = await mount(b)
    expect(b.theme.layers.size).toBe(0)
    expect(b.theme.preference()).toBe('system')
    expect(face.hooks.packs.getSnapshot()).toEqual({ activeId: '', packs: [] })
  })

  it('waits for the sidebar declaration before registering', async () => {
    const b = await bench({ declare: false })
    const fiber = b.ctx.plugin({ inject: [...inject], apply })
    await fiber.await()
    expect(b.slots.entries('sidebar.footer.action')).toEqual([])
    const disposeRoot = b.slots.register({
      name: 'root',
      children: { 'sidebar.footer.action': { kind: 'list', scope: 'root' } },
    }, FooterFrame)
    expect(b.slots.entries('sidebar.footer.action')).toHaveLength(1)
    disposeRoot()
    expect(b.slots.entries('sidebar.footer.action')).toEqual([])
    await fiber.dispose()
  })

  it('applies a built-in pack as one layer over its base scheme', async () => {
    const storage = memoryStorage()
    const b = await bench({ storage })
    const { face } = await mount(b)
    const pack = BUILTIN_PACKS[0]!
    face.selectPack(pack.id)
    const layer = b.theme.layers.get(PACK_LAYER_SOURCE)
    expect(layer).toBeDefined()
    expect(Object.keys(layer ?? {})).toEqual(Object.keys(pack.tokens))
    expect(layer?.['--dsw-alias-bg-base']).toEqual({ light: pack.tokens['--dsw-alias-bg-base'], dark: pack.tokens['--dsw-alias-bg-base'] })
    expect(b.theme.preference()).toBe(pack.colorScheme)
    expect(face.hooks.packs.getSnapshot().activeId).toBe(pack.id)
    expect(storage.entries.get('dsh.ui-themes.active.v1')).toBe(pack.id)
  })

  it('returns to the default appearance and drops the layer', async () => {
    const storage = memoryStorage()
    const b = await bench({ storage })
    const { face } = await mount(b)
    face.selectPack(BUILTIN_PACKS[1]!.id)
    expect(b.theme.layers.size).toBe(1)
    face.selectPack('')
    expect(b.theme.layers.size).toBe(0)
    expect(face.hooks.packs.getSnapshot().activeId).toBe('')
    expect(storage.entries.get('dsh.ui-themes.active.v1')).toBe('')
  })

  it('ignores an unknown pack id', async () => {
    const b = await bench({ storage: memoryStorage() })
    const { face } = await mount(b)
    face.selectPack('custom-missing')
    expect(b.theme.layers.size).toBe(0)
    expect(face.hooks.packs.getSnapshot().activeId).toBe('')
  })

  it('keeps the layer while the appearance still matches the pack scheme', async () => {
    const b = await bench({ storage: memoryStorage() })
    const { face } = await mount(b)
    const pack = BUILTIN_PACKS[0]!
    face.selectPack(pack.id)
    b.theme.choose(pack.colorScheme)
    expect(b.theme.layers.size).toBe(1)
    expect(face.hooks.packs.getSnapshot().activeId).toBe(pack.id)
  })

  it('drops the layer when the user picks another appearance', async () => {
    const storage = memoryStorage()
    const b = await bench({ storage })
    const { face } = await mount(b)
    face.selectPack(BUILTIN_PACKS[0]!.id)
    b.theme.choose('light')
    expect(b.theme.layers.size).toBe(0)
    expect(face.hooks.packs.getSnapshot().activeId).toBe('')
    expect(storage.entries.get('dsh.ui-themes.active.v1')).toBe('')
  })

  it('ignores appearance changes while no pack is applied', async () => {
    const b = await bench({ storage: memoryStorage() })
    await mount(b)
    expect(() => { b.theme.choose('dark') }).not.toThrow()
    expect(b.theme.layers.size).toBe(0)
  })

  it('restores a stored pack and its selection', async () => {
    const stored = importedPack({
      name: 'Harbor dusk',
      colorScheme: 'dark',
      tokens: { '--dsw-alias-bg-base': '#101820' },
    }, 'custom-harbor-dusk')
    const storage = memoryStorage({
      'dsh.ui-themes.packs.v1': JSON.stringify([{
        id: stored.id,
        name: stored.name,
        colorScheme: stored.colorScheme,
        tokens: stored.tokens,
      }]),
      'dsh.ui-themes.active.v1': stored.id,
    })
    const b = await bench({ storage })
    const { face } = await mount(b)
    expect(face.hooks.packs.getSnapshot().packs.map(pack => pack.id)).toEqual([stored.id])
    expect(face.hooks.packs.getSnapshot().activeId).toBe(stored.id)
    expect(b.theme.layers.get(PACK_LAYER_SOURCE)).toBeDefined()
    expect(b.theme.preference()).toBe('dark')
  })

  it('clears a stored selection that no longer resolves', async () => {
    const storage = memoryStorage({ 'dsh.ui-themes.active.v1': 'custom-gone' })
    const b = await bench({ storage })
    const { face } = await mount(b)
    expect(face.hooks.packs.getSnapshot().activeId).toBe('')
    expect(b.theme.layers.size).toBe(0)
    expect(storage.entries.get('dsh.ui-themes.active.v1')).toBe('')
  })

  it('reports an unreadable file instead of importing it', async () => {
    const b = await bench({ storage: memoryStorage() })
    const { face } = await mount(b)
    const file = { text: () => Promise.reject(new Error('io')) } as File
    await expect(face.importFile(file)).resolves.toBe('read')
    expect(face.hooks.packs.getSnapshot().packs).toEqual([])
  })

  it('reports a refused file and leaves the state alone', async () => {
    const b = await bench({ storage: memoryStorage() })
    const { face } = await mount(b)
    await expect(face.importFile(new File(['not json'], 'theme.json'))).resolves.toBe('invalid-json')
    expect(face.hooks.packs.getSnapshot().packs).toEqual([])
  })

  it('imports a pack, selects it, and persists both', async () => {
    const storage = memoryStorage()
    const b = await bench({ storage })
    const { face } = await mount(b)
    await expect(face.importFile(new File([packText()], 'theme.json'))).resolves.toBe('ok')
    const snapshot = face.hooks.packs.getSnapshot()
    expect(snapshot.packs.map(pack => pack.id)).toEqual(['custom-harbor-dusk'])
    expect(snapshot.activeId).toBe('custom-harbor-dusk')
    expect(storage.entries.get('dsh.ui-themes.active.v1')).toBe('custom-harbor-dusk')
    expect(JSON.parse(storage.entries.get('dsh.ui-themes.packs.v1') ?? '[]')).toHaveLength(1)
    expect(b.theme.layers.get(PACK_LAYER_SOURCE)).toBeDefined()
  })

  it('accepts an empty theme list without selecting anything', async () => {
    const storage = memoryStorage()
    const b = await bench({ storage })
    const { face } = await mount(b)
    await expect(face.importFile(new File([JSON.stringify({ themes: [] })], 'theme.json'))).resolves.toBe('ok')
    expect(face.hooks.packs.getSnapshot()).toEqual({ activeId: '', packs: [] })
    expect(b.theme.layers.size).toBe(0)
    expect(storage.entries.get('dsh.ui-themes.packs.v1')).toBe('[]')
  })

  it('keeps the pack when the appearance re-adopts the system preference', async () => {
    const b = await bench({ storage: memoryStorage() })
    const { face } = await mount(b)
    face.selectPack(BUILTIN_PACKS[0]!.id)
    b.theme.choose('system')
    expect(b.theme.layers.size).toBe(1)
    expect(face.hooks.packs.getSnapshot().activeId).toBe(BUILTIN_PACKS[0]!.id)
  })

  it('suffixes a colliding imported name', async () => {
    const b = await bench({ storage: memoryStorage() })
    const { face } = await mount(b)
    await face.importFile(new File([packText()], 'theme.json'))
    await face.importFile(new File([packText()], 'theme.json'))
    expect(face.hooks.packs.getSnapshot().packs.map(pack => pack.id)).toEqual(['custom-harbor-dusk', 'custom-harbor-dusk-2'])
    expect(face.hooks.packs.getSnapshot().activeId).toBe('custom-harbor-dusk-2')
  })

  it('removes an active imported pack and its layer', async () => {
    const storage = memoryStorage()
    const b = await bench({ storage })
    const { face } = await mount(b)
    await face.importFile(new File([packText()], 'theme.json'))
    face.removePack('custom-harbor-dusk')
    expect(face.hooks.packs.getSnapshot()).toEqual({ activeId: '', packs: [] })
    expect(b.theme.layers.size).toBe(0)
    expect(storage.entries.get('dsh.ui-themes.packs.v1')).toBe('[]')
  })

  it('removes an inactive imported pack without touching the selection', async () => {
    const b = await bench({ storage: memoryStorage() })
    const { face } = await mount(b)
    face.selectPack(BUILTIN_PACKS[0]!.id)
    await face.importFile(new File([packText()], 'theme.json'))
    face.selectPack(BUILTIN_PACKS[0]!.id)
    face.removePack('custom-harbor-dusk')
    expect(face.hooks.packs.getSnapshot().activeId).toBe(BUILTIN_PACKS[0]!.id)
    expect(face.hooks.packs.getSnapshot().packs).toEqual([])
    expect(b.theme.layers.size).toBe(1)
  })

  it('removes the layer and the registration on teardown', async () => {
    const b = await bench({ storage: memoryStorage() })
    const { fiber, face } = await mount(b)
    face.selectPack(BUILTIN_PACKS[0]!.id)
    expect(b.theme.layers.size).toBe(1)
    await fiber.dispose()
    expect(b.theme.layers.size).toBe(0)
    expect(b.slots.entries('sidebar.footer.action')).toEqual([])
  })

  it('applies packs without a usable browser store', async () => {
    vi.stubGlobal('localStorage', memoryStorage())
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      get: () => { throw new Error('blocked') },
    })
    const b = await bench()
    const { face } = await mount(b)
    face.selectPack(BUILTIN_PACKS[0]!.id)
    expect(face.hooks.packs.getSnapshot().activeId).toBe(BUILTIN_PACKS[0]!.id)
    await expect(face.importFile(new File([packText()], 'theme.json'))).resolves.toBe('ok')
    expect(face.hooks.packs.getSnapshot().packs).toHaveLength(1)
  })
})
