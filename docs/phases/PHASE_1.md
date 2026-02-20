# Phase 1 — Reader & Player

> Estimated: 2–3 weeks
> Goal: Users can browse their ABS library, play audiobooks with full controls, and read ebooks with foliate-js. Progress syncs back to ABS.
> Depends on: Phase 0 complete

---

## Tasks

### 1.1 — ABS Proxy Routes

Expose AudioBookShelf data through the sidecar.

**Tasks:**
- [ ] `GET /api/abs/libraries` — list all libraries
- [ ] `GET /api/abs/libraries/:id/items` — paginated book list with search, filter, sort
- [ ] `GET /api/abs/items/:id` — detailed book info (expanded)
- [ ] `GET /api/abs/items/:id/cover` — proxy cover image
- [ ] `GET /api/abs/items/:id/stream` — proxy audio stream (with Range header support)
- [ ] `GET /api/abs/items/:id/ebook` — serve ebook file
- [ ] `PATCH /api/abs/items/:id/progress` — sync progress back to ABS
- [ ] Transform ABS responses to Fumiki format (see `FUMIKI_API.md`)
- [ ] Cache book metadata in `book_cache` table
- [ ] Auto-detect genre → category mapping on cache

**Acceptance criteria:**
- [ ] All routes return correctly shaped responses
- [ ] Cover images proxy correctly (correct content-type)
- [ ] Audio streams support Range requests (seeking)
- [ ] Ebook files serve with correct content-type
- [ ] Progress syncs bidirectionally with ABS
- [ ] `book_cache` populated on first library load

---

### 1.2 — Library Store & Page

Browse and search books.

**Tasks:**
- [ ] Library store (`src/lib/stores/library.ts`) — load, search, filter, sort, paginate
- [ ] Derived store: `continueReading` — books with progress > 0
- [ ] `BookCoverCard.svelte` — cover image, title, author, progress mini-bar
- [ ] `BookGrid.svelte` — responsive grid (2→3→4→5→6 columns)
- [ ] `SearchInput.svelte` — debounced search (300ms)
- [ ] `FilterPills.svelte` — All / Ebook / Audiobook
- [ ] Library page (`/library`) — search + filters + grid + infinite scroll
- [ ] Loading skeleton for grid (matching card sizes)
- [ ] Empty state ("Your library is empty")

**Acceptance criteria:**
- [ ] Library loads and displays all books from ABS
- [ ] Search filters in real-time (debounced)
- [ ] Filter by media type works
- [ ] Sort by title, author, date, progress works
- [ ] Grid is responsive across all breakpoints
- [ ] Infinite scroll or "load more" for large libraries
- [ ] Cover images load lazily
- [ ] Works in all three themes

---

### 1.3 — Book Detail Page

Full information about a single book.

**Tasks:**
- [ ] Book detail store (`src/lib/stores/book.ts`)
- [ ] Book detail page (`/library/:id`)
- [ ] Header: cover, title, author, narrator, duration/pages
- [ ] Action buttons: Play (if audiobook), Read (if ebook), Notes
- [ ] Progress bar with percentage + time remaining
- [ ] Category tags (auto-detected, manual override via `PATCH /api/books/:id/category`)
- [ ] Description (collapsible on phone)
- [ ] Chapter list with timestamps
- [ ] Metadata section (publisher, year, ISBN, genres)
- [ ] Tablet layout: two-column (cover+meta left, details right)

**Acceptance criteria:**
- [ ] All book metadata displayed correctly
- [ ] Play/Read buttons navigate to player/reader
- [ ] Chapter list shows current chapter highlighted
- [ ] Progress accurate from ABS
- [ ] Responsive: phone single column, tablet two-column
- [ ] Works in all three themes

---

### 1.4 — Audiobook Player

Full-featured audio player with background playback.

**Tasks:**
- [ ] Player store (`src/lib/stores/player.ts`) — play, pause, seek, speed, sleep timer, chapter nav
- [ ] `PlayerFull.svelte` — full-screen player page (`/player/:id`)
- [ ] `PlayerMini.svelte` — mini player bar (64px, above bottom nav)
- [ ] `SeekBar.svelte` — draggable progress bar with time display
- [ ] `SpeedSelector.svelte` — 0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x
- [ ] `SleepTimer.svelte` — 15, 30, 45, 60 min, end of chapter
- [ ] `ChapterList.svelte` — jump to chapter, current highlighted
- [ ] Audio via HTML `<audio>` element (or Howler.js if needed for gaps/crossfade)
- [ ] Media Session API — lock screen controls (play, pause, skip back/forward)
- [ ] Background audio — continues when navigating to other pages
- [ ] Progress sync to ABS — throttled every 60 seconds
- [ ] Minimize: full player → mini player (slide down transition)
- [ ] Tablet: split view (controls left, chapters + notes right)

