# Phase 2 — Knowledge Layer

> Estimated: 2–3 weeks
> Goal: Users can highlight text, bookmark audio, take notes, browse all notes, get AI chapter summaries, and export notes as markdown.
> Depends on: Phase 1 complete

---

## Tasks

### 2.1 — Notes API

Full CRUD for notes, highlights, and bookmarks.

**Tasks:**
- [ ] `GET /api/notes` — all notes with filtering (bookId, type, search, pagination)
- [ ] `GET /api/notes/:bookId` — notes for a specific book
- [ ] `POST /api/notes` — create note/highlight/bookmark
- [ ] `PATCH /api/notes/:id` — update content or color
- [ ] `DELETE /api/notes/:id` — remove note
- [ ] `GET /api/notes/export/:bookId` — export as markdown file
- [ ] Zod validation for all request bodies
- [ ] Position storage: `{ seconds, chapterTitle }` for audio, `{ cfi, chapter, excerpt }` for ebook

**Acceptance criteria:**
- [ ] All CRUD operations work correctly
- [ ] Filtering by book, type, search all functional
- [ ] Export generates clean markdown with book title, chapter groupings, highlight excerpts
- [ ] Handles concurrent note creation gracefully

---

### 2.2 — Notes Store

Client-side state management for notes.

**Tasks:**
- [ ] Notes store (`src/lib/stores/notes.ts`)
- [ ] Per-book cache (`Map<bookId, Note[]>`)
- [ ] All-notes list (for notes browser page)
- [ ] Optimistic create (instant UI, rollback on failure)
- [ ] Update and delete operations
- [ ] Export markdown (download file)

**Acceptance criteria:**
- [ ] Notes appear instantly when created (optimistic)
- [ ] Failed creates roll back with error toast
- [ ] Per-book cache avoids re-fetching

---

### 2.3 — Ebook Highlights & Notes

Text selection → highlight → note in the ebook reader.

**Tasks:**
- [ ] Text selection detection in foliate-js
- [ ] `HighlightPopover.svelte` — floating menu on text selection: Highlight (4 colors), Note, Copy
- [ ] Highlight rendering — colored background on highlighted ranges (via foliate-js annotation API)
- [ ] Note input — inline expandable textarea after highlight
- [ ] Highlights persist as notes with type `highlight`, position as ebook CFI
- [ ] Highlight colors: yellow, blue, green, pink (stored in note.color)
- [ ] Tap existing highlight → edit/delete popover
- [ ] Notes panel (tablet split view right side) — shows all highlights/notes for current chapter

**Acceptance criteria:**
- [ ] Select text → popover appears above selection
- [ ] Highlight applies immediately, persists across sessions
- [ ] Note attached to highlight displays on tap
- [ ] Colors render correctly in all three reader themes
- [ ] Multiple highlights on same page don't conflict
- [ ] Tablet: notes panel shows chapter notes in real-time
- [ ] Deleting highlight removes it visually and from database

---

### 2.4 — Audio Bookmarks & Notes

Timestamp-based bookmarks during audiobook playback.

**Tasks:**
- [ ] Bookmark button in player — creates bookmark at current timestamp
- [ ] `BookmarkButton.svelte` — one-tap bookmark, visual confirmation
- [ ] Note button in player — creates bookmark + opens note input
- [ ] `QuickNoteInput.svelte` — slide-up input for typing note at current timestamp
- [ ] Bookmarks display in chapter list with timestamps
- [ ] Tap bookmark → seek to that position
- [ ] Notes panel (tablet split view) — shows bookmarks/notes for current chapter

**Acceptance criteria:**
- [ ] One-tap bookmark at current audio position
- [ ] Note entry doesn't interrupt playback
- [ ] Bookmarks show in chapter list with accurate timestamps
- [ ] Tapping bookmark seeks to correct position
- [ ] Bookmark icon toggles if current position has a bookmark

---

