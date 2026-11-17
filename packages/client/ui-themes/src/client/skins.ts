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
  'cod-tactical': buildSkin('cod-tactical', { ...SPEC['cod-tactical'], extras: `
/* Tactical: chamfered plates, hazard stripes, HUD labels. */
body[data-ds-theme-pack="cod-tactical"] [data-chat-user-row] {
  position: relative;
  isolation: isolate;
  margin-inline-start: auto;
  max-width: min(76%, 760px);
  padding: 16px 20px;
  border: 1px solid rgba(143, 227, 111, 0.52);
  border-radius: 3px;
  color: #d9efca;
  background:
    linear-gradient(135deg, rgba(143, 227, 111, 0.12), transparent 36%),
    linear-gradient(180deg, rgba(28, 38, 31, 0.96), rgba(10, 16, 13, 0.98));
  box-shadow: 0 0 0 3px rgba(143, 227, 111, 0.08), inset 0 0 30px rgba(143, 227, 111, 0.05);
}
body[data-ds-theme-pack="cod-tactical"] [data-chat-user-row]::before,
body[data-ds-theme-pack="cod-tactical"] [data-chat-user-row]::after {
  content: '';
  position: absolute;
  pointer-events: none;
}
body[data-ds-theme-pack="cod-tactical"] [data-chat-user-row]::before {
  inset: 5px;
  border: 1px solid rgba(200, 220, 190, 0.18);
}
body[data-ds-theme-pack="cod-tactical"] [data-chat-user-row]::after {
  right: 8px;
  top: 8px;
  width: 26px;
  height: 5px;
  background: repeating-linear-gradient(90deg, #8fe36f 0 3px, transparent 3px 5px);
  opacity: .7;
}
body[data-ds-theme-pack="cod-tactical"] [data-turn-error] {
  position: relative;
  border-left: 4px solid #ff633d;
  background: linear-gradient(90deg, rgba(255, 75, 45, .18), transparent 72%);
  color: #ff8064;
  text-transform: uppercase;
}
body[data-ds-theme-pack="cod-tactical"] [data-turn-error]::before {
  content: '';
  position: absolute;
  inset: 0 0 auto 0;
  height: 8px;
  background: repeating-linear-gradient(135deg, rgba(255, 90, 55, .65) 0 8px, transparent 8px 16px);
  opacity: .45;
}
body[data-ds-theme-pack="cod-tactical"] [data-retry-row] {
  border-bottom: 1px dotted rgba(143, 227, 111, .38);
  color: #aeb9a7;
  font-family: var(--sk-mono, 'Consolas', monospace);
}
body[data-ds-theme-pack="cod-tactical"] [data-turn-process] {
  color: #ff784d;
  font-family: 'Arial Narrow', 'Segoe UI', sans-serif;
  font-weight: 800;
  text-transform: uppercase;
}
body[data-ds-theme-pack="cod-tactical"] [data-goal-bar] {
  border: 1px solid rgba(143, 227, 111, .35);
  background: linear-gradient(90deg, rgba(143, 227, 111, .12), rgba(232, 184, 79, .06));
}
body[data-ds-theme-pack="cod-tactical"] [data-composer-stat] {
  color: #9cae91;
  font-family: 'Consolas', monospace;
  letter-spacing: .06em;
}
@media (prefers-reduced-motion: reduce) {
  body[data-ds-theme-pack="cod-tactical"] *,
  body[data-ds-theme-pack="cod-tactical"] *::before,
  body[data-ds-theme-pack="cod-tactical"] *::after {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
body[data-ds-theme-pack="cod-tactical"] [data-slot="sidebar"] [role="region"],
body[data-ds-theme-pack="cod-tactical"] [data-slot="sidebar"] nav {
  border-top: 1px dashed rgba(143, 227, 111, 0.35);
  border-bottom: 1px dashed rgba(200, 176, 99, 0.35);
}
body[data-ds-theme-pack="cod-tactical"] [data-slot="sidebar"] button,
body[data-ds-theme-pack="cod-tactical"] [data-slot="conversation.composer"] button,
body[data-ds-theme-pack="cod-tactical"] [role="dialog"] button {
  clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);
}
body[data-ds-theme-pack="cod-tactical"] [data-slot="conversation.session.header"] h1,
body[data-ds-theme-pack="cod-tactical"] [data-slot="sidebar.brand.name"] {
  color: #f2f6ea;
  text-shadow: 0 0 10px rgba(143, 191, 95, 0.35);
}
body[data-ds-theme-pack="cod-tactical"] [data-slot="conversation.chat.node"] {
  background-image: repeating-linear-gradient(135deg, rgba(143, 227, 111, 0.06) 0 2px, transparent 2px 9px);
}
body[data-ds-theme-pack="cod-tactical"] [data-slot="conversation.composer"] {
  background-image: linear-gradient(180deg, rgba(143, 227, 111, 0.07), transparent 40%);
}
` }),
  'solo-leveling': buildSkin('solo-leveling', { ...SPEC['solo-leveling'], extras: `
/* Shadow monarch: violet glow, double borders, crystal highlights. */
body[data-ds-theme-pack="solo-leveling"] [data-chat-user-row] {
  position: relative;
  isolation: isolate;
  margin-inline-start: auto;
  max-width: min(76%, 760px);
  padding: 16px 20px;
  border: 1px solid rgba(121, 103, 255, .88);
  border-radius: 12px;
  color: #83eaff;
  background: linear-gradient(135deg, rgba(19, 36, 76, .94), rgba(11, 12, 34, .96));
  box-shadow: 0 0 0 2px rgba(56, 214, 255, .12), 0 0 24px rgba(124, 92, 255, .48), inset 0 0 24px rgba(56, 214, 255, .08);
}
body[data-ds-theme-pack="solo-leveling"] [data-chat-user-row]::before {
  content: '';
  position: absolute;
  inset: -7px;
  z-index: -1;
  border-radius: 16px;
  background: radial-gradient(ellipse, rgba(124, 92, 255, .3), transparent 68%);
  filter: blur(10px);
  pointer-events: none;
}
body[data-ds-theme-pack="solo-leveling"] [data-turn-error] {
  position: relative;
  border-left: 3px solid #ff465f;
  color: #ff697a;
  background: linear-gradient(90deg, rgba(150, 25, 57, .2), transparent 78%);
  text-shadow: 0 0 12px rgba(255, 48, 82, .35);
}
body[data-ds-theme-pack="solo-leveling"] [data-turn-error]::before {
  content: '';
  position: absolute;
  inset: -18px 35% -18px -12px;
  z-index: -1;
  background: radial-gradient(ellipse, rgba(170, 25, 60, .24), transparent 70%);
  filter: blur(12px);
  pointer-events: none;
}
body[data-ds-theme-pack="solo-leveling"] [data-retry-row] {
  border-bottom: 1px solid rgba(124, 92, 255, .28);
  color: #aeb8ed;
}
body[data-ds-theme-pack="solo-leveling"] [data-turn-process] {
  color: #c4aaff;
  text-shadow: 0 0 12px rgba(124, 92, 255, .5);
}
body[data-ds-theme-pack="solo-leveling"] [data-goal-bar] {
  border: 1px solid rgba(124, 92, 255, .48);
  box-shadow: 0 0 16px rgba(124, 92, 255, .2);
}
body[data-ds-theme-pack="solo-leveling"] [data-composer-stat] {
  color: #a9b8ef;
  text-shadow: 0 0 8px rgba(56, 214, 255, .3);
}
@media (prefers-reduced-motion: reduce) {
  body[data-ds-theme-pack="solo-leveling"] *,
  body[data-ds-theme-pack="solo-leveling"] *::before,
  body[data-ds-theme-pack="solo-leveling"] *::after {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
body[data-ds-theme-pack="solo-leveling"] [data-slot="sidebar"],
body[data-ds-theme-pack="solo-leveling"] [data-slot="conversation.composer"],
body[data-ds-theme-pack="solo-leveling"] [role="dialog"],
body[data-ds-theme-pack="solo-leveling"] [role="menu"] {
  box-shadow:
    0 0 0 1px rgba(124, 92, 255, 0.55),
    0 0 26px rgba(124, 92, 255, 0.30),
    inset 0 0 60px rgba(56, 214, 255, 0.06),
    0 22px 70px rgba(0, 0, 0, 0.55);
}
body[data-ds-theme-pack="solo-leveling"] [data-slot="sidebar"] button,
body[data-ds-theme-pack="solo-leveling"] [data-slot="conversation.composer"] button {
  border: 1px solid rgba(124, 92, 255, 0.45);
  box-shadow: inset 0 0 12px rgba(124, 92, 255, 0.18);
}
body[data-ds-theme-pack="solo-leveling"] [data-slot="conversation.chat.node"] {
  border-color: rgba(124, 92, 255, 0.45) !important;
  background: linear-gradient(180deg, rgba(20, 27, 58, 0.75), rgba(8, 11, 26, 0.85)) !important;
  box-shadow: 0 0 22px rgba(124, 92, 255, 0.18), inset 0 0 40px rgba(56, 214, 255, 0.05);
}
body[data-ds-theme-pack="solo-leveling"] [data-slot="sidebar.brand.name"],
body[data-ds-theme-pack="solo-leveling"] [data-slot="conversation.session.header"] h1 {
  color: #eae6ff;
  text-shadow: 0 0 8px rgba(124, 92, 255, 0.85), 0 0 22px rgba(56, 214, 255, 0.45);
}
body[data-ds-theme-pack="solo-leveling"] [data-slot="conversation.header"] [role="tab"][aria-selected="true"] {
  color: #d8e6ff !important;
  text-shadow: 0 0 12px rgba(56, 214, 255, 0.8);
  box-shadow: inset 0 -2px 0 #38d6ff, 0 0 18px rgba(56, 214, 255, 0.45);
}
` }),
  'gta-vice': buildSkin('gta-vice', { ...SPEC['gta-vice'], extras: `
/* Vice sunset: chrome display type, neon outlines, sun-drenched halo. */
body[data-ds-theme-pack="gta-vice"] [data-chat-user-row] {
  position: relative;
  isolation: isolate;
  margin-inline-start: auto;
  max-width: min(76%, 760px);
  padding: 16px 20px;
  border: 1px solid rgba(34, 211, 238, .72);
  border-radius: 10px;
  color: #9ff4ff;
  background: linear-gradient(135deg, rgba(54, 18, 64, .92), rgba(20, 8, 34, .94));
  box-shadow: 0 0 0 1px rgba(255, 47, 146, .42), 0 0 24px rgba(255, 47, 146, .24), inset 0 0 24px rgba(34, 211, 238, .08);
}
body[data-ds-theme-pack="gta-vice"] [data-turn-error] {
  border-left: 4px solid #ff624f;
  color: #ff7469;
  background: linear-gradient(90deg, rgba(255, 58, 85, .2), transparent 76%);
  text-shadow: 2px 0 rgba(34, 211, 238, .35), -2px 0 rgba(255, 47, 146, .35);
}
body[data-ds-theme-pack="gta-vice"] [data-retry-row] {
  border-bottom: 1px solid rgba(34, 211, 238, .3);
  color: #f0c4e7;
}
body[data-ds-theme-pack="gta-vice"] [data-turn-process] {
  color: #ff9a67;
  text-shadow: 0 0 10px rgba(255, 47, 146, .45);
}
body[data-ds-theme-pack="gta-vice"] [data-goal-bar] {
  border: 1px solid rgba(255, 47, 146, .5);
  background: linear-gradient(90deg, rgba(255, 47, 146, .15), rgba(255, 170, 80, .12));
}
body[data-ds-theme-pack="gta-vice"] [data-composer-stat] {
  color: #8fefff;
}
@media (prefers-reduced-motion: reduce) {
  body[data-ds-theme-pack="gta-vice"] *,
  body[data-ds-theme-pack="gta-vice"] *::before,
  body[data-ds-theme-pack="gta-vice"] *::after {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
body[data-ds-theme-pack="gta-vice"]::before {
  background:
    url("data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 400' preserveAspectRatio='none'%3E%3Cg fill='%23120718'%3E%3Cpath d='M120 400c0-90 10-150 26-190 6-16 4-34-6-46-8-10-6-24 6-26 8-2 14 6 16 16 4 18 2 38-2 56-6 30-12 60-12 90v100z'/%3E%3Cpath d='M180 400c-4-84-26-140-52-176-10-14-12-32-6-44 4-8 14-8 18 2 6 14 4 30-2 44-12 28-6 60 6 86 10 22 16 58 16 88z' opacity='.85'/%3E%3Cpath d='M1380 400c0-96-12-158-30-200-6-16-4-34 6-46 8-10 6-24-6-26-8-2-14 6-16 16-4 18-2 38 2 56 6 30 12 60 12 90v110z'/%3E%3Cpath d='M1320 400c4-88 28-146 56-184 10-14 12-32 6-44-4-8-14-8-18 2-6 14-4 30 2 44 12 28 6 60-6 86-10 22-18 60-18 96z' opacity='.85'/%3E%3C/g%3E%3C/svg%3E") bottom center / 100% 46% no-repeat,
    radial-gradient(60% 46% at 50% 92%, rgba(255, 168, 96, 0.55), transparent 68%),
    radial-gradient(26% 26% at 50% 72%, rgba(255, 226, 150, 0.5), transparent 70%),
    linear-gradient(180deg, #1b0a2c 0%, #3d1046 28%, #7d2352 52%, #c93a5f 66%, #2a0f2c 100%);
}
body[data-ds-theme-pack="gta-vice"] [data-slot="sidebar.brand.name"] {
  background: linear-gradient(180deg, #fff 0%, #ffd0e8 42%, #ff2f92 56%, #ffe9f6 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent !important;
  font-style: italic;
  letter-spacing: 0.02em;
  filter: drop-shadow(0 0 12px rgba(255, 47, 146, 0.75));
}
body[data-ds-theme-pack="gta-vice"] [data-slot="sidebar"],
body[data-ds-theme-pack="gta-vice"] [data-slot="conversation.composer"],
body[data-ds-theme-pack="gta-vice"] [role="dialog"] {
  border: 2px solid rgba(255, 47, 146, 0.7) !important;
  box-shadow:
    0 0 0 1px rgba(34, 211, 238, 0.5),
    0 0 30px rgba(255, 47, 146, 0.42),
    0 0 70px rgba(34, 211, 238, 0.22),
    inset 0 0 70px rgba(255, 47, 146, 0.10);
}
body[data-ds-theme-pack="gta-vice"] [data-slot="conversation.chat.node"] {
  border: 1px solid rgba(34, 211, 238, 0.55) !important;
  background: linear-gradient(180deg, rgba(58, 18, 48, 0.6), rgba(18, 8, 28, 0.72)) !important;
  box-shadow: 0 0 24px rgba(255, 47, 146, 0.22), inset 0 0 50px rgba(34, 211, 238, 0.07);
}
body[data-ds-theme-pack="gta-vice"] [data-slot="sidebar"] nav button,
body[data-ds-theme-pack="gta-vice"] [data-slot="conversation.composer"] button {
  border-color: rgba(34, 211, 238, 0.5);
  box-shadow: 0 0 14px rgba(34, 211, 238, 0.18);
}
body[data-ds-theme-pack="gta-vice"] [data-slot="conversation.header"] [role="tab"][aria-selected="true"] {
  color: #fff !important;
  box-shadow: inset 0 -2px 0 #22d3ee, 0 0 18px rgba(34, 211, 238, 0.6);
}
/* Palm silhouettes: tapered trunks with fanned fronds, mirrored at both edges. */
body[data-ds-theme-pack="gta-vice"]::before {
  background:
    url("data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 400' preserveAspectRatio='none'%3E%3Cg fill='%23120718'%3E%3Cg%3E%3Cpath d='M150 400c0-78 2-146 14-206 2-10 14-10 16 0 12 60 14 128 14 206z'/%3E%3Cg transform='translate(172,192)'%3E%3Cellipse rx='58' ry='9' transform='rotate(-10)'/%3E%3Cellipse rx='52' ry='8' transform='rotate(26)'/%3E%3Cellipse rx='52' ry='8' transform='rotate(-34)'/%3E%3Cellipse rx='40' ry='7' transform='rotate(60)'/%3E%3Cellipse rx='40' ry='7' transform='rotate(-64)'/%3E%3Cellipse rx='30' ry='6' transform='rotate(88)'/%3E%3Cellipse rx='30' ry='6' transform='rotate(-92)'/%3E%3C/g%3E%3C/g%3E%3Cg transform='translate(1600,0) scale(-1,1)'%3E%3Cpath d='M150 400c0-78 2-146 14-206 2-10 14-10 16 0 12 60 14 128 14 206z'/%3E%3Cg transform='translate(172,192)'%3E%3Cellipse rx='58' ry='9' transform='rotate(-10)'/%3E%3Cellipse rx='52' ry='8' transform='rotate(26)'/%3E%3Cellipse rx='52' ry='8' transform='rotate(-34)'/%3E%3Cellipse rx='40' ry='7' transform='rotate(60)'/%3E%3Cellipse rx='40' ry='7' transform='rotate(-64)'/%3E%3Cellipse rx='30' ry='6' transform='rotate(88)'/%3E%3Cellipse rx='30' ry='6' transform='rotate(-92)'/%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E") bottom center / 100% 44% no-repeat,
    radial-gradient(52% 40% at 50% 88%, rgba(255, 176, 104, 0.55), transparent 70%),
    radial-gradient(22% 22% at 50% 70%, rgba(255, 232, 160, 0.55), transparent 72%),
    linear-gradient(180deg, #1b0a2c 0%, #3d1046 26%, #7d2352 50%, #c93a5f 64%, #2a0f2c 100%);
}
` }),
  'aot-scout': buildSkin('aot-scout', { ...SPEC['aot-scout'], extras: `
/* Scout regiment: parchment, leather frame, wax seals, brass rivets. */
body[data-ds-theme-pack="aot-scout"] [data-chat-user-row] {
  position: relative;
  isolation: isolate;
  margin-inline-start: auto;
  max-width: min(76%, 760px);
  padding: 16px 20px;
  border: 1px solid rgba(105, 78, 42, .62);
  border-radius: 2px;
  color: #43351f;
  background:
    radial-gradient(ellipse at 10% 0%, rgba(255, 255, 245, .8), transparent 60%),
    repeating-linear-gradient(2deg, rgba(110, 82, 44, .035) 0 1px, transparent 1px 5px),
    linear-gradient(180deg, #f3e8ce, #e1d1ae);
  box-shadow: 0 8px 22px rgba(65, 45, 20, .22), inset 0 0 0 4px rgba(128, 96, 52, .09);
}
body[data-ds-theme-pack="aot-scout"] [data-chat-user-row]::before {
  content: '';
  position: absolute;
  inset: 7px;
  border: 1px dashed rgba(105, 78, 42, .42);
  pointer-events: none;
}
body[data-ds-theme-pack="aot-scout"] [data-turn-error] {
  border-left: 5px solid #9b302b;
  color: #8c2f2a;
  background: linear-gradient(90deg, rgba(155, 48, 43, .15), transparent 75%);
  font-weight: 700;
}
body[data-ds-theme-pack="aot-scout"] [data-retry-row] {
  border-bottom: 1px dashed rgba(105, 78, 42, .45);
  color: #695332;
}
body[data-ds-theme-pack="aot-scout"] [data-turn-process] {
  color: #8c2f2a;
  font-variant: small-caps;
  letter-spacing: .08em;
}
body[data-ds-theme-pack="aot-scout"] [data-goal-bar] {
  border: 1px dashed rgba(105, 78, 42, .5);
  background: rgba(128, 96, 52, .08);
}
body[data-ds-theme-pack="aot-scout"] [data-composer-stat] {
  color: #695332;
}
@media (prefers-reduced-motion: reduce) {
  body[data-ds-theme-pack="aot-scout"] *,
  body[data-ds-theme-pack="aot-scout"] *::before,
  body[data-ds-theme-pack="aot-scout"] *::after {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
body[data-ds-theme-pack="aot-scout"]::before {
  background:
    radial-gradient(30% 22% at 8% 6%, rgba(255, 252, 240, 0.55), transparent 72%),
    radial-gradient(24% 18% at 92% 88%, rgba(120, 92, 52, 0.18), transparent 72%),
    radial-gradient(16% 12% at 30% 74%, rgba(120, 92, 52, 0.12), transparent 72%),
    repeating-linear-gradient(93deg, rgba(120, 92, 52, 0.035) 0 1px, transparent 1px 6px),
    #eadfc6;
}
body[data-ds-theme-pack="aot-scout"] [data-slot="sidebar"] {
  border: 2px solid rgba(122, 92, 48, 0.7) !important;
  box-shadow:
    inset 0 0 0 4px rgba(122, 92, 48, 0.18),
    inset 0 0 80px rgba(122, 92, 48, 0.18),
    0 18px 50px rgba(80, 60, 30, 0.35);
}
body[data-ds-theme-pack="aot-scout"] [data-slot="sidebar"]::before,
body[data-ds-theme-pack="aot-scout"] [data-slot="sidebar"]::after {
  background:
    radial-gradient(circle at 50% 50%, #e8dcc0 0 38%, #8c6a38 40% 52%, #5d4522 54% 100%);
  border: 0;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  opacity: 1;
  box-shadow: 0 0 0 2px rgba(93, 69, 34, 0.45);
}
body[data-ds-theme-pack="aot-scout"] [data-slot="sidebar.brand.name"] {
  font-variant: small-caps;
  letter-spacing: 0.08em;
  color: #3a2c18;
  text-shadow: 0 1px 0 rgba(255, 250, 235, 0.8);
}
body[data-ds-theme-pack="aot-scout"] [data-slot="sidebar"] nav button {
  border-color: rgba(122, 92, 48, 0.45);
  background: linear-gradient(180deg, rgba(255, 250, 235, 0.65), rgba(206, 190, 160, 0.5));
  color: #3a2c18;
}
body[data-ds-theme-pack="aot-scout"] [data-slot="conversation.chat.node"] {
  border: 1px solid rgba(122, 92, 48, 0.55) !important;
  background:
    linear-gradient(180deg, rgba(255, 252, 240, 0.72), rgba(232, 220, 194, 0.78)) !important;
  box-shadow: 0 8px 26px rgba(80, 60, 30, 0.22), inset 0 0 0 3px rgba(255, 252, 240, 0.4);
}
body[data-ds-theme-pack="aot-scout"] [data-slot="conversation.session.header"] h1 {
  color: #3a2c18;
  text-shadow: 0 1px 0 rgba(255, 252, 240, 0.75);
}
body[data-ds-theme-pack="aot-scout"] [data-slot="conversation.header"] [role="tab"][aria-selected="true"] {
  color: #3a2c18 !important;
  box-shadow: inset 0 -2px 0 #8c2f2a;
}
body[data-ds-theme-pack="aot-scout"] [data-slot="conversation.composer"] {
  border: 2px solid rgba(122, 92, 48, 0.6) !important;
  box-shadow: 0 10px 30px rgba(80, 60, 30, 0.35), inset 0 0 0 3px rgba(255, 252, 240, 0.35);
}
body[data-ds-theme-pack="aot-scout"] [data-slot="shell.bottom"] {
  color: #6b5836;
  border-top-color: rgba(122, 92, 48, 0.45);
  background: linear-gradient(180deg, transparent, rgba(122, 92, 48, 0.12));
}
` }),
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
