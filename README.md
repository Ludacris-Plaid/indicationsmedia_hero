# Indications Media

Marketing site for **Indications Media** — a one-page portfolio / dev studio / cybersecurity showcase. Dark, terminal-inspired aesthetic with WebGL shader background, AI chatbot, live threat monitor, and 22 case-study project modals.

**Live:** [indicationsmedia.com](https://indicationsmedia.com)

## Stack

- **React 19** + Vite 8
- **@react-three/fiber** + **@react-three/drei** + **three** for the WebGL background (circuit board shader + particle system)
- **DeepSeek** + **Featherless AI** for the in-page AI assistant (with automatic fallback)
- **No CSS framework** — hand-rolled inline styles, design tokens in `src/index.css`
- **No state library** — three `useState`s in `App.jsx`, props down
- **No router** — single scroll-snap page with four anchored sections

## Development

```bash
npm install
npm run dev      # localhost:5173
npm run build    # production build to dist/
npm run preview  # serve the built dist/
npm run lint     # eslint
```

## Environment

Create a `.env` in the project root (gitignored). Required keys:

```bash
DEEPSEEK_API_KEY=...       # primary LLM provider
FEATHERLESS_API_KEY=...    # fallback if DeepSeek fails
```

Get keys at:
- [platform.deepseek.com](https://platform.deepseek.com)
- [featherless.ai](https://featherless.ai)

The dev server uses an inline Vite middleware (`vite.config.js`) that proxies `/api/chat` to DeepSeek. In production, Vercel runs `api/chat.js` as a serverless function. The system prompt lives in both — keep them in sync.

## Architecture

```
src/
├── App.jsx                    # Root: scroll container, section observers, cursor tracking
├── main.jsx                   # React entry point
├── index.css                  # Global resets, font face, design tokens, keyframes
├── components/
│   ├── Scene.jsx              # WebGL canvas with CircuitBoard + DataParticles
│   ├── CircuitBoard.jsx       # GLSL fragment shader (matrix-trace grid)
│   ├── DataParticles.jsx      # 800 additive-blended mouse-repelled particles
│   ├── DataStream.jsx         # 2D canvas "digital rain" overlay
│   ├── GlitchOverlay.jsx      # Hex stream, status bar, scanlines, vignette
│   ├── CustomCursor.jsx       # Portal-rendered crosshair cursor (desktop only)
│   ├── Navigation.jsx         # Top nav + full-screen mobile menu
│   ├── Logo.jsx               # Animated "iM" monogram
│   ├── Hero.jsx               # Headline + boot sequence + CTAs
│   ├── ProjectGrid.jsx        # 22 project tiles
│   ├── ProjectTile.jsx        # Single project tile (tilt-on-hover)
│   ├── ProjectModal.jsx       # Case-study modal (problem/solution/stack)
│   ├── About.jsx              # About section with stats + manifesto + testimonials
│   ├── TechStack.jsx          # Hex-tile grid of tech with brand colors
│   ├── ChatBot.jsx            # AI assistant UI
│   └── ThreatMonitor.jsx      # Live-scrolling security event log
├── data/
│   └── projects.js            # 22 projects with problem/solution/stack/case study
└── hooks/
    └── useIsMobile.js         # matchMedia <768px

api/
└── chat.js                    # Vercel serverless function: DeepSeek + Featherless proxy
```

## Design tokens

All colors and animations live in `src/index.css` `:root` as CSS custom properties. Components reference them via `var(--c-primary)` etc.

| Token | Value | Usage |
|-------|-------|-------|
| `--c-primary` | `#00ff66` | Terminal green, brand accent |
| `--c-secondary` | `#00ccff` | Data/AI accent |
| `--c-bg` | `#030806` | Page background |
| `--c-purple` | `#c084fc` | Featured/portfolio accent |

## Deployment

Pushes to `main` auto-deploy via Vercel. To deploy manually:

```bash
npx vercel --prod
```

## Security

`vercel.json` sets baseline security headers: HSTS, X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy lockdown. The chatbot's `SYSTEM_PROMPT` references this posture — the headers make it true.
