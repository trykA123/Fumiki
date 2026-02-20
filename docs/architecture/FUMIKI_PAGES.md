# Fumiki — Pages & Routes

> Every page in the app: what it shows, what data it needs, components used, and responsive behavior.

---

## Route Map

```
/                       → Home (continue reading, activity)
/auth                   → Login (ABS URL on first use + credentials)
/library                → Book grid/list with search
/library/:id            → Book detail
/player/:id             → Full-screen audiobook player
/reader/:id             → Full-screen ebook reader
/bonsai                 → Bonsai visualization + stats
/notes                  → All notes browser
/notes/:bookId          → Notes for a specific book
/settings               → Preferences, AI config, connection
/settings/ai            → AI provider configuration
```

---

## 1. Home `/`

> The landing page. Shows what to continue and recent activity.

### Data Requirements

| Store | Action | Data |
|---|---|---|
| `library` | `loadBooks()` | Books with progress > 0 |
| `progress` | `load()` | Total KP, current title |
| `player` | (check active) | Currently playing book |

### Layout

```
PHONE                          TABLET (≥ 768px)
┌──────────────────────┐      ┌──────────────────────────────────┐
│  [Greeting]          │      │  [Greeting]         [KP badge]  │
│  Good evening, User  │      │                                  │
│                      │      ├─────────────────┬────────────────┤
│  ── Continue ──      │      │                 │                │
│  ┌────┐ ┌────┐       │      │  Continue       │  Activity      │
│  │book│ │book│ →      │      │  Reading        │  Feed          │
│  │    │ │    │        │      │                 │                │
│  └────┘ └────┘        │      │  ┌────┐ ┌────┐ │  • 42 KP       │
│                      │      │  │book│ │book│ │  • 15 min ago   │
│  ── Library ──       │      │  └────┘ └────┘ │  • Dune ch.4    │
│  ┌────┐┌────┐┌────┐  │      │  ┌────┐ ┌────┐ │                │
│  │    ││    ││    │  │      │  │book│ │book│ │  • 89 KP       │
│  └────┘└────┘└────┘  │      │  └────┘ └────┘ │  • 2 hrs ago   │
│  ┌────┐┌────┐┌────┐  │      │                 │                │
│  │    ││    ││    │  │      ├─────────────────┴────────────────┤
│  └────┘└────┘└────┘  │      │  Recent Library (grid)           │
│                      │      │  ┌────┐┌────┐┌────┐┌────┐┌────┐ │
│  ── Activity ──      │      │  └────┘└────┘└────┘└────┘└────┘ │
│  42 KP · Dune ch4   │      └──────────────────────────────────┘
│  89 KP · Atomic H   │
│                      │
│  [Bottom Nav]        │
└──────────────────────┘
```

### Sections

1. **Greeting** — "Good morning/afternoon/evening" + user's current title + KP badge
2. **Continue Reading** — Horizontal scroll of books with progress (cover + tiny progress bar). Max 5.
3. **Recent Library** — Grid of recently added/active books. 2 cols phone, 3-5 cols tablet+.
4. **Activity Feed** — Recent KP events (last 5-10). Book title, KP amount, time ago.

### Components Used

- `SectionHeader`, `BookCoverCard` (interactive), `KpBadge`, `ActivityItem`, `BookGrid`

---

## 2. Auth `/auth`

> Single login page that adapts. Shows ABS URL field on first use, hides it after.

### Layout — First Login (no saved ABS URL)

```
┌──────────────────────┐
│                      │
│     🌳 Fumiki        │
│     文木              │
│                      │
│  ┌──────────────────┐│
│  │ ABS Server URL   ││
│  │ ________________ ││
│  │ ℹ️ Docker URL,    ││
│  │ public URL, or IP││
│  │                  ││
│  │ Username         ││
│  │ ________________ ││
│  │                  ││
│  │ Password         ││
│  │ ________________ ││
│  │                  ││
│  │ [   Log In   ]   ││
│  │                  ││
│  │ (error message)  ││
│  └──────────────────┘│
│                      │
└──────────────────────┘
```

### Layout — Returning Login (ABS URL saved)

