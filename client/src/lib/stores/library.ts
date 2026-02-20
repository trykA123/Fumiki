import { writable, derived } from 'svelte/store';
import { api } from '$lib/api/client';

export interface Book {
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
      try {
        const libs = await api.get<any[]>('/abs/libraries');
        // Filter to book libraries only (exclude podcasts for now in Phase 1)
        const bookLibs = libs.filter((l: any) => l.mediaType === 'book');
        update(s => ({
          ...s,
          libraries: bookLibs,
          activeLibraryId: bookLibs[0]?.id || null,
        }));
        if (bookLibs.length > 0) {
          await this.loadBooks(0, bookLibs[0]?.id);
        }
      } catch (err: any) {
        update(s => ({ ...s, error: err.message }));
      }
    },

    async switchLibrary(libraryId: string) {
      update(s => ({ ...s, activeLibraryId: libraryId, books: [], searchQuery: '' }));
      await this.loadBooks(0, libraryId);
    },

    async loadBooks(page = 0, overrideLibraryId?: string) {
      update(s => ({ ...s, loading: true }));
      try {
        const state = getCurrentState();
        const libraryIdToUse = overrideLibraryId || state.activeLibraryId;

        if (!libraryIdToUse) {
          throw new Error("No active library selected");
        }

        const params = new URLSearchParams({
          page: String(page),
          limit: '50',
          sort: state.sortBy,
        });

        if (state.searchQuery) params.append('search', state.searchQuery);
        if (state.filter !== 'all') params.append('filter', state.filter);

        const result: any = await api.get<any>(
          `/abs/libraries/${libraryIdToUse}/items?${params.toString()}`
        );

        // Normalize data to Fumiki Format
        const parsedBooks: Book[] = result.map((item: any) => ({
          id: item.id,
          title: item.media?.metadata?.title || 'Unknown Title',
          author: item.media?.metadata?.authorName || 'Unknown Author',
          coverUrl: `/api/abs/items/${item.id}/cover`,
          mediaType: item.mediaType === 'book' && item.media?.audioFiles ? 'audiobook' : 'ebook',
          duration: item.media?.duration || null,
          pages: item.media?.metadata?.numPages || null,
          progress: item.userMediaProgress?.progress || 0,
          genres: item.media?.metadata?.genres || [],
          primaryCategory: 'Uncategorized', // Auto-detection logic will be built later
          addedAt: item.addedAt || Date.now()
        }));

        update(s => ({
          ...s,
          books: page === 0 ? parsedBooks : [...s.books, ...parsedBooks],
          total: result.total || parsedBooks.length,
          loading: false,
          error: null,
        }));
      } catch (err: any) {
        update(s => ({ ...s, loading: false, error: err.message }));
      }
    },

    setSearch(query: string) {
      update(s => ({ ...s, searchQuery: query }));
      // Component will manually debounce call loadBooks(0)
    },

    setFilter(filter: LibraryState['filter']) {
      update(s => ({ ...s, filter }));
      this.loadBooks(0);
    },

    setSort(sort: LibraryState['sortBy']) {
      update(s => ({ ...s, sortBy: sort }));
      this.loadBooks(0);
    },
  };

  function getCurrentState(): LibraryState {
    let state: LibraryState;
    subscribe(s => { state = s; })();
    return state!;
  }
}

export const library = createLibraryStore();

export const continueReading = derived(library, $lib =>
  [...$lib.books]
    .filter(b => b.progress > 0 && b.progress < 1)
    .sort((a, b) => b.addedAt - a.addedAt)
    .slice(0, 5)
);
