/**
 * Registers the sidebar paintbrush launcher, the theme studio, and the four
 * shipped palettes.
 *
 * A pack is applied as one `ctx.theme.overrideTokens` layer plus the pack's
 * own base color scheme. Writing the pack's scheme as the durable preference
 * (rather than registering a custom theme id) keeps the pack from being
 * retracted when the settings scope re-adopts its stored section: the
 * preference already equals the pack's scheme. Choosing a different base
 * scheme in the Appearance row therefore shows up as a `theme/change` whose
 * preference no longer matches the applied pack, and that is the signal to
 * drop the layer.
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis'
import type { ThemeTokenOverrides } from '@deepseek-ai/dsh-client-ui-theme/client'
// Type-only: pulls the locale plugin's Context merge (ctx.locale).
import type {} from '@deepseek-ai/dsh-client-locale/client'
// Type-only: pulls the SlotRegistry service merge (ctx.slots).
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
// Type-only: pulls the `sidebar.footer.action` declaration.
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'
import type { ThemePack } from './themes.ts'
import { BUILTIN_PACKS, PACK_LAYER_SOURCE } from './themes.ts'
import type { ImportOutcome } from './packs.ts'
import {
  browserStorage, createPackStore, importedPack, packId, parsePackFile, storedActiveId, storedPacks,
  storeActiveId, storePacks,
} from './packs.ts'
import type { ThemeKey } from './locales.ts'
import { de, en, es, fr, ja, pt, ru, zh } from './locales.ts'
import { PACK_ATTRIBUTE, skinCss } from './skins.ts'
import type { ThemeStudioInjected } from './ThemeStudio.tsx'
import { ThemeStudio } from './ThemeStudio.tsx'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** Theme studio copy: launcher label, pack names, import failures. */
    'sidebar.themes': ThemeKey
  }
}

/** Dictionary namespace owned by this plugin. */
const NS = 'sidebar.themes'

/** Tag stamp the injected skin stylesheet is found and replaced by. */
const SKIN_TAG = 'data-ds-theme-skin'

/**
 * Drop the injected skin stylesheet and its `body` attribute.
 * The Default tile therefore restores the shell exactly as it shipped.
 */
function removeSkin(): void {
  if (typeof document === 'undefined') return
  document.body.removeAttribute(PACK_ATTRIBUTE)
  document.querySelector(`style[${SKIN_TAG}]`)?.remove()
}

/**
 * Install one pack's skin: the `body` attribute every rule is scoped by, plus
 * the stylesheet that carries fonts, art, frames, and chrome.
 * @param id - pack id; packs without a skin leave the shell untouched.
 */
function applySkin(id: string): void {
  removeSkin()
  if (typeof document === 'undefined') return
  const css = skinCss(id)
  if (css === undefined) return
  const style = document.createElement('style')
  style.setAttribute(SKIN_TAG, id)
  style.textContent = css
  document.head.append(style)
  document.body.setAttribute(PACK_ATTRIBUTE, id)
}

/** Services required by the theme pack plugin. */
export const inject = ['slots', 'locale', 'theme']

/**
 * Register the launcher, the studio, and the pack layer lifecycle.
 * @param ctx - Client root context.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en, ja, es, fr, de, ru, pt }), 'ui-themes: dictionaries')

  const storage = browserStorage()
  const restored = storedPacks(storage)
  const restoredId = storedActiveId(storage)
  const initial = [...BUILTIN_PACKS, ...restored].find(pack => pack.id === restoredId)
  const packs = createPackStore(restored, initial?.id ?? '')

  let applied: ThemePack | undefined
  let layer: (() => void) | undefined
  // Set while this plugin moves the preference itself, so the drift listener
  // below does not read its own write as an Appearance-row change.
  let applying = false

  const dropLayer = (): void => {
    if (layer === undefined) return
    layer()
    layer = undefined
  }

  const clearPack = (): void => {
    dropLayer()
    removeSkin()
    applied = undefined
    packs.setActive('')
    storeActiveId(storage, '')
  }

  const applyPack = (pack: ThemePack): void => {
    const overrides: ThemeTokenOverrides = {}
    for (const [name, value] of Object.entries(pack.tokens)) overrides[name] = { light: value, dark: value }
    applying = true
    try {
      dropLayer()
      layer = ctx.theme.overrideTokens(PACK_LAYER_SOURCE, overrides)
      ctx.theme.setTheme(pack.colorScheme)
    } finally {
      applying = false
    }
    applySkin(pack.id)
    applied = pack
    packs.setActive(pack.id)
    storeActiveId(storage, pack.id)
  }

  const selectPack = (id: string): void => {
    if (id === '') {
      clearPack()
      return
    }
    const pack = [...BUILTIN_PACKS, ...packs.getSnapshot().packs].find(candidate => candidate.id === id)
    if (pack === undefined) return
    applyPack(pack)
  }

  const importFile = async (file: File): Promise<ImportOutcome> => {
    let text: string
    try {
      text = await file.text()
    } catch {
      // An unreadable file is a reported outcome, not a thrown error: the studio owns the message line.
      return 'read'
    }
    const parsed = parsePackFile(text)
    if (!parsed.ok) return parsed.reason
    const taken = new Set([...BUILTIN_PACKS, ...packs.getSnapshot().packs].map(pack => pack.id))
    const added = parsed.packs.map((entry) => {
      const id = packId(entry.name, taken)
      taken.add(id)
      return importedPack(entry, id)
    })
    packs.addPacks(added)
    storePacks(storage, packs.getSnapshot().packs)
    const first = added[0]
    if (first !== undefined) applyPack(first)
    return 'ok'
  }

  const removePack = (id: string): void => {
    if (packs.getSnapshot().activeId === id) clearPack()
    packs.removePack(id)
    storePacks(storage, packs.getSnapshot().packs)
  }

  ctx.on('theme/change', (snapshot) => {
    if (applying || applied === undefined) return
    // `system` carries no preference of its own: the settings scope re-adopts
    // it after every write, so treating it as drift would drop a light pack on
    // a dark desktop the moment it is restored. Only an explicit other
    // appearance clears the pack.
    if (snapshot.preference === 'system') return
    if (snapshot.preference === applied.colorScheme) return
    clearPack()
  })

  ctx.effect(() => () => {
    dropLayer()
    removeSkin()
  }, 'ui-themes: pack layer')

  const face = (): ThemeStudioInjected => ({ selectPack, importFile, removePack, hooks: { packs } })
  ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({
    name: 'sidebar.footer.action',
    id: 'theme-studio',
    order: 10,
    locale: NS,
    inject: face,
  }, ThemeStudio))

  if (initial !== undefined) applyPack(initial)
  else if (restoredId !== '') storeActiveId(storage, '')
}
