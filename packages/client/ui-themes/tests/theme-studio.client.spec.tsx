// @vitest-environment jsdom
/**
 * Theme studio behavior: the sidebar launcher, the pack grid, selection,
 * file import, refusal reporting, removal, and the collapsed rail.
 */
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react'
import { LocaleRuntime } from '@deepseek-ai/dsh-client-locale/client'
import { SlotTestRuntime } from '@deepseek-ai/dsh-client-test-runtime'
import { apply, inject } from '@deepseek-ai/dsh-client-ui-themes/client'

const runtimes: SlotTestRuntime[] = []
afterEach(async () => {
  try {
    for (const runtime of runtimes.splice(0)) await runtime.dispose()
  } finally {
    cleanup()
    vi.unstubAllGlobals()
  }
})

/** Theme service double: the studio only writes one layer and one base scheme. */
interface ThemeDouble {
  overrideTokens(source: string, tokens: Record<string, unknown>): () => void
  setTheme(id: string): void
}

/** Inert theme service; the apply spec owns layer semantics. */
function inertTheme(): ThemeDouble {
  return {
    overrideTokens: () => () => {},
    setTheme: () => {},
  }
}

/** Mount the plugin on the test runtime and render its sidebar-foot entry. */
async function mountStudio({ wide = true, theme = inertTheme() }: {
  wide?: boolean
  theme?: ThemeDouble
} = {}) {
  const runtime = await SlotTestRuntime.create()
  runtimes.push(runtime)
  const locale = new LocaleRuntime(runtime.ctx)
  runtime.ctx.provide('locale', locale)
  runtime.ctx.provide('theme', theme as never)
  runtime.slots.installLocale(locale)
  await runtime.mount({ inject: [...inject], apply })
  await runtime.declare({ 'sidebar.footer.action': { kind: 'list', scope: 'root' } })
  runtime.renderSlot('sidebar.footer.action', { wide })
}

/** Open the studio through its launcher. */
function openStudio(): HTMLElement {
  fireEvent.click(screen.getByRole('button', { name: 'Themes' }))
  return screen.getByRole('dialog', { name: 'Themes' })
}

/** One importable theme file. */
function themeFile(name = 'Harbor dusk'): File {
  return new File([JSON.stringify({
    name,
    description: 'Slate surfaces.',
    colorScheme: 'dark',
    tokens: { '--dsw-alias-bg-base': '#101820' },
  })], 'theme.json')
}

/** The studio's hidden file picker. */
function fileInput(): HTMLInputElement {
  const input = document.querySelector('input[type="file"]')
  if (!(input instanceof HTMLInputElement)) throw new Error('the studio rendered no file input')
  return input
}

