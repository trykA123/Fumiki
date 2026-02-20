# Fumiki — Rules & Constraints

> Hard rules. Non-negotiable. Read before writing any code.
> If a rule conflicts with your instincts, the rule wins.

---

## 1. Package Manager & Runtime

| Rule | Details |
|---|---|
| **Bun only** | Use `bun`, `bunx`, `bun install`, `bun run`, `bun add`, `bun remove`. Never `npm`, `npx`, `yarn`, `pnpm`. |
| **bun.lock** | Lockfile is `bun.lock`, not `package-lock.json` or `yarn.lock`. Delete those if they appear. |
| **bun:sqlite** | Use Bun's native SQLite. Never install `better-sqlite3`, `sql.js`, `knex`, `prisma`, `drizzle`, or any ORM. Write raw SQL with parameterized queries. |
| **Bun scripts** | All `package.json` scripts use `bun run`. Example: `"dev": "bun run --hot sidecar/src/index.ts"`. |
| **Bun workspace** | Root `package.json` uses `"workspaces": ["client", "sidecar", "shared"]`. |

```json
// ✅ Correct
"scripts": {
  "dev": "bun run sidecar/src/index.ts --hot",
  "build": "cd client && bunx svelte-kit build",
  "migrate": "bun run sidecar/src/db/migrations.ts"
}

// ❌ Wrong
"scripts": {
  "dev": "npx ts-node sidecar/src/index.ts",
  "build": "npm run build --workspace=client"
}
```

---

## 2. No ORMs, No Query Builders

- Write **raw SQL** with parameterized queries via `bun:sqlite`
- No Prisma, no Drizzle, no Knex, no TypeORM, no Sequelize
- No query builder libraries of any kind
- Schema defined in `.sql` migration files, not in TypeScript decorators or schema builders
- Queries are simple enough that an ORM adds no value and plenty of weight

```typescript
// ✅ Correct
const book = db.query('SELECT * FROM book_cache WHERE book_id = ?').get(bookId);

// ❌ Wrong
const book = await prisma.bookCache.findUnique({ where: { bookId } });
```

---

## 3. No Unnecessary Dependencies

Before adding any dependency, ask: **"Can I do this with what I already have?"**

### Already Available (don't duplicate)

| Need | Use | Don't install |
|---|---|---|
| HTTP framework | Hono (already chosen) | Express, Fastify, Koa |
| Database | bun:sqlite (built-in) | better-sqlite3, pg, mysql |
| Validation | Zod (already chosen) | Joi, Yup, AJK |
| CSS framework | Tailwind CSS 4 (already chosen) | Bootstrap, Chakra, Mantine |
| Fetch/HTTP client | Native `fetch` (built into Bun & browsers) | Axios, got, node-fetch, ky |
| Date formatting | `Intl.DateTimeFormat` (built-in) | moment, dayjs, date-fns, luxon |
| UUID generation | `crypto.randomUUID()` or `hex(randomblob(8))` in SQLite | uuid, nanoid, cuid |
| JSON parsing | Native `JSON.parse` | Any JSON library |
| Path utilities | Bun's native path | path-to-regexp for routes |
| Environment variables | `process.env` or `Bun.env` | dotenv (Bun loads .env natively) |
| Testing | `bun:test` (built-in) | Jest, Vitest, Mocha |

### Approved Dependencies (already in the stack)

- `hono` — HTTP framework
- `zod` — Validation
- `svelte` / `@sveltejs/kit` — Frontend framework
- `tailwindcss` — Styling
- `foliate-js` — Ebook rendering (git submodule)
- `howler.js` — Audio playback (if needed beyond native `<audio>`)

### Adding New Dependencies

If you genuinely need a new dependency:
1. Check if Bun or browser APIs cover the need
2. Check if an existing dependency covers it
3. Prefer zero-dependency, single-purpose packages
4. Prefer packages < 50KB gzipped
5. Never install packages with native bindings (no node-gyp)

