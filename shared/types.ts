// Shared types will go here
export interface APIResponse<T> {
    data?: T;
    error?: string;
    detail?: string;
}

export interface Chapter {
    id: string;
    title: string;
    start: number; // seconds
    end: number;
}

export interface BookItem {
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

export interface BookDetail {
    id: string;
    title: string;
    subtitle: string | null;
    author: string;
    narrator: string | null;
    publisher: string | null;
    publishedYear: string | null;
    description: string | null;
    coverUrl: string;
    genres: string[];
    tags: string[];
    language: string | null;
    isbn: string | null;
    mediaType: 'ebook' | 'audiobook' | 'both';

    // Audiobook specific
    duration: number | null;
    chapters: Chapter[] | null;

    // Ebook specific
    pages: number | null;
    ebookFormat: string | null;

    // Progress from ABS
    progress: number;
    currentTime: number | null;
    isFinished: boolean;

    // Fumiki data
    primaryCategory: string;
    secondaryCategory: string | null;
    totalKp: number;
    noteCount: number;
}
