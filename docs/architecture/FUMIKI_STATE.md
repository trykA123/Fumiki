# Fumiki — State Management

> Svelte stores, data flow, caching strategy, and client-side state architecture.

---

## 1. Philosophy

- **Stores are the single source of truth** for all UI state
- **API calls live in store actions**, not in components
- **Components are dumb** — they read from stores and dispatch actions
- **Optimistic updates** for writes (notes, preferences, progress)
- **Stale-while-revalidate** for reads (library, book details)
- **No global state library** — native Svelte stores + context are sufficient

---

## 2. Store Architecture

```
┌─────────────────────────────────────────────────┐
│                  Components                      │
│   (read from stores, dispatch actions)           │
└──────────────┬──────────────────┬───────────────┘
               │ subscribe        │ action()
               ▼                  ▼
┌─────────────────────────────────────────────────┐
│                  Svelte Stores                   │
│                                                  │
│   ┌──────────┐ ┌──────────┐ ┌──────────────┐   │
│   │  auth    │ │ library  │ │  player      │   │
│   └──────────┘ └──────────┘ └──────────────┘   │
│   ┌──────────┐ ┌──────────┐ ┌──────────────┐   │
│   │  book    │ │  notes   │ │  reader      │   │
│   └──────────┘ └──────────┘ └──────────────┘   │
│   ┌──────────┐ ┌──────────┐ ┌──────────────┐   │
│   │ progress │ │  bonsai  │ │  theme       │   │
│   └──────────┘ └──────────┘ └──────────────┘   │
│   ┌──────────┐ ┌──────────────────────────┐     │
│   │ seasons  │ │  preferences             │     │
│   └──────────┘ └──────────────────────────┘     │
│                      │                           │
└──────────────────────┼──────────────────────────┘
                       │ fetch()
                       ▼
┌─────────────────────────────────────────────────┐
│                  API Client                      │
│   (central fetch wrapper with error handling)    │
└──────────────────────┬──────────────────────────┘
                       │
                       ▼
                   Sidecar API
```

---

## 3. API Client

Central fetch wrapper used by all stores.

```typescript
// src/lib/api/client.ts

import { goto } from '$app/navigation';
import { toast } from '$lib/stores/toast';

const BASE = '/api';

interface ApiResponse<T> {
  data: T;
}

interface ApiError {
  error: string;
  detail?: string;
}

class ApiClient {
  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',   // Include session cookie
    });

    if (res.status === 401) {
      goto('/auth');
      throw new Error('Unauthorized');
    }

    if (!res.ok) {
      const err: ApiError = await res.json().catch(() => ({
        error: `HTTP ${res.status}`,
      }));

      if (res.status === 502) {
        toast.error('Could not reach AudioBookShelf');
      } else if (res.status === 503) {
        toast.error('AI service unavailable');
      }

      throw new Error(err.error);
    }

    // Handle non-JSON responses (streams, files)
    const contentType = res.headers.get('Content-Type') || '';
    if (contentType.includes('application/json')) {
      const body: ApiResponse<T> = await res.json();
      return body.data;
    }

    return res as unknown as T;
  }

  get<T>(path: string) {
    return this.request<T>(path);
  }

  post<T>(path: string, body: unknown) {
    return this.request<T>(path, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  patch<T>(path: string, body: unknown) {
    return this.request<T>(path, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  delete<T>(path: string) {
    return this.request<T>(path, { method: 'DELETE' });
  }
}

export const api = new ApiClient();
```

---

## 4. Individual Stores

### 4.1 Auth Store