```
┌──────────────────────┐
│                      │
│     🌳 Fumiki        │
│     文木              │
│                      │
│  ┌──────────────────┐│
│  │                  ││
│  │ audiobookshelf ✓ ││
│  │          [Change]││
│  │                  ││
│  │ Username         ││
│  │ ________________ ││
│  │                  ││
│  │ Password         ││
│  │ ________________ ││
│  │                  ││
│  │ [   Log In   ]   ││
│  │                  ││
│  │ (error message)  ││
│  └──────────────────┘│
│                      │
└──────────────────────┘
```

- Centered card, max-width 400px
- Logo + app name above
- **ABS URL field**: visible as editable input on first login, collapsed to label + "Change" link after saving
- Tapping "Change" expands it back to an editable input
- **Username + Password**: always visible
- Error states: "Invalid credentials" or "Could not reach AudioBookShelf server"
- Helper text below URL field (when visible): "Fumiki connects from the server, not your browser. Docker internal URLs work."
- No bottom nav on this page

### Behavior

```
Page loads → GET /api/auth/status
  ├── absConfigured: true  → show saved hostname + "Change" link + username/password
  ├── absConfigured: false → show full URL input + username/password
  └── authenticated: true  → redirect to / (already logged in)
```

### Data Requirements

| Store | Action |
|---|---|
| `auth` | `checkStatus()`, `login()` |

---

## 3. Library `/library`

> Browse all books with search, filter, and sort.

### Layout

```
PHONE                          TABLET (≥ 768px)
┌──────────────────────┐      ┌──────────────────────────────────┐
│  Library             │      │  Library            [filter|sort]│
│  ┌──────────────────┐│      │  ┌────────────────────────────┐  │
│  │ 🔍 Search...     ││      │  │ 🔍 Search...              │  │
│  └──────────────────┘│      │  └────────────────────────────┘  │
│  [All][Ebook][Audio] │      │                                  │
│                      │      │  ┌────┐┌────┐┌────┐┌────┐┌────┐ │
│  ┌────┐┌────┐        │      │  │    ││    ││    ││    ││    │ │
│  │    ││    │        │      │  │    ││    ││    ││    ││    │ │
│  │    ││    │        │      │  │    ││    ││    ││    ││    │ │
│  └────┘└────┘        │      │  └────┘└────┘└────┘└────┘└────┘ │
│  ┌────┐┌────┐        │      │  ┌────┐┌────┐┌────┐┌────┐┌────┐ │
│  │    ││    │        │      │  │    ││    ││    ││    ││    │ │
│  └────┘└────┘        │      │  └────┘└────┘└────┘└────┘└────┘ │
│  ┌────┐┌────┐        │      │  (virtual scroll / load more)   │
│  │    ││    │        │      └──────────────────────────────────┘
│  └────┘└────┘        │
│  (load more)         │
│  [Bottom Nav]        │
└──────────────────────┘
```

### Sections

1. **Library picker** — If the ABS server has multiple libraries, show a dropdown/pill selector at the top: "Fiction · Non-Fiction · Podcasts". Default to the first book-type library. Podcasts library hidden (not supported in Fumiki v1).
2. **Search bar** — debounced, 300ms delay
3. **Filter pills** — All / Ebook / Audiobook
4. **Sort** — Title / Author / Recently Added / Progress (in dropdown or toggle)
5. **Book grid** — Responsive columns (2→3→4→5→6). Each book: cover, title, author, progress bar
6. **Load more / infinite scroll** — Paginated, 50 at a time

### Dual-Format Books (audiobook + ebook)

When a book exists as both audiobook and ebook in ABS (`mediaType: "both"`):
- **Library grid**: show as ONE card, not two. Display a small dual-format icon (headphones + book) on the cover corner.
- **Book detail**: show both "▶ Play" and "📖 Read" action buttons side by side.
- **Filter behavior**: dual-format books appear in ALL filter views (All, Ebook, Audiobook).

### Data Requirements

| Store | Action |
|---|---|
| `library` | `loadBooks()`, `setSearch()`, `setFilter()`, `setSort()` |

### Components Used

- `SearchInput`, `FilterPills`, `SortDropdown`, `BookGrid`, `BookCoverCard`, `LoadingGrid` (skeleton), `LibraryPicker` (if multiple libraries), `MediaTypeBadge` (headphones/book/dual icon on cover corner)

---

## 4. Book Detail `/library/:id`

> Full info about a book with actions.

### Layout