---

## 4. Styling Rules

### Safe Areas & System Bars (Android / iOS / PWA)

The app must never render interactive content behind system UI (status bar, navigation bar, notch).

**How it works:**

The HTML viewport meta tag must include `viewport-fit=cover` to allow the app to draw edge-to-edge:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```

Then use CSS `env()` safe area insets to pad content away from system UI:

```css
/* These are provided by the browser/webview automatically */
env(safe-area-inset-top)      /* Status bar (time, battery, signal) */
env(safe-area-inset-bottom)   /* Gesture bar / 3-button nav */
env(safe-area-inset-left)     /* Landscape notch */
env(safe-area-inset-right)    /* Landscape notch */
```

**Rules:**

| Area | What to pad | How |
|---|---|---|
| **App shell top** | Top nav, top toolbar | `padding-top: env(safe-area-inset-top)` |
| **App shell bottom** | Bottom nav, mini player | `padding-bottom: env(safe-area-inset-bottom)` |
| **Full-screen pages** | Player, Reader | Both top and bottom safe areas |
| **Modals** | Any edge-touching modal | All four safe areas |
| **Scrollable content** | Main content area | Top inset on first element, bottom inset on last |

**Implementation pattern:**

```css
/* App shell — applies safe areas to the outer layout */
.app-shell {
  padding-top: env(safe-area-inset-top, 0px);
  padding-bottom: env(safe-area-inset-bottom, 0px);
  padding-left: env(safe-area-inset-left, 0px);
  padding-right: env(safe-area-inset-right, 0px);
}

