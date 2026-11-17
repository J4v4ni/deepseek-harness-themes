/**
 * Per-pack skins: every shipped pack paints a scoped stylesheet, imported
 * packs do not, and the scoping attribute is the one the plugin sets.
 */
import { describe, expect, it } from 'vitest'
import { BUILTIN_PACKS } from '../src/client/themes.ts'
import { PACK_ATTRIBUTE, skinCss } from '../src/client/skins.ts'

describe('pack skins', () => {
  it('ships a skin for every built-in pack', () => {
    for (const pack of BUILTIN_PACKS) {
      const css = skinCss(pack.id)
      expect(css, pack.id).toBeDefined()
      expect(css).toContain(`body[${PACK_ATTRIBUTE}="${pack.id}"]`)
    }
  })

  it('scopes every rule of a skin to its own pack', () => {
    const css = skinCss('cod-tactical') ?? ''
    const scope = 'body[data-ds-theme-pack="cod-tactical"]'
    const selectors = css
      .split('}')
      .map(block => block.split('{')[0] ?? '')
      .map(block => block.replace(/\/\*[\s\S]*?\*\//gu, '').trim())
      .filter(selector => selector !== '')
      .flatMap(selector => selector.split(',').map(part => part.trim()).filter(Boolean))
    expect(selectors.length).toBeGreaterThan(20)
    expect(selectors.filter(selector => !selector.startsWith(scope))).toEqual([])
  })

  it('carries fonts, art, and chrome rather than colour alone', () => {
    const css = skinCss('aot-scout') ?? ''
    expect(css).toContain('font-family:')
    expect(css).toContain('background:')
    expect(css).toContain('[data-slot="sidebar"]')
    expect(css).toContain('[data-slot="conversation.composer"]')
  })

  it('leaves imported packs without a skin', () => {
    expect(skinCss('custom-harbor-dusk')).toBeUndefined()
  })
})
