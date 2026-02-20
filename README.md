# 🌳 Fumiki 文木

> A tree that grows from literature.

Fumiki is a self-hosted reading companion for [AudioBookShelf](https://www.audiobookshelf.org/). Listen to audiobooks, read ebooks, take notes, and grow a bonsai tree shaped by your reading practice.

![License](https://img.shields.io/badge/license-MIT-green)
![Stack](https://img.shields.io/badge/stack-SvelteKit%20%2B%20Bun%20%2B%20Hono-orange)

---

## Features

- **AudioBookShelf client** — Browse your library, play audiobooks, read ebooks (EPUB, MOBI, AZW3, FB2)
- **Three visual themes** — Sumi (ink), Kami (paper), Mori (forest). Not just color swaps — different navigation, layout, spacing, and decorative language
- **The Bonsai** — A generative tree visualization that grows from your reading. Branch patterns influenced by what you read. Every user's tree is unique
- **Notes & Highlights** — Highlight ebook passages, bookmark audio timestamps, take notes. Export to markdown
- **AI Summaries** — Per-chapter summaries via Ollama, OpenAI, or Anthropic (optional, self-hosted friendly)
- **Quiet Progression** — Knowledge Points, Japanese titles (初心 Shoshin → 仙人 Sennin), 90-day seasons. No streak anxiety, no loud celebrations
- **Mobile & Tablet first** — Designed for phones and tablets as primary devices. Desktop works too

---

## Themes

| 墨 Sumi — Ink | 紙 Kami — Paper | 森 Mori — Forest |
|---|---|---|
| Scholar's midnight desk | Manuscript on a reading desk | Reading nook in a mountain garden |
| Dark, vermillion accents | Warm cream, ink brushstrokes | Deep green, amber light |
| Top nav, single column, sharp | Side panel, two-column, soft | Bottom tabs, card grid, organic |

---

## Tech Stack

| Layer | Choice |
|---|---|
| Runtime | [Bun](https://bun.sh) |
| Frontend | [SvelteKit](https://kit.svelte.dev) (static SPA) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) + CSS custom properties |
| Backend | [Hono](https://hono.dev) |
| Database | bun:sqlite (embedded) |
| Ebook | [foliate-js](https://github.com/johnfactotum/foliate-js) |
| Audio | Howler.js + Media Session API |
| Validation | [Zod](https://zod.dev) |
| Container | Docker |

---

## Quick Start

### Docker (recommended)

```bash
docker compose up -d
```

Open `http://localhost:3000` and connect to your AudioBookShelf server.

### From Source

```bash
# Clone
git clone https://github.com/your-username/fumiki.git
cd fumiki

# Install dependencies
bun install

# Start development
bun run dev
```

Requires [Bun](https://bun.sh) v1.0+.

---

## Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

```env
PORT=3000
NODE_ENV=development
DATA_DIR=/app/data
```

AI providers are configured in Settings within the app. No environment variables needed for AI — keys are stored securely server-side.

---

## Project Structure

```
fumiki/
├── client/              # SvelteKit frontend (static build)
│   ├── src/
│   │   ├── lib/
│   │   │   ├── components/    # UI components
│   │   │   ├── stores/        # Svelte stores
│   │   │   ├── themes/        # Theme configurations
│   │   │   └── api/           # API client
│   │   └── routes/            # Pages
│   └── static/                # Static assets
│
├── sidecar/             # Bun + Hono backend
│   └── src/
│       ├── routes/            # API endpoints
│       ├── services/          # Business logic
│       ├── db/                # SQLite schema & migrations
│       └── middleware/        # Auth, rate limiting
│
├── shared/              # Shared types & schemas
├── docs/                # Design system & specs
├── Dockerfile
└── docker-compose.yml
```

---

## Development Phases

| Phase | Focus | Status |
|---|---|---|
| 0 | Foundation (theme system, auth, Docker, components) | 🔲 |
| 1 | Reader & Player (library, ebook, audiobook) | 🔲 |
| 2 | Knowledge Layer (notes, highlights, AI summaries) | 🔲 |
| 3 | The Bonsai (KP tracking, visualization, progression) | 🔲 |
| 4 | Offline & Polish (service worker, Capacitor, performance) | 🔲 |

---

## Design System

The design system is documented in `/docs/`:

- `FUMIKI_COLORS.md` — HSL color tokens for all three themes
- `FUMIKI_TYPOGRAPHY.md` — Font stacks, type scale, per-theme overrides
- `FUMIKI_SPACING.md` — Spatial system, breakpoints, grid
- `FUMIKI_COMPONENTS.md` — Every UI component with per-theme variants
- `FUMIKI_DECORATIONS.md` — Theme-specific ornaments and textures

---

## Philosophy

Fumiki is built on Japanese aesthetic principles:

- **侘寂 Wabi-sabi** — Beauty in imperfection
- **初心 Shoshin** — Beginner's mind
- **改善 Kaizen** — Continuous improvement
- **間 Ma** — Negative space

Reading is a contemplative practice, not a competition. Fumiki rewards consistency and depth, not speed.

---

## License

MIT

---

*Fumiki 文木 — A tree that grows from literature.*