```typescript
// src/lib/stores/auth.ts
import { writable, derived } from 'svelte/store';
import { api } from '$lib/api/client';

interface AuthState {
  absConfigured: boolean;
  authenticated: boolean;
  absHost: string | null;
  username: string | null;
  loading: boolean;
  error: string | null;
}

function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState>({
    absConfigured: false,
    authenticated: false,
    absHost: null,
    username: null,
    loading: true,
    error: null,
  });

  return {
    subscribe,

    // Called on app init — determines what login page shows
    async checkStatus() {
      try {
        const data = await api.get<any>('/auth/status');
        set({
          absConfigured: data.absConfigured,
          authenticated: data.authenticated,
          absHost: data.absHost,
          username: data.username,
          loading: false,
          error: null,
        });
      } catch {
        set({
          absConfigured: false,
          authenticated: false,
          absHost: null,
          username: null,
          loading: false,
          error: null,
        });
      }
    },

    // Single login method — include absUrl on first login or when changing server
    async login(username: string, password: string, absUrl?: string) {
      update(s => ({ ...s, loading: true, error: null }));
      try {
        const body: any = { username, password };
        if (absUrl) body.absUrl = absUrl;

        const data = await api.post<any>('/auth/login', body);
        set({
          absConfigured: true,
          authenticated: true,
          absHost: absUrl ? new URL(absUrl).hostname : null,
          username: data.user.username,
          loading: false,
          error: null,
        });
        return true;
      } catch (err: any) {
        update(s => ({ ...s, loading: false, error: err.message }));
        return false;
      }
    },

    async logout() {
      await api.post('/auth/logout', {});
      update(s => ({
        ...s,
        authenticated: false,
        username: null,
      }));
    },
  };
}

export const auth = createAuthStore();
export const isAuthenticated = derived(auth, $a => $a.authenticated);
export const absConfigured = derived(auth, $a => $a.absConfigured);
```

### 4.2 Theme Store

```typescript
// src/lib/stores/theme.ts
import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import { themes } from '$lib/themes';

type ThemeId = 'sumi' | 'kami' | 'mori';

function createThemeStore() {
  // Load from localStorage or default to sumi
  const initial: ThemeId = browser
    ? (localStorage.getItem('fumiki-theme') as ThemeId) || 'sumi'
    : 'sumi';

  const { subscribe, set } = writable<ThemeId>(initial);

  return {
    subscribe,

    setTheme(id: ThemeId) {
      set(id);
      if (browser) {
        document.documentElement.setAttribute('data-theme', id);
        localStorage.setItem('fumiki-theme', id);
      }
    },

    // Called on app init
    init() {
      if (browser) {
        document.documentElement.setAttribute('data-theme', initial);
      }
    },
  };
}

export const themeId = createThemeStore();

// Derived: full theme config object
export const theme = derived(themeId, $id => themes[$id]);
```

### 4.3 Library Store

```typescript
// src/lib/stores/library.ts
import { writable, derived } from 'svelte/store';
import { api } from '$lib/api/client';

interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  mediaType: 'ebook' | 'audiobook' | 'both';
  duration: number | null;
  pages: number | null;
  progress: number;
  genres: string[];
  primaryCategory: string;
  addedAt: number;
}

interface LibraryState {
  libraries: { id: string; name: string; mediaType: string }[];
  activeLibraryId: string | null;
  books: Book[];
  total: number;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  filter: 'all' | 'ebook' | 'audiobook';
  sortBy: 'title' | 'author' | 'addedAt' | 'progress';
}

function createLibraryStore() {
  const { subscribe, set, update } = writable<LibraryState>({
    libraries: [],
    activeLibraryId: null,
    books: [],
    total: 0,
    loading: false,
    error: null,
    searchQuery: '',
    filter: 'all',
    sortBy: 'title',
  });

  return {
    subscribe,

    async loadLibraries() {
      const libs = await api.get<any[]>('/abs/libraries');
      // Filter to book libraries only (exclude podcasts)
      const bookLibs = libs.filter(l => l.mediaType === 'book');
      update(s => ({
        ...s,
        libraries: bookLibs,
        activeLibraryId: bookLibs[0]?.id || null,
      }));
      if (bookLibs.length > 0) {
        await this.loadBooks();
      }
    },

    async switchLibrary(libraryId: string) {
      update(s => ({ ...s, activeLibraryId: libraryId, books: [], searchQuery: '' }));
      await this.loadBooks();
    },

    async loadBooks(page = 0) {
      update(s => ({ ...s, loading: true }));
      try {
        const state = getCurrentState();
        const params = new URLSearchParams({
          page: String(page),
          limit: '50',
          sort: state.sortBy,
          ...(state.searchQuery && { search: state.searchQuery }),
          ...(state.filter !== 'all' && { filter: state.filter }),
        });

        const result = await api.get<any>(
          `/abs/libraries/${state.activeLibraryId}/items?${params}`
        );

        update(s => ({
          ...s,
          books: page === 0 ? result.data : [...s.books, ...result.data],
          total: result.total,
          loading: false,
          error: null,
        }));
      } catch (err: any) {
        update(s => ({ ...s, loading: false, error: err.message }));
      }
    },

    setSearch(query: string) {
      update(s => ({ ...s, searchQuery: query }));
      // Debounced reload handled by component
    },

    setFilter(filter: LibraryState['filter']) {
      update(s => ({ ...s, filter }));
      this.loadBooks();
    },

    setSort(sort: LibraryState['sortBy']) {
      update(s => ({ ...s, sortBy: sort }));
      this.loadBooks();
    },
  };

  // Helper to read current state synchronously
  function getCurrentState(): LibraryState {
    let state: LibraryState;
    subscribe(s => { state = s; })();
    return state!;
  }
}

export const library = createLibraryStore();

// Derived stores
export const continueReading = derived(library, $lib =>
  [...$lib.books]
    .filter(b => b.progress > 0 && b.progress < 1)
    .sort((a, b) => b.addedAt - a.addedAt)
    .slice(0, 5)
);
```