```
PHONE                          TABLET (≥ 768px)
┌──────────────────────┐      ┌──────────────────────────────────┐
│  ← Back              │      │  ← Back                          │
│                      │      ├──────────────┬───────────────────┤
│     ┌──────────┐     │      │              │                   │
│     │  Cover   │     │      │    Cover     │  Title            │
│     │          │     │      │    180×267    │  Author           │
│     │          │     │      │              │  Narrator          │
│     └──────────┘     │      │              │  Duration / Pages  │
│                      │      │              │                   │
│  Title               │      │              │  [▶ Play] [📖 Read]│
│  Author              │      │              │  [📝 Notes]       │
│  Narrator            │      │              │                   │
│  Duration / Pages    │      │              │  Progress ████░░  │
│                      │      │              │  67% · 4h 12m left│
│  [▶ Play] [📖 Read]  │      │              │                   │
│  [📝 Notes]          │      │              │  ── Category ──   │
│                      │      │              │  [Mind] [Stories]  │
│  Progress ████░░░    │      │──────────────┼───────────────────│
│  67% · 4h 12m left   │      │  Description (full)              │
│                      │      │                                  │
│  ── Description ──   │      │  ── Chapters ──                  │
│  Lorem ipsum...      │      │  1. Chapter One        00:00    │
│  (expandable)        │      │  2. Chapter Two        12:34    │
│                      │      │  3. Chapter Three ►    28:10    │
│  ── Chapters ──      │      │                                  │
│  1. Chapter One      │      │  ── AI Summaries ──             │
│  2. Chapter Two      │      │  Ch 1: [Generated] [View]       │
│  3. Chapter Three ►  │      │  Ch 2: [Generate]               │
│                      │      │                                  │
│  ── AI Summaries ──  │      │  ── Notes (3) ──                │
│  ...                 │      │  [note items]                   │
│                      │      └──────────────────────────────────┘
│  [Bottom Nav]        │
└──────────────────────┘
```

### Sections

1. **Header** — Cover, title, author, narrator, duration/pages, progress
2. **Action buttons** — Play (audiobook), Read (ebook), Notes
3. **Progress** — Bar + percentage + time remaining
4. **Category** — Auto-detected or manual override. Editable tags.
5. **Description** — Collapsible on phone, full on tablet
6. **Chapters** — List with timestamps (audiobook) or titles (ebook). Current chapter highlighted.
7. **AI Summaries** — Per chapter. Generate button if not cached. View if cached.
8. **Notes** — Recent notes for this book. Link to full notes view.
9. **Metadata** — Publisher, year, ISBN, genres (collapsed section)

### Data Requirements

| Store | Action |
|---|---|
| `book` | `load(id)` |
| `notes` | `loadForBook(id)` |
| API | `GET /api/summaries/:bookId` |

### Components Used

- `BookCover`, `Button`, `ProgressBar`, `Tag`, `ChapterList`, `SummaryCard`, `NoteItem`, `SectionHeader`

---

## 5. Audiobook Player `/player/:id`

> Full-screen player with controls, chapters, and notes.

### Layout

```
PHONE                          TABLET (≥ 768px)
┌──────────────────────┐      ┌──────────────────────────────────┐
│  ▼ Minimize          │      │  ▼ Minimize                      │
│                      │      ├──────────────────┬───────────────┤
│     ┌──────────────┐ │      │                  │               │
│     │              │ │      │    ┌──────────┐  │  Chapter 4    │
│     │    Cover     │ │      │    │          │  │  The Spice    │
│     │   (large)    │ │      │    │  Cover   │  │               │
│     │              │ │      │    │          │  │  12:34 / 1:04 │
│     └──────────────┘ │      │    └──────────┘  │               │
│                      │      │                  │  ┌─────────┐  │
│  Title               │      │  Title           │  │ Notes   │  │
│  Author              │      │  Author          │  │ panel   │  │
│                      │      │                  │  │         │  │
│  Ch 4: The Spice     │      │  ────────────── │  │  • note │  │
│                      │      │  |◄ -30  ▶  +30 ►| │  • note │  │
│  ──────●──────────── │      │  ────────────── │  │         │  │
│  12:34        1:04:22│      │  12:34    1:04:22│  │ [+ Add] │  │
│                      │      │                  │  └─────────┘  │
│  |◄  -30s  ▶  +30s  ►|│      │  [1x] [💤] [📝]  │               │
│                      │      │                  │  ── Chapters ─│
│  [1x] [💤 Sleep] [📝] │      │                  │  1. Intro     │
│                      │      │                  │  2. Arrakis   │
│  ── Chapters ──      │      │                  │  3. House A.  │
│  ...                 │      │                  │  4. Spice ►   │
│                      │      └──────────────────┴───────────────┘
└──────────────────────┘
```

