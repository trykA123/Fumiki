# Fumiki — API Specification

> Every sidecar endpoint: routes, methods, request/response shapes, auth requirements.

---

## Base URL

All API routes are prefixed with `/api`.
All routes except `/api/auth/*` and `/api/health` require a valid session cookie.

## Response Format

All responses are JSON:

```typescript
// Success
{ data: T }

// Error
{ error: string, detail?: string }

// List
{ data: T[], total?: number }
```

---

## 1. Health

### `GET /api/health`

No auth required. Used by Docker healthcheck.

```typescript
// Response 200
{
  data: {
    status: "ok",
    version: "0.1.0",
    uptime: 3600
  }
}
```

---

## 2. Auth

### `GET /api/auth/status`

Check if ABS is configured and if user has a session. No auth required.

```typescript
// Response 200
{
  data: {
    absConfigured: boolean,       // true if server_config has abs_url
    authenticated: boolean,       // true if valid session cookie
    absHost: string | null,       // Hostname only (e.g. "audiobookshelf"), never full URL
    username: string | null       // If authenticated
  }
}
```

Used by the client on app init to decide what the login page shows.

### `POST /api/auth/login`

Login with ABS credentials. If `absUrl` is included, saves it to `server_config` (first-time or change).

```typescript
// Request — first login (or changing server)
{
  absUrl: string,        // "http://audiobookshelf:80"
  username: string,
  password: string
}

// Request — returning login (ABS URL already saved)
{
  username: string,
  password: string
}

// Response 200
{
  data: {
    user: {
      id: string,
      username: string
    }
  }
}

// Response 401
{ error: "Invalid credentials" }

// Response 502
{ error: "Could not connect to AudioBookShelf server" }
```

**Sidecar logic:**
1. If `absUrl` in request body → validate URL, save to `server_config`
2. Else → read `abs_url` from `server_config` (or `ABS_URL` env var)
3. If no ABS URL available → return `400 { error: "ABS server URL required" }`
4. Call ABS `/login` with credentials
5. On success → store connection, create session, set cookie

Cookie set: `fumiki_session=<token>; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`

### `POST /api/auth/logout`

Destroy session.

```typescript
// Response 200
{ data: { loggedOut: true } }
```

---

## 3. ABS Proxy

All ABS data flows through these proxy endpoints. The sidecar adds auth headers and transforms responses.

### `GET /api/abs/libraries`

List all ABS libraries.

```typescript
// Response 200
{
  data: [{
    id: string,
    name: string,
    mediaType: "book" | "podcast",
    folders: string[],
    stats: { totalItems: number }
  }]
}
```

### `GET /api/abs/libraries/:libraryId/items`

List books in a library. Supports pagination and filtering.

```typescript
// Query params
?page=0&limit=50&sort=title&filter=ebook|audiobook&search=dune

// Response 200
{
  data: [{
    id: string,
    title: string,
    author: string,
    coverUrl: string,         // Proxied: /api/abs/items/{id}/cover
    mediaType: "ebook" | "audiobook" | "both",
    duration: number | null,  // seconds (audiobooks)
    pages: number | null,     // (ebooks)
    progress: number,         // 0-1 from ABS
    genres: string[],
    primaryCategory: string,  // Mapped to Fumiki category
    addedAt: number
  }],
  total: number,
  page: number,
  limit: number
}
```

The sidecar also updates `book_cache` table on each fetch.

### `GET /api/abs/items/:itemId`

Get detailed book info.

```typescript
// Response 200
{
  data: {
    id: string,
    title: string,
    subtitle: string | null,
    author: string,
    narrator: string | null,
    publisher: string | null,
    publishedYear: string | null,
    description: string | null,
    coverUrl: string,
    genres: string[],
    tags: string[],
    language: string | null,
    isbn: string | null,
    mediaType: "ebook" | "audiobook" | "both",
    
    // Audiobook specific
    duration: number | null,
    chapters: [{
      id: string,
      title: string,
      start: number,    // seconds
      end: number
    }] | null,
    
    // Ebook specific
    pages: number | null,
    ebookFormat: string | null,   // "epub", "mobi", "azw3", etc.
    
    // Progress from ABS
    progress: number,             // 0-1
    currentTime: number | null,   // seconds (audiobook)
    isFinished: boolean,
    
    // Fumiki data
    primaryCategory: string,
    secondaryCategory: string | null,
    totalKp: number,
    noteCount: number
  }
}
```

