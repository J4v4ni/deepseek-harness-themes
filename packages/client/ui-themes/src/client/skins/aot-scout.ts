import { GRENZE_GOTISCH_TTF } from './font-data.ts'

/** Theme-specific visual rules for the aot-scout pack. */
export const AOT_SCOUT_EXTRAS = String.raw`@font-face { font-family: 'DSH Gothic'; src: url(data:font/ttf;base64,${GRENZE_GOTISCH_TTF}) format('truetype'); font-style: normal; font-weight: 100 900; font-display: swap; }\n
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
}`
