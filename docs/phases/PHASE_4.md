# Phase 4 — Offline & Polish

> Estimated: 3–4 weeks
> Goal: Offline support, Capacitor Android build, performance optimization, accessibility audit, and final polish across all themes.
> Depends on: Phase 3 complete

---

## Tasks

### 4.1 — Service Worker & Offline Shell

App works without internet (for cached content).

**Tasks:**
- [ ] Service worker registration in SvelteKit
- [ ] Cache strategy:
  - App shell (HTML, CSS, JS, fonts): Cache-first
  - API responses: Network-first, fallback to cache
  - Cover images: Cache-first with stale-while-revalidate
  - Audio/ebook files: Only cache if explicitly downloaded
- [ ] Offline detection — show indicator in nav when offline
- [ ] Offline library browsing — cached book metadata + covers
- [ ] Offline notes — queue writes, sync when back online
- [ ] Offline progress — queue KP events and progress syncs

**Acceptance criteria:**
- [ ] App shell loads instantly when offline
- [ ] Cached library browsable offline
- [ ] Notes created offline sync when reconnected
- [ ] KP events queued offline are recorded when reconnected
- [ ] Offline indicator visible and clear
- [ ] No errors or blank screens when offline

---

### 4.2 — Download Manager

Download books for offline reading/listening.

**Tasks:**
- [ ] `DownloadManager.svelte` — UI for downloading books
- [ ] Download button on book detail page
- [ ] Progress indicator during download
- [ ] Storage in Cache API or IndexedDB (for ebook files and audio)
- [ ] Download status per book: not downloaded / downloading / downloaded
- [ ] Delete downloaded content to free space
- [ ] Storage usage indicator in Settings

**Acceptance criteria:**
- [ ] Can download ebook for offline reading
- [ ] Can download audiobook for offline listening
- [ ] Download progress visible
- [ ] Downloaded books playable/readable without internet
- [ ] Can delete downloads to free space
- [ ] Storage usage displayed in settings

---

### 4.3 — Capacitor Android Build

Wrap the PWA as a native Android app.

