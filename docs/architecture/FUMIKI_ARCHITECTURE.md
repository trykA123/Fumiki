# Fumiki — Architecture

> System design, deployment, request flows, and infrastructure.

---

## 1. System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Device                              │
│                 (Phone / Tablet / Desktop)                       │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Fumiki Client (SvelteKit SPA)              │   │
│   │                                                         │   │
│   │   ┌──────────┐ ┌──────────┐ ┌────────┐ ┌──────────┐   │   │
│   │   │ Library  │ │  Player  │ │ Reader │ │  Bonsai  │   │   │
│   │   └────┬─────┘ └────┬─────┘ └───┬────┘ └────┬─────┘   │   │
│   │        │             │           │           │         │   │
│   │   ┌────┴─────────────┴───────────┴───────────┴─────┐   │   │
│   │   │            Svelte Stores (State)               │   │   │
│   │   └────────────────────┬───────────────────────────┘   │   │
│   │                        │                               │   │
│   │   ┌────────────────────┴───────────────────────────┐   │   │
│   │   │              API Client (fetch)                │   │   │
│   │   └────────────────────┬───────────────────────────┘   │   │
│   └────────────────────────┼───────────────────────────────┘   │
│                            │ HTTPS                              │
└────────────────────────────┼───────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Fumiki Sidecar                                │
│                 (Bun + Hono + SQLite)                            │
│                 Serves: API + Static Client                      │
│                                                                 │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │                     Hono Router                          │  │
│   │                                                          │  │
│   │   /api/auth/*          → Auth routes                     │  │
│   │   /api/abs/*           → ABS proxy routes                │  │
│   │   /api/notes/*         → Notes CRUD                      │  │
│   │   /api/summaries/*     → AI summary routes               │  │
│   │   /api/progress/*      → KP & progression                │  │
│   │   /api/bonsai/*        → Bonsai state                    │  │
│   │   /api/preferences/*   → User settings                   │  │
│   │   /*                   → Static file serving (client)    │  │
│   │                                                          │  │
│   ├──────────────────────────────────────────────────────────┤  │
│   │                     Middleware                            │  │
│   │   Session auth → Rate limit → Request logging            │  │
│   ├──────────────────────────────────────────────────────────┤  │
│   │                     Services                             │  │
│   │   ABS Client │ KP Calculator │ AI Provider │ Bonsai Eng  │  │
│   ├──────────────────────────────────────────────────────────┤  │
│   │                     SQLite (bun:sqlite)                  │  │
│   │                     /app/data/fumiki.db                  │  │
│   └──────────────────────────────────────────────────────────┘  │
│                            │                                    │
│                            │ HTTP(S)                            │
└────────────────────────────┼────────────────────────────────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼ (optional)
┌──────────────────────────┐  ┌──────────────────────────┐
│    AudioBookShelf        │  │    AI Provider           │
│    (user's server)       │  │                          │
│                          │  │  • Ollama (local)        │
│  • Auth (login/token)    │  │  • OpenAI API            │
│  • Library metadata      │  │  • Anthropic API         │
│  • Audio streaming       │  │                          │
│  • Ebook file serving    │  │  Endpoint + API key      │
│  • Progress read/write   │  │  stored in preferences   │
└──────────────────────────┘  └──────────────────────────┘
```

---

## 2. Key Architectural Decisions

### 2.1 Single Deployment Unit

The sidecar serves both the API and the client static files. One container, one port.

```
Sidecar process (Bun)
  ├── Hono API routes    → /api/*
  └── Static file serve  → /* (SvelteKit build output)
```

This means:
- No CORS issues (same origin)
- No separate web server needed (no nginx)
- Single docker-compose service
- Client is pre-built at Docker image build time

### 2.2 Client Never Talks to ABS Directly

All ABS communication goes through the sidecar. Reasons:
- ABS API token stored server-side only (never in browser)
- Sidecar can cache metadata, reducing ABS load
- Sidecar can transform ABS responses to Fumiki's format
- Client doesn't need to know ABS API specifics

### 2.3 Auth & ABS Linking

Fumiki does NOT have its own user system. Users authenticate with their AudioBookShelf credentials. ABS is the identity provider.

**One login page, smart about what it remembers.** The first time anyone uses a Fumiki instance, they enter the ABS server URL + credentials. The URL is saved. Every subsequent login just shows username + password with the saved server displayed as a label.

#### Login Flow

```
First login (ABS URL not yet saved):
┌──────────────────────────────────────────┐
│                                          │
│     🌳 Fumiki 文木                        │
│                                          │
│  AudioBookShelf Server                   │
│  ┌──────────────────────────────────┐    │
│  │ http://audiobookshelf:80         │    │
│  └──────────────────────────────────┘    │
│  ℹ️ Docker URL, public URL, or IP.       │
│     Fumiki connects from the server.     │
│                                          │
│  Username                                │
│  ┌──────────────────────────────────┐    │
│  │                                  │    │
│  └──────────────────────────────────┘    │
│                                          │
│  Password                                │
│  ┌──────────────────────────────────┐    │
│  │                                  │    │
│  └──────────────────────────────────┘    │
│                                          │
│  [       Log In       ]                  │
│                                          │
└──────────────────────────────────────────┘


Returning login (ABS URL saved):
┌──────────────────────────────────────────┐
│                                          │
│     🌳 Fumiki 文木                        │
│                                          │
│  audiobookshelf ✓         [Change]       │
│                                          │
│  Username                                │
│  ┌──────────────────────────────────┐    │
│  │                                  │    │
│  └──────────────────────────────────┘    │
│                                          │
│  Password                                │
│  ┌──────────────────────────────────┐    │
│  │                                  │    │
│  └──────────────────────────────────┘    │
│                                          │
│  [       Log In       ]                  │
│                                          │
└──────────────────────────────────────────┘
```

**Tapping "Change"** expands the server URL field back into an editable input. Saving a new URL invalidates all existing sessions.

#### Sidecar Logic

```
On login request:
  1. Read ABS URL from request body (first time) or server_config (returning)
  2. Call ABS /login with username + password
  3. ABS validates → returns API token
  4. Store connection (absToken) in SQLite
  5. If first time: save ABS URL to server_config
  6. Create session → set HTTP-only cookie
  7. Return success
```

#### ABS URL Resolution (priority order)

1. `ABS_URL` environment variable (if set, always wins — for power users)
2. `server_config` table entry (saved from first login)
3. User input on login page (first time only)

The env var is optional. Most users never touch it — they just enter the URL on first login.

#### Key Principles

- **Client never knows the ABS URL or token.** Everything proxied through sidecar.
- **ABS doesn't need to be publicly accessible.** Docker internal URLs work.
- **One login page, not two.** No separate "setup" page. The login page adapts.

#### Deployment Scenarios

**Scenario A: Same Docker network (recommended)**

```yaml
# docker-compose.yml
services:
  audiobookshelf:
    image: ghcr.io/advplyr/audiobookshelf:latest
    container_name: audiobookshelf
    ports:
      - "13378:80"
    volumes:
      - ./abs-config:/config
      - ./abs-metadata:/metadata
      - /path/to/audiobooks:/audiobooks
      - /path/to/ebooks:/ebooks
    restart: unless-stopped

  fumiki:
    build: .
    container_name: fumiki
    ports:
      - "3000:3000"
    volumes:
      - fumiki-data:/app/data
    environment:
      - NODE_ENV=production
      - PORT=3000
      # ABS_URL not needed — entered on first login
    restart: unless-stopped

volumes:
  fumiki-data:
    driver: local
```

First user opens Fumiki, enters `http://audiobookshelf:80` + credentials. Done. Every user after that just sees username + password.

**Scenario B: Power user with env var**

```yaml
    environment:
      - ABS_URL=http://audiobookshelf:80   # Pre-configured, URL field never shown
```

**Scenario C: ABS on different server**

First user enters `https://abs.example.com` on login page. Saved for all future logins.

#### Your Setup

```
Internet → NPM → books.erzago.duckdns.org → fumiki:3000
                                                 ↓ (Docker internal)
                                            ABS (audiobookshelf:80)
```

#### Reverse Proxy (Nginx Proxy Manager)

| Field | Value |
|---|---|
| Domain | `books.erzago.duckdns.org` |
| Scheme | `http` |
| Forward Hostname | `fumiki` |
| Forward Port | `3000` |
| SSL | Let's Encrypt |
| Websockets | Enable |

#### Session Lifecycle

| Event | Behavior |
|---|---|
| First login | ABS URL saved + session created, cookie set (30 days) |
| Returning login | Session created using saved ABS URL |
| Normal use | Cookie refreshed on activity (sliding expiration) |
| ABS token expires | Sidecar re-authenticates or prompts re-login |
| User logs out | Session deleted, cookie cleared, redirect to login |
| Cookie expires (30 days) | Redirect to login |
| ABS password changed | Next ABS request fails → prompt re-login |
| ABS URL changed | All sessions invalidated, all users re-login |

### 2.4 SQLite as Single Database

- `bun:sqlite` — native, zero-config, embedded
- Single file: `/app/data/fumiki.db`
- WAL mode enabled for concurrent reads
- Migrations run on startup
- Backed up via Docker volume

### 2.5 Static SPA Client

SvelteKit builds to a static site (adapter-static):
- No server-side rendering needed (all data comes from API)
- Pre-built at Docker image build time
- Served by Hono's static middleware
- Client-side routing handles all navigation

---

## 3. Request Flow Examples

### 3.1 Loading the Library

```
Client                     Sidecar                    ABS
  │                          │                         │
  │  GET /api/abs/library    │                         │
  │ ─────────────────────►   │                         │
  │  (session cookie)        │                         │
  │                          │  GET /api/libraries     │
  │                          │  ────────────────────►  │
  │                          │  (ABS token header)     │
  │                          │                         │
  │                          │  ◄──── library data ──  │
  │                          │                         │
  │                          │  (transform to Fumiki   │
  │                          │   format, cache in      │
  │                          │   book_cache table)     │
  │                          │                         │
  │  ◄──── books[] ─────────│                         │
  │                          │                         │
```

### 3.2 Playing an Audiobook

```
Client                     Sidecar                    ABS
  │                          │                         │
  │  GET /api/abs/items/{id} │                         │
  │ ─────────────────────►   │                         │
  │                          │  GET /api/items/{id}    │
  │                          │  ────────────────────►  │
  │                          │  ◄──── item metadata ── │
  │  ◄──── book detail ─────│                         │
  │                          │                         │
  │  Audio stream URL:       │                         │
  │  /api/abs/stream/{id}    │                         │
  │ ─────────────────────►   │                         │
  │                          │  Proxy stream from ABS  │
  │                          │  ────────────────────►  │
  │  ◄──── audio chunks ────│  ◄──── audio chunks ── │
  │                          │                         │
  │  POST /api/progress/kp   │                         │
  │  { bookId, minutes: 5 }  │                         │
  │ ─────────────────────►   │                         │
  │                          │  (calculate KP,         │
  │                          │   update user_progress, │
  │                          │   update bonsai)        │
  │                          │                         │
  │                          │  POST /api/session/{id}/sync
  │                          │  ────────────────────►  │
  │                          │  (sync progress to ABS) │
```

### 3.3 AI Chapter Summary

```
Client                     Sidecar                    AI Provider
  │                          │                         │
  │  POST /api/summaries     │                         │
  │  { bookId, chapter: 3 }  │                         │
  │ ─────────────────────►   │                         │
  │                          │  Check cache (summaries │
  │                          │  table) — if exists,    │
  │                          │  return immediately     │
  │                          │                         │
  │                          │  If not cached:         │
  │                          │  Extract chapter text   │
  │                          │  from ebook via ABS     │
  │                          │                         │
  │                          │  POST /v1/messages (or  │
  │                          │  /v1/chat/completions)  │
  │                          │  ────────────────────►  │
  │                          │  ◄──── summary text ──  │
  │                          │                         │
  │                          │  Store in summaries     │
  │                          │  table for cache        │
  │                          │                         │
  │  ◄──── summary ─────────│                         │
```

---

## 4. Deployment

### 4.1 Docker Compose

**Fumiki + ABS on same Docker network (recommended):**

```yaml
# docker-compose.yml
services:
  audiobookshelf:
    image: ghcr.io/advplyr/audiobookshelf:latest
    container_name: audiobookshelf
    ports:
      - "13378:80"                    # Optional: local access to ABS web UI
    volumes:
      - ./abs-config:/config
      - ./abs-metadata:/metadata
      - /path/to/audiobooks:/audiobooks
      - /path/to/ebooks:/ebooks
    restart: unless-stopped

  fumiki:
    build: .
    container_name: fumiki
    ports:
      - "3000:3000"
    volumes:
      - fumiki-data:/app/data
    environment:
      - NODE_ENV=production
      - PORT=3000
      - ABS_URL=http://audiobookshelf:80    # Docker internal — no public exposure
    restart: unless-stopped

volumes:
  fumiki-data:
    driver: local
```

**Fumiki standalone** (ABS URL set via first-run setup):

```yaml
# docker-compose.yml
services:
  fumiki:
    build: .
    container_name: fumiki
    ports:
      - "3000:3000"
    volumes:
      - fumiki-data:/app/data
    environment:
      - NODE_ENV=production
      - PORT=3000
      # ABS_URL not set — admin configures on first launch
    restart: unless-stopped

volumes:
  fumiki-data:
    driver: local
```

### 4.2 Dockerfile

```dockerfile
# === Build Client ===
FROM oven/bun:1 AS client-build
WORKDIR /app/client
COPY client/package.json client/bun.lock ./
RUN bun install --frozen-lockfile
COPY client/ .
COPY shared/ /app/shared/
RUN bun run build

# === Runtime ===
FROM oven/bun:1-slim AS runtime
WORKDIR /app

# Install sidecar dependencies
COPY sidecar/package.json sidecar/bun.lock ./sidecar/
RUN cd sidecar && bun install --frozen-lockfile --production

# Copy sidecar source
COPY sidecar/ ./sidecar/
COPY shared/ ./shared/

# Copy built client
COPY --from=client-build /app/client/build ./client/build

# Create data directory
RUN mkdir -p /app/data

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["bun", "run", "sidecar/src/index.ts"]
```

### 4.3 Sidecar Entry Point

```typescript
// sidecar/src/index.ts
import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import { db, runMigrations } from './db/schema';
import { sessionMiddleware } from './middleware/session';
import { authRoutes } from './routes/auth';
import { absProxyRoutes } from './routes/abs-proxy';
import { notesRoutes } from './routes/notes';
import { summariesRoutes } from './routes/summaries';
import { progressRoutes } from './routes/progress';
import { bonsaiRoutes } from './routes/bonsai';
import { preferencesRoutes } from './routes/preferences';
import { healthRoutes } from './routes/health';

// Initialize database
runMigrations();

const app = new Hono();

// Global middleware
app.use('*', logger());

// API routes (session auth required except /auth and /health)
app.route('/api/health', healthRoutes);
app.route('/api/auth', authRoutes);

// Protected API routes
app.use('/api/*', sessionMiddleware);
app.route('/api/abs', absProxyRoutes);
app.route('/api/notes', notesRoutes);
app.route('/api/summaries', summariesRoutes);
app.route('/api/progress', progressRoutes);
app.route('/api/bonsai', bonsaiRoutes);
app.route('/api/preferences', preferencesRoutes);

// Serve static client (SvelteKit build)
app.use('/*', serveStatic({ root: './client/build' }));

// SPA fallback — serve index.html for all non-API, non-file routes
app.get('*', serveStatic({ root: './client/build', path: 'index.html' }));

const port = parseInt(process.env.PORT || '3000');
console.log(`Fumiki sidecar running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};
```

---

## 5. Database

### 5.1 Connection & Configuration

```typescript
// sidecar/src/db/schema.ts
import { Database } from 'bun:sqlite';
import { join } from 'path';

const DB_PATH = join(process.env.DATA_DIR || '/app/data', 'fumiki.db');

export const db = new Database(DB_PATH, { create: true });

// Enable WAL mode for better concurrent read performance
db.run('PRAGMA journal_mode = WAL');
db.run('PRAGMA foreign_keys = ON');
db.run('PRAGMA busy_timeout = 5000');
```

### 5.2 Migrations

Migrations are sequential SQL files executed on startup.

```
sidecar/src/db/migrations/
  001_initial.sql
  002_add_seasons.sql
  ...
```

```typescript
// sidecar/src/db/migrations.ts
import { db } from './schema';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

export function runMigrations() {
  db.run(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      applied_at INTEGER DEFAULT (unixepoch())
    )
  `);

  const dir = join(import.meta.dir, 'migrations');
  const files = readdirSync(dir).filter(f => f.endsWith('.sql')).sort();

  const applied = new Set(
    db.query('SELECT name FROM _migrations').all().map((r: any) => r.name)
  );

  for (const file of files) {
    if (!applied.has(file)) {
      const sql = readFileSync(join(dir, file), 'utf-8');
      db.run('BEGIN');
      try {
        db.run(sql);
        db.run('INSERT INTO _migrations (name) VALUES (?)', [file]);
        db.run('COMMIT');
        console.log(`Migration applied: ${file}`);
      } catch (err) {
        db.run('ROLLBACK');
        throw new Error(`Migration failed: ${file}: ${err}`);
      }
    }
  }
}
```

### 5.3 Full Schema

See `FUMIKI.md` section 8 for the complete SQL schema.

---

## 6. ABS Proxy Layer

The ABS client abstracts all AudioBookShelf API communication.

```typescript
// sidecar/src/services/abs-client.ts

interface ABSConnection {
  absUrl: string;
  absToken: string;
}

export class ABSClient {
  private baseUrl: string;
  private token: string;

  constructor(connection: ABSConnection) {
    this.baseUrl = connection.absUrl.replace(/\/$/, '');
    this.token = connection.absToken;
  }

  private async request(path: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${path}`;
    const res = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!res.ok) {
      throw new Error(`ABS API error: ${res.status} ${res.statusText}`);
    }

    return res;
  }

  async getLibraries() {
    const res = await this.request('/api/libraries');
    return res.json();
  }

  async getLibraryItems(libraryId: string, params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    const res = await this.request(`/api/libraries/${libraryId}/items${query}`);
    return res.json();
  }

  async getItem(itemId: string) {
    const res = await this.request(`/api/items/${itemId}?expanded=1`);
    return res.json();
  }

  async getItemCover(itemId: string): Promise<Response> {
    return this.request(`/api/items/${itemId}/cover`);
  }

  async streamAudio(itemId: string): Promise<Response> {
    return this.request(`/api/items/${itemId}/play`);
  }

  async getEbookContent(itemId: string): Promise<Response> {
    return this.request(`/api/items/${itemId}/ebook`);
  }

  async updateProgress(itemId: string, progress: object) {
    return this.request(`/api/me/progress/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify(progress),
    });
  }

  async login(username: string, password: string) {
    const res = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) throw new Error('ABS login failed');
    return res.json();
  }
}
```

---

## 7. AI Provider Abstraction

```typescript
// sidecar/src/services/ai/provider.ts

export interface AIProvider {
  summarize(text: string, options?: { maxTokens?: number }): Promise<string>;
}

export function createAIProvider(config: {
  provider: 'ollama' | 'openai' | 'anthropic';
  endpoint?: string;
  model?: string;
  apiKey?: string;
}): AIProvider {
  switch (config.provider) {
    case 'ollama':
      return new OllamaProvider(config);
    case 'openai':
      return new OpenAIProvider(config);
    case 'anthropic':
      return new AnthropicProvider(config);
    default:
      throw new Error(`Unknown AI provider: ${config.provider}`);
  }
}
```

Each provider implements `summarize()` using the respective API format.
The sidecar reads AI config from the user's `preferences` table row.

---

## 8. Session Management

```typescript
// sidecar/src/middleware/session.ts
import { Context, Next } from 'hono';
import { db } from '../db/schema';
import { getCookie } from 'hono/cookie';

const SESSION_COOKIE = 'fumiki_session';
const SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

export async function sessionMiddleware(c: Context, next: Next) {
  const token = getCookie(c, SESSION_COOKIE);

  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const session = db.query(`
    SELECT s.*, c.abs_url, c.abs_token, c.abs_user_id
    FROM sessions s
    JOIN connections c ON s.connection_id = c.id
    WHERE s.token = ? AND s.expires_at > unixepoch()
  `).get(token) as any;

  if (!session) {
    return c.json({ error: 'Session expired' }, 401);
  }

  // Attach to context for route handlers
  c.set('session', session);
  c.set('connectionId', session.connection_id);
  c.set('absUrl', session.abs_url);
  c.set('absToken', session.abs_token);

  await next();
}
```

---

## 9. Caching Strategy

### Server-Side (Sidecar)

| Data | Cache Location | TTL | Invalidation |
|---|---|---|---|
| ABS library items | `book_cache` table | 1 hour | Manual refresh / on library load |
| Book covers | Filesystem `/app/data/covers/` | Indefinite | When book changes |
| AI summaries | `summaries` table | Indefinite | Never (content doesn't change) |
| User progress | `user_progress` table | Real-time | Updated on each KP event |

### Client-Side (SvelteKit)

| Data | Cache | Strategy |
|---|---|---|
| Library list | Svelte store + localStorage | Stale-while-revalidate |
| Book detail | Svelte store | Fetch on navigate, cache in memory |
| Notes | Svelte store | Fetch per book, write-through |
| Preferences | Svelte store + localStorage | Load once, write-through |
| Bonsai state | Svelte store | Fetch on bonsai page |
| KP / progress | Svelte store | Updated via WebSocket or polling |

---

## 10. Error Handling

### Sidecar

```typescript
// Global error handler
app.onError((err, c) => {
  console.error('Unhandled error:', err);

  if (err.message.includes('ABS API error')) {
    return c.json({ error: 'AudioBookShelf connection error', detail: err.message }, 502);
  }

  if (err.message.includes('AI provider')) {
    return c.json({ error: 'AI service error', detail: err.message }, 503);
  }

  return c.json({ error: 'Internal server error' }, 500);
});
```

### Client

All API calls go through a central fetch wrapper that handles:
- 401 → Redirect to auth page
- 502 → Show "ABS connection error" toast
- 503 → Show "AI service unavailable" toast
- Network error → Show "Offline" indicator

---

## 11. ABS Connection Resilience

AudioBookShelf may go offline temporarily (restarts, network issues, maintenance). Fumiki handles this gracefully.

### Detection

The sidecar detects ABS unavailability when any proxy request returns a network error or non-2xx status.

### Behavior During ABS Outage

| Feature | Behavior | Data Source |
|---|---|---|
| Library browsing | Works (cached) | `book_cache` table |
| Book detail | Works (cached) | `book_cache` table |
| Cover images | Works (cached) | Filesystem `/app/data/covers/` |
| Audio playback | Fails — shows "ABS unavailable" | Requires live stream |
| Ebook reading | Fails (unless downloaded for offline) | Requires file from ABS |
| Notes | Works (all local) | `notes` table |
| KP / Bonsai | Works (all local) | `kp_events`, `bonsai` tables |
| Progress sync to ABS | Queued — retried when ABS returns | Queue in `progress_sync_queue` |

### Progress Sync Queue

When ABS is unreachable during a progress sync, the sidecar queues the update:

```sql
CREATE TABLE progress_sync_queue (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
  connection_id TEXT NOT NULL REFERENCES connections(id),
  book_id TEXT NOT NULL,
  progress REAL NOT NULL,
  current_time REAL,
  ebook_location TEXT,
  is_finished INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (unixepoch())
);
```

A background job runs every 60 seconds: fetch queued items → attempt sync → delete on success → increment attempts on failure → discard after 100 attempts.

### Client-Side Indicators

- **ABS offline banner** — subtle, persistent banner at top: "AudioBookShelf is unreachable. Cached content available."
- **Degraded feature indicators** — Play/Read buttons show disabled state with tooltip: "Requires AudioBookShelf connection"
- **Auto-recovery** — When ABS comes back, banner dismisses, queued syncs flush, library refreshes in background

### Reconnection Strategy

```
On ABS error:
  1. Mark connection as degraded (in-memory flag)
  2. Show banner on client
  3. Start health check polling: GET /api/abs/libraries every 30 seconds
  4. On success: clear degraded flag, dismiss banner, flush sync queue
  5. Stop polling after recovery
```

---

## 12. Data Backup & Migration

### SQLite Backup

The entire Fumiki state lives in a single file: `fumiki.db`. Users can back up by copying this file.

**Recommended backup approaches:**
- Docker volume snapshot
- Cron job: `cp /app/data/fumiki.db /app/data/backups/fumiki-$(date +%Y%m%d).db`
- Manual: stop container → copy `fumiki.db` → restart

### Schema Migrations on Upgrade

When Fumiki updates (new Docker image), the migration runner handles schema changes:

1. Container starts
2. `runMigrations()` executes on startup
3. Compares `migrations/*.sql` files against `_migrations` table
4. Applies any new migrations in order, within transactions
5. If a migration fails: rollback that migration, log error, exit (do not start with broken schema)

**Rules for writing migrations:**
- Always additive (add columns, add tables) — never drop columns in use
- Use `ALTER TABLE ... ADD COLUMN` with defaults for backward compatibility
- Never rename columns — add new, migrate data, deprecate old
- Test migrations against a copy of production data before releasing

### Data Portability

Fumiki stores user data (notes, KP, bonsai state) separately from ABS data (library metadata cache). If a user switches ABS servers:
- Notes, KP, bonsai, and seasons are preserved (linked to `connection_id`, but transferable)
- Library cache refreshes from the new server
- Book-specific notes may become orphaned if the same book doesn't exist on the new server (preserved but unlinkable until the book appears)

---

## 13. Security

| Concern | Mitigation |
|---|---|
| ABS token exposure | Stored server-side only, never sent to client |
| AI API keys | Stored in SQLite preferences, never sent to client |
| XSS | SvelteKit escapes by default; CSP headers on static files |
| Session hijacking | HTTP-only, Secure, SameSite=Lax cookie |
| Ebook script injection | foliate-js + CSP blocks all scripts except 'self' |
| Rate limiting | Middleware on AI routes (5 requests/minute) |
| SQL injection | Parameterized queries via bun:sqlite |

---

## 14. Performance Targets

| Metric | Target |
|---|---|
| Initial page load (LCP) | < 1.5s on 4G |
| Time to interactive | < 2s |
| Library page render (100 books) | < 500ms |
| Audio playback start | < 1s |
| Theme switch | < 100ms (CSS only, no re-render) |
| SQLite query (any) | < 10ms |
| Docker image size | < 150MB |
| Memory usage (idle) | < 100MB |

---

*Companion to FUMIKI.md*
