import { writable } from 'svelte/store';

export type AuthState = {
    initialized: boolean;
    isAuthenticated: boolean;
    absConfigured: boolean;
    absHost: string | null;
    username: string | null;
    error: string | null;
    loading: boolean;
};

const initialState: AuthState = {
    initialized: false,
    isAuthenticated: false,
    absConfigured: false,
    absHost: null,
    username: null,
    error: null,
    loading: true
};

function createAuthStore() {
    const { subscribe, set, update } = writable<AuthState>(initialState);

    return {
        subscribe,

        async checkStatus() {
            update(s => ({ ...s, loading: true, error: null }));
            try {
                const res = await fetch('/api/auth/status');
                const data = await res.json();

                update(s => ({
                    ...s,
                    initialized: true,
                    isAuthenticated: data.authenticated,
                    absConfigured: data.absConfigured,
                    absHost: data.absHost,
                    username: data.username,
                    loading: false
                }));
            } catch (err) {
                update(s => ({ ...s, initialized: true, error: 'Could not connect to Hono backend', loading: false }));
            }
        },

        async login(username: string, password: string, absUrl?: string) {
            update(s => ({ ...s, loading: true, error: null }));
            try {
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password, absUrl })
                });

                const data = await res.json();

                if (!res.ok) {
                    update(s => ({ ...s, error: data.error || 'Login failed', loading: false }));
                    return false;
                }

                await this.checkStatus();
                return true;
            } catch (err) {
                update(s => ({ ...s, error: 'Network error', loading: false }));
                return false;
            }
        },

        async logout() {
            update(s => ({ ...s, loading: true }));
            try {
                await fetch('/api/auth/logout', { method: 'POST' });
            } catch (e) {
                // ignore
            }
            set({ ...initialState, initialized: true, loading: false });
        }
    };
}

export const auth = createAuthStore();