### Controls

- **Play/Pause** — Center, large
- **Skip back/forward** — 30 seconds (configurable)
- **Seek bar** — Draggable progress
- **Speed** — 0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x
- **Sleep timer** — 15, 30, 45, 60 min, end of chapter
- **Chapter list** — Jump to chapter
- **Bookmark** — Add audio bookmark at current timestamp
- **Notes** — Quick note at current timestamp

### Tablet Split View

Left: cover, controls, seek bar. Right: notes panel + chapter list.

### Data Requirements

| Store | Action |
|---|---|
| `player` | `load(id)`, `play()`, `pause()`, `seek()` |
| `book` | `load(id)` |
| `notes` | `loadForBook(id)` |

### Components Used

- `BookCover`, `PlayerControls`, `SeekBar`, `SpeedSelector`, `SleepTimer`, `ChapterList`, `NotePanel`, `BookmarkButton`

### Special Behavior

- Page is full-screen (no bottom nav)
- Minimize button → returns to previous page, mini player appears at bottom
- Lock screen controls via Media Session API
- Background audio continues when navigating away
- KP recorded every 60 seconds while playing

---

## 6. Ebook Reader `/reader/:id`

> Full-screen distraction-free reading with highlights and notes.

### Layout

```
PHONE                          TABLET (≥ 768px)
┌──────────────────────┐      ┌──────────────────────────────────┐
│  [≡] Ch4  42%  [Aa]  │      │  [≡] Chapter 4   42%   [Aa] [×]│
│──────────────────────│      ├──────────────────┬───────────────┤
│                      │      │                  │               │
│  Book content here   │      │  Book content    │  Notes Panel  │
│  rendered by         │      │  rendered by     │               │
│  foliate-js          │      │  foliate-js      │  ── Ch 4 ──  │
│                      │      │                  │               │
│  Tap left: prev page │      │  max-width:      │  • highlight  │
│  Tap right: next page│      │  680px           │  • note       │
│  Tap center: toolbar │      │  centered        │  • bookmark   │
│                      │      │                  │               │
│  (selected text →    │      │  (text selection │  [+ Add note] │
│   highlight menu)    │      │   → popover)     │               │
│                      │      │                  │               │
│──────────────────────│      │                  │               │
│  [Progress: 42%]     │      │──────────────────│               │
│  Page 84 of 200      │      │  Page 84 / 200   │               │
└──────────────────────┘      └──────────────────┴───────────────┘
```

### Top Toolbar (tap center to show/hide)

- **Menu (≡)** — Table of contents drawer
- **Chapter title** — Current chapter name
- **Progress** — Percentage
- **Font settings (Aa)** — Font family, size, line height
- **Close** — Return to book detail

### Text Selection Actions

When user selects text, a floating popover appears:
- **Highlight** — Yellow, blue, green, pink
- **Note** — Highlight + open note input
- **Copy** — Copy to clipboard

### Reader Settings (Aa panel)

- Font family: Georgia, Crimson Pro, DM Sans, OpenDyslexic
- Font size: slider 14–28px
- Line height: slider 1.4–2.2
- Theme: follows app theme (Sumi dark, Kami cream, Mori dark green)

### Tablet Split View

Left: ebook content (max-width 680px, centered). Right: notes panel for current chapter.

### Data Requirements

| Store | Action |
|---|---|
| `book` | `load(id)` (for metadata) |
| `notes` | `loadForBook(id)`, `create()` |
| API | `GET /api/abs/items/:id/ebook` (file stream) |
| `preferences` | Reader font settings |

### Special Behavior

- Full-screen, no bottom nav, no app chrome
- foliate-js handles rendering, pagination, font application
- Progress synced to ABS on page turn (debounced, every 30 seconds)
- KP recorded per page turn
- Dark/light reading mode follows theme
- Highlights persist via notes store (ebook CFI positions)

---

## 7. Bonsai `/bonsai`

> Contemplative full-screen bonsai visualization with stats.

### Layout