### 4.4 Book Detail Store

```typescript
// src/lib/stores/book.ts
import { writable } from 'svelte/store';
import { api } from '$lib/api/client';

interface BookDetail {
  // Full book object (see API spec)
  [key: string]: any;
}

interface BookState {
  current: BookDetail | null;
  loading: boolean;
  error: string | null;
}

function createBookStore() {
  const { subscribe, set, update } = writable<BookState>({
    current: null,
    loading: false,
    error: null,
  });

  return {
    subscribe,

    async load(bookId: string) {
      update(s => ({ ...s, loading: true }));
      try {
        const book = await api.get<BookDetail>(`/abs/items/${bookId}`);
        set({ current: book, loading: false, error: null });
      } catch (err: any) {
        set({ current: null, loading: false, error: err.message });
      }
    },

    clear() {
      set({ current: null, loading: false, error: null });
    },
  };
}

export const book = createBookStore();
```

### 4.5 Player Store

```typescript
// src/lib/stores/player.ts
import { writable, derived } from 'svelte/store';
import { api } from '$lib/api/client';

interface PlayerState {
  bookId: string | null;
  bookTitle: string;
  coverUrl: string;
  duration: number;
  currentTime: number;
  playbackSpeed: number;
  isPlaying: boolean;
  isLoading: boolean;
  chapters: { id: string; title: string; start: number; end: number }[];
  currentChapterIndex: number;
  sleepTimer: number | null;    // Minutes remaining, null = off
}

function createPlayerStore() {
  const { subscribe, set, update } = writable<PlayerState>({
    bookId: null,
    bookTitle: '',
    coverUrl: '',
    duration: 0,
    currentTime: 0,
    playbackSpeed: 1.0,
    isPlaying: false,
    isLoading: false,
    chapters: [],
    currentChapterIndex: 0,
    sleepTimer: null,
  });

  let audio: HTMLAudioElement | null = null;
  let kpInterval: ReturnType<typeof setInterval> | null = null;
  let lastKpTime = 0;

  return {
    subscribe,

    async load(bookId: string, book: any) {
      // Stop current playback
      this.stop();

      update(s => ({
        ...s,
        bookId,
        bookTitle: book.title,
        coverUrl: book.coverUrl,
        duration: book.duration || 0,
        chapters: book.chapters || [],
        isLoading: true,
      }));

      // Create audio element
      audio = new Audio(`/api/abs/items/${bookId}/stream`);
      audio.playbackRate = getCurrentState().playbackSpeed;

      audio.addEventListener('timeupdate', () => {
        update(s => ({ ...s, currentTime: audio!.currentTime }));
      });

      audio.addEventListener('loadeddata', () => {
        update(s => ({ ...s, isLoading: false }));
      });

      audio.addEventListener('ended', () => {
        update(s => ({ ...s, isPlaying: false }));
        this.syncProgress();
      });

      // Start KP tracking interval (every 60 seconds)
      lastKpTime = Date.now();
      kpInterval = setInterval(() => this.recordKp(), 60_000);
    },

    play() {
      audio?.play();
      update(s => ({ ...s, isPlaying: true }));
      this.setupMediaSession();
    },

    pause() {
      audio?.pause();
      update(s => ({ ...s, isPlaying: false }));
      this.recordKp();
      this.syncProgress();
    },

    stop() {
      audio?.pause();
      audio = null;
      if (kpInterval) clearInterval(kpInterval);
      kpInterval = null;
    },

    seek(time: number) {
      if (audio) audio.currentTime = time;
    },

    setSpeed(speed: number) {
      if (audio) audio.playbackRate = speed;
      update(s => ({ ...s, playbackSpeed: speed }));
    },

    setSleepTimer(minutes: number | null) {
      update(s => ({ ...s, sleepTimer: minutes }));
      // Timer countdown handled separately
    },

    async recordKp() {
      const state = getCurrentState();
      if (!state.bookId) return;

      const elapsed = (Date.now() - lastKpTime) / 1000 / 60;  // minutes
      lastKpTime = Date.now();

      if (elapsed > 0.5) {  // Only record if > 30 seconds
        await api.post('/progress/kp', {
          bookId: state.bookId,
          source: 'listening',
          amount: Math.round(elapsed),
          sessionSeconds: Math.round(elapsed * 60),
        }).catch(() => {}); // Silent fail, will retry
      }
    },

    async syncProgress() {
      const state = getCurrentState();
      if (!state.bookId || !audio) return;

      await api.patch(`/abs/items/${state.bookId}/progress`, {
        progress: audio.currentTime / state.duration,
        currentTime: audio.currentTime,
      }).catch(() => {});
    },

    setupMediaSession() {
      if (!('mediaSession' in navigator)) return;
      const state = getCurrentState();

      navigator.mediaSession.metadata = new MediaMetadata({
        title: state.bookTitle,
        artist: 'Fumiki',
        artwork: state.coverUrl
          ? [{ src: state.coverUrl, type: 'image/jpeg' }]
          : [],
      });

      navigator.mediaSession.setActionHandler('play', () => this.play());
      navigator.mediaSession.setActionHandler('pause', () => this.pause());
      navigator.mediaSession.setActionHandler('seekbackward', () => {
        this.seek(Math.max(0, (audio?.currentTime || 0) - 30));
      });
      navigator.mediaSession.setActionHandler('seekforward', () => {
        this.seek(Math.min(state.duration, (audio?.currentTime || 0) + 30));
      });
    },
  };

  function getCurrentState(): PlayerState {
    let state: PlayerState;
    subscribe(s => { state = s; })();
    return state!;
  }
}

export const player = createPlayerStore();

// Derived
export const isPlayerActive = derived(player, $p => $p.bookId !== null);
export const currentChapter = derived(player, $p => {
  const ch = $p.chapters.find(
    (c, i) => $p.currentTime >= c.start &&
    ($p.chapters[i + 1] ? $p.currentTime < $p.chapters[i + 1].start : true)
  );
  return ch || null;
});
export const playerProgress = derived(player, $p =>
  $p.duration > 0 ? $p.currentTime / $p.duration : 0
);
```

