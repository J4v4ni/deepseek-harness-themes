/** Theme pack import validation, id minting, storage, and selection state. */
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  browserStorage, createPackStore, importedPack, packId, parsePackFile, restorePacks, storedActiveId,
  storedPacks, storeActiveId, storePacks,
} from '../src/client/packs.ts'
import type { PackStorage } from '../src/client/packs.ts'
import type { ThemePack } from '../src/client/themes.ts'
import { BUILTIN_PACKS } from '../src/client/themes.ts'

/** One minimal valid pack file object. */
function packFile(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    name: 'Harbor dusk',
    colorScheme: 'dark',
    tokens: { '--dsw-alias-bg-base': '#101820' },
    ...overrides,
  }
}

/** In-memory storage double recording writes. */
function memoryStorage(initial: Record<string, string> = {}): PackStorage & { entries: Map<string, string> } {
  const entries = new Map(Object.entries(initial))
  return {
    entries,
    getItem: key => entries.get(key) ?? null,
    setItem: (key, value) => { entries.set(key, value) },
  }
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('parsePackFile', () => {
  it('accepts one pack object and normalizes its text fields', () => {
    expect(parsePackFile(JSON.stringify(packFile({
      name: '  Harbor dusk  ',
      description: '  Slate surfaces.  ',
    })))).toEqual({
      ok: true,
      packs: [{
        name: 'Harbor dusk',
        description: 'Slate surfaces.',
        colorScheme: 'dark',
        tokens: { '--dsw-alias-bg-base': '#101820' },
      }],
    })
  })

  it('drops an empty description instead of storing it', () => {
    const parsed = parsePackFile(JSON.stringify(packFile({ description: '   ' })))
    expect(parsed.ok).toBe(true)
    expect(parsed.ok && parsed.packs[0]).not.toHaveProperty('description')
  })

  it('accepts a bare list and a themed list', () => {
    const first = packFile({ name: 'First' })
    const second = packFile({ name: 'Second', colorScheme: 'light' })
    const list = parsePackFile(JSON.stringify([first, second]))
    expect(list.ok && list.packs.map(pack => pack.name)).toEqual(['First', 'Second'])
    const themed = parsePackFile(JSON.stringify({ themes: [second] }))
    expect(themed.ok && themed.packs.map(pack => pack.name)).toEqual(['Second'])
  })

  it('accepts an empty themed list', () => {
    expect(parsePackFile(JSON.stringify({ themes: [] }))).toEqual({ ok: true, packs: [] })
  })

  it('refuses text that is not JSON', () => {
    expect(parsePackFile('{ not json')).toEqual({ ok: false, reason: 'invalid-json' })
  })

  it('refuses files above the pack-count limit', () => {
    const nine = Array.from({ length: 9 }, (_, index) => packFile({ name: `Pack ${String(index)}` }))
    expect(parsePackFile(JSON.stringify(nine))).toEqual({ ok: false, reason: 'limit' })
  })

  it('refuses a pack above the token-count limit', () => {
    const tokens = Object.fromEntries(Array.from({ length: 257 }, (_, index) => [`--dsw-token-${String(index)}`, '#000000']))
    expect(parsePackFile(JSON.stringify(packFile({ tokens })))).toEqual({ ok: false, reason: 'limit' })
  })

  it.each([
    ['a non-object pack', 'null'],
    ['a missing name', packFile({ name: undefined })],
    ['a blank name', packFile({ name: '   ' })],
    ['an overlong name', packFile({ name: 'x'.repeat(49) })],
    ['an unknown scheme', packFile({ colorScheme: 'sepia' })],
    ['a non-string description', packFile({ description: 7 })],
    ['an overlong description', packFile({ description: 'x'.repeat(161) })],
    ['missing tokens', packFile({ tokens: undefined })],
    ['a non-object token map', packFile({ tokens: ['--dsw-alias-bg-base'] })],
    ['an empty token map', packFile({ tokens: {} })],
    ['a token outside the dsw namespace', packFile({ tokens: { '--other-token': '#000000' } })],
    ['an overlong token name', packFile({ tokens: { [`--dsw-${'x'.repeat(76)}`]: '#000000' } })],
    ['a non-string token value', packFile({ tokens: { '--dsw-alias-bg-base': 12 } })],
    ['an empty token value', packFile({ tokens: { '--dsw-alias-bg-base': '' } })],
    ['an overlong token value', packFile({ tokens: { '--dsw-alias-bg-base': 'x'.repeat(241) } })],
  ])('refuses %s', (_label, entry) => {
    const text = typeof entry === 'string' ? entry : JSON.stringify(entry)
    expect(parsePackFile(text)).toEqual({ ok: false, reason: 'invalid-shape' })
  })
})

describe('packId', () => {
  it('slugifies the name and suffixes collisions', () => {
    expect(packId('Harbor dusk', new Set())).toBe('custom-harbor-dusk')
    expect(packId('Harbor dusk', new Set(['custom-harbor-dusk']))).toBe('custom-harbor-dusk-2')
    expect(packId('Harbor dusk', new Set(['custom-harbor-dusk', 'custom-harbor-dusk-2']))).toBe('custom-harbor-dusk-3')
  })

  it('falls back to a generic slug when the name has no latin characters', () => {
    expect(packId('夜港', new Set())).toBe('custom-theme')
  })
})

describe('importedPack', () => {
  it('freezes the record and derives its preview swatches', () => {
    const pack = importedPack({
      name: 'Harbor dusk',
      colorScheme: 'dark',
      tokens: {
        '--dsw-specific-sidebar-fill': '#101820',
        '--dsw-alias-brand-primary': '#c8763c',
      },
    }, 'custom-harbor-dusk')
    expect(pack).toMatchObject({
      id: 'custom-harbor-dusk',
      builtin: false,
      colorScheme: 'dark',
      name: 'Harbor dusk',
    })
    expect(pack.description).toBeUndefined()
    // The missing warning token falls back to the surface ink.
    expect(pack.swatches).toEqual(['#101820', '#c8763c', '#808080'])
    expect(Object.isFrozen(pack)).toBe(true)
    expect(Object.isFrozen(pack.tokens)).toBe(true)
  })

  it('carries an author description verbatim', () => {
    const pack = importedPack({
      name: 'Harbor dusk',
      description: 'Slate surfaces.',
      colorScheme: 'light',
      tokens: { '--dsw-alias-label-primary': '#101820' },
    }, 'custom-harbor-dusk')
    expect(pack.description).toBe('Slate surfaces.')
    expect(pack.swatches).toEqual(['#101820', '#101820', '#101820'])
  })
})

describe('restorePacks', () => {
  it('returns nothing for absent or corrupt storage text', () => {
    expect(restorePacks(null)).toEqual([])
    expect(restorePacks('{ not json')).toEqual([])
    expect(restorePacks(JSON.stringify({ packs: [] }))).toEqual([])
  })

  it('drops entries without an id, duplicate ids, and invalid packs', () => {
    const valid = { id: 'custom-kept', ...packFile({ name: 'Kept' }) }
    const stored = JSON.stringify([
      valid,
      { ...valid },
      { id: '', ...packFile({ name: 'No id' }) },
      { id: 'custom-broken', name: 'Broken', colorScheme: 'dark', tokens: {} },
      { id: 'custom-scheme', ...packFile({ name: 'Scheme', colorScheme: 'sepia' }) },
      'not a pack',
      { id: 'custom-light', ...packFile({ name: 'Light', colorScheme: 'light' }) },
    ])
    expect(restorePacks(stored).map(pack => pack.id)).toEqual(['custom-kept', 'custom-light'])
  })

  it('caps a stored list at the import limit', () => {
    const stored = JSON.stringify(Array.from({ length: 10 }, (_, index) => ({
      id: `custom-${String(index)}`,
      ...packFile({ name: `Pack ${String(index)}` }),
    })))
    expect(restorePacks(stored)).toHaveLength(8)
  })
})

describe('storage helpers', () => {
  it('round-trips packs through storage, keeping descriptions', () => {
    const storage = memoryStorage()
    const pack = importedPack({
      name: 'Harbor dusk',
      description: 'Slate surfaces.',
      colorScheme: 'dark',
      tokens: { '--dsw-alias-bg-base': '#101820' },
    }, 'custom-harbor-dusk')
    storePacks(storage, [pack])
    expect(storedPacks(storage)).toEqual([pack])
    expect(JSON.parse(storage.entries.get('dsh.ui-themes.packs.v1') ?? '[]')).toEqual([{
      id: 'custom-harbor-dusk',
      name: 'Harbor dusk',
      description: 'Slate surfaces.',
      colorScheme: 'dark',
      tokens: { '--dsw-alias-bg-base': '#101820' },
    }])
  })

  it('writes a pack without a description and reads an absent selection as empty', () => {
    const storage = memoryStorage()
    storePacks(storage, [importedPack({ name: 'Plain', colorScheme: 'light', tokens: { '--dsw-alias-bg-base': '#ffffff' } }, 'custom-plain')])
    expect(JSON.parse(storage.entries.get('dsh.ui-themes.packs.v1') ?? '[]')).toEqual([{
      id: 'custom-plain',
      name: 'Plain',
      colorScheme: 'light',
      tokens: { '--dsw-alias-bg-base': '#ffffff' },
    }])
    expect(storedActiveId(storage)).toBe('')
    storeActiveId(storage, 'cod-tactical')
    expect(storedActiveId(storage)).toBe('cod-tactical')
  })

  it('stores an imported pack id in place of a missing name', () => {
    const storage = memoryStorage()
    storePacks(storage, [{
      id: 'custom-nameless',
      colorScheme: 'dark',
      tokens: { '--dsw-alias-bg-base': '#101820' },
      swatches: ['#101820', '#101820', '#101820'],
      builtin: false,
    }])
    expect(JSON.parse(storage.entries.get('dsh.ui-themes.packs.v1') ?? '[]')).toEqual([{
      id: 'custom-nameless',
      name: 'custom-nameless',
      colorScheme: 'dark',
      tokens: { '--dsw-alias-bg-base': '#101820' },
    }])
  })

  it('treats a withheld store as empty and write-free', () => {
    expect(storedPacks(undefined)).toEqual([])
    expect(storedActiveId(undefined)).toBe('')
    expect(() => { storePacks(undefined, []) }).not.toThrow()
    expect(() => { storeActiveId(undefined, 'cod-tactical') }).not.toThrow()
  })

  it('survives a store that throws on every call', () => {
    const blocked: PackStorage = {
      getItem: () => { throw new Error('blocked') },
      setItem: () => { throw new Error('blocked') },
    }
    expect(storedPacks(blocked)).toEqual([])
    expect(storedActiveId(blocked)).toBe('')
    expect(() => { storePacks(blocked, []) }).not.toThrow()
    expect(() => { storeActiveId(blocked, 'cod-tactical') }).not.toThrow()
  })

  it('reads the browser store, or reports its absence when access throws', () => {
    vi.stubGlobal('localStorage', memoryStorage())
    expect(browserStorage()).toBe(globalThis.localStorage)
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      get: () => { throw new Error('blocked') },
    })
    expect(browserStorage()).toBeUndefined()
  })
})

