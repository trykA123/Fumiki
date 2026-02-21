import { createMiddleware } from 'hono/factory';
import { getCookie } from 'hono/cookie';
import { db } from '../db/db';

export type UserContext = {
    id: string;          // Internal connection id
    abs_user_id: string; // ABS user id
    username: string;    // ABS username
    token: string;       // ABS auth token
};

export type Env = {
    Variables: {
        user: UserContext | null;
    }
}

export const sessionMiddleware = createMiddleware<Env>(async (c, next) => {
    const token = getCookie(c, 'fumiki_session');
    let user: UserContext | null = null;

    const config = db.query('SELECT value FROM server_config WHERE key = ?').get('ABS_URL') as { value: string } | undefined;
    const absUrl = process.env.ABS_URL || (config?.value);

    if (process.env.ABS_TOKEN && absUrl) {
        user = {
            id: 'env-override',
            abs_user_id: 'api-user',
            username: 'api-user',
            token: process.env.ABS_TOKEN
        };
    } else if (token) {
        const row = db.query(`
            SELECT c.id, c.abs_user_id, c.username, c.token
            FROM sessions s
            JOIN connections c ON s.connection_id = c.id
            WHERE s.token = ? AND s.expires_at > unixepoch()
        `).get(token) as UserContext | undefined;

        if (row) {
            user = row;
        }
    }

    c.set('user', user);

    // Guard API routes (except auth/login and auth/status for bootstrap)
    const isAuthRoute = c.req.path === '/api/auth/login' || c.req.path === '/api/auth/status';
    if (!isAuthRoute && !user && c.req.path.startsWith('/api/')) {
        return c.json({ error: 'Unauthorized' }, 401);
    }

    await next();
});
