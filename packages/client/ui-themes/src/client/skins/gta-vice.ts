import { BUNGEE_TTF } from './font-data.ts'

/** Theme-specific visual rules for the gta-vice pack. */
export const GTA_VICE_EXTRAS = String.raw`@font-face { font-family: 'DSH Vice'; src: url(data:font/ttf;base64,${BUNGEE_TTF}) format('truetype'); font-style: normal; font-weight: 400; font-display: swap; }

/* Vice sunset: chrome display type, neon outlines, sun-drenched halo. */
body[data-ds-theme-pack="gta-vice"] [data-slot="main.conversation"] {
  background-image:
    linear-gradient(rgba(34, 211, 238, .10) 1px, transparent 1px),
    linear-gradient(90deg, rgba(34, 211, 238, .10) 1px, transparent 1px),
    linear-gradient(180deg, rgba(13, 7, 28, .1), rgba(13, 7, 28, .42)) !important;
  background-size: 34px 34px, 34px 34px, auto;
  background-position: center bottom;
}
body[data-ds-theme-pack="gta-vice"] [data-slot="conversation.header"] [role="tab"] {
  text-transform: none;
  letter-spacing: .025em;
  font-family: 'DSH Vice', Impact, sans-serif;
}

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
}`