### 4.6 Notes Store

```typescript
// src/lib/stores/notes.ts
import { writable } from 'svelte/store';
import { api } from '$lib/api/client';

interface Note {
  id: string;
  bookId: string;
  bookTitle: string;
  type: 'note' | 'highlight' | 'bookmark';
  content: string | null;
  color: string | null;
  positionType: 'audio' | 'ebook';
  positionValue: any;
  createdAt: number;
  updatedAt: number;
}

interface NotesState {
  byBook: Map<string, Note[]>;   // Cached per book
  all: Note[];                    // All notes (for notes page)
  loading: boolean;
}

function createNotesStore() {
  const { subscribe, set, update } = writable<NotesState>({
    byBook: new Map(),
    all: [],
    loading: false,
  });

  return {
    subscribe,

    async loadForBook(bookId: string) {
      update(s => ({ ...s, loading: true }));
      const notes = await api.get<Note[]>(`/notes/${bookId}`);
      update(s => {
        const byBook = new Map(s.byBook);
        byBook.set(bookId, notes);
        return { ...s, byBook, loading: false };
      });
    },

    async loadAll(params?: { search?: string; type?: string }) {
      update(s => ({ ...s, loading: true }));
      const query = new URLSearchParams(params as any).toString();
      const notes = await api.get<Note[]>(`/notes?${query}`);
      update(s => ({ ...s, all: notes, loading: false }));
    },

    // Optimistic create
    async create(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'bookTitle'>) {
      const tempId = `temp-${Date.now()}`;
      const optimistic: Note = {
        ...note,
        id: tempId,
        bookTitle: '',
        createdAt: Date.now() / 1000,
        updatedAt: Date.now() / 1000,
      };

      // Optimistic add
      update(s => {
        const byBook = new Map(s.byBook);
        const bookNotes = byBook.get(note.bookId) || [];
        byBook.set(note.bookId, [...bookNotes, optimistic]);
        return { ...s, byBook };
      });

      try {
        const created = await api.post<Note>('/notes', note);
        // Replace temp with real
        update(s => {
          const byBook = new Map(s.byBook);
          const bookNotes = (byBook.get(note.bookId) || [])
            .map(n => n.id === tempId ? created : n);
          byBook.set(note.bookId, bookNotes);
          return { ...s, byBook };
        });
        return created;
      } catch {
        // Rollback optimistic
        update(s => {
          const byBook = new Map(s.byBook);
          const bookNotes = (byBook.get(note.bookId) || [])
            .filter(n => n.id !== tempId);
          byBook.set(note.bookId, bookNotes);
          return { ...s, byBook };
        });
        throw new Error('Failed to save note');
      }
    },

    async update(noteId: string, bookId: string, data: Partial<Note>) {
      const updated = await api.patch<Note>(`/notes/${noteId}`, data);
      update(s => {
        const byBook = new Map(s.byBook);
        const bookNotes = (byBook.get(bookId) || [])
          .map(n => n.id === noteId ? updated : n);
        byBook.set(bookId, bookNotes);
        return { ...s, byBook };
      });
    },

    async remove(noteId: string, bookId: string) {
      await api.delete(`/notes/${noteId}`);
      update(s => {
        const byBook = new Map(s.byBook);
        const bookNotes = (byBook.get(bookId) || [])
          .filter(n => n.id !== noteId);
        byBook.set(bookId, bookNotes);
        return { ...s, byBook };
      });
    },

    async exportMarkdown(bookId: string) {
      const res = await fetch(`/api/notes/export/${bookId}`, {
        credentials: 'include',
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `notes-${bookId}.md`;
      a.click();
      URL.revokeObjectURL(url);
    },
  };
}

export const notes = createNotesStore();
```

