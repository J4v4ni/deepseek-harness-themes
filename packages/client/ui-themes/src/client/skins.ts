import { COD_TACTICAL_EXTRAS } from './skins/cod-tactical.ts'
import { SOLO_LEVELING_EXTRAS } from './skins/solo-leveling.ts'
import { GTA_VICE_EXTRAS } from './skins/gta-vice.ts'
import { AOT_SCOUT_EXTRAS } from './skins/aot-scout.ts'

/**
 * Per-pack visual skins: the part of a theme that colour tokens cannot express.
 *
 * A skin is one scoped stylesheet injected while its pack is applied and
 * removed with it. Every rule hangs off `body[data-ds-theme-pack="<id>"]`, the
 * attribute the plugin sets beside the tokens, so two packs never fight and the
 * Default tile restores the untouched shell.
 *
 * Rules address stable structure rather than hashed class names: the `data-slot`
 * seats the shell declares (`sidebar`, `conversation.header`,
 * `conversation.composer`, `conversation.chat.node`, `shell.bottom`, …), ARIA
 * roles, and element kinds inside them. That keeps a skin working across
 * rebuilds, where CSS Module hashes change.
 */

/** One skin's parameter set: what the shared chrome rules are painted with. */
interface SkinSpec {
  /** Body text stack. */
  readonly fontUi: string
  /** Heading and brand stack. */
  readonly fontDisplay: string
  /** Code, terminal, and status-bar stack. */
  readonly fontMono: string
  /** Primary accent. */
  readonly accent: string
  /** Secondary accent used for focus and selection rules. */
  readonly accent2: string
  /** Body ink. */
  readonly ink: string
  /** Muted ink. */
  readonly dim: string
  /** Frame line color. */
  readonly frame: string
  /** Panel paint behind the sidebar, composer, and dialogs. */
  readonly panel: string
  /** Panel corner radius. */
  readonly radius: string
  /** Full-page background art layers. */
  readonly art: string
  /** Composer card paint; light skins need a light card. */
  readonly cardBg: string
  /** Ink drawn on top of the primary accent (send button glyph). */
  readonly onAccent: string
  /** Theme-specific ornament appended after the shared chrome rules. */
  readonly extras: string
}