/* Bottom nav — sits above the gesture bar */
.bottom-nav {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

/* Full-screen player — needs its own safe area handling */
.player-full {
  padding-top: env(safe-area-inset-top, 0px);
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

/* Status bar background — colored bar behind transparent status bar */
.status-bar-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: env(safe-area-inset-top, 0px);
  background: var(--surface-0);
  z-index: var(--z-fixed);
}
```

**Capacitor-specific:**

In `capacitor.config.ts`, configure the status bar to be transparent so the app draws behind it:

```typescript
// capacitor.config.ts
{
  plugins: {
    StatusBar: {
      overlaysWebView: true,     // App draws behind status bar
      style: 'Dark',             // Light text (for Sumi/Mori), or 'Light' for Kami
      backgroundColor: '#00000000'  // Transparent
    }
  }
}
```

The status bar text color (light/dark) must switch when the theme changes:
- Sumi (dark bg) → light status bar text
- Kami (light bg) → dark status bar text
- Mori (dark bg) → light status bar text

**Testing checklist:**
- [ ] No content hidden behind status bar
- [ ] No interactive elements behind gesture bar
- [ ] Bottom nav fully visible above gesture bar
- [ ] Full-screen player/reader handles all safe areas
- [ ] Landscape mode handles left/right notch insets
- [ ] Works on devices with no notch (safe areas = 0px, fallback works)

**Never do:**
```css
/* ❌ Hardcoded status bar height — varies by device */
padding-top: 24px;
padding-top: 48px;

/* ❌ Forgetting the fallback — breaks on devices without safe areas */
padding-top: env(safe-area-inset-top);  /* No fallback! */

/* ✅ Always include fallback */
padding-top: env(safe-area-inset-top, 0px);
```

---

### Never Hardcode

```css
/* ❌ Never */
color: #c22038;
background: #0e0d14;
border-radius: 8px;
padding: 16px;
font-family: 'DM Sans';
transition: all 200ms;

/* ✅ Always */
color: var(--accent);
background: var(--surface-1);
border-radius: var(--radius-lg);
padding: var(--card-padding);
font-family: var(--font-body);
transition: all var(--transition-base) ease;
```

### Theme-Aware Components

Every component MUST render correctly in all three themes without JavaScript theme detection. Use:
- CSS custom properties for all visual values
- `data-theme` attribute on `<html>` for theme-specific overrides
- `[data-theme="sumi"] .component { ... }` for structural differences

### No `!important`

Never use `!important`. If specificity is a problem, fix the selector structure.

### No Inline Styles (almost)

Inline styles are only acceptable for:
- Dynamic values from JavaScript (e.g., `style="width: {progress}%"`)
- User-set accent overrides (if we ever re-add customization)

Everything else goes in `<style>` blocks or Tailwind classes.

---

## 5. File & Code Rules

### No Default Exports (except Svelte components)

```typescript
// ✅ Named exports
export const library = createLibraryStore();
export function calculateKp(amount: number): number { ... }

// ❌ Default exports (in .ts files)
export default createLibraryStore();
```

Svelte components use default export by convention (SvelteKit requires it).

### No Barrel Files

```
// ❌ Don't create src/lib/stores/index.ts that re-exports everything
// ✅ Import directly
import { library } from '$lib/stores/library';
import { player } from '$lib/stores/player';
```

### No `console.log` in Production Code

- Sidecar: Use a simple logger (`console.info`, `console.warn`, `console.error` with context)
- Client: Remove all `console.log` before committing. Use the toast store for user-facing messages.

### No `any` Type

```typescript
// ❌ Never
const data: any = await response.json();

// ✅ Type it
interface ABSLibraryResponse { ... }
const data: ABSLibraryResponse = await response.json();

// ✅ Or at minimum, use `unknown` and narrow
const data: unknown = await response.json();
if (isABSLibraryResponse(data)) { ... }
```

The only exception: interfacing with external APIs (ABS) where the response shape isn't fully typed yet. In that case, cast to `unknown` first, then narrow.

### File Size Limits

| File Type | Max Lines | Action if exceeded |
|---|---|---|
| Svelte component | 150 lines | Split into sub-components |
| Store | 100 lines | Extract service functions |
| API route handler | 80 lines | Extract to service |
| Service | 200 lines | Split by responsibility |
| SQL migration | No limit | Keep sequential, one concern per file |

---

## 6. Database Rules

### Always Use Parameterized Queries

```typescript
// ✅ Safe
db.query('SELECT * FROM notes WHERE book_id = ? AND type = ?').all(bookId, type);

// ❌ SQL injection risk
db.query(`SELECT * FROM notes WHERE book_id = '${bookId}'`).all();
```

### Migrations Are Append-Only

- Never edit an existing migration file after it's been applied
- To change a table, create a new migration
- Migration filenames: `001_initial.sql`, `002_add_seasons.sql`, etc.
- Each migration runs in a transaction

### IDs Are Random Hex Strings

```sql
-- ✅ Fumiki ID pattern
id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8)))

-- ❌ Don't use auto-increment integers
id INTEGER PRIMARY KEY AUTOINCREMENT
```

Hex IDs are URL-safe, non-sequential (no enumeration attacks), and don't leak info about row count.

---

## 7. API Rules

### Response Shape

Every API response follows one of these shapes:

```typescript
// Success with data
{ data: T }

// Success with list
{ data: T[], total?: number }

// Error
{ error: string, detail?: string }
```

No other shapes. No `{ success: true, result: ... }`. No `{ message: "ok" }`.

### HTTP Status Codes

| Code | When |
|---|---|
| 200 | Success (GET, PATCH, DELETE) |
| 201 | Created (POST that creates a resource) |
| 400 | Bad request (validation error) |
| 401 | Unauthorized (no session / expired) |
| 404 | Not found |
| 429 | Rate limited |
| 500 | Internal server error |
| 502 | ABS connection error (upstream) |
| 503 | AI provider error (upstream) |

### No REST Purity Dogma

Use sensible URLs. Don't contort routes to be "RESTful" when a simple verb makes more sense:

```
// ✅ Clear and practical
POST /api/progress/kp
POST /api/progress/complete
GET  /api/notes/export/:bookId

