# Phase 0 — Foundation

> Estimated: 1–2 weeks
> Goal: Scaffolded project that builds, runs in Docker, has the theme system working, auth flow complete, and core UI components ready.

---

## Prerequisites

- Bun v1.0+ installed locally
- Docker + Docker Compose
- An AudioBookShelf server to connect to (for testing auth)

---

## Tasks

### 0.1 — Project Scaffold

Create the monorepo structure with Bun workspaces.

```
fumiki/
├── package.json          # workspaces: ["client", "sidecar", "shared"]
├── client/
│   ├── package.json
│   ├── svelte.config.js  # adapter-static
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── src/
│       ├── app.html
│       ├── app.css
│       └── routes/
│           └── +layout.svelte
├── sidecar/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       └── index.ts
├── shared/
│   ├── package.json
│   ├── types.ts
│   └── schemas.ts
├── .env.example
├── .gitignore
├── Dockerfile
└── docker-compose.yml
```

**Acceptance criteria:**
- [ ] `bun install` at root installs all workspaces
- [ ] `bun run dev` starts both client dev server and sidecar
- [ ] `bun run build` builds client to static files
- [ ] Sidecar serves built client files + API routes
- [ ] TypeScript strict mode, no errors
- [ ] `.gitignore` covers node_modules, .env, build output, db files

---

### 0.2 — Tailwind CSS 4 + CSS Custom Properties

Set up the full design token system.

**Tasks:**
- [ ] Install Tailwind CSS 4
- [ ] Create `app.css` with all CSS custom properties from `FUMIKI_COLORS.md`
- [ ] Add all three theme token blocks: `[data-theme="sumi"]`, `[data-theme="kami"]`, `[data-theme="mori"]`
- [ ] Add spacing tokens from `FUMIKI_SPACING.md`
- [ ] Add typography tokens from `FUMIKI_TYPOGRAPHY.md`
- [ ] Add transition/animation tokens from `FUMIKI_COMPONENTS.md`
- [ ] Import Google Fonts (Noto Serif JP, Crimson Pro, DM Sans, JetBrains Mono)
- [ ] Verify `prefers-reduced-motion` media query disables animations

**Acceptance criteria:**
- [ ] Changing `data-theme` on `<html>` switches all colors, fonts, spacing instantly
- [ ] No flash of wrong theme on page load
- [ ] All three themes render distinct visual experiences

---

### 0.3 — Theme System (Svelte)

Build the theme store and theme configuration objects.

**Tasks:**
- [ ] Create `src/lib/themes/sumi.ts`, `kami.ts`, `mori.ts` — each exports a theme config object with layout variants, decorations, etc.
- [ ] Create `src/lib/stores/theme.ts` — writable store, persists to localStorage, applies `data-theme` attribute
- [ ] Create theme init logic in `+layout.svelte` — reads localStorage, applies before first paint
- [ ] Theme switch is instant (CSS-only, no re-render)

**Acceptance criteria:**
- [ ] Theme persists across page reloads
- [ ] No flash of default theme before saved theme applies
- [ ] `$theme` store provides full config object for conditional rendering

---

### 0.4 — Core UI Components

Build the shared component library. Every component must work across all three themes.

| Component | File | Key Variants |
|---|---|---|
| Button | `ui/Button.svelte` | primary, secondary, ghost, danger, icon; sm, md, lg |
| Card | `ui/Card.svelte` | default, interactive, elevated, hero |
| Input | `ui/Input.svelte` | text, search, textarea; sm, md, lg |
| ProgressBar | `ui/ProgressBar.svelte` | xs, sm, md, lg; accent, success |
| Tag | `ui/Tag.svelte` | accent, success, info, muted |
| Toast | `ui/Toast.svelte` | info, success, error, warning |
| Modal | `ui/Modal.svelte` | default |
| SectionHeader | `ui/SectionHeader.svelte` | with optional link |
| Divider | `ui/Divider.svelte` | theme-aware: line / dots / space |
| Skeleton | `ui/Skeleton.svelte` | text, card, cover, row |
| EmptyState | `ui/EmptyState.svelte` | icon, title, text, optional action |

**Per component:**
- [ ] Works in Sumi, Kami, Mori
- [ ] Uses CSS custom properties only (no hardcoded values)
- [ ] Has per-theme structural variants (from `FUMIKI_COMPONENTS.md`)
- [ ] Has per-theme decorations (from `FUMIKI_DECORATIONS.md`)
- [ ] Accessible (keyboard, aria labels, focus-visible)
- [ ] Reduced motion safe

**Acceptance criteria:**
- [ ] A dev page (`/dev/components`) renders all components
- [ ] Switching theme instantly updates all components
- [ ] Components pass visual inspection on phone (375px), tablet (768px), desktop (1280px)

