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

export interface Note {
    id: string;
    bookId: string;
    bookTitle?: string;
    type: 'note' | 'highlight' | 'bookmark';
    content: string | null;
    color: string | null;
    positionType: 'audio' | 'ebook';
    positionValue: Record<string, any>;
    createdAt: number;
    updatedAt: number;
}

// ABS error response
export interface ABSError {
    error: string;
}

// ABS library (from GET /api/libraries)
export interface ABSLibrary {
    id: string;
    name: string;
    mediaType: 'book' | 'podcast';
    folders: { id: string; fullPath: string }[];
}

// ABS libraries list response
export interface ABSLibrariesResponse {
    libraries: ABSLibrary[];
}

// ABS item metadata
export interface ABSItemMetadata {
    title: string;
    subtitle: string | null;
    authorName: string;
    narratorName: string | null;
    publisher: string | null;
    publishedYear: string | null;
    description: string | null;
    genres: string[];
    language: string | null;
    isbn: string | null;
    numPages: number | null;
}

// ABS item media
export interface ABSItemMedia {
    duration: number;
    ebookFormat: string | null;
    tags: string[];
    chapters: { id: string; start: number; end: number; title: string }[];
    audioFiles: { ino: string }[];
    metadata: ABSItemMetadata;
}

// ABS user progress
export interface ABSUserProgress {
    progress: number;
    currentTime: number;
    isFinished: boolean;
}

// ABS item (from GET /api/items/:id?expanded=1)
export interface ABSItem {
    id: string;
    mediaType: 'book' | 'podcast';
    addedAt: number;
    media: ABSItemMedia;
    userMediaProgress: ABSUserProgress | null;
}

// ABS items list response (from GET /api/libraries/:id/items)
export interface ABSItemsResponse {
    results: ABSItem[];
    total: number;
    page: number;
    limit: number;
}

// ABS login response (from POST /api/login)
export interface ABSLoginResponse {
    user: {
        id: string;
        username: string;
        token: string;
        type: string;
    };
}

// ABS progress update payload (for PATCH /api/me/progress/:id)
export interface ABSProgressPayload {
    progress: number;
    currentTime?: number;
    isFinished?: boolean;
}

// Raw SQLite note row (from notes table JOIN book_cache)
export interface NoteRow {
    id: string;
    connection_id: string;
    book_id: string;
    type: string;
    content: string;
    color: string | null;
    position_type: string;
    position_value: string; // JSON string
    created_at: number;
    updated_at: number;
    bookTitle: string | null;
    bookAuthor: string | null;
}

// Raw SQLite AI summary row
export interface AISummaryRow {
    id: string;
    book_id: string;
    provider: string;
    prompt_type: string;
    content: string;
    created_at: number;
}