```
PHONE                          TABLET (≥ 768px)
┌──────────────────────┐      ┌──────────────────────────────────┐
│                      │      │                                  │
│                      │      │        ┌──────────────┐          │
│     🌳               │      │        │              │          │
│  (Bonsai SVG,        │      │        │   Bonsai     │          │
│   large, centered,   │      │        │   (large)    │          │
│   breathing anim)    │      │        │              │          │
│                      │      │        └──────────────┘          │
│                      │      │                                  │
│──────────────────────│      │  4,230 KP · 学者 Gakusha         │
│                      │      │                                  │
│  4,230 KP            │      ├──────────────────┬───────────────┤
│  学者 Gakusha · Scholar│      │  Stats           │  Categories   │
│                      │      │                  │               │
│  23 books · 142 hrs  │      │  23 books        │  ┌─────────┐ │
│  Season 3, Day 47    │      │  142 hours       │  │ radial  │ │
│                      │      │  Season 3, D47   │  │ chart   │ │
│  ┌──────────────────┐│      │                  │  └─────────┘ │
│  │ Category chart   ││      │  Next: Sensei    │               │
│  │ (radial/donut)   ││      │  at 25,000 KP    │               │
│  └──────────────────┘│      └──────────────────┴───────────────┘
│                      │
│  ── Recent ──        │
│  Psychology of Money │
│  +42 KP · 2h ago    │
│                      │
│  [Bottom Nav]        │
└──────────────────────┘
```

### Sections

1. **Bonsai visualization** — SVG, centered, takes up ~50% of viewport. Subtle breathing animation (scale 1.0 ↔ 1.005, 4s cycle).
2. **KP counter** — Large display font. Current title in Japanese + English.
3. **Stats row** — Books completed, total hours, current season + day.
4. **Next milestone** — "Next: Sensei at 25,000 KP" with mini progress bar.
5. **Category chart** — Donut/radial showing KP distribution across 7 categories.
6. **Recent activity** — Last 5 KP events.

### Data Requirements

| Store | Action |
|---|---|
| `bonsai` | `load()` |
| `progress` | `load()` |

---

## 8. Notes `/notes`

> Browse all notes across all books.

### Layout

```
PHONE                          TABLET (≥ 768px)
┌──────────────────────┐      ┌──────────────────────────────────┐
│  Notes               │      │  Notes                           │
│  ┌──────────────────┐│      ├──────────────┬───────────────────┤
│  │ 🔍 Search notes  ││      │  Book List   │  Notes for Book   │
│  └──────────────────┘│      │              │                   │
│  [All][Notes][High]  │      │  Psychology  │  ┌─────────────┐  │
│                      │      │  of Money ►  │  │ Highlight   │  │
│  ── Psychology of ── │      │              │  │ "The highest│  │
│  ── Money ──         │      │  Dune        │  │  form of..."│  │
│  📌 "The highest     │      │              │  └─────────────┘  │
│  form of wealth..."  │      │  Atomic      │  ┌─────────────┐  │
│  Note: Key insight   │      │  Habits      │  │ Note        │  │
│  about...            │      │              │  │ Key insight  │  │
│                      │      │              │  │ about wealth │  │
│  📌 "Money's great..." │      │              │  └─────────────┘  │
│                      │      │              │                   │
│  ── Dune ──          │      │  [Export MD] │  [+ Add note]    │
│  🔖 Bookmark 12:34   │      └──────────────┴───────────────────┘
│  ...                 │
│                      │
│  [Bottom Nav]        │
└──────────────────────┘
```

### Tablet: Master-Detail

Left panel: book list (books that have notes). Right panel: notes for selected book.

### Sections

1. **Search** — Full-text search across all notes
2. **Filter** — All / Notes / Highlights / Bookmarks
3. **Grouped by book** — Each book is a section with its notes listed
4. **Export** — Download all notes for a book as markdown

### Data Requirements

| Store | Action |
|---|---|
| `notes` | `loadAll()`, `exportMarkdown()` |

---

## 9. Settings `/settings`

> App preferences, theme selection, AI configuration, connection info.

### Layout