**Acceptance criteria:**
- [ ] Audio plays continuously, even when navigating pages
- [ ] Seek bar is accurate and draggable
- [ ] Speed change applies instantly
- [ ] Sleep timer pauses playback after set time
- [ ] Chapter navigation jumps to correct position
- [ ] Lock screen controls work on Android (Media Session API)
- [ ] Mini player shows when on other pages during playback
- [ ] Progress syncs to ABS periodically
- [ ] Resuming a book starts from last position
- [ ] Works in all three themes

---

### 1.5 — Ebook Reader

Full-screen reading experience with foliate-js.

**Tasks:**
- [ ] Integrate foliate-js as git submodule
- [ ] Reader page (`/reader/:id`) — full-screen, no app chrome
- [ ] `EbookReader.svelte` — foliate-js wrapper component
- [ ] Top toolbar (tap to show/hide): chapter title, progress %, font settings, close
- [ ] Table of contents drawer (slide from left)
- [ ] Font settings panel: family (Georgia, Crimson Pro, DM Sans, OpenDyslexic), size (14–28px), line height (1.4–2.2)
- [ ] Page turn: tap left/right edges, swipe, arrow keys
- [ ] Progress display: percentage, page X of Y
- [ ] Reader theme matches app theme (Sumi = dark, Kami = cream, Mori = dark green)
- [ ] Progress sync to ABS — throttled every 30 seconds
- [ ] Multi-format: test with EPUB, MOBI, AZW3
- [ ] Tablet: split view (content left, notes panel right — notes panel is empty placeholder for Phase 2)

**Acceptance criteria:**
- [ ] EPUB files render correctly with proper typography
- [ ] MOBI and AZW3 files open and render
- [ ] Page turns are smooth
- [ ] Font settings apply immediately
- [ ] Reading position persists (synced to ABS)
- [ ] Toolbar shows/hides on tap
- [ ] TOC drawer navigates to correct chapter
- [ ] Reader respects theme colors
- [ ] Reduced motion: no page turn animation if preferred
- [ ] Works in all three themes

---

### 1.6 — Home Page

Landing page with continue reading and recent library.

**Tasks:**
- [ ] Home page (`/`) — greeting, continue reading, recent library, activity feed
- [ ] Greeting: "Good morning/afternoon/evening" based on time
- [ ] Continue reading: horizontal scroll of books with progress
- [ ] Recent library: grid of recently added books
- [ ] Activity feed: placeholder (empty until Phase 3 adds KP events)
- [ ] Preferences store integration — load theme on init

**Acceptance criteria:**
- [ ] Home page renders after auth
- [ ] Continue reading shows books with progress > 0
- [ ] Tapping a book navigates to book detail
- [ ] Responsive layout (single column phone, split on tablet)
- [ ] Works in all three themes

---

### 1.7 — API Client & Error Handling

Central fetch wrapper with proper error handling.

**Tasks:**
- [ ] Create `src/lib/api/client.ts` — typed fetch wrapper
- [ ] 401 → redirect to auth
- [ ] 502 → "ABS connection error" toast
- [ ] 503 → "Service unavailable" toast
- [ ] Network error → "Offline" indicator
- [ ] Toast store (`src/lib/stores/toast.ts`)
- [ ] Toast renderer component in app shell

**Acceptance criteria:**
- [ ] All API errors show user-friendly toasts
- [ ] Expired session redirects to auth page
- [ ] No raw error messages shown to users

---

## Definition of Done

After Phase 1, the app:
- Browses ABS library with search, filter, sort
- Displays book details with metadata, chapters, progress
- Plays audiobooks with full controls, background playback, lock screen
- Reads ebooks (EPUB, MOBI, AZW3) with font customization
- Syncs progress bidirectionally with ABS
- Has a functional home page with continue reading
- All pages work in all three themes, all breakpoints

---

*Next: Phase 2 — Knowledge Layer*
