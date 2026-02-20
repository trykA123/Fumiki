# Fumiki 文木

> *A tree that grows from literature.*

Fumiki is a reading companion for AudioBookShelf. It lets you read ebooks, listen to audiobooks, take notes, and grow a bonsai tree shaped by your reading practice. It ships with three visual themes rooted in Japanese aesthetic philosophy.

**Stack:** SvelteKit + Tailwind CSS 4 + Bun + Hono + SQLite
**Distribution:** Docker (self-hosted), Android APK (Capacitor), iOS PWA
**Primary targets:** Phone + Tablet (co-primary), Desktop (secondary)
**License:** MIT

---

## Table of Contents

1. [Core Principles](#1-core-principles)
2. [Architecture](#2-architecture)
3. [Tech Stack](#3-tech-stack)
4. [The Three Themes](#4-the-three-themes)
5. [The Bonsai](#5-the-bonsai)
6. [Progression System](#6-progression-system)
7. [Features by Phase](#7-features-by-phase)
8. [Data Model](#8-data-model)
9. [Project Structure](#9-project-structure)
10. [Deployment](#10-deployment)
11. [Design System](#11-design-system)

---

## 1. Core Principles

| Principle | Meaning |
|---|---|
| **Cultivate, don't compete** | Reading is a practice, not a game. The app rewards consistency and depth, not speed. |
| **Three moods, not ten skins** | Sumi (ink/dark), Kami (paper/light), Mori (forest/nature). Each is a complete UX, not a color swap. |
| **The tree is the feature** | Every user grows a unique bonsai shaped by what and how much they read. This is what people remember. |
| **Free forever** | No paywalls, no ads, no premium tiers. Self-hosted, user-owned. |
| **Mobile & tablet first** | Designed for phones and tablets as co-primary experiences. Tablets get split views (reader + notes, library + detail). Desktop works but is secondary. |
| **Extend ABS, don't replace it** | Fumiki is a client for AudioBookShelf. It adds notes, AI summaries, and the bonsai — it doesn't replicate ABS. |

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User Device                             │
│              (Phone / Tablet / Desktop)                      │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                     Fumiki Client                           │
│              SvelteKit (static build)                        │
│                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ Library  │ │  Player  │ │  Reader  │ │  Bonsai  │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
└───────────────────────┬─────────────────────────────────────┘
                        │
          ┌─────────────┴─────────────┐
          │                           │
          ▼                           ▼
┌───────────────────┐     ┌───────────────────────────┐
│  AudioBookShelf   │     │      Fumiki Sidecar       │
│  (user's server)  │     │   Bun + Hono + SQLite     │
│                   │     │                           │
│  • Auth           │     │  • Notes & Highlights     │
│  • Library data   │     │  • KP & Progression       │
│  • Audio streams  │     │  • Bonsai state           │
│  • Ebook files    │     │  • AI Summary proxy       │
│  • Progress sync  │     │  • User preferences       │
└───────────────────┘     └───────────────────────────┘
                                      │
                                      ▼ (optional)
                          ┌───────────────────────────┐
                          │   AI Provider             │
                          │   • Ollama (local)        │
                          │   • OpenAI / Anthropic    │
                          └───────────────────────────┘
```

### Key Decisions

1. **Single deployment unit.** The sidecar serves the client (static files) and the API. One Docker container, one port.

2. **ABS proxy through sidecar.** The client never talks to ABS directly. The sidecar adds auth, caches metadata, and abstracts the ABS API.

3. **Auth token stored server-side.** The client gets a session cookie. ABS credentials never touch the browser.

4. **Multi-user support.** Multiple users can connect to the same or different ABS servers. Each has their own bonsai, notes, and progression.

5. **Three themes with Level 3 depth.** Each theme changes tokens (colors, fonts), decorations (borders, patterns, textures), AND layout behavior (navigation style, spacing, card shapes, animation speed).

---

## 3. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Runtime | Bun | Fast, native SQLite, good DX |
| Frontend | SvelteKit (static SPA) | Less boilerplate, native transitions, CSS vars for themes |
| Styling | Tailwind CSS 4 | Utility-first, theme tokens via CSS custom properties |
| State | Svelte stores | Built-in reactivity, no external library needed |
| Backend | Hono (on Bun) | Lightweight, fast, middleware-friendly |
| Database | bun:sqlite | Embedded, single file, zero config |
| Validation | Zod | Shared schemas between client and sidecar |
| Audio | Howler.js + Media Session API | Cross-browser audio with lock screen controls |
| Ebook | foliate-js (git submodule) | Multi-format: EPUB, MOBI, AZW3, FB2, CBZ. Same lib Booklore uses. |
| Bonsai | SVG + D3 or custom Canvas | Generative tree visualization |
| Android | Capacitor | PWA wrapper → native APK |
| iOS | PWA | Safari supports what we need |
| Container | Docker | Single Dockerfile, docker-compose.yml |

---

## 4. The Three Themes

Each theme is a complete visual experience — not just different colors, but different navigation, layout, spacing, animation, and decorative language.

### 墨 Sumi — Ink

> The scholar's desk at midnight.

- **Mood:** Deep focus, intensity, late-night reading
- **Palette:** Near-black (#06060a), warm white (#ece8f0), vermillion red (#c22038)
- **Typography:** Noto Serif JP (headings), DM Sans (body), JetBrains Mono (data)
- **Geometry:** Sharp (1-2px radius), precise thin borders
- **Layout:** Top horizontal nav, single centered column, vertical flow
- **Spacing:** Tight, efficient, information-dense
- **Decorations:** Red accent bars, brush-stroke line ornaments, diamond markers
- **Animations:** Crisp, fast (150ms), minimal

### 紙 Kami — Paper

> A manuscript on a warm reading desk.

- **Mood:** Cozy warmth, afternoon reading, comfort
- **Palette:** Warm cream (#f2ece1), ink black (#2a2420), charcoal greys
- **Typography:** Crimson Pro (headings), DM Sans (body)
- **Geometry:** Soft (8-12px radius), subtle depth shadows
- **Layout:** Side panel nav (table-of-contents feel), two-column, book proportions
- **Spacing:** Generous, breathable, comfortable margins
- **Decorations:** Paper grain textures, brushstroke borders (subtle), ink splatter accents
- **Animations:** Gentle, slow (300-400ms), page-turn easing

### 森 Mori — Forest

> A reading nook in a mountain garden.

- **Mood:** Meditative calm, nature, gentle focus
- **Palette:** Deep forest green (#1a2e1f), moss, warm wood, amber (#c9943c)
- **Typography:** Rounded sans-serif (headings), DM Sans (body)
- **Geometry:** Organic (12-16px radius), soft edges, no hard lines
- **Layout:** Bottom tab nav (mobile), floating minimal nav (desktop), card-based grid
- **Spacing:** Very generous, lots of breathing room (ma)
- **Decorations:** Subtle wood grain, botanical line art, leaf patterns
- **Animations:** Slow, organic (400-600ms), breathing feel

### Theme Architecture

Each theme is defined as a TypeScript object with three levels:

```typescript
interface Theme {
  id: string;
  name: string;
  kanji: string;

  // Level 1: Tokens (CSS custom properties)
  tokens: Record<string, string>;

  // Level 2: Decorations (ornamental elements)
  decorations: {
    cardBorderImage?: string;
    dividerOrnament?: string;
    headerOrnament?: string;
    backgroundPattern?: string;
    backgroundPatternOpacity?: string;
    emptyStateIllustration?: string;
  };

  // Level 3: Layout variants
  layout: {
    navPosition: 'top' | 'side' | 'bottom';
    cardVariant: 'sharp' | 'soft' | 'organic';
    listStyle: 'dense' | 'comfortable' | 'spacious';
    headerStyle: 'minimal' | 'classic' | 'floating';
    transitionStyle: 'crisp' | 'gentle' | 'breathing';
    transitionDuration: number;
    contentMaxWidth: string;
    contentAlignment: 'center' | 'left';
  };

  // Category-influenced decorative overlays
  categoryDecorations: Record<string, {
    backgroundPattern: string;
    accentModifier?: string;
  }>;
}
```

Components read from `data-theme` on the root element and adapt their structure accordingly:

```svelte
<!-- Example: Card adapts shape to theme -->
<div
  class="card"
  class:sharp={$theme.layout.cardVariant === 'sharp'}
  class:soft={$theme.layout.cardVariant === 'soft'}
  class:organic={$theme.layout.cardVariant === 'organic'}
>
  <slot />
</div>
```

---

## 5. The Bonsai

The bonsai is Fumiki's signature feature. Every user grows a unique tree shaped by their reading.

### How It Works

The bonsai is a **generative SVG visualization** of your reading practice. It's not a pre-drawn illustration with stages — it's algorithmically generated from your reading data.

**Inputs that shape the tree:**
- **Total KP** → Overall size (trunk thickness, branch count, canopy density)
- **Reading consistency** → Trunk straightness (consistent readers grow straight trunks; sporadic readers grow twisted, interesting ones — both are beautiful)
- **Genre distribution** → Branch character:
  - Fiction/Stories → Flowing, curved branches
  - Technology/Science → Angular, geometric branches
  - Philosophy/Mind → Spiral, inward-curving branches
  - Finance/Business → Structured, symmetrical branches
  - Self-development → Upward-reaching branches
  - History → Thick, gnarled, ancient-looking branches
  - Art → Asymmetric, expressive branches
- **Number of books completed** → Leaf/blossom count
- **Current season (time of year)** → Seasonal appearance:
  - Spring: Cherry blossoms (pink)
  - Summer: Full green canopy
  - Autumn: Red/orange/gold leaves
  - Winter: Bare branches with snow

### Growth Stages

| Total KP | Stage | Visual |
|---|---|---|
| 0 | Seed | A small circle — potential |
| 50 | Sprout | A thin stem with 1-2 tiny leaves |
| 200 | Sapling | Short trunk, 2-3 small branches |
| 500 | Young tree | Clear trunk, several branches, small canopy |
| 2,000 | Growing tree | Defined shape, branches show genre influence |
| 5,000 | Mature tree | Full canopy, detailed branching, genre patterns visible |
| 12,000 | Ancient tree | Thick trunk, complex branch structure, rich detail |
| 25,000 | Grand bonsai | Museum-quality complexity, deeply unique |
| 50,000+ | Continues evolving | Never "done" — subtle refinements forever |

### Technical Implementation

**Option A: L-System (Lindenmayer System)**
- Deterministic, rule-based growth
- Seed derived from user's reading data
- Fast to render, reproducible from seed
- Can be done in pure SVG with path generation

**Option B: Procedural with Canvas/WebGL**
- More organic, natural-looking
- Real-time growth animation possible
- Heavier rendering cost

**Recommended: Option A (L-System in SVG)** for the initial implementation. It's lighter, works everywhere, and can be exported as a static image. The tree state is stored as a seed + parameters in the database, and re-rendered client-side.

### Bonsai Page

The bonsai gets its own full-screen page — a contemplative space:

```
┌──────────────────────────────────────┐
│                                      │
│                                      │
│          🌳                          │
│       (Your bonsai,                  │
│        large, centered,              │
│        breathing animation)          │
│                                      │
│                                      │
│──────────────────────────────────────│
│                                      │
│  文木 Fumiki                         │
│  12,430 KP · 学者 Gakusha           │
│                                      │
│  23 books completed                  │
│  142 hours of reading                │
│  Season 3, Day 47                    │
│                                      │
│  ┌──────────────────────────────┐    │
│  │ [Knowledge distribution      │    │
│  │  radial/pie chart]           │    │
│  └──────────────────────────────┘    │
│                                      │
└──────────────────────────────────────┘
```

The bonsai is the centerpiece. Stats are secondary — displayed below, quietly.

### Sharing

Users can export their bonsai as:
- PNG image (for social media)
- SVG (for printing)
- A shareable link that shows the tree with stats (optional, future)

This is unlocked at 10,000 KP — you should have a tree worth sharing by then.

---

## 6. Progression System

### Knowledge Points (KP)

| Source | Rate |
|---|---|
| Ebook (primary genre) | 1 KP / page |
| Ebook (secondary genre) | 0.5 KP / page |
| Audiobook (primary genre) | 1 KP / minute |
| Audiobook (secondary genre) | 0.5 KP / minute |
| Completion bonus (≥90%) | +20% of total book KP |

**Anti-gaming:** Idle detection (audio), speed cap (max 2x rate), session cap (500 KP/book/day).

KP is presented as **growth**, not score:
- "142 pages absorbed today" not "142 XP earned!"
- Progress bars fill like water, not like loading bars
- Numbers are shown in quiet, monospaced type — data, not celebration

### Titles

Single unified ladder, Japanese words with real meaning:

| KP | Title | Kanji | Meaning |
|---|---|---|---|
| 0 | Shoshin | 初心 | Beginner's mind |
| 500 | Dokusha | 読者 | Reader |
| 2,000 | Gakusei | 学生 | Student |
| 5,000 | Shosei | 書生 | Scholar-student |
| 12,000 | Gakusha | 学者 | Scholar |
| 25,000 | Sensei | 先生 | Teacher |
| 50,000 | Kenja | 賢者 | Sage |
| 100,000 | Sennin | 仙人 | Hermit-sage |
| 200,000 | Michi | 道 | The Path |

### Knowledge Categories

Seven categories for tracking what you read (no mythology, no locking):

| Category | Genres |
|---|---|
| Mind | Psychology, Neuroscience, Philosophy, Ethics |
| World | History, Politics, Biography, Sociology |
| Craft | Technology, Programming, Science, Mathematics |
| Wealth | Finance, Economics, Business, Entrepreneurship |
| Self | Self-development, Productivity, Leadership, Health |
| Stories | Fiction (all sub-genres) |
| Art | Art, Music, Design, Writing, Film |

Categories influence the bonsai's branch patterns and add subtle decorative overlays to your active theme.

### Seasons

90-day cycles that give rhythm without pressure:

- Stats summary (books, KP, hours)
- Bonsai snapshot (how the tree looked at season end)
- Optional personal reflection text
- Archived and browsable

### Feature Unlocks

| Milestone | Unlock |
|---|---|
| First book completed | Reading statistics page |
| 500 KP | Bonsai starts growing beyond sprout |
| 1,000 KP | Reader font presets (additional font choices) |
| 2,000 KP | Reading calendar visualization |
| 5,000 KP | Seasonal reflections (journal) |
| 10,000 KP | Bonsai export (PNG/SVG) |
| 25,000 KP | Custom font upload for ebook reader |

### Reward Moments

Quiet, not loud:

| Event | Response |
|---|---|
| Book completed | Gentle moment: cover, KP earned, bonsai grows. Optional prompt: "What will you carry from this book?" |
| Title earned | Subtle toast: "学者 Gakusha · Scholar" |
| Feature unlocked | Notification: "Reading calendar is now available" |
| Season end | Summary card with bonsai snapshot, stats, reflection prompt |
| Milestones (50th book, 100th hour) | "50 books. Your tree remembers each one." |

---

## 7. Features by Phase

### Phase 0: Foundation (1-2 weeks)

- [ ] SvelteKit project, Tailwind CSS 4, static adapter
- [ ] Theme system with all three themes (Sumi, Kami, Mori) — tokens, decorations, layout variants
- [ ] Responsive shell: adapts navigation per theme and screen size
- [ ] Auth flow: connect to ABS server
- [ ] Sidecar: Hono, SQLite, ABS proxy, serves client
- [ ] docker-compose.yml
- [ ] Component library: Button, Card, Input, Modal, Toast (themed)

### Phase 1: Reader & Player (2-3 weeks)

- [ ] Library view: book grid/list with search and filter
- [ ] Book detail page: metadata, cover, progress, chapters
- [ ] Audiobook player: play/pause, seek, speed, sleep timer, chapters, lock screen controls, background audio, progress sync to ABS
- [ ] Ebook reader: foliate-js (EPUB, MOBI, AZW3, FB2), font/size controls, reading progress sync
- [ ] Continue reading: homepage with recently active books
- [ ] Responsive: phone (375px+), tablet (768px+ — split views: reader+notes, library+detail), desktop (1200px+)

### Phase 2: Knowledge Layer (2-3 weeks)

- [ ] Ebook highlights (select text → highlight → optional note)
- [ ] Audiobook bookmarks (timestamp + optional note)
- [ ] Notes panel per book
- [ ] All-notes browser (search, filter)
- [ ] AI summarization (per chapter, configurable provider)
- [ ] Export notes as markdown

### Phase 3: The Bonsai (2-3 weeks)

- [ ] KP tracking (per-book, per-category)
- [ ] Bonsai generation algorithm (L-system or procedural)
- [ ] Bonsai page (full-screen, contemplative)
- [ ] Growth animation (bonsai updates when you return from reading)
- [ ] Category influence on branch patterns
- [ ] Seasonal appearance (spring blossoms, autumn leaves, etc.)
- [ ] Title system
- [ ] Profile page (bonsai + stats + calendar)
- [ ] Feature unlock system
- [ ] Reward moments (quiet celebrations)

### Phase 4: Offline & Polish (3-4 weeks)

- [ ] Download manager (cache books for offline)
- [ ] Service Worker (app shell caching, offline detection)
- [ ] Background sync (queue progress updates)
- [ ] Capacitor build (Android APK)
- [ ] PWA enhancements (manifest, install prompt)
- [ ] Performance pass (lazy loading, virtual scroll)
- [ ] Bonsai export (PNG/SVG)
- [ ] Seasons system
- [ ] Reading calendar

---

## 8. Data Model

```sql
-- ==========================================
-- SERVER CONFIG (instance-level settings)
-- ==========================================

CREATE TABLE server_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at INTEGER DEFAULT (unixepoch())
);

-- ==========================================
-- AUTH & CONNECTION
-- ==========================================

CREATE TABLE connections (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
  abs_url TEXT NOT NULL,
  abs_token TEXT NOT NULL,
  abs_user_id TEXT,
  username TEXT,
  created_at INTEGER DEFAULT (unixepoch()),
  last_synced_at INTEGER
);

CREATE TABLE sessions (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
  connection_id TEXT NOT NULL REFERENCES connections(id),
  token TEXT NOT NULL UNIQUE,
  expires_at INTEGER NOT NULL,
  created_at INTEGER DEFAULT (unixepoch())
);

-- ==========================================
-- USER PREFERENCES
-- ==========================================

CREATE TABLE preferences (
  connection_id TEXT PRIMARY KEY REFERENCES connections(id),
  active_theme TEXT DEFAULT 'sumi',
  active_title TEXT DEFAULT 'Shoshin',
  playback_speed REAL DEFAULT 1.0,
  reader_font_size INTEGER DEFAULT 16,
  reader_font TEXT DEFAULT 'default',
  reader_line_height REAL DEFAULT 1.6,
  ai_provider TEXT DEFAULT NULL,          -- 'ollama' | 'openai' | 'anthropic'
  ai_model TEXT DEFAULT NULL,
  ai_endpoint TEXT DEFAULT NULL,
  ai_api_key TEXT DEFAULT NULL
);

-- ==========================================
-- NOTES & HIGHLIGHTS
-- ==========================================

CREATE TABLE notes (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
  connection_id TEXT NOT NULL REFERENCES connections(id),
  book_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('note', 'highlight', 'bookmark')),
  content TEXT,
  color TEXT DEFAULT NULL,
  position_type TEXT NOT NULL CHECK(position_type IN ('audio', 'ebook')),
  position_value TEXT NOT NULL,           -- JSON: audio={seconds}, ebook={cfi, chapter}
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

-- ==========================================
-- AI SUMMARIES
-- ==========================================

CREATE TABLE summaries (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
  book_id TEXT NOT NULL,
  chapter_index INTEGER NOT NULL,
  chapter_title TEXT,
  summary TEXT NOT NULL,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  created_at INTEGER DEFAULT (unixepoch()),
  UNIQUE(book_id, chapter_index)
);

-- ==========================================
-- PROGRESSION
-- ==========================================

CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  display_order INTEGER DEFAULT 0
);

-- Seed data:
-- mind, world, craft, wealth, self, stories, art

CREATE TABLE genre_category_map (
  genre TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES categories(id)
);

CREATE TABLE kp_events (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
  connection_id TEXT NOT NULL REFERENCES connections(id),
  book_id TEXT NOT NULL,
  category_id TEXT NOT NULL REFERENCES categories(id),
  kp_amount INTEGER NOT NULL,
  multiplier REAL NOT NULL DEFAULT 1.0,
  source TEXT NOT NULL CHECK(source IN ('reading', 'listening', 'completion_bonus')),
  session_seconds INTEGER,
  created_at INTEGER DEFAULT (unixepoch())
);

CREATE TABLE user_progress (
  connection_id TEXT PRIMARY KEY REFERENCES connections(id),
  total_kp INTEGER DEFAULT 0,
  current_title TEXT DEFAULT 'Shoshin',
  books_completed INTEGER DEFAULT 0,
  total_hours REAL DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_reading_date TEXT DEFAULT NULL
);

CREATE TABLE category_progress (
  connection_id TEXT NOT NULL REFERENCES connections(id),
  category_id TEXT NOT NULL REFERENCES categories(id),
  total_kp INTEGER DEFAULT 0,
  PRIMARY KEY (connection_id, category_id)
);

-- ==========================================
-- BONSAI
-- ==========================================

CREATE TABLE bonsai (
  connection_id TEXT PRIMARY KEY REFERENCES connections(id),
  seed TEXT NOT NULL DEFAULT (hex(randomblob(4))),   -- Deterministic seed for generation
  stage INTEGER DEFAULT 0,                            -- Growth stage index
  branch_params TEXT DEFAULT '{}',                    -- JSON: genre-influenced branch config
  last_snapshot TEXT DEFAULT NULL,                     -- SVG string of last rendered state
  updated_at INTEGER DEFAULT (unixepoch())
);

-- ==========================================
-- SEASONS
-- ==========================================

CREATE TABLE seasons (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
  connection_id TEXT NOT NULL REFERENCES connections(id),
  season_number INTEGER NOT NULL,
  start_date INTEGER NOT NULL,
  end_date INTEGER NOT NULL,
  total_kp INTEGER DEFAULT 0,
  books_completed INTEGER DEFAULT 0,
  hours_spent REAL DEFAULT 0,
  reflection TEXT,
  bonsai_snapshot TEXT,                               -- SVG at season end
  created_at INTEGER DEFAULT (unixepoch())
);

-- ==========================================
-- UNLOCKS
-- ==========================================

CREATE TABLE unlocks (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
  connection_id TEXT NOT NULL REFERENCES connections(id),
  feature TEXT NOT NULL,                              -- 'stats', 'accent_color', 'calendar', etc.
  unlocked_at INTEGER DEFAULT (unixepoch()),
  UNIQUE(connection_id, feature)
);

-- ==========================================
-- BOOK METADATA CACHE
-- ==========================================

CREATE TABLE book_cache (
  book_id TEXT PRIMARY KEY,
  connection_id TEXT NOT NULL REFERENCES connections(id),
  title TEXT,
  author TEXT,
  cover_url TEXT,
  media_type TEXT DEFAULT 'ebook',                      -- 'ebook', 'audiobook', 'both'
  primary_category TEXT REFERENCES categories(id),
  secondary_category TEXT REFERENCES categories(id),
  is_manual_category INTEGER DEFAULT 0,
  total_pages INTEGER,
  total_duration INTEGER,                             -- seconds (audiobooks)
  cached_at INTEGER DEFAULT (unixepoch())
);

-- Progress sync queue (for when ABS is unreachable)
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

-- Book requests (Phase 4 — external book discovery)
CREATE TABLE book_requests (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
  connection_id TEXT NOT NULL REFERENCES connections(id),
  title TEXT NOT NULL,
  author TEXT,
  isbn TEXT,
  cover_url TEXT,
  source TEXT NOT NULL,                               -- 'google_books', 'open_library'
  source_id TEXT,
  status TEXT DEFAULT 'pending',                      -- 'pending', 'approved', 'fulfilled', 'declined'
  admin_note TEXT,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch()),
  UNIQUE(connection_id, isbn)
);

-- ==========================================
-- INDEXES
-- ==========================================

CREATE INDEX idx_notes_book ON notes(book_id);
CREATE INDEX idx_notes_connection ON notes(connection_id);
CREATE INDEX idx_kp_connection ON kp_events(connection_id);
CREATE INDEX idx_kp_category ON kp_events(category_id);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_book_cache_connection ON book_cache(connection_id);
CREATE INDEX idx_sync_queue_connection ON progress_sync_queue(connection_id);
CREATE INDEX idx_book_requests_connection ON book_requests(connection_id);
CREATE INDEX idx_book_requests_status ON book_requests(status);
```

---

## 9. Project Structure

```
fumiki/
├── docker-compose.yml
├── Dockerfile
├── package.json                    # Bun workspaces: ["client", "sidecar"]
│
├── client/                         # SvelteKit (static build)
│   ├── src/
│   │   ├── lib/
│   │   │   ├── components/
│   │   │   │   ├── ui/             # Button, Card, Input, Modal, Toast
│   │   │   │   ├── player/         # AudioPlayer, Controls, SleepTimer
│   │   │   │   ├── reader/         # EbookReader (foliate-js), Highlights, NotePanel
│   │   │   │   ├── library/        # BookCard, BookGrid, BookList, Search
│   │   │   │   ├── bonsai/         # BonsaiRenderer, GrowthAnimation
│   │   │   │   └── progress/       # KPCounter, Calendar, CategoryChart
│   │   │   ├── stores/
│   │   │   │   ├── auth.ts
│   │   │   │   ├── player.ts
│   │   │   │   ├── library.ts
│   │   │   │   ├── notes.ts
│   │   │   │   ├── theme.ts
│   │   │   │   ├── bonsai.ts
│   │   │   │   └── progress.ts
│   │   │   ├── api/
│   │   │   │   ├── abs.ts
│   │   │   │   └── sidecar.ts
│   │   │   ├── themes/
│   │   │   │   ├── sumi.ts
│   │   │   │   ├── kami.ts
│   │   │   │   └── mori.ts
│   │   │   ├── bonsai/
│   │   │   │   ├── generator.ts    # L-system / procedural algorithm
│   │   │   │   ├── renderer.ts     # SVG rendering
│   │   │   │   └── seasons.ts      # Seasonal appearance
│   │   │   └── utils/
│   │   ├── routes/
│   │   │   ├── +layout.svelte      # App shell (nav adapts to theme)
│   │   │   ├── +page.svelte        # Home (continue reading)
│   │   │   ├── auth/
│   │   │   ├── library/
│   │   │   │   ├── +page.svelte
│   │   │   │   └── [id]/+page.svelte
│   │   │   ├── player/[id]/+page.svelte
│   │   │   ├── reader/[id]/+page.svelte
│   │   │   ├── bonsai/+page.svelte
│   │   │   ├── notes/+page.svelte
│   │   │   ├── profile/+page.svelte
│   │   │   └── settings/+page.svelte
│   │   ├── app.css
│   │   └── app.html
│   ├── static/
│   │   └── themes/                 # SVG patterns, decorative assets
│   ├── svelte.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── sidecar/                        # Bun + Hono
│   ├── src/
│   │   ├── index.ts
│   │   ├── db/
│   │   │   ├── schema.ts
│   │   │   ├── seed.ts             # Categories, genre mappings
│   │   │   └── migrations/
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── abs-proxy.ts
│   │   │   ├── notes.ts
│   │   │   ├── summaries.ts
│   │   │   ├── progress.ts
│   │   │   ├── bonsai.ts
│   │   │   ├── preferences.ts
│   │   │   └── health.ts
│   │   ├── services/
│   │   │   ├── abs-client.ts
│   │   │   ├── kp-calculator.ts
│   │   │   ├── bonsai-engine.ts    # Server-side bonsai state management
│   │   │   └── ai/
│   │   │       ├── provider.ts
│   │   │       ├── ollama.ts
│   │   │       ├── openai.ts
│   │   │       └── anthropic.ts
│   │   └── middleware/
│   │       ├── session.ts
│   │       └── rate-limit.ts
│   ├── package.json
│   └── tsconfig.json
│
├── shared/
│   ├── types.ts
│   └── schemas.ts
│
└── docs/
    └── FUMIKI.md                   # This document
```

---

## 10. Deployment

```yaml
# docker-compose.yml
services:
  fumiki:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - fumiki-data:/app/data
    environment:
      - NODE_ENV=production
    restart: unless-stopped

volumes:
  fumiki-data:
```

```dockerfile
# Dockerfile
FROM oven/bun:1 AS base

FROM base AS client-build
WORKDIR /app/client
COPY client/package.json client/bun.lock ./
RUN bun install --frozen-lockfile
COPY client/ .
COPY shared/ /app/shared/
RUN bun run build

FROM base AS runtime
WORKDIR /app
COPY sidecar/package.json sidecar/bun.lock ./sidecar/
RUN cd sidecar && bun install --frozen-lockfile --production
COPY sidecar/ ./sidecar/
COPY shared/ ./shared/
COPY --from=client-build /app/client/build ./client/build

EXPOSE 3000
CMD ["bun", "run", "sidecar/src/index.ts"]
```

---

## 11. Design System

### Component Requirements

Every component must support all three themes via:

1. **CSS custom properties** for colors, fonts, spacing
2. **`data-variant` attributes** for structural differences (sharp/soft/organic)
3. **Conditional decoration slots** for theme-specific ornaments
4. **Layout awareness** for navigation position and spacing rhythm

### Core Components

| Component | Sumi Variant | Kami Variant | Mori Variant |
|---|---|---|---|
| Button | Sharp corners, thin border, uppercase | Rounded, subtle shadow, serif label | Organic shape, no border, warm |
| Card | 1px border, no radius, red accent bar | Paper shadow, 8px radius, warm bg | 14px radius, wood-tone border, soft shadow |
| Navigation | Top bar, horizontal, text links | Side panel, vertical, serif labels | Bottom tabs (mobile), floating (desktop) |
| Progress bar | 2px height, sharp, red fill | 5px height, rounded, warm fill + glow | 6px height, organic, amber fill |
| Divider | Thin red line with brush-stroke mask | Faint paper-colored rule | No visible line, just spacing (ma) |
| Toast | Bottom-left, minimal, fast dismiss | Bottom-center, warm bg, gentle slide | Top-center, floating, slow fade |
| Modal | Full-width, slides from bottom | Centered, paper-textured bg | Centered, rounded, organic shadow |

---

*Fumiki 文木 — A tree that grows from literature.*
*This is the single source of truth for the project.*
