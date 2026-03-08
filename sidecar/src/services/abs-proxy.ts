import type { ABSError, ABSLibrariesResponse, ABSItemsResponse, ABSItem, ABSProgressPayload } from '../../../shared/types';

export class ABSProxy {
    private baseUrl: string;
    private token: string;

    constructor(baseUrl: string, token: string) {
        this.baseUrl = baseUrl.replace(/\/$/, '');
        this.token = token;
    }

    private async request(endpoint: string, options: RequestInit = {}) {
        const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

        const headers = new Headers(options.headers || {});
        headers.set('Authorization', `Bearer ${this.token}`);

        const res = await fetch(url, {
            ...options,
            headers
        });

        if (!res.ok && res.status !== 206) {
            let errorMsg = 'Failed to fetch from AudioBookShelf';
            try {
                const errData = await res.json() as ABSError;
                errorMsg = errData.error || errorMsg;
            } catch (e) {
                // Ignore parsing errors for error messages
            }
            throw new Error(errorMsg);
        }

        return res;
    }

    async getLibraries() {
        const res = await this.request('/api/libraries');
        const data = await res.json() as ABSLibrariesResponse;
        return data.libraries || [];
    }

    async getItems(libraryId: string, queryParams: string = '') {
        const res = await this.request(`/api/libraries/${libraryId}/items?${queryParams}`);
        const data = await res.json() as ABSItemsResponse;
        return data || { results: [], total: 0 };
    }

    async getItem(itemId: string, expanded: number = 1) {
        const res = await this.request(`/api/items/${itemId}?expanded=${expanded}`);
        const data = await res.json() as ABSItem;
        return data; // Needs downstream sanitization
    }

    // Streams pass the raw response back instead of parsing JSON
    async getCoverStream(itemId: string) {
        return this.request(`/api/items/${itemId}/cover`);
    }

    async getAudioStream(itemId: string, range?: string | null) {
        // First get the item to find its primary audio file ID
        const itemRes = await this.request(`/api/items/${itemId}`);
        const item = await itemRes.json() as ABSItem;
        const fileId = item.media?.audioFiles?.[0]?.ino;

        if (!fileId) throw new Error("No audio file found for streaming");

        const headers: Record<string, string> = {};
        if (range) headers['Range'] = range;

        // Progressive stream the specific file ID which natively supports `<audio>` playback.
        return this.request(`/api/items/${itemId}/file/${fileId}`, { headers });
    }

    async getMediaFile(itemId: string) {
        // Download endpoint for epub/ebook
        return this.request(`/api/items/${itemId}/download`);
    }

    async updateProgress(itemId: string, payload: ABSProgressPayload) {
        const res = await this.request(`/api/me/progress/${itemId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const text = await res.text();
        try {
            return text ? JSON.parse(text) : {};
        } catch (err: unknown) {
            return {};
        }
    }
}