### 4.7 Progress Store

```typescript
// src/lib/stores/progress.ts
import { writable } from 'svelte/store';
import { api } from '$lib/api/client';

interface ProgressState {
  totalKp: number;
  currentTitle: string;
  currentTitleKanji: string;
  nextTitle: string | null;
  nextTitleAt: number | null;
  booksCompleted: number;
  totalHours: number;
  categories: { id: string; name: string; totalKp: number; percentage: number }[];
  loading: boolean;
}

function createProgressStore() {
  const { subscribe, set, update } = writable<ProgressState>({
    totalKp: 0,
    currentTitle: 'Shoshin',
    currentTitleKanji: '初心',
    nextTitle: 'Dokusha',
    nextTitleAt: 500,
    booksCompleted: 0,
    totalHours: 0,
    categories: [],
    loading: false,
  });

  return {
    subscribe,

    async load() {
      update(s => ({ ...s, loading: true }));
      const data = await api.get<any>('/progress');
      set({ ...data, loading: false });
    },

    // Called after KP is recorded — updates local state from response
    applyKpResult(result: {
      totalKp: number;
      titleChanged: boolean;
      newTitle: string | null;
    }) {
      update(s => ({
        ...s,
        totalKp: result.totalKp,
        ...(result.titleChanged && result.newTitle ? {
          currentTitle: result.newTitle,
        } : {}),
      }));
    },
  };
}

export const progress = createProgressStore();
```

### 4.8 Bonsai Store

```typescript
// src/lib/stores/bonsai.ts
import { writable } from 'svelte/store';
import { api } from '$lib/api/client';

interface BonsaiState {
  seed: string;
  stage: number;
  stageName: string;
  branchParams: Record<string, number>;
  totalKp: number;
  loading: boolean;
}

function createBonsaiStore() {
  const { subscribe, set, update } = writable<BonsaiState>({
    seed: '',
    stage: 0,
    stageName: 'Seed',
    branchParams: {},
    totalKp: 0,
    loading: false,
  });

  return {
    subscribe,

    async load() {
      update(s => ({ ...s, loading: true }));
      const data = await api.get<any>('/bonsai');
      set({ ...data, loading: false });
    },
  };
}

export const bonsai = createBonsaiStore();
```

### 4.9 Preferences Store