---

### 0.5 — Navigation Shell

Build the responsive navigation that adapts per theme and breakpoint.

**Tasks:**
- [ ] `BottomNav.svelte` — 5 tabs (Home, Library, Bonsai, Notes, Settings). Phone, all themes.
- [ ] `TopNav.svelte` — Horizontal bar. Sumi on tablet/desktop.
- [ ] `SideNav.svelte` — Vertical panel, 260px. Kami on tablet/desktop.
- [ ] `FloatingNav.svelte` — Minimal floating nav. Mori on tablet/desktop.
- [ ] `AppShell.svelte` — Reads theme + breakpoint, renders correct nav.
- [ ] Active route highlighted. Player mini bar slot (empty for now).

**Acceptance criteria:**
- [ ] Phone: all themes show bottom tabs
- [ ] Tablet/desktop: Sumi = top, Kami = side, Mori = floating/bottom
- [ ] Active page highlighted, smooth transitions
- [ ] Safe area padding on notched devices

---

### 0.6 — Sidecar Foundation

Set up the Hono server with database, migrations, and middleware.

**Tasks:**
- [ ] Hono app with logging middleware
- [ ] bun:sqlite connection (WAL mode, foreign keys, busy timeout)
- [ ] Migration runner (sequential `.sql` files, tracked in `_migrations` table)
- [ ] `001_initial.sql` — full schema from `FUMIKI.md` section 8
- [ ] Seed data (7 categories, genre→category mappings)
- [ ] Session middleware (cookie → validate → attach to context)
- [ ] Health route (`GET /api/health`)
- [ ] Static file serving + SPA fallback

**Acceptance criteria:**
- [ ] Sidecar starts and serves on port 3000
- [ ] `GET /api/health` returns `{ data: { status: "ok" } }`
- [ ] Database created on first run, all tables exist
- [ ] Categories seeded

---

### 0.7 — Auth Flow

Login with AudioBookShelf credentials. Single adaptive login page.

**Tasks:**
- [ ] `server_config` table — key/value store for instance-level settings (ABS URL)
- [ ] On sidecar startup: if `ABS_URL` env var set → upsert into `server_config`
- [ ] `ABSClient` service (login, getLibraries — just enough for auth)
- [ ] `GET /api/auth/status` — returns `{ absConfigured, authenticated, absHost, username }`
- [ ] `POST /api/auth/login` — accepts optional `absUrl` (saves on first use) + username + password
- [ ] `POST /api/auth/logout` — destroys session
- [ ] Auth store (`src/lib/stores/auth.ts`) — `checkStatus()`, `login()`, `logout()`
- [ ] Login page (`/auth`) — single page that adapts:
  - First time: ABS URL field + username + password
  - Returning: saved server label + "Change" link + username + password
- [ ] Route guard in `+layout.svelte` — redirect to `/auth` if not authenticated
- [ ] Session cookie: HTTP-only, Secure (in production), SameSite=Lax, 30-day expiry
- [ ] Settings page: show connected ABS host, option to change ABS URL

**Acceptance criteria:**
- [ ] First launch: login page shows ABS URL field + credentials
- [ ] After first login: ABS URL saved, shown as label on future logins
- [ ] "Change" link re-expands URL field for editing
- [ ] `ABS_URL` env var pre-configures URL (field hidden entirely)
- [ ] Can connect to a real ABS server
- [ ] Session persists across page reloads
- [ ] Invalid credentials show error message
- [ ] Unreachable ABS server shows connection error
- [ ] Logout clears session and redirects to login
- [ ] All API routes return 401 without valid session
- [ ] ABS URL + token never exposed to the client

---

### 0.8 — Docker Build

Package into a single container.

**Tasks:**
- [ ] Multi-stage Dockerfile (build client → runtime)
- [ ] `docker-compose.yml` with data volume
- [ ] Health check configured

**Acceptance criteria:**
- [ ] `docker compose up -d` builds and runs
- [ ] App at `http://localhost:3000`
- [ ] Data persists across restarts
- [ ] Image < 150MB

---

### 0.9 — Dev Tools Page (temporary)

Development-only visual testing page.

**Tasks:**
- [ ] `/dev/components` — all UI components in all states
- [ ] `/dev/themes` — side-by-side theme comparison
- [ ] Only accessible when `NODE_ENV=development`

---

## Definition of Done

After Phase 0, the app:
- Shows auth page → connects to ABS → renders empty home page
- Navigation works across all themes and breakpoints
- Theme switching is instant and persisted
- 11 core UI components built and themed
- Docker build works end-to-end
- No books, no player, no reader yet — just the foundation

---

*Next: Phase 1 — Reader & Player*
