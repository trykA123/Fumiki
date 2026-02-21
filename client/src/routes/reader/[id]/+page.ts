import { book } from '$lib/stores/book';
import type { PageLoad } from './$types';
import { get } from 'svelte/store';

export const load: PageLoad = async ({ params }) => {
    // If the book isn't loaded in the store yet, fetch it so we have the title/metadata
    const currentBook = get(book).data;
    if (!currentBook || currentBook.id !== params.id) {
        await book.load(params.id);
    }

    return {
        id: params.id
    };
};