/** The four skins' shared parameters; each theme's ornament lives in its `extras`. */
const SPEC = {
  'cod-tactical': {
    fontUi: "'Bahnschrift SemiCondensed', 'Bahnschrift', 'Arial Narrow', 'Segoe UI', sans-serif",
    fontDisplay: "'Bahnschrift SemiCondensed', 'Bahnschrift', 'Impact', 'Arial Narrow', sans-serif",
    fontMono: "'Consolas', 'SF Mono', monospace",
    accent: '#8fe36f',
    accent2: '#e8b84f',
    ink: '#e7edde',
    dim: '#8d997f',
    frame: 'rgba(143, 227, 111, 0.52)',
    panel: 'linear-gradient(180deg, rgba(20, 27, 21, 0.96), rgba(10, 15, 11, 0.98))',
    radius: '2px',
    art: `radial-gradient(120% 80% at 50% -10%, rgba(143, 227, 111, 0.10), transparent 62%),
      repeating-linear-gradient(0deg, rgba(198, 214, 180, 0.045) 0 1px, transparent 1px 4px),
      repeating-linear-gradient(90deg, rgba(198, 214, 180, 0.03) 0 1px, transparent 1px 132px),
      repeating-linear-gradient(45deg, rgba(143, 191, 95, 0.028) 0 2px, transparent 2px 16px),
      #080b09`,
    cardBg: 'linear-gradient(180deg, rgba(28, 36, 26, 0.94), rgba(12, 17, 12, 0.96))',
    onAccent: '#0b0b0b',
    extras: '',
  },
  'solo-leveling': {
    fontUi: "'Segoe UI', 'Inter', system-ui, sans-serif",
    fontDisplay: "'Montserrat', 'Segoe UI', sans-serif",
    fontMono: "'Consolas', 'SF Mono', monospace",
    accent: '#7c5cff',
    accent2: '#38d6ff',
    ink: '#e9edff',
    dim: '#7f8bbb',
    frame: 'rgba(124, 92, 255, 0.55)',
    panel: 'linear-gradient(180deg, rgba(13, 18, 40, 0.94), rgba(6, 9, 22, 0.97))',
    radius: '10px',
    art: `radial-gradient(58% 42% at 76% 8%, rgba(124, 92, 255, 0.34), transparent 72%),
      radial-gradient(46% 38% at 18% 82%, rgba(56, 214, 255, 0.16), transparent 74%),
      radial-gradient(1.4px 1.4px at 12% 22%, #ffffff, transparent 100%),
      radial-gradient(1.2px 1.2px at 32% 8%, #dfe6ff, transparent 100%),
      radial-gradient(1.6px 1.6px at 68% 32%, #ffffff, transparent 100%),
      radial-gradient(1.2px 1.2px at 84% 62%, #cfe0ff, transparent 100%),
      radial-gradient(1.1px 1.1px at 48% 74%, #ffffff, transparent 100%),
      radial-gradient(1.3px 1.3px at 6% 56%, #d8e3ff, transparent 100%),
      radial-gradient(1.1px 1.1px at 92% 18%, #ffffff, transparent 100%),
      #04060f`,
    cardBg: 'linear-gradient(180deg, rgba(22, 28, 58, 0.9), rgba(7, 10, 24, 0.94))',
    onAccent: '#0b0b0b',
    extras: '',
  },
  'gta-vice': {
    fontUi: "'Segoe UI', 'Inter', system-ui, sans-serif",
    fontDisplay: "'Impact', 'Haettenschweiler', 'Arial Black', sans-serif",
    fontMono: "'Consolas', 'SF Mono', monospace",
    accent: '#ff2f92',
    accent2: '#22d3ee',
    ink: '#ffe9f6',
    dim: '#d6abc9',
    frame: 'rgba(255, 47, 146, 0.6)',
    panel: 'linear-gradient(180deg, rgba(37, 15, 52, 0.85), rgba(17, 7, 26, 0.95))',
    radius: '8px',
    art: `radial-gradient(60% 46% at 50% 96%, rgba(255, 150, 80, 0.5), transparent 70%),
      radial-gradient(30% 30% at 50% 74%, rgba(255, 214, 120, 0.35), transparent 70%),
      linear-gradient(180deg, #1b0a2c 0%, #3d1046 30%, #7d2352 54%, #c93a5f 68%, #2a0f2c 100%)`,
    cardBg: 'linear-gradient(180deg, rgba(52, 18, 44, 0.82), rgba(14, 6, 22, 0.92))',
    onAccent: '#17081c',
    extras: '',
  },
  'aot-scout': {
    fontUi: "'Georgia', 'Palatino Linotype', 'Book Antiqua', serif",
    fontDisplay: "'Palatino Linotype', 'Book Antiqua', Georgia, serif",
    fontMono: "'Consolas', 'SF Mono', monospace",
    accent: '#8c2f2a',
    accent2: '#5a6b52',
    ink: '#2c2a24',
    dim: '#736d60',
    frame: 'rgba(122, 92, 48, 0.65)',
    panel: 'linear-gradient(180deg, rgba(243, 234, 214, 0.97), rgba(226, 213, 187, 0.98))',
    radius: '3px',
    art: `radial-gradient(120% 90% at 50% 0%, rgba(255, 250, 235, 0.7), transparent 70%),
      radial-gradient(40% 30% at 12% 18%, rgba(150, 120, 70, 0.10), transparent 70%),
      radial-gradient(35% 26% at 84% 62%, rgba(150, 120, 70, 0.10), transparent 70%),
      #eadfc6`,
    cardBg: 'linear-gradient(180deg, rgba(255, 252, 241, 0.94), rgba(233, 220, 194, 0.96))',
    onAccent: '#fffaf0',
    extras: '',
  },
} satisfies Record<string, SkinSpec>

