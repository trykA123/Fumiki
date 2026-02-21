import { writable } from 'svelte/store';
import { api } from '../api/client';
import type { BookDetail } from '../../../../shared/types';

interface BookState {
    data: BookDetail | null;
    loading: boolean;
    error: string | null;
}

function createBookStore() {
    const { subscribe, set, update } = writable<BookState>({
        data: null,
        loading: false,
        error: null
    });

    return {
        subscribe,

        async load(id: string) {
            update(s => ({ ...s, loading: true, error: null, data: s.data?.id === id ? s.data : null }));

            try {
                const detail = await api.get<BookDetail>(`/abs/items/${id}`);
                update(s => ({ ...s, data: detail, loading: false }));
            } catch (err: any) {
                update(s => ({ ...s, error: err.message || 'Failed to load book', loading: false }));
            }
        },

        clear() {
            set({ data: null, loading: false, error: null });
        }
    };
}

export const book = createBookStore();
