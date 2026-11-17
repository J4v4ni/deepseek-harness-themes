---
description: "Theme packs for the dsh web client: four shipped palettes, a sidebar paintbrush launcher, and a theme studio that imports and stores JSON packs."
kind: "package-reference"
---

# @deepseek-ai/dsh-client-ui-themes

English | [中文](README.zh.md)

## Summary

`dsh-client-ui-themes` repaints the whole Web harness with selectable theme packs and puts the control in the sidebar foot. Four packs ship: Call of Duty tactical dark, Solo Leveling shadow violet, GTA 6 vice sunset, and Attack on Titan scout parchment. A paintbrush row above Settings opens a studio that lists every pack, imports new packs from a JSON file, keeps them in browser storage, and restores the selection after reload. Each pack is one alias-token layer over the light or dark base palette, so the sidebar, conversation, composer, and status surfaces change together.

## Table of Contents

- [Use this package](#use-this-package)
- [Understand the implementation](#understand-the-implementation)
- [Further Exploration](#further-exploration)
- [Model Experience](#model-experience)
- [Known Limitations and Deferred Work](#known-limitations-and-deferred-work)
- [Dev Note](#dev-note)

-----

<a id="use-this-package"></a>
## Use this package

### Switching packs

The Themes row sits in the sidebar foot directly above the Settings row and the signed-in account row. Selecting it opens the theme studio, which lists the Default tile, the four shipped packs, and every imported pack as a card with a three-color preview strip. Selecting a card applies that pack immediately; the Default tile returns the harness to the light, dark, or system appearance chosen in Settings → General → Appearance.

### Loading a pack file

The studio's **Load theme file** action accepts a JSON file holding one pack or a `{"themes": [...]}` list of up to eight packs. Each pack names itself, declares the base palette it was drawn for, and supplies `--dsw-*` token values:

```json
{
  "name": "Harbor dusk",
  "description": "Slate surfaces with a copper signal color.",
  "colorScheme": "dark",
  "tokens": {
    "--dsw-alias-bg-base": "#101820",
    "--dsw-alias-label-primary": "#e6eef5",
    "--dsw-alias-brand-primary": "#c8763c"
  }
}
```

Names are at most 48 characters, descriptions at most 160, and a pack carries at most 256 tokens whose names start with `--dsw-` and whose values are at most 240 characters. A file that is not JSON, lacks a name, scheme, or tokens, or exceeds those limits is refused with one error line inside the studio. A successful import selects the first imported pack. Imported packs and the current selection survive reloads in `localStorage`; a refused or unreadable store only shortens their life to the current page.

### Where the launcher sits

The row occupies the sidebar's `sidebar.footer.action` seat, which the shell renders above the Settings seat in both sidebar widths. The expanded column shows the paintbrush and the Themes label in the same geometry as the Settings row; the collapsed rail shows a 36×36 round button. The studio is a body-portaled modal, so it is not clipped by the sidebar column.

### What a pack changes

A pack is not only a palette. Each shipped pack also carries a **skin**: a stylesheet injected while the pack is applied and scoped to `body[data-ds-theme-pack="<id>"]`. The skin sets the interface and display font stacks, paints the page background (tactical grid, starfield nebula, sunset palms, parchment), frames the sidebar, content column, composer, dialogs and menus, and restyles navigation rows, header tabs, message cards, the send button, and the status bar. Choosing the Default tile removes the token layer and the skin together, restoring the stock shell.

Skin rules address stable `data-slot` seats (`sidebar`, `conversation.header`, `conversation.composer`, `conversation.chat.node`, `shell.bottom`), ARIA roles, and dedicated semantic hooks for transcript rows (`data-chat-user-row`, `data-turn-error`, `data-retry-row`, and `data-turn-process`) rather than CSS Module class names, so a skin keeps working when a build rehashes those names. Imported packs carry tokens only.

-----

<a id="understand-the-implementation"></a>
## Understand the implementation

A pack is applied through `ctx.theme.overrideTokens` as one layer whose source is the package id, plus `ctx.theme.setTheme(pack.colorScheme)`. Every pack token is written as a `{ light, dark }` pair with the same value in both modes because the layer stores both modes and the presenter reads only the active one. The layer composes over the built-in palette, so the four shipped packs and imported packs share one mechanism and a pack may override any alias or `--dsw-specific-*` token the shell draws with.

The pack's color scheme is written as the durable theme preference instead of registering a custom theme id. The settings scope re-adopts its stored section after every write and reconnect, and a custom id would be reset by that adoption; writing the pack's own scheme means the adopted preference already matches, so the layer stays. Choosing a different Appearance cube changes the preference, which arrives as a `theme/change` whose preference no longer equals the applied pack's scheme, and that is the only signal the plugin uses to drop the layer and clear the selection. `system` is exempt because the settings scope re-adopts it after every write: treating it as drift would drop a light pack on a dark desktop the moment it was restored, so only an explicit light or dark choice clears a pack. Applying a pack suppresses that listener for the duration of its own two writes.

The paintbrush row registers into `sidebar.footer.action` through `ctx.slots.inject`, so it waits for the sidebar declaration, disappears when the declaration collapses, and leaves with the plugin fiber. Pack state is a `createPackStore` handle published to the studio through the inject `hooks` compartment; the studio reads it with `usePacks` and never subscribes itself. The fiber disposer removes the override layer, so unloading the plugin restores the plain palette.

-----

<a id="further-exploration"></a>
## Further Exploration

- [ui-theme](../ui-theme/README.md) — the theme registry, the built-in palettes, and the override layer this package composes.
- [ui-sidebar](../ui-sidebar/README.md) — declares the `sidebar.footer.action` seat the launcher fills.
- [Web styling](../../../docs/web-styling.md) — the token and CSS Module rules the studio styles follow.

-----

<a id="model-experience"></a>
## Model Experience

None, as the package is a browser-side UI plugin layer that registers nothing model-facing.

#### KV Cache effect

None; this package neither assembles nor sends a provider request.

## Known Limitations and Deferred Work

<a id="known-limitations-and-deferred-work"></a>

These limits are current package constraints, not pending cleanup.

- **Imported packs are not validated for completeness** — the studio checks names, schemes, and token syntax; a pack that overrides only a few tokens inherits the rest of its base palette and may leave some surfaces unchanged.
- **Pack state lives in browser storage** — imported packs and the selection do not sync across browsers or devices, and clearing site data removes them.
- **A pack cannot replace product icons** — `ThemeDefinition.icons` exists on the theme service, but this package registers no theme definition and ships no artwork.
- **The shipped skins still use system font fallbacks and CSS-drawn ornaments** — locally bundled display fonts and dedicated SVG/texture assets remain future work; screenshots must be reviewed in the running application before treating a pack as visually complete.
- **Only the active color scheme is meaningful** — every token is stored for both modes with one value, so a pack cannot paint different light and dark palettes.
- **A skin is an authored approximation, not a build of the concept art** — background art is drawn from CSS gradients and inline SVG, fonts come from the operating system, and no pack ships custom illustrations or icon sets.

<a id="dev-note"></a>
### Dev Note

<details>
<summary>Working context for maintainers — click to expand</summary>

Adding a shipped pack means one frozen `ThemePack` in `src/client/themes.ts`, one entry in `BUILTIN_PACKS`, and `pack.*` name and description keys in all eight dictionaries of `src/client/locales.ts`. The token list should stay in step with the aliases the shell reads; `src/styles/design-platform.css` in ui-theme is the authority for token names.

</details>
