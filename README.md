# The NavyaVerse ✿

Navya Shah's personal portfolio: a scroll-through pixel-art world in the style of an early-2000s handheld game.

You start on **Marine Drive, Mumbai at sunset**, board a Navya Air flight to **London** (hobbies and interests), watch a poem unroll on a parchment scroll, follow a shuttlecock smash onto **the badminton court** (projects, internships, clubs, skills), fly a paper plane into a very pink **study room** (education), and end back home on **Marine Drive at night** (contact). There's also a speech bubble above Navya's head: click it to chat with **AI-Navya**, who answers in her voice.

**Live site:** _add the Vercel URL here after deploying_

## Built with

- HTML, CSS and vanilla JavaScript (ES modules), bundled with [Vite](https://vitejs.dev)
- HTML5 Canvas, using a small pixel engine written for this site (`src/engine/`)
- [GSAP](https://gsap.com) + ScrollTrigger for the scroll-driven scenes
- [Lenis](https://lenis.darkroom.engineering) for smooth scrolling on desktop
- [Gemini API](https://ai.google.dev) (`@google/genai`) behind a Vercel Function for the AI chat
- Hosted on [Vercel](https://vercel.com)

## How it's put together

| Folder | What's inside |
|---|---|
| `index.html` | All the content as real, readable HTML |
| `src/engine/` | `pixel.js` (drawing helpers, bitmap font, sprite grids with auto-outline) and `stage.js` (scales each scene to whole pixels and lays it out for the screen shape) |
| `src/sprites/` | Pixel-Navya (one set of poses, outfits swapped by palette) and every prop, drawn in code |
| `src/scenes/` | One file per world: Mumbai, flight, London, court, study room, contact, transitions |
| `src/scroll.js` | Pins each scene and maps scroll position to scene progress |
| `src/ui.js` | London hotspots, outfit mirror, validation to-do list, contact buttons, easter eggs |
| `src/chat/` | The speech bubble chat and its offline fallback answers |
| `api/ask.js` | Serverless function that calls Gemini, so the API key never reaches the browser |
| `api/_lib/knowledge.js` | Everything AI-Navya knows. Edit this to teach her more |

`sprites.html` and `scenes.html` are dev-only preview pages (not part of the build). For example, `/scenes.html?scene=london&p=0.4` shows one scene at 40% scroll progress.

## Run it locally

```bash
npm install
cp .env.example .env.local   # then paste a Gemini API key into .env.local
npm run dev
```

The chat still works without a key: it falls back to pre-written answers.

## Deploy

1. Push this folder to a public GitHub repo.
2. On vercel.com: **Add New → Project**, import the repo (framework preset: Vite).
3. Under **Settings → Environment Variables**, add `GEMINI_API_KEY` (and optionally `GEMINI_MODEL`, default `gemini-flash-latest`).
4. Deploy. `api/ask.js` becomes the `/api/ask` function automatically.

Never commit the key. `.env*` files are git-ignored.

## Credits

- **Words, poem ("Wanderlust") and ideas:** Navya Shah
- **Pixel art:** drawn in code for this site. The reference images used while planning (stock pixel art) were style inspiration only, and none of them are included.
- **Fonts** (all SIL Open Font License 1.1, via [Fontsource](https://fontsource.org)): Press Start 2P by CodeMan38, Pixelify Sans by Stefie Justprince, Pinyon Script by Nicole Fally
- **Libraries:** GSAP (GreenSock standard no-charge license), Lenis (MIT), @google/genai (Apache-2.0), Vite (MIT)
- **AI assistance:** built with help from Claude (Anthropic), as allowed by the assignment. The content and personality are Navya's.