**Tasks:**
- [ ] Add Capacitor to the project
- [ ] Configure `capacitor.config.ts` — app name, icon, splash, start URL
- [ ] Android project setup
- [ ] App icon: Fumiki logo adapted for Android (adaptive icon)
- [ ] Splash screen: Fumiki logo on theme-appropriate background
- [ ] Test on real Android device
- [ ] Build signed APK for distribution
- [ ] Background audio plugin (if native `<audio>` doesn't work in Capacitor webview)
- [ ] Status bar: transparent overlay mode, text color matches theme (see `FUMIKI_RULES.md` Safe Areas section)
- [ ] Safe area insets verified on real device — no content behind status bar or gesture bar

**Acceptance criteria:**
- [ ] APK installs on Android
- [ ] App looks and behaves like the web version
- [ ] Audio plays in background (lock screen, other apps)
- [ ] Status bar color matches theme
- [ ] App icon and splash screen look professional
- [ ] No white flash on launch

---

### 4.4 — PWA Enhancements

iOS and desktop PWA polish.

**Tasks:**
- [ ] `manifest.json` — name, icons, theme_color, background_color, start_url, display: standalone
- [ ] Icons: 192px, 512px, maskable variants
- [ ] Apple touch icon
- [ ] Install prompt — subtle banner for iOS and desktop
- [ ] `theme_color` matches active theme (updates dynamically)

**Acceptance criteria:**
- [ ] "Add to Home Screen" works on iOS Safari
- [ ] PWA launches as standalone app (no browser chrome)
- [ ] Icons display correctly on home screen
- [ ] Correct theme color in OS task switcher

---

### 4.5 — Performance Optimization

Hit the performance targets from `FUMIKI_ARCHITECTURE.md`.

**Tasks:**
- [ ] Audit with Lighthouse (target: 90+ performance on mobile)
- [ ] Code splitting — verify SvelteKit lazy-loads routes
- [ ] Image optimization — lazy loading, correct sizes, WebP if possible
- [ ] Virtual scroll for library (> 100 books)
- [ ] Skeleton screens audit — ensure all pages have proper loading states
- [ ] Font loading optimization — `font-display: swap`, preload critical fonts
- [ ] CSS purge — verify Tailwind only ships used utilities
- [ ] Bundle size audit — no dependency > 100KB gzipped without justification
- [ ] SQLite query audit — ensure all queries < 10ms, add indexes where needed
- [ ] Memory leak check — verify audio elements, intervals, event listeners cleaned up

**Performance targets:**
- [ ] LCP < 1.5s on 4G
- [ ] TTI < 2s
- [ ] Library render (100 books) < 500ms
- [ ] Audio playback start < 1s
- [ ] Theme switch < 100ms
- [ ] Docker image < 150MB
- [ ] Memory (idle) < 100MB

---

### 4.6 — Accessibility Audit

Full WCAG AA compliance check.

**Tasks:**
- [ ] Color contrast audit — all text/background combos meet 4.5:1 (body) / 3:1 (large text, UI)
- [ ] Keyboard navigation audit — every interactive element reachable via Tab, activated via Enter/Space
- [ ] Focus management — modals trap focus, drawers return focus on close
- [ ] Screen reader audit — test with VoiceOver (iOS) and TalkBack (Android)
- [ ] Aria labels — all icon-only buttons, all images, all interactive elements
- [ ] Heading hierarchy — h1 → h2 → h3, no skipped levels
- [ ] Reduced motion — verify all animations disabled with `prefers-reduced-motion: reduce`
- [ ] Touch targets — minimum 44×44px on all interactive elements
- [ ] Live regions — toasts announced to screen readers

**Acceptance criteria:**
- [ ] Zero WCAG AA violations
- [ ] Full keyboard navigation possible
- [ ] Screen reader provides meaningful experience
- [ ] Reduced motion fully supported

---

### 4.7 — Theme Polish

Final visual QA across all three themes.

**Tasks:**
- [ ] Screenshot every page in all three themes at phone, tablet, desktop
- [ ] Fix any visual inconsistencies
- [ ] Verify all decorations render correctly (brush strokes, paper grain, wood texture)
- [ ] Verify all transitions feel right per theme (Sumi fast, Kami gentle, Mori slow)
- [ ] Test dark mode system preference interaction (Sumi/Mori are dark, Kami is light)
- [ ] Verify all empty states, loading states, error states themed correctly
- [ ] Bonsai renders correctly in all three theme contexts
- [ ] Reader theme matches app theme

**Acceptance criteria:**
- [ ] Every page looks polished in every theme
- [ ] No visual glitches, no misaligned elements, no wrong colors
- [ ] Decorations are subtle and enhance, not distract

---

### 4.8 — Settings Polish

Complete the settings page with all features.

**Tasks:**
- [ ] Theme selector — 3 visual preview cards
- [ ] Reader settings — font, size, line height (with live preview)
- [ ] Playback settings — default speed
- [ ] AI settings — provider, endpoint, model, key, test button
- [ ] Connection info — server URL, username, disconnect
- [ ] Storage — download manager, clear cache
- [ ] About — version, logo, GitHub link, "Fumiki 文木"
- [ ] All settings persist via preferences store + API

**Acceptance criteria:**
- [ ] All settings functional and persisted
- [ ] Theme preview cards accurately represent each theme
- [ ] AI test button works
- [ ] Disconnect works cleanly

---

### 4.9 — Documentation

Final documentation for users and contributors.

**Tasks:**
- [ ] README.md — finalize with screenshots, real setup instructions
- [ ] CONTRIBUTING.md — development setup, coding standards (link to FUMIKI_RULES.md)
- [ ] CHANGELOG.md — initial release notes
- [ ] In-app help — brief tooltips or info icons for non-obvious features (AI setup, KP explanation)

**Acceptance criteria:**
- [ ] New user can set up Fumiki from README alone
- [ ] Contributor can set up dev environment from CONTRIBUTING
- [ ] Changelog covers all features

---

### 4.10 — Book Discovery & Requests

Search for books beyond the local library using external APIs.

**Concept:**
When a user searches in the library and gets no results (or few results), Fumiki offers to search external book databases. Books found externally show as "Not in library" cards with a "Request" button. Requests are stored locally and can optionally notify the ABS admin.

**Tasks:**
- [ ] External book search service (`sidecar/src/services/book-discovery.ts`)
- [ ] Google Books API integration (free, no key required for basic search):
  - `GET https://www.googleapis.com/books/v1/volumes?q={query}`
  - Extract: title, author, description, cover image, ISBN, page count, categories
- [ ] Open Library API as fallback (free, no key):
  - `GET https://openlibrary.org/search.json?q={query}`
  - Cover images: `https://covers.openlibrary.org/b/isbn/{isbn}-M.jpg`
- [ ] `GET /api/discovery/search?q={query}` — search external APIs, merge results, deduplicate against local library
- [ ] `POST /api/discovery/request` — create a book request
- [ ] `GET /api/discovery/requests` — list all pending/fulfilled requests
- [ ] `PATCH /api/discovery/requests/:id` — update request status (admin)
- [ ] `book_requests` table:
  ```sql
  CREATE TABLE book_requests (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
    connection_id TEXT NOT NULL REFERENCES connections(id),
    title TEXT NOT NULL,
    author TEXT,
    isbn TEXT,
    cover_url TEXT,
    source TEXT NOT NULL,          -- 'google_books' | 'open_library'
    source_id TEXT,                -- External API ID
    status TEXT DEFAULT 'pending', -- 'pending' | 'approved' | 'fulfilled' | 'declined'
    admin_note TEXT,
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch()),
    UNIQUE(connection_id, isbn)
  );
  ```

**Client tasks:**
- [ ] Enhance library search: when local results < 5, show "Search beyond your library" section below
- [ ] `ExternalBookCard.svelte` — similar to `BookCoverCard` but with "Not in library" badge and "Request" button
- [ ] External results clearly separated from local results (different section, muted styling)
- [ ] Request flow: tap "Request" → confirmation → "Requested" badge replaces button
- [ ] `RequestsList.svelte` — view pending requests in Settings or profile
- [ ] Request status updates: pending → approved/declined/fulfilled
- [ ] When a requested book appears in ABS library (fulfilled), show notification

**Search flow:**
```
User types "Dune" in library search
  │
  ├── Local results: show immediately (from book_cache)
  │
  └── If < 5 local results:
      ├── Show "Search beyond your library" link
      ├── On click/tap → fetch from Google Books + Open Library
      ├── Deduplicate (by ISBN) against local library
      ├── Show external results with "Not in library" badge
      └── "Request" button on each external result
```

**Acceptance criteria:**
- [ ] External search returns relevant results from Google Books and/or Open Library
- [ ] External results clearly distinguished from local library
- [ ] "Not in library" badge visible on external results
- [ ] Request button works, shows confirmation
- [ ] Duplicate requests prevented (same ISBN)
- [ ] Requested books show "Requested" status
- [ ] Request list viewable by user
- [ ] Works offline: external search gracefully hidden when offline
- [ ] No API keys required (both APIs are free for basic usage)
- [ ] Rate limiting on external API calls (2 requests/second)
- [ ] Works in all three themes

---

## Definition of Done

After Phase 4, the app:
- Works offline (cached library, queued writes)
- Downloads books for offline reading/listening
- Has an Android APK via Capacitor
- Is installable as PWA on iOS and desktop
- Meets performance targets (Lighthouse 90+)
- Passes WCAG AA accessibility audit
- Every page polished in every theme at every breakpoint
- Searches external book databases when local results are sparse
- Lets users request books not in their library
- Settings page fully functional
- Documentation complete

---

## What's Next?

Phase 4 is the final planned phase. After this, Fumiki is a shippable v1.0.

Future ideas (not planned):
- 3D bonsai renderer (Three.js, swappable with SVG)
- Multi-user support on single instance
- OPDS feed integration
- Bonsai sharing (public link)
- Reading challenges / seasonal events
- Logseq/Obsidian export plugin
- KoReader sync
- Podcast support (via ABS)

These would be separate feature proposals, not part of the core roadmap.

---

*Fumiki 文木 — A tree that grows from literature.*
