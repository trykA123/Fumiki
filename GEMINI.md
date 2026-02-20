# GEMINI.md

> Antigravity IDE and Gemini CLI read this file automatically.

## Project

Fumiki 文木 — A self-hosted reading companion for AudioBookShelf.
SvelteKit + Bun + Hono + bun:sqlite + Tailwind CSS 4.
Three Japanese-inspired themes: Sumi (ink), Kami (paper), Mori (forest).

## Before Writing Any Code

Read these two files first:

1. `docs/agent/FUMIKI_AGENT.md` — Who you are, design philosophy, decision framework, workflow
2. `docs/agent/FUMIKI_RULES.md` — Hard constraints (Bun only, no ORMs, no npm, .env rules, etc.)

## Documentation Map

```
docs/
├── README.md                         ← Full index with reading order
├── architecture/
│   ├── FUMIKI.md                     ← Master doc (features, data model, schema)
│   ├── FUMIKI_ARCHITECTURE.md        ← System design, Docker, auth, caching
│   ├── FUMIKI_API.md                 ← Every API endpoint
│   ├── FUMIKI_STATE.md               ← Svelte stores, data flow
│   └── FUMIKI_PAGES.md               ← Every page with wireframes
├── design/
│   ├── FUMIKI_COLORS.md              ← HSL color tokens, 3 themes
│   ├── FUMIKI_TYPOGRAPHY.md          ← Fonts, type scale
│   ├── FUMIKI_SPACING.md             ← Spatial system, breakpoints
│   ├── FUMIKI_COMPONENTS.md          ← UI components with theme variants
│   └── FUMIKI_DECORATIONS.md         ← Theme ornaments (CSS-only)
├── phases/
│   ├── PHASE_0.md through PHASE_4.md ← Roadmap with task lists
└── agent/
    ├── FUMIKI_AGENT.md               ← Persona & workflow
    └── FUMIKI_RULES.md               ← Hard rules & constraints
```

## Key Rules (quick reference)

- **Bun only.** `bun`, `bunx`, `bun install`. Never npm/npx/yarn.
- **No ORMs.** Raw SQL with parameterized queries via `bun:sqlite`.
- **No unnecessary deps.** Native `fetch`, `Intl.DateTimeFormat`, `crypto.randomUUID()`.
- **No hardcoded values.** Colors, spacing, radius, fonts — all CSS custom properties.
- **Three themes.** Every component must work in Sumi, Kami, and Mori.
- **Mobile + tablet first.** Phone and tablet are co-primary. Desktop is secondary.

## Current Phase

Phase 0 — Foundation. See `docs/phases/PHASE_0.md` for the task list.
