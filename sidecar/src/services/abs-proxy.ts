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
                const errData: any = await res.json();
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
        const data: any = await res.json();
        return data.libraries || [];
    }

    async getItems(libraryId: string, queryParams: string = '') {
        const res = await this.request(`/api/libraries/${libraryId}/items?${queryParams}`);
        const data: any = await res.json();
        return data || { results: [], total: 0 };
    }

    async getItem(itemId: string, expanded: number = 1) {
        const res = await this.request(`/api/items/${itemId}?expanded=${expanded}`);
        const data: any = await res.json();
        return data; // Needs downstream sanitization
    }

    // Streams pass the raw response back instead of parsing JSON
    async getCoverStream(itemId: string) {
        return this.request(`/api/items/${itemId}/cover`);
    }

    async getAudioStream(itemId: string, range?: string | null) {
        // We generally proxy to the direct ABS streaming endpoint (often /api/items/{id}/play)
        // But ABS requires requesting the specific file for ranges. 
        // A generic proxy to the ABS stream controller:
        const headers: Record<string, string> = {};
        if (range) headers['Range'] = range;

        // We hit the raw playback endpoint that ABS Native uses.
        // It's usually /api/items/{item_id}/play or /api/items/{item_id}/file/{file_id}
        // Assuming hitting the primary stream endpoint for the item:
        return this.request(`/api/items/${itemId}/play`, { headers });
    }

    async getMediaFile(itemId: string) {
        // Download endpoint for epub/ebook
        return this.request(`/api/items/${itemId}/download`);
    }

    async updateProgress(itemId: string, payload: any) {
        const res = await this.request(`/api/me/progress/${itemId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data: any = await res.json();
        return data;
    }
}