### `GET /api/abs/items/:itemId/cover`

Proxy book cover image from ABS.

```typescript
// Response 200
// Content-Type: image/jpeg (or image/png)
// Binary image data
```

### `GET /api/abs/items/:itemId/stream`

Proxy audio stream for audiobook playback.

```typescript
// Headers: Range (for seeking)
// Response 200 or 206
// Content-Type: audio/mpeg (or appropriate type)
// Binary audio data (streaming)
```

### `GET /api/abs/items/:itemId/ebook`

Get ebook file for reader.

```typescript
// Response 200
// Content-Type: application/epub+zip (or appropriate type)
// Binary ebook data
```

### `PATCH /api/abs/items/:itemId/progress`

Sync reading/listening progress back to ABS.

```typescript
// Request
{
  progress: number,        // 0-1
  currentTime?: number,    // seconds (audiobook)
  ebookLocation?: string,  // CFI or position (ebook)
  isFinished?: boolean
}

// Response 200
{ data: { synced: true } }
```

---

## 4. Notes

### `GET /api/notes`

List all notes for the current user. Supports filtering.

```typescript
// Query params
?bookId=abc&type=note|highlight|bookmark&page=0&limit=50&search=keyword

// Response 200
{
  data: [{
    id: string,
    bookId: string,
    bookTitle: string,      // Joined from book_cache
    type: "note" | "highlight" | "bookmark",
    content: string | null,
    color: string | null,
    positionType: "audio" | "ebook",
    positionValue: {
      // Audio: { seconds: number, chapterTitle?: string }
      // Ebook: { cfi: string, chapter?: string, excerpt?: string }
    },
    createdAt: number,
    updatedAt: number
  }],
  total: number
}
```

### `GET /api/notes/:bookId`

List notes for a specific book.

```typescript
// Query params
?type=note|highlight|bookmark

// Response 200
{
  data: [/* same shape as above */]
}
```

### `POST /api/notes`

Create a new note, highlight, or bookmark.

```typescript
// Request
{
  bookId: string,
  type: "note" | "highlight" | "bookmark",
  content?: string,
  color?: string,
  positionType: "audio" | "ebook",
  positionValue: object     // { seconds } or { cfi, chapter, excerpt }
}

// Response 201
{
  data: {
    id: string,
    /* ...full note object */
  }
}
```

### `PATCH /api/notes/:id`

Update a note.

```typescript
// Request (partial)
{
  content?: string,
  color?: string
}

// Response 200
{ data: { /* updated note */ } }
```

### `DELETE /api/notes/:id`

```typescript
// Response 200
{ data: { deleted: true } }
```

### `GET /api/notes/export/:bookId`

Export all notes for a book as markdown.

```typescript
// Response 200
// Content-Type: text/markdown
// Content-Disposition: attachment; filename="book-title-notes.md"
```

---

## 5. AI Summaries

### `GET /api/summaries/:bookId`

Get all cached summaries for a book.

```typescript
// Response 200
{
  data: [{
    id: string,
    bookId: string,
    chapterIndex: number,
    chapterTitle: string | null,
    summary: string,
    provider: string,
    model: string,
    createdAt: number
  }]
}
```

### `POST /api/summaries`

Generate a summary for a chapter. Returns cached if available.

```typescript
// Request
{
  bookId: string,
  chapterIndex: number,
  chapterTitle?: string
}

// Response 200 (cached)
{ data: { /* summary object */, cached: true } }

// Response 200 (generated)
{ data: { /* summary object */, cached: false } }

// Response 503
{ error: "AI provider not configured" }
```

### `DELETE /api/summaries/:id`

Delete a cached summary (forces regeneration on next request).

```typescript
// Response 200
{ data: { deleted: true } }
```

---

## 6. Progress & KP

### `GET /api/progress`

Get current user's overall progress.

```typescript
// Response 200
{
  data: {
    totalKp: number,
    currentTitle: string,         // "Gakusha"
    currentTitleKanji: string,    // "学者"
    nextTitle: string | null,
    nextTitleAt: number | null,   // KP threshold
    booksCompleted: number,
    totalHours: number,
    currentStreak: number,
    longestStreak: number,
    lastReadingDate: string | null,
    categories: [{
      id: string,
      name: string,
      totalKp: number,
      percentage: number          // Of total KP
    }]
  }
}
```