/** Serialize a spec into the scoped stylesheet for one pack id. */
function buildSkin(id: string, s: SkinSpec): string {
  const scope = `body[data-ds-theme-pack="${id}"]`
  return `
/* ---------- ${id} ---------- */
${scope} {
  --sk-accent: ${s.accent};
  --sk-accent2: ${s.accent2};
  --sk-ink: ${s.ink};
  --sk-dim: ${s.dim};
  --sk-frame: ${s.frame};
  --sk-radius: ${s.radius};
  font-family: ${s.fontUi};
  background-color: transparent;
}

/* Background art and its grain ride fixed layers behind the shell. */
${scope}::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: ${s.art};
  background-blend-mode: normal;
}
${scope}::after {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.5;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E");
}
${scope} [data-slot="root"] {
  position: relative;
  z-index: 1;
}
${scope} [data-slot="root"],
${scope} [data-slot="root"] * {
  font-family: inherit;
}

/* The shell paints an opaque base colour; a skin replaces it with the art. */
${scope} [data-slot="root"] > div,
${scope} [data-slot="root"] > div > div,
${scope} [data-slot="main"],
${scope} [data-slot="main.conversation"],
${scope} [data-slot="rightbar"],
${scope} [data-slot="shell.bottom"] {
  background-color: transparent !important;
  background-image: none !important;
}
${scope} [data-slot="root"] {
  background: transparent !important;
}
${scope} [data-slot="main.conversation"] > div,
${scope} [data-slot="main.conversation"] > div > div,
${scope} [data-slot="conversation.hero.frame"],
${scope} [data-slot="conversation.hero.frame"] > div,
${scope} [data-slot="conversation.session"],
${scope} [data-slot="conversation.body"] {
  background-color: transparent !important;
  background-image: none !important;
}
/* The whale hero canvas belongs to the stock shell; skins show their own art. */
${scope} canvas[data-home-whale],
${scope} [data-home-whale] {
  opacity: 0 !important;
}

/* ---------- chrome: the frame surfaces ---------- */
${scope} [data-slot="sidebar"] {
  position: relative;
  border: 1px solid var(--sk-frame) !important;
  border-radius: var(--sk-radius);
  background: ${s.panel} !important;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.45),
    0 18px 60px rgba(0, 0, 0, 0.45),
    inset 0 0 90px rgba(0, 0, 0, 0.22);
  backdrop-filter: blur(2px);
}
${scope} [data-slot="sidebar"]::before,
${scope} [data-slot="sidebar"]::after,
${scope} [data-slot="conversation.header"] header::before,
${scope} [data-slot="conversation.header"] header::after,
${scope} [data-slot="conversation.composer"]::before,
${scope} [data-slot="conversation.composer"]::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  border: 0 solid var(--sk-accent);
  pointer-events: none;
  opacity: 0.9;
}
${scope} [data-slot="sidebar"]::before {
  top: 6px; left: 6px; border-top-width: 2px; border-left-width: 2px;
}
${scope} [data-slot="sidebar"]::after {
  right: 6px; bottom: 6px; border-right-width: 2px; border-bottom-width: 2px;
}
${scope} [data-slot="conversation.header"] header {
  position: relative;
}
${scope} [data-slot="conversation.header"] header::before {
  left: 10px; bottom: 4px; border-bottom-width: 2px; border-left-width: 2px;
}
${scope} [data-slot="conversation.header"] header::after {
  right: 10px; bottom: 4px; border-bottom-width: 2px; border-right-width: 2px;
}

/* Brand and session title typography. */
${scope} [data-slot="sidebar.brand.name"],
${scope} [data-slot="conversation.session.header"] h1,
${scope} [data-slot="conversation.session.header"] h2 {
  font-family: ${s.fontDisplay} !important;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--sk-ink);
  text-shadow: 0 0 12px color-mix(in srgb, var(--sk-accent) 45%, transparent);
}
${scope} [data-slot="conversation.session.header"] {
  color: var(--sk-ink);
}
${scope} [data-slot="conversation.header"] {
  border-bottom: 1px solid color-mix(in srgb, var(--sk-accent) 38%, transparent) !important;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.22), transparent) !important;
}
${scope} [data-slot="conversation.header"] [role="tab"],
${scope} [data-slot="conversation.header"] button[role="tab"] {
  font-family: ${s.fontDisplay};
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 11px;
  border-radius: var(--sk-radius);
}
${scope} [data-slot="conversation.header"] [role="tab"][aria-selected="true"] {
  color: var(--sk-ink) !important;
  box-shadow: inset 0 -2px 0 var(--sk-accent2), 0 0 14px color-mix(in srgb, var(--sk-accent2) 40%, transparent);
}

/* ---------- sidebar navigation ---------- */
${scope} [data-slot="sidebar"] button {
  border-radius: var(--sk-radius);
  font-family: ${s.fontUi};
}
${scope} [data-slot="sidebar"] nav button,
${scope} [data-slot="sidebar"] [role="treeitem"] {
  border: 1px solid transparent;
  border-radius: var(--sk-radius);
  letter-spacing: 0.02em;
}
${scope} [data-slot="sidebar"] nav button {
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 11px;
  font-family: ${s.fontDisplay};
  border: 1px solid color-mix(in srgb, var(--sk-frame) 55%, transparent);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(0, 0, 0, 0.18));
  margin: 3px 0;
  padding-block: 6px;
}
${scope} [data-slot="sidebar"] nav button:hover {
  border-color: var(--sk-accent);
  box-shadow: 0 0 12px color-mix(in srgb, var(--sk-accent) 35%, transparent);
}
${scope} [data-slot="sidebar"] [role="treeitem"][aria-selected="true"],
${scope} [data-slot="sidebar"] [role="treeitem"][data-selected="true"] {
  background: linear-gradient(90deg, color-mix(in srgb, var(--sk-accent) 30%, transparent), transparent 88%) !important;
  box-shadow: inset 3px 0 0 var(--sk-accent2);
  border-color: color-mix(in srgb, var(--sk-accent) 45%, transparent) !important;
}
${scope} [data-slot="sidebar"] [role="tree"] [role="treeitem"]:hover {
  background: color-mix(in srgb, var(--sk-accent) 14%, transparent) !important;
}

/* The New Session / deploy control reads as a plate, not a pill. */
${scope} [data-slot="sidebar"] > div > button:first-of-type,
${scope} [data-slot="sidebar"] button[class*="newSession"] {
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-family: ${s.fontDisplay};
  font-weight: 700;
  border: 1px solid var(--sk-accent) !important;
  background: linear-gradient(180deg,
    color-mix(in srgb, var(--sk-accent) 26%, transparent),
    color-mix(in srgb, var(--sk-accent) 8%, transparent)) !important;
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, var(--sk-accent) 55%, transparent),
    0 0 18px color-mix(in srgb, var(--sk-accent) 25%, transparent);
}

/* ---------- conversation ---------- */
/* The mockups frame the content column as one plate inside the art. */
${scope} [data-slot="main"] {
  padding: 10px 12px 8px;
  box-sizing: border-box;
}
${scope} [data-slot="main.conversation"] {
  position: relative;
  border: 1px solid var(--sk-frame) !important;
  border-radius: calc(var(--sk-radius) + 6px);
  background: color-mix(in srgb, var(--sk-accent) 4%, rgba(6, 6, 10, 0.42)) !important;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.4),
    0 0 26px color-mix(in srgb, var(--sk-accent) 18%, transparent),
    inset 0 0 60px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(3px);
  overflow: hidden;
}
${scope} [data-slot="main.conversation"]::before,
${scope} [data-slot="main.conversation"]::after {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  border: 0 solid var(--sk-accent2);
  pointer-events: none;
  z-index: 2;
}
${scope} [data-slot="main.conversation"]::before {
  top: 6px; left: 6px; border-top-width: 2px; border-left-width: 2px;
}
${scope} [data-slot="main.conversation"]::after {
  right: 6px; bottom: 6px; border-right-width: 2px; border-bottom-width: 2px;
}
${scope} [data-slot="conversation.chat.flow"] > *,
${scope} [data-slot="conversation.chat.node"] > * {
  border-radius: var(--sk-radius);
}
${scope} [data-slot="conversation.chat.node"] {
  border: 1px solid color-mix(in srgb, var(--sk-frame) 42%, transparent);
  border-radius: var(--sk-radius);
  background: color-mix(in srgb, var(--sk-accent) 5%, rgba(10, 12, 14, 0.55));
  box-shadow: 0 10px 34px rgba(0, 0, 0, 0.32);
  padding: 2px 10px;
  margin-block: 6px;
}
${scope} [data-slot="conversation.chat.node"] h1,
${scope} [data-slot="conversation.chat.node"] h2,
${scope} [data-slot="conversation.chat.node"] h3 {
  font-family: ${s.fontDisplay};
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
${scope} [data-slot="conversation.chat.node"] code,
${scope} [data-slot="conversation.chat.node"] pre,
${scope} [data-slot="shell.bottom"] {
  font-family: ${s.fontMono};
}
${scope} [data-slot="conversation.chat.node"] hr {
  border-color: color-mix(in srgb, var(--sk-accent) 30%, transparent);
}

/* ---------- composer ---------- */
${scope} [data-slot="conversation.composer"] {
  position: relative;
  border: 1px solid var(--sk-frame) !important;
  border-radius: calc(var(--sk-radius) + 4px);
  background: ${s.panel} !important;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.4),
    0 0 26px color-mix(in srgb, var(--sk-accent) 22%, transparent),
    inset 0 0 40px rgba(0, 0, 0, 0.25);
  padding: 6px 10px;
}
${scope} [data-slot="conversation.composer"]::before {
  top: -3px; left: -3px; border-top-width: 2px; border-left-width: 2px;
}
${scope} [data-slot="conversation.composer"]::after {
  right: -3px; bottom: -3px; border-right-width: 2px; border-bottom-width: 2px;
}
${scope} [data-slot="conversation.composer"] [contenteditable="true"],
${scope} [data-slot="conversation.composer"] textarea {
  font-family: ${s.fontUi};
  color: var(--sk-ink);
}
${scope} [data-slot="conversation.composer"] > div > div > div {
  border-radius: calc(var(--sk-radius) + 2px);
}
${scope} [data-slot="conversation.composer"] [class*="card"] {
  background: ${s.cardBg} !important;
  color: var(--sk-ink) !important;
  border: 1px solid color-mix(in srgb, var(--sk-accent) 55%, transparent) !important;
  border-radius: calc(var(--sk-radius) + 6px) !important;
  box-shadow:
    0 0 22px color-mix(in srgb, var(--sk-accent) 30%, transparent),
    inset 0 0 40px rgba(0, 0, 0, 0.18);
}
${scope} [data-slot="conversation.composer"] [class*="card"] * {
  color: inherit;
}
${scope} [data-slot="conversation.composer"] [class*="card"] [contenteditable="true"]:empty::before,
${scope} [data-slot="conversation.composer"] [class*="card"] [aria-placeholder] {
  color: color-mix(in srgb, var(--sk-ink) 62%, transparent) !important;
}
${scope} [data-slot="conversation.composer"] [class*="card"]:focus-within {
  box-shadow:
    0 0 30px color-mix(in srgb, var(--sk-accent2) 45%, transparent),
    inset 0 0 40px rgba(0, 0, 0, 0.35);
}
${scope} [data-slot="conversation.input.dock"] button,
${scope} [data-slot="conversation.composer.bar"] button {
  border-radius: var(--sk-radius);
}
${scope} [data-slot="conversation.composer.bar"] button[aria-label*="Send"],
${scope} [data-slot="conversation.composer.bar"] button[class*="send"] {
  background: linear-gradient(180deg,
    color-mix(in srgb, var(--sk-accent) 92%, #fff),
    color-mix(in srgb, var(--sk-accent) 80%, #000)) !important;
  color: ${s.onAccent} !important;
  border: 1px solid color-mix(in srgb, var(--sk-accent) 80%, #fff);
  border-radius: 999px;
  box-shadow:
    0 0 18px color-mix(in srgb, var(--sk-accent) 55%, transparent),
    inset 0 -2px 6px rgba(0, 0, 0, 0.35);
  font-family: ${s.fontDisplay};
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* ---------- status bar, dialogs, menus ---------- */
${scope} [data-slot="shell.bottom"] {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 10px;
  color: var(--sk-dim);
  border-top: 1px solid color-mix(in srgb, var(--sk-accent) 26%, transparent);
  background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.22));
}
${scope} [role="dialog"],
${scope} [role="menu"],
${scope} [data-menu-material] {
  border: 1px solid var(--sk-frame) !important;
  border-radius: calc(var(--sk-radius) + 2px);
  background: ${s.panel} !important;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.55), 0 0 22px color-mix(in srgb, var(--sk-accent) 18%, transparent);
}
${scope} [role="dialog"] h1,
${scope} [role="dialog"] h2,
${scope} [role="menu"] [role="menuitem"] {
  font-family: ${s.fontDisplay};
  letter-spacing: 0.04em;
}
${scope} [role="dialog"] button {
  border-radius: var(--sk-radius);
}
${scope} :focus-visible {
  outline: 2px solid var(--sk-accent2);
  outline-offset: 1px;
}

/* Theme-specific ornament. */
${s.extras}
`
}

/** Per-pack skins, keyed by pack id. Imported packs have none and inherit the tokens only. */
const SKINS: Readonly<Record<string, string>> = Object.freeze({
  'cod-tactical': buildSkin('cod-tactical', { ...SPEC['cod-tactical'], extras: COD_TACTICAL_EXTRAS })
  'solo-leveling': buildSkin('solo-leveling', { ...SPEC['solo-leveling'], extras: SOLO_LEVELING_EXTRAS })
  'gta-vice': buildSkin('gta-vice', { ...SPEC['gta-vice'], extras: GTA_VICE_EXTRAS })
  'aot-scout': buildSkin('aot-scout', { ...SPEC['aot-scout'], extras: AOT_SCOUT_EXTRAS })
})

/**
 * Skin stylesheet for one pack.
 * @param id - pack id.
 * @returns the scoped CSS, or undefined when the pack ships no skin.
 */
export function skinCss(id: string): string | undefined {
  return SKINS[id]
}

/** Attribute carrying the active pack id on `body`. */
export const PACK_ATTRIBUTE = 'data-ds-theme-pack'