```
┌──────────────────────┐
│  Settings            │
│                      │
│  ── Appearance ──    │
│  Theme               │
│  [墨 Sumi]           │
│  [紙 Kami]           │
│  [森 Mori]           │
│                      │
│  ── Reader ──        │
│  Font       [Georgia]│
│  Size       [──●──] │
│  Line height[──●──] │
│                      │
│  ── Playback ──      │
│  Speed      [──●──] │
│                      │
│  ── AI ──            │
│  Provider   [Ollama] │
│  Endpoint   [______] │
│  Model      [______] │
│  API Key    [______] │
│  [Test Connection]   │
│                      │
│  ── Connection ──    │
│  AudioBookShelf:     │
│  audiobookshelf ✓    │
│  Logged in as: user  │
│  [Change Server URL] │
│  [Log Out]           │
│                      │
│  ── About ──         │
│  Fumiki v0.1.0       │
│  文木                 │
│                      │
│  [Bottom Nav]        │
└──────────────────────┘
```

### Sections

1. **Appearance** — Theme selector (3 visual cards, one for each theme)
2. **Reader** — Font family picker, font size slider, line height slider
3. **Playback** — Default speed slider
4. **AI** — Provider dropdown, endpoint URL, model name, API key (masked). Test button.
5. **Connection** — ABS server hostname (not full URL), logged-in username, "Change Server URL" (opens modal with URL input — invalidates all sessions), "Log Out" button
6. **About** — App version, logo, link to GitHub, "Fumiki 文木"

### Data Requirements

| Store | Action |
|---|---|
| `preferences` | `load()`, `save()` |
| `auth` | (connection info), `disconnect()` |

### Theme Selector Cards

Three small preview cards showing a mini version of each theme's aesthetic:
- Sumi: dark bg, red accent dot, sharp corners
- Kami: cream bg, ink accent, soft corners
- Mori: forest bg, amber accent, organic corners

Active theme gets a border/ring indicator.

---

## 10. Loading States

Every page that fetches data shows a skeleton screen matching the page layout.

### Skeleton Rules

- Skeletons use `var(--surface-2)` with a shimmer animation
- Shimmer: subtle left-to-right gradient sweep
- Match the layout of real content (same card sizes, text line heights)
- Show skeleton only on first load. Subsequent visits show cached data + background refresh.

```css
.skeleton {
  background: var(--surface-2);
  border-radius: var(--radius);
  position: relative;
  overflow: hidden;
}

.skeleton::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent,
    var(--surface-3),
    transparent
  );
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

---

## 11. Error States

### Connection Error (ABS unreachable)

Full-page message with retry button:
```
  ⚠️
  Can't reach AudioBookShelf
  Check that your server is running at:
  abs.example.com

  [Retry]  [Settings]
```

### Empty States

| Page | Empty Message |
|---|---|
| Library | "Your library is empty. Add books to AudioBookShelf to see them here." |
| Notes | "No notes yet. Start reading and highlight passages that resonate." |
| Bonsai (0 KP) | "Your bonsai is a seed. Start reading to watch it grow." |
| Search (no results) | "No books match your search." |

---

## 12. Navigation Flow

### Primary Navigation (Bottom Tabs / Side / Top)

```
Home → Library → Bonsai → Notes → Settings
```

5 items. Icon + label on bottom tabs. Text-only on top/side.

### Secondary Navigation

- Book Detail → Player (full screen, back = minimize)
- Book Detail → Reader (full screen, back = close)
- Book Detail → Notes for book
- Settings → AI Configuration (sub-page)
- Notes → Notes for specific book

### Back Button Behavior

| Current Page | Back Goes To |
|---|---|
| Book Detail | Library (or Home if came from Home) |
| Player | Previous page (minimizes to mini player) |
| Reader | Book Detail |
| Notes for Book | Notes (all) |
| Settings / AI | Settings |

### Deep Links

Every page is directly accessible via URL. This matters for:
- Browser back/forward
- Sharing URLs
- PWA "start_url"

---

## 13. Transition Animations

| Transition | Animation |
|---|---|
| Page → Page | Fade + slide up (page-enter animation from Components doc) |
| Page → Player | Slide up from bottom (full screen) |
| Page → Reader | Fade to black → content appears |
| Player minimize | Slide down, mini player slides in at bottom |
| Modal open | Backdrop fade in, modal scale up from 0.95 |
| Modal close | Reverse of open |
| Toast appear | Slide in from position (theme-specific) |
| Toast dismiss | Fade out + slide |

All durations respect `var(--transition-base)` from the active theme.

---

*Companion to FUMIKI_ARCHITECTURE.md, FUMIKI_API.md, and FUMIKI_STATE.md*
