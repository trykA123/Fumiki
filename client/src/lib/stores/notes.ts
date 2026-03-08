import { writable } from 'svelte/store';
import { api } from '$lib/api/client';
import type { Note } from '@fumiki/shared/types';
import { toast } from '$lib/stores/toast';

interface NotesState {
    // A map storing notes by book ID for quick reader/player access
    bookCache: Record<string, Note[]>;

    // A global list of notes used for the `/notes` browser page
    allNotes: Note[];
    totalNotes: number;

    loading: boolean;
    error: string | null;
}

function createNotesStore() {
    const { subscribe, set, update } = writable<NotesState>({
        bookCache: {},
        allNotes: [],
        totalNotes: 0,
        loading: false,
        error: null
    });

    return {
        subscribe,

        // Browsing All Notes (Pagination + Filters)
        async loadAllNotes(page = 0, limit = 50, filters: { type?: string, search?: string, bookId?: string } = {}) {
            update(s => ({ ...s, loading: true, error: null }));

            const params = new URLSearchParams({
                page: String(page),
                limit: String(limit)
            });
            if (filters.type && filters.type !== 'all') params.append('type', filters.type);
            if (filters.search) params.append('search', filters.search);
            if (filters.bookId) params.append('bookId', filters.bookId);

            try {
                const result = await api.get<{ data: Note[], total: number }>(`/notes?${params.toString()}`);

                update(s => ({
                    ...s,
                    allNotes: page === 0 ? result.data : [...s.allNotes, ...result.data],
                    totalNotes: result.total,
                    loading: false
                }));
            } catch (err: unknown) {
                update(s => ({ ...s, loading: false, error: err instanceof Error ? err.message : String(err) }));
            }
        },

        // Fast local loading for Reader / Player
        async loadBookNotes(bookId: string) {
            update(s => ({ ...s, loading: true, error: null }));
            try {
                const result = await api.get<{ data: Note[] }>(`/notes/${bookId}`);
                update(s => ({
                    ...s,
                    bookCache: { ...s.bookCache, [bookId]: result.data },
                    loading: false
                }));
            } catch (err: unknown) {
                update(s => ({ ...s, loading: false, error: err instanceof Error ? err.message : String(err) }));
            }
        },

        // Optimistic Create
        async createNote(
            bookId: string,
            type: Note['type'],
            positionType: Note['positionType'],
            positionValue: Record<string, unknown>,
            content?: string | null,
            color?: string | null
        ) {
            const tempId = `temp-${Date.now()}`;
            const tempNote: Note = {
                id: tempId,
                bookId,
                type,
                content: content || null,
                color: color || null,
                positionType,
                positionValue,
                createdAt: Math.floor(Date.now() / 1000),
                updatedAt: Math.floor(Date.now() / 1000)
            };

            // Optimistic append
            update(s => {
                const currentBookNotes = s.bookCache[bookId] || [];
                return {
                    ...s,
                    bookCache: {
                        ...s.bookCache,
                        [bookId]: [tempNote, ...currentBookNotes]
                    },
                    allNotes: [tempNote, ...s.allNotes]
                };
            });

            try {
                const result = await api.post<{ data: Note }>('/notes', {
                    bookId, type, positionType, positionValue, content, color
                });

                // Swap temp with real
                update(s => {
                    const currentBookNotes = s.bookCache[bookId] || [];
                    return {
                        ...s,
                        bookCache: {
                            ...s.bookCache,
                            [bookId]: currentBookNotes.map(n => n.id === tempId ? result.data : n)
                        },
                        allNotes: s.allNotes.map(n => n.id === tempId ? result.data : n)
                    };
                });

                return result.data;
            } catch (err: unknown) {
                // Rollback
                update(s => {
                    const currentBookNotes = s.bookCache[bookId] || [];
                    return {
                        ...s,
                        bookCache: {
                            ...s.bookCache,
                            [bookId]: currentBookNotes.filter(n => n.id !== tempId)
                        },
                        allNotes: s.allNotes.filter(n => n.id !== tempId)
                    };
                });
                toast.add('Failed to save note', 'error');
                throw err;
            }
        },

        // Optimistic Update
        async updateNote(id: string, bookId: string, payload: { content?: string | null, color?: string | null }) {
            // Snapshot for rollback
            let oldNote: Note | undefined;

            update(s => {
                const currentBookNotes = s.bookCache[bookId] || [];
                oldNote = currentBookNotes.find(n => n.id === id) || s.allNotes.find(n => n.id === id);

                const applyUpdate = (n: Note) => n.id === id ? { ...n, ...payload, updatedAt: Math.floor(Date.now() / 1000) } : n;

                return {
                    ...s,
                    bookCache: {
                        ...s.bookCache,
                        [bookId]: currentBookNotes.map(applyUpdate)
                    },
                    allNotes: s.allNotes.map(applyUpdate)
                };
            });

            try {
                const result = await api.patch<{ data: Note }>(`/notes/${id}`, payload);
                // Sync exact response
                update(s => {
                    const applyUpdateExact = (n: Note) => n.id === id ? result.data : n;
                    return {
                        ...s,
                        bookCache: {
                            ...s.bookCache,
                            [bookId]: (s.bookCache[bookId] || []).map(applyUpdateExact)
                        },
                        allNotes: s.allNotes.map(applyUpdateExact)
                    };
                });
            } catch (err: unknown) {
                // Rollback
                if (oldNote) {
                    update(s => {
                        const rollback = (n: Note) => n.id === id ? oldNote! : n;
                        return {
                            ...s,
                            bookCache: {
                                ...s.bookCache,
                                [bookId]: (s.bookCache[bookId] || []).map(rollback)
                            },
                            allNotes: s.allNotes.map(rollback)
                        };
                    });
                }
                toast.add('Failed to update note', 'error');
                throw err;
            }
        },

        // Optimistic Delete
        async deleteNote(id: string, bookId: string) {
            // Snapshot
            let oldNote: Note | undefined;

            update(s => {
                const currentBookNotes = s.bookCache[bookId] || [];
                oldNote = currentBookNotes.find(n => n.id === id) || s.allNotes.find(n => n.id === id);

                return {
                    ...s,
                    bookCache: {
                        ...s.bookCache,
                        [bookId]: currentBookNotes.filter(n => n.id !== id)
                    },
                    allNotes: s.allNotes.filter(n => n.id !== id)
                };
            });

            try {
                await api.delete(`/notes/${id}`);
            } catch (err: unknown) {
                // Rollback
                if (oldNote) {
                    update(s => {
                        return {
                            ...s,
                            bookCache: {
                                ...s.bookCache,
                                [bookId]: [oldNote!, ...(s.bookCache[bookId] || [])]
                            },
                            allNotes: [oldNote!, ...s.allNotes]
                        };
                    });
                }
                toast.add('Failed to delete note', 'error');
                throw err;
            }
        },

        // Export Trigger
        exportMarkdown(bookId: string) {
            const url = `/api/notes/export/${bookId}`;
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.target = '_blank';
            anchor.download = 'export.md';
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
        }
    };
}

export const notesStore = createNotesStore();