describe('createPackStore', () => {
  it('publishes selection and pack changes only when they move', () => {
    const store = createPackStore([], '')
    const listener = vi.fn()
    const unsubscribe = store.subscribe(listener)
    const initial = store.getSnapshot()
    store.setActive('')
    expect(store.getSnapshot()).toBe(initial)
    store.addPacks([])
    expect(store.getSnapshot()).toBe(initial)
    store.removePack('custom-missing')
    expect(store.getSnapshot()).toBe(initial)
    expect(listener).not.toHaveBeenCalled()

    const pack = importedPack({ name: 'Harbor dusk', colorScheme: 'dark', tokens: { '--dsw-alias-bg-base': '#101820' } }, 'custom-harbor-dusk')
    store.addPacks([pack])
    expect(listener).toHaveBeenCalledTimes(1)
    expect(store.getSnapshot().packs).toEqual([pack])
    expect(store.getSnapshot().activeId).toBe('')

    store.setActive('custom-harbor-dusk')
    expect(listener).toHaveBeenCalledTimes(2)
    expect(store.getSnapshot().activeId).toBe('custom-harbor-dusk')
    expect(Object.isFrozen(store.getSnapshot())).toBe(true)

    unsubscribe()
    store.setActive('')
    expect(listener).toHaveBeenCalledTimes(2)
  })

  it('clears the selection when its pack is removed', () => {
    const pack = importedPack({ name: 'Harbor dusk', colorScheme: 'dark', tokens: { '--dsw-alias-bg-base': '#101820' } }, 'custom-harbor-dusk')
    const store = createPackStore([pack], 'custom-harbor-dusk')
    store.removePack('custom-harbor-dusk')
    expect(store.getSnapshot()).toEqual({ activeId: '', packs: [] })
  })

  it('keeps another selection when an inactive pack is removed', () => {
    const keep: ThemePack = BUILTIN_PACKS[0]!
    const pack = importedPack({ name: 'Harbor dusk', colorScheme: 'dark', tokens: { '--dsw-alias-bg-base': '#101820' } }, 'custom-harbor-dusk')
    const store = createPackStore([pack], 'cod-tactical')
    store.removePack('custom-harbor-dusk')
    expect(store.getSnapshot()).toEqual({ activeId: 'cod-tactical', packs: [] })
    expect(keep.id).toBe('cod-tactical')
  })
})