### `POST /api/progress/kp`

Record a reading/listening session. Called periodically during reading.

```typescript
// Request
{
  bookId: string,
  source: "reading" | "listening",
  amount: number,            // Pages or minutes
  sessionSeconds: number     // Actual time elapsed (for anti-gaming)
}

// Response 200
{
  data: {
    kpEarned: number,
    multiplier: number,          // 1.0 or 0.5 (secondary genre)
    totalKp: number,             // New total
    categoryId: string,
    categoryKp: number,          // New category total
    titleChanged: boolean,
    newTitle: string | null,
    bonsaiGrew: boolean          // If bonsai stage advanced
  }
}
```

### `POST /api/progress/complete`

Mark a book as completed. Awards completion bonus.

```typescript
// Request
{
  bookId: string
}

// Response 200
{
  data: {
    bonusKp: number,
    totalKp: number,
    booksCompleted: number,
    titleChanged: boolean,
    newTitle: string | null
  }
}
```

### `GET /api/progress/calendar`

Get reading activity calendar data.

```typescript
// Query params
?year=2026&month=2

// Response 200
{
  data: {
    days: [{
      date: "2026-02-17",
      kpEarned: number,
      minutesRead: number,
      booksActive: number
    }]
  }
}
```

### `GET /api/progress/history`

Get recent KP events (activity feed).

```typescript
// Query params
?limit=20&offset=0

// Response 200
{
  data: [{
    id: string,
    bookId: string,
    bookTitle: string,
    categoryId: string,
    categoryName: string,
    kpAmount: number,
    source: "reading" | "listening" | "completion_bonus",
    createdAt: number
  }],
  total: number
}
```

---

## 7. Bonsai

### `GET /api/bonsai`

Get current bonsai state.

```typescript
// Response 200
{
  data: {
    seed: string,
    stage: number,              // 0-8+
    stageName: string,          // "Sapling", "Growing tree", etc.
    branchParams: {
      // Genre-influenced branch parameters
      mind: number,             // KP weight (0-1)
      stories: number,
      craft: number,
      wealth: number,
      self: number,
      world: number,
      art: number
    },
    totalKp: number,
    lastSnapshot: string | null, // SVG string
    updatedAt: number
  }
}
```

### `GET /api/bonsai/snapshot`

Get bonsai as exportable SVG (unlocked at 10,000 KP).

```typescript
// Response 200
// Content-Type: image/svg+xml
```

---

## 8. Preferences

### `GET /api/preferences`

Get current user preferences.

```typescript
// Response 200
{
  data: {
    activeTheme: "sumi" | "kami" | "mori",
    activeTitle: string,
    playbackSpeed: number,
    readerFontSize: number,
    readerFont: string,
    readerLineHeight: number,
    aiProvider: string | null,
    aiModel: string | null,
    aiEndpoint: string | null,
    aiConfigured: boolean       // True if provider + endpoint set (key hidden)
  }
}
```

Note: `aiApiKey` is never returned to the client. Only `aiConfigured` boolean.

### `PATCH /api/preferences`

Update preferences. Partial updates supported.

```typescript
// Request (any subset)
{
  activeTheme?: "sumi" | "kami" | "mori",
  playbackSpeed?: number,
  readerFontSize?: number,
  readerFont?: string,
  readerLineHeight?: number,
  aiProvider?: string,
  aiModel?: string,
  aiEndpoint?: string,
  aiApiKey?: string          // Write-only, never returned
}

// Response 200
{ data: { /* updated preferences (without apiKey) */ } }
```

---

## 9. Seasons

### `GET /api/seasons`

List all seasons for current user.

```typescript
// Response 200
{
  data: [{
    id: string,
    seasonNumber: number,
    startDate: number,
    endDate: number,
    totalKp: number,
    booksCompleted: number,
    hoursSpent: number,
    reflection: string | null,
    hasBonsaiSnapshot: boolean,
    isCurrent: boolean
  }]
}
```

### `GET /api/seasons/current`

Get current season details.

```typescript
// Response 200
{
  data: {
    id: string,
    seasonNumber: number,
    startDate: number,
    endDate: number,
    dayNumber: number,        // Day X of 90
    totalKp: number,
    booksCompleted: number,
    hoursSpent: number,
    reflection: string | null
  }
}
```