describe('theme studio', () => {
  it('renders the paintbrush row with its label when the sidebar is wide', async () => {
    await mountStudio()
    const launcher = screen.getByRole('button', { name: 'Themes' })
    expect(launcher.getAttribute('aria-haspopup')).toBe('dialog')
    expect(launcher.getAttribute('aria-expanded')).toBe('false')
    expect(launcher.textContent).toBe('Themes')
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('opens the studio on the default appearance and lists every shipped pack', async () => {
    await mountStudio()
    const dialog = openStudio()
    expect(screen.getByRole('button', { name: 'Themes' }).getAttribute('aria-expanded')).toBe('true')
    expect(screen.getByRole('button', { name: /^Default/ }).getAttribute('aria-pressed')).toBe('true')
    for (const name of ['Call of Duty: Tactical', 'Solo Leveling: Shadow', 'GTA 6: Vice Sunset', 'Attack on Titan: Scouts']) {
      expect(dialog.textContent).toContain(name)
    }
    expect(dialog.textContent).toContain('Load theme file')
  })

  it('selects a shipped pack and returns to the default tile', async () => {
    await mountStudio()
    openStudio()
    fireEvent.click(screen.getByRole('button', { name: /^Call of Duty/ }))
    expect(screen.getByRole('button', { name: /^Call of Duty/ }).getAttribute('aria-pressed')).toBe('true')
    expect(screen.getByRole('button', { name: /^Default/ }).getAttribute('aria-pressed')).toBe('false')
    fireEvent.click(screen.getByRole('button', { name: /^Default/ }))
    expect(screen.getByRole('button', { name: /^Default/ }).getAttribute('aria-pressed')).toBe('true')
    expect(screen.getByRole('button', { name: /^Call of Duty/ }).getAttribute('aria-pressed')).toBe('false')
  })

  it('applies the shipped pack tokens over its own base scheme', async () => {
    const calls: string[] = []
    await mountStudio({
      theme: {
        overrideTokens: (source: string) => { calls.push(`layer:${source}`); return () => {} },
        setTheme: (id: string) => { calls.push(`scheme:${id}`) },
      },
    })
    openStudio()
    fireEvent.click(screen.getByRole('button', { name: /^Call of Duty/ }))
    expect(calls).toEqual(['layer:@deepseek-ai/dsh-client-ui-themes', 'scheme:dark'])
  })

  it('imports a theme file and selects the imported pack', async () => {
    await mountStudio()
    openStudio()
    fireEvent.change(fileInput(), { target: { files: [themeFile()] } })
    const card = await screen.findByRole('button', { name: /^Harbor dusk/ })
    expect(card.getAttribute('aria-pressed')).toBe('true')
    expect(screen.getByRole('button', { name: 'Remove Harbor dusk' })).toBeTruthy()
  })

  it('reports a refused file and keeps the current selection', async () => {
    await mountStudio()
    openStudio()
    fireEvent.change(fileInput(), { target: { files: [new File(['not json'], 'theme.json')] } })
    const alert = await screen.findByRole('alert')
    expect(alert.textContent).toBe("That file isn't valid JSON.")
    expect(screen.getByRole('button', { name: /^Default/ }).getAttribute('aria-pressed')).toBe('true')
  })

  it('ignores a change event without a chosen file', async () => {
    await mountStudio()
    openStudio()
    fireEvent.change(fileInput(), { target: { files: [] } })
    expect(screen.queryByRole('alert')).toBeNull()
    expect(screen.getByRole('button', { name: /^Default/ }).getAttribute('aria-pressed')).toBe('true')
  })

  it('removes an imported pack', async () => {
    await mountStudio()
    openStudio()
    fireEvent.change(fileInput(), { target: { files: [themeFile()] } })
    await screen.findByRole('button', { name: /^Harbor dusk/ })
    fireEvent.click(screen.getByRole('button', { name: 'Remove Harbor dusk' }))
    await waitFor(() => { expect(screen.queryByRole('button', { name: /^Harbor dusk/ })).toBeNull() })
    expect(screen.getByRole('button', { name: /^Default/ }).getAttribute('aria-pressed')).toBe('true')
  })

  it('closes from the footer action and clears a reported failure', async () => {
    await mountStudio()
    openStudio()
    fireEvent.change(fileInput(), { target: { files: [new File(['not json'], 'theme.json')] } })
    await screen.findByRole('alert')
    fireEvent.click(screen.getByRole('button', { name: 'Done' }))
    expect(screen.queryByRole('dialog')).toBeNull()
    openStudio()
    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('reselects an imported pack after returning to the default tile', async () => {
    await mountStudio()
    openStudio()
    fireEvent.change(fileInput(), { target: { files: [themeFile()] } })
    await screen.findByRole('button', { name: /^Harbor dusk/ })
    fireEvent.click(screen.getByRole('button', { name: /^Default/ }))
    expect(screen.getByRole('button', { name: /^Harbor dusk/ }).getAttribute('aria-pressed')).toBe('false')
    fireEvent.click(screen.getByRole('button', { name: /^Harbor dusk/ }))
    expect(screen.getByRole('button', { name: /^Harbor dusk/ }).getAttribute('aria-pressed')).toBe('true')
  })

  it('lists an imported pack without a description', async () => {
    await mountStudio()
    openStudio()
    fireEvent.change(fileInput(), {
      target: {
        files: [new File([JSON.stringify({
          name: 'Bare slate',
          colorScheme: 'light',
          tokens: { '--dsw-alias-bg-base': '#f4f4f4' },
        })], 'theme.json')],
      },
    })
    const card = await screen.findByRole('button', { name: 'Bare slate' })
    expect(card.textContent).toBe('Bare slate')
  })

  it('opens the file picker from the load button', async () => {
    await mountStudio()
    openStudio()
    const click = vi.spyOn(HTMLInputElement.prototype, 'click')
    fireEvent.click(screen.getByRole('button', { name: 'Load theme file' }))
    expect(click).toHaveBeenCalledTimes(1)
  })

  it('renders only the round control in the collapsed rail', async () => {
    await mountStudio({ wide: false })
    const launcher = screen.getByRole('button', { name: 'Themes' })
    expect(launcher.textContent).toBe('')
    fireEvent.click(launcher)
    expect(screen.getByRole('dialog', { name: 'Themes' })).toBeTruthy()
  })
})
