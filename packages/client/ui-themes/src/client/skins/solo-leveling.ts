import { ORBITRON_TTF } from './font-data.ts'

/** Theme-specific visual rules for the solo-leveling pack. */
export const SOLO_LEVELING_EXTRAS = String.raw`@font-face { font-family: 'DSH Arcane'; src: url(data:font/ttf;base64,${ORBITRON_TTF}) format('truetype'); font-style: normal; font-weight: 100 900; font-display: swap; }

/* Shadow monarch: violet glow, double borders, crystal highlights. */
@keyframes dsh-shadow-spark {
  0%, 100% { opacity: .18; transform: translateY(0) scale(.85); }
  50% { opacity: .75; transform: translateY(-5px) scale(1); }
}
body[data-ds-theme-pack="solo-leveling"] [data-slot="conversation.composer"] {
  background:
    radial-gradient(ellipse at 50% 0%, rgba(124, 92, 255, .2), transparent 60%),
    linear-gradient(180deg, rgba(13, 18, 40, .96), rgba(6, 9, 22, .98)) !important;
}
body[data-ds-theme-pack="solo-leveling"] [data-slot="conversation.composer"] [aria-label*="Send"] {
  border-radius: 50%;
  box-shadow: 0 0 12px rgba(56, 214, 255, .55), 0 0 30px rgba(124, 92, 255, .55);
}
body[data-ds-theme-pack="solo-leveling"] [data-slot="conversation.chat.node"] {
  background-image: radial-gradient(2px 2px at 20% 30%, rgba(220, 230, 255, .65), transparent 100%);
}
@media (prefers-reduced-motion: no-preference) {
  body[data-ds-theme-pack="solo-leveling"] [data-chat-user-row]::before {
    animation: dsh-shadow-spark 4.5s ease-in-out infinite;
  }
}

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
}`