### `PATCH /api/seasons/:id`

Update season reflection.

```typescript
// Request
{ reflection: string }

// Response 200
{ data: { /* updated season */ } }
```

---

## 10. Unlocks

### `GET /api/unlocks`

List all unlocked features for current user.

```typescript
// Response 200
{
  data: [{
    feature: string,        // "stats", "calendar", "bonsai_export", etc.
    unlockedAt: number
  }]
}
```

---

## 11. Genre-Category Mapping

### `GET /api/categories`

List all categories with genre mappings.

```typescript
// Response 200
{
  data: [{
    id: string,             // "mind", "stories", etc.
    name: string,           // "Mind", "Stories", etc.
    genres: string[]        // Mapped ABS genres
  }]
}
```

### `PATCH /api/books/:bookId/category`

Manually override a book's category mapping.

```typescript
// Request
{
  primaryCategory: string,
  secondaryCategory?: string | null
}

// Response 200
{ data: { updated: true } }
```

---

## 12. Book Discovery & Requests

### `GET /api/discovery/search`

Search external book databases (Google Books + Open Library).

```typescript
// Query params
?q=dune+frank+herbert

// Response 200
{
  data: [{
    title: string,
    author: string,
    description: string | null,
    coverUrl: string | null,
    isbn: string | null,
    pageCount: number | null,
    categories: string[],
    source: "google_books" | "open_library",
    sourceId: string,
    inLibrary: boolean,          // true if ISBN matches a book_cache entry
    requested: boolean           // true if user already requested this
  }]
}
```

### `POST /api/discovery/request`

Request a book to be added to the ABS library.

```typescript
// Request
{
  title: string,
  author?: string,
  isbn?: string,
  coverUrl?: string,
  source: "google_books" | "open_library",
  sourceId?: string
}

// Response 201
{
  data: {
    id: string,
    title: string,
    status: "pending",
    createdAt: number
  }
}

// Response 409
{ error: "Book already requested" }
```

### `GET /api/discovery/requests`

List user's book requests.

```typescript
// Query params
?status=pending|approved|fulfilled|declined

// Response 200
{
  data: [{
    id: string,
    title: string,
    author: string | null,
    isbn: string | null,
    coverUrl: string | null,
    status: "pending" | "approved" | "fulfilled" | "declined",
    adminNote: string | null,
    createdAt: number,
    updatedAt: number
  }]
}
```

### `PATCH /api/discovery/requests/:id`

Update request status (admin action).

```typescript
// Request
{
  status: "approved" | "fulfilled" | "declined",
  adminNote?: string
}

// Response 200
{ data: { /* updated request */ } }
```

---

## 13. Validation

All request bodies are validated with Zod schemas shared between client and sidecar.

```typescript
// shared/schemas.ts
import { z } from 'zod';

export const ConnectSchema = z.object({
  absUrl: z.string().url(),
  username: z.string().min(1),
  password: z.string().min(1),
});

export const CreateNoteSchema = z.object({
  bookId: z.string().min(1),
  type: z.enum(['note', 'highlight', 'bookmark']),
  content: z.string().optional(),
  color: z.string().optional(),
  positionType: z.enum(['audio', 'ebook']),
  positionValue: z.record(z.any()),
});

export const RecordKpSchema = z.object({
  bookId: z.string().min(1),
  source: z.enum(['reading', 'listening']),
  amount: z.number().positive(),
  sessionSeconds: z.number().positive(),
});

export const PreferencesSchema = z.object({
  activeTheme: z.enum(['sumi', 'kami', 'mori']).optional(),
  playbackSpeed: z.number().min(0.5).max(3).optional(),
  readerFontSize: z.number().min(14).max(28).optional(),
  readerFont: z.string().optional(),
  readerLineHeight: z.number().min(1.2).max(2.5).optional(),
  aiProvider: z.enum(['ollama', 'openai', 'anthropic']).nullable().optional(),
  aiModel: z.string().nullable().optional(),
  aiEndpoint: z.string().url().nullable().optional(),
  aiApiKey: z.string().nullable().optional(),
}).partial();

// etc.
```

---

*Companion to FUMIKI_ARCHITECTURE.md*