### 2.5 — Notes Browser Page

Browse all notes across all books.

**Tasks:**
- [ ] Notes page (`/notes`) — all notes grouped by book
- [ ] Search across all notes (full-text)
- [ ] Filter: All / Notes / Highlights / Bookmarks
- [ ] Notes grouped by book with section headers
- [ ] `NoteItem.svelte` — displays note with type icon, excerpt, timestamp, book reference
- [ ] Tablet master-detail: book list left, notes for selected book right
- [ ] Per-book notes page (`/notes/:bookId`) — deep link
- [ ] Export button per book (download markdown)
- [ ] Empty state ("No notes yet. Start reading and highlight passages that resonate.")

**Acceptance criteria:**
- [ ] All notes from all books displayed
- [ ] Search finds notes by content
- [ ] Filter by type works
- [ ] Grouped by book with clear visual separation
- [ ] Tapping a note navigates to book position (reader or player)
- [ ] Export produces clean markdown
- [ ] Tablet layout with master-detail
- [ ] Works in all three themes

---

### 2.6 — AI Summary System

Per-chapter summaries via configurable AI provider.

**Tasks:**
- [ ] AI provider abstraction (`sidecar/src/services/ai/provider.ts`)
- [ ] Ollama provider (POST to `/api/generate` or `/api/chat`)
- [ ] OpenAI provider (POST to `/v1/chat/completions`)
- [ ] Anthropic provider (POST to `/v1/messages`)
- [ ] `GET /api/summaries/:bookId` — list cached summaries
- [ ] `POST /api/summaries` — generate summary (check cache first)
- [ ] `DELETE /api/summaries/:id` — delete cached summary (force regeneration)
- [ ] Chapter text extraction — pull chapter content from ebook via ABS
- [ ] Summary prompt template: concise, 3-5 paragraphs, key concepts, neutral tone
- [ ] Rate limiting: 5 requests/minute per user
- [ ] Cache summaries in `summaries` table (never regenerate unless deleted)

**Tasks (client):**
- [ ] `SummaryCard.svelte` — shows summary or "Generate" button per chapter
- [ ] Summary section on book detail page
- [ ] Loading state while generating (may take 10-30 seconds)
- [ ] Error state if AI provider not configured or unavailable

**Acceptance criteria:**
- [ ] Ollama, OpenAI, and Anthropic all work
- [ ] Summaries cached — second request is instant
- [ ] Rate limiting prevents abuse
- [ ] Works without AI configured (section hidden or shows "Configure in Settings")
- [ ] Summary generation shows loading spinner
- [ ] Generated summaries are readable and useful
- [ ] Works in all three themes

---

### 2.7 — AI Settings Page

Configure AI provider in the Settings UI.

**Tasks:**
- [ ] Settings sub-page (`/settings/ai`) or section in settings
- [ ] Provider dropdown: Ollama / OpenAI / Anthropic / None
- [ ] Endpoint URL input (pre-filled with defaults)
- [ ] Model name input (pre-filled with suggestions)
- [ ] API key input (masked, write-only)
- [ ] "Test Connection" button — calls a minimal AI request to verify
- [ ] Save → writes to `preferences` table

**Acceptance criteria:**
- [ ] Can configure any of the three providers
- [ ] API key never displayed after saving (write-only)
- [ ] Test button verifies connectivity and shows success/failure
- [ ] Changing provider clears old config
- [ ] Settings persist across sessions

---

## Definition of Done

After Phase 2, the app:
- Highlights text in ebooks with 4 colors
- Bookmarks audio positions with one tap
- Attaches notes to highlights and bookmarks
- Browses all notes across all books with search and filter
- Exports notes per book as markdown
- Generates AI chapter summaries (Ollama, OpenAI, or Anthropic)
- Caches summaries for instant retrieval
- Tablet split view: reader + notes, player + notes
- All features work in all three themes

---

*Next: Phase 3 — The Bonsai*