// ❌ Over-RESTified
POST /api/progress-events
PATCH /api/books/:id/completion-status
GET  /api/books/:id/notes?format=markdown
```

---

## 8. Git Rules

### Commit Messages

```
type: short description

type is one of:
  feat     — New feature
  fix      — Bug fix
  refactor — Code restructuring (no behavior change)
  style    — CSS/visual changes
  docs     — Documentation
  chore    — Config, deps, build changes
  test     — Tests
```

```
// ✅ Good
feat: add audio player with chapter navigation
fix: book cover aspect ratio on Kami theme
style: adjust Mori card shadow depth
refactor: extract KP calculation to service

// ❌ Bad
update stuff
WIP
fix bug
changes
```

### Commit Best Practices

| Rule | Details |
|---|---|
| **Atomic commits** | One logical change per commit. Don't mix a feature + a refactor + a style fix in one commit. |
| **Build must pass** | Every commit should leave the project in a buildable, runnable state. No "WIP" commits on main. |
| **No large blobs** | Never commit images > 200KB, database files, build outputs, or binary assets. Use `.gitignore`. |
| **Review diffs before committing** | Always `git diff --staged` before commit. Catch accidental debug code, `console.log`, hardcoded values, or secrets. |
| **No fixup chains** | Don't commit "fix typo in last commit" separately. Use `git commit --amend` or squash before merging. |
| **Meaningful scope** | If a commit touches more than 5 files, consider splitting it. Exception: renames, migration-style changes. |

### Branch Names

```
feat/audio-player
fix/kami-cover-ratio
refactor/kp-service
```

### No Generated or Sensitive Files in Git

```gitignore
# Dependencies
node_modules/

# Build outputs
client/build/
dist/

# Runtime data
/app/data/
*.db
*.db-wal
*.db-shm

# Environment (CRITICAL — never commit secrets)
.env
.env.local
.env.production

# OS
.DS_Store
Thumbs.db

# Editor
.idea/
.vscode/
*.swp
```

### `.env` Safety Rules

1. **`.env` is gitignored. Always.** No exceptions, no "just this once."
2. **Only `.env.example` is committed.** It contains every variable with placeholder values.
3. **Never put real keys in `.env.example`.** Use obvious placeholders:

```env
# .env.example — committed to git
# Copy to .env and fill in real values

# Server
PORT=3000
NODE_ENV=development
LOG_LEVEL=info

# Data
DATA_DIR=/app/data

# AudioBookShelf (recommended — avoids first-run setup)
# ABS_URL=http://audiobookshelf:80

# AI (optional — configure in Settings UI instead)
# OLLAMA_ENDPOINT=http://localhost:11434
# OPENAI_API_KEY=sk-your-key-here
# ANTHROPIC_API_KEY=sk-ant-your-key-here
```

4. **If `.env` is accidentally committed:**
   - Remove it from git: `git rm --cached .env`
   - Add to `.gitignore` if missing
   - **Rotate ALL keys immediately** — they are compromised
   - Force-push to remove from history if on a private repo
5. **Pre-commit check:** Consider adding a git pre-commit hook that rejects commits containing `.env`:

```bash
#!/bin/sh
# .git/hooks/pre-commit
if git diff --cached --name-only | grep -qE '^\\.env$'; then
  echo "ERROR: Attempting to commit .env file. Aborting."
  exit 1
