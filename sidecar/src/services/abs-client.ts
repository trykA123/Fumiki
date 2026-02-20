export class ABSClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        // Ensure no trailing slash
        this.baseUrl = baseUrl.replace(/\/$/, '');
    }

    /**
     * Attempt to login to the AudioBookShelf instance.
     * Returns user details and token on success.
     * Throws an error on failure.
     */
    async login(username: string, password: string): Promise<{ id: string, username: string, token: string }> {
        try {
            const res = await fetch(`${this.baseUrl}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    throw new Error('Invalid username or password');
                }
                throw new Error(`ABS Server returned ${res.status}`);
            }

            const data = await res.json() as any;

            // ABS typically returns { user: { id, username, token, type, ... } }
            if (!data.user || !data.user.token) {
                throw new Error('Invalid response from ABS server');
            }

            return {
                id: data.user.id,
                username: data.user.username,
                token: data.user.token
            };

        } catch (err: any) {
            if (err.name === 'TypeError' || err.message.includes('fetch')) {
                throw new Error(`Could not connect to server at ${this.baseUrl}`);
            }
            throw err;
        }
    }
}
