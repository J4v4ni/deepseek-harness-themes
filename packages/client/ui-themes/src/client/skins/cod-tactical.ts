import { ORBITRON_TTF } from './font-data.ts'

/** Theme-specific visual rules for the cod-tactical pack. */
export const COD_TACTICAL_EXTRAS = String.raw`@font-face { font-family: 'DSH HUD'; src: url(data:font/ttf;base64,${ORBITRON_TTF}) format('truetype'); font-style: normal; font-weight: 100 900; font-display: swap; }

/* Tactical: chamfered plates, hazard stripes, HUD labels. */
body[data-ds-theme-pack="cod-tactical"] [data-slot="main.conversation"] {
  background-image:
    repeating-linear-gradient(0deg, rgba(170, 210, 160, .045) 0 1px, transparent 1px 4px),
    linear-gradient(180deg, rgba(8, 12, 10, .42), rgba(8, 12, 10, .12)) !important;
}
body[data-ds-theme-pack="cod-tactical"] [data-slot="conversation.header"] {
  position: relative;
}
body[data-ds-theme-pack="cod-tactical"] [data-slot="conversation.header"]::after {
  content: 'SECURE CHANNEL // LIVE';
  position: absolute;
  top: 7px;
  right: 48px;
  color: rgba(143, 227, 111, .58);
  font: 700 9px 'DSH HUD', monospace;
  letter-spacing: .12em;
  pointer-events: none;
}
body[data-ds-theme-pack="cod-tactical"] [data-slot="sidebar"] nav button::after {
  content: '';
  width: 6px;
  height: 6px;
  margin-left: auto;
  border-radius: 50%;
  background: #8fe36f;
  box-shadow: 0 0 8px rgba(143, 227, 111, .75);
}

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
}`