fi
```

---

## 9. Security Rules

| Rule | Details |
|---|---|
| **No secrets in client** | ABS tokens, AI API keys — server-side only. Never in Svelte stores, never in localStorage, never in responses. |
| **Secrets in `.env` only** | All API keys, tokens, and credentials go in `.env`. Never hardcode secrets in source code, config files, or migration scripts. Access via `Bun.env.VARIABLE_NAME`. |
| **Never commit `.env`** | `.env` is gitignored. Always. Only `.env.example` is committed, with placeholder values. If `.env` ever gets committed by accident, rotate all keys immediately. |
| **HTTP-only cookies** | Session token is HTTP-only, Secure, SameSite=Lax. Client JavaScript cannot read it. |
| **CSP headers** | Content-Security-Policy must block all scripts except `'self'`. Critical for foliate-js ebook rendering. |
| **Parameterized SQL** | Every query. No exceptions. See Database Rules above. |
| **No eval()** | Never. Not in client, not in sidecar. |
| **Sanitize user input** | Notes, reflections — sanitize before storing. No HTML injection. |
| **Rate limit AI routes** | 5 requests/minute per user for summary generation. |

---

## 10. Testing Rules

### Use `bun:test`

```typescript
import { describe, it, expect } from 'bun:test';

describe('KP Calculator', () => {
  it('calculates reading KP correctly', () => {
    expect(calculateKp({ source: 'reading', amount: 10 })).toBe(10);
  });
});
```

### What to Test

| Priority | What | How |
|---|---|---|
| High | KP calculation logic | Unit tests |
| High | API route handlers | Integration tests with test DB |
| High | Zod schemas | Unit tests (valid + invalid input) |
| Medium | Store actions | Unit tests with mocked fetch |
| Low | Components | Manual testing across 3 themes |

### What NOT to Test

- CSS/visual styling (test manually across themes)
- Third-party libraries (foliate-js, Howler.js)
- SQLite itself

---

## 11. Accessibility Rules

| Rule | Details |
|---|---|
| **Contrast** | WCAG AA minimum (4.5:1 body text, 3:1 large text, 3:1 UI elements) |
| **Touch targets** | Minimum 44×44px on mobile for interactive elements |
| **Keyboard nav** | All interactive elements reachable via Tab. Enter/Space to activate. Escape to close modals. |
| **Focus visible** | Focus ring visible on keyboard navigation. Use `:focus-visible`, not `:focus`. |
| **Aria labels** | Icon-only buttons need `aria-label`. Live regions for toasts. |
| **Reduced motion** | All animations respect `prefers-reduced-motion: reduce`. |
| **Semantic HTML** | Use `<button>` not `<div onclick>`. Use `<nav>`, `<main>`, `<aside>`. Use heading hierarchy. |

---

## 12. Performance Rules

| Rule | Details |
|---|---|
| **No blocking requests** | Page renders with skeleton immediately, data loads async |
| **Images lazy** | All images use `loading="lazy"` |
| **Bundle aware** | No dependencies > 100KB gzipped without explicit justification |
| **No layout thrashing** | Don't read DOM measurements in loops |
| **Debounce input** | Search: 300ms. Resize: 200ms. Scroll: 100ms. |
| **Throttle sync** | Reader progress: 30s. Player progress: 60s. KP recording: 60s. |
| **No memory leaks** | Clean up intervals, event listeners, and audio elements in `onDestroy` |

---

## 13. Environment & Config

### `.env.example`

```env
# Server
PORT=3000
NODE_ENV=development
LOG_LEVEL=info

# Data
DATA_DIR=/app/data
```

- Bun loads `.env` files natively — no `dotenv` package needed
- Access via `Bun.env.PORT` or `process.env.PORT`
- All config has sensible defaults. The app runs with zero env vars set.

### No Config Files Proliferation

| Allowed | Not allowed |
|---|---|
| `package.json` | `.babelrc` |
| `svelte.config.js` | `webpack.config.js` |
| `tailwind.config.js` | `.eslintrc` (use Biome or nothing) |
| `tsconfig.json` | `jest.config.js` |
| `Dockerfile` | `prettier.config.js` |
| `docker-compose.yml` | `.editorconfig` |
| `.env` / `.env.example` | |
| `.gitignore` | |

One config file per tool. No tool needs more than one.

---

*This file is a companion to FUMIKI_AGENT.md. Together they define how to think and what rules to follow.*