```typescript
// src/lib/stores/preferences.ts
import { writable } from 'svelte/store';
import { api } from '$lib/api/client';
import { themeId } from './theme';

interface PreferencesState {
  activeTheme: 'sumi' | 'kami' | 'mori';
  playbackSpeed: number;
  readerFontSize: number;
  readerFont: string;
  readerLineHeight: number;
  aiProvider: string | null;
  aiModel: string | null;
  aiEndpoint: string | null;
  aiConfigured: boolean;
  loading: boolean;
}

function createPreferencesStore() {
  const { subscribe, set, update } = writable<PreferencesState>({
    activeTheme: 'sumi',
    playbackSpeed: 1.0,
    readerFontSize: 18,
    readerFont: 'Georgia',
    readerLineHeight: 1.8,
    aiProvider: null,
    aiModel: null,
    aiEndpoint: null,
    aiConfigured: false,
    loading: false,
  });

  return {
    subscribe,

    async load() {
      update(s => ({ ...s, loading: true }));
      const data = await api.get<any>('/preferences');
      set({ ...data, loading: false });

      // Sync theme with theme store
      themeId.setTheme(data.activeTheme);
    },

    async save(changes: Partial<PreferencesState>) {
      // Optimistic update
      update(s => ({ ...s, ...changes }));

      // Sync theme immediately if changed
      if (changes.activeTheme) {
        themeId.setTheme(changes.activeTheme);
      }

      await api.patch('/preferences', changes);
    },
  };
}

export const preferences = createPreferencesStore();
```

### 4.10 Toast Store

```typescript
// src/lib/stores/toast.ts
import { writable } from 'svelte/store';

interface Toast {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
  duration: number;
}

function createToastStore() {
  const { subscribe, update } = writable<Toast[]>([]);

  function add(message: string, type: Toast['type'] = 'info', duration = 4000) {
    const id = `toast-${Date.now()}-${Math.random()}`;
    update(toasts => [...toasts, { id, message, type, duration }]);

    setTimeout(() => {
      update(toasts => toasts.filter(t => t.id !== id));
    }, duration);
  }

  return {
    subscribe,
    info: (msg: string) => add(msg, 'info'),
    success: (msg: string) => add(msg, 'success'),
    error: (msg: string) => add(msg, 'error'),
    warning: (msg: string) => add(msg, 'warning'),
    dismiss: (id: string) => update(ts => ts.filter(t => t.id !== id)),
  };
}

export const toast = createToastStore();
```

---

## 5. Data Flow Patterns

### 5.1 Page Load Pattern

```
Route loads → onMount:
  1. Check if store has data (cache hit)
  2. If not → set loading = true → fetch from API → set data + loading = false
  3. If yes (stale-while-revalidate) → render cached → fetch in background → update
```

```svelte
<script>
  import { onMount } from 'svelte';
  import { library } from '$lib/stores/library';

  onMount(() => {
    if ($library.books.length === 0) {
      library.loadBooks();
    }
  });
</script>

{#if $library.loading && $library.books.length === 0}
  <LoadingSkeleton />
{:else}
  <BookGrid books={$library.books} />
{/if}
```

### 5.2 Optimistic Write Pattern

```
User action:
  1. Update store immediately (optimistic)
  2. Send API request in background
  3. On success → replace optimistic with server response
  4. On failure → rollback store, show error toast
```

Used for: notes creation, preference changes, category overrides.

### 5.3 Real-Time Progress Pattern

```
During reading/listening:
  1. Player/reader tracks time locally
  2. Every 60 seconds → POST /api/progress/kp
  3. Response includes new totals → update progress store
  4. If title changed → show toast
  5. On pause/close → sync progress to ABS
```

---

## 6. Persistence

### localStorage Keys

| Key | Data | Purpose |
|---|---|---|
| `fumiki-theme` | Theme ID string | Instant theme on page load (no flash) |
| `fumiki-player` | `{ bookId, currentTime }` | Resume playback after page refresh |
| `fumiki-library-cache` | Serialized book list | Instant library render before API response |

### Important Rules

- **Never store auth tokens** in localStorage
- **Never store ABS URLs or credentials** in localStorage
- localStorage is a performance cache only, not a source of truth
- All localStorage data can be safely deleted without data loss

---

## 7. Initialization Sequence

On app startup (`+layout.svelte` onMount):

```
1. themeId.init()              // Apply saved theme to DOM immediately
2. auth.checkStatus()          // Check: ABS configured? Session valid?
3. Route decision:
   a. If !authenticated → goto('/auth')  // Login page (adapts to show URL field if needed)
   b. If authenticated:
      i.   preferences.load()   // Load user prefs (may update theme)
      ii.  progress.load()      // Load KP, title, categories
      iii. library.loadLibraries() // Load ABS libraries + books
```

---

*Companion to FUMIKI_ARCHITECTURE.md and FUMIKI_API.md*
