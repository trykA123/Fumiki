import { Hono } from 'hono';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import { db } from '../db/db';
import { ABSClient } from '../services/abs-client';
import type { Env } from '../middleware/session';

export const authRoutes = new Hono<Env>();

// Check current config & auth status
authRoutes.get('/status', (c) => {
    const user = c.get('user');

    const config = db.query('SELECT value FROM server_config WHERE key = ?').get('ABS_URL') as { value: string } | undefined;

    return c.json({
        absConfigured: !!config,
        absHost: config ? config.value : null,
        authenticated: !!user,
        username: user ? user.username : null
    });
});

// Perform ABS login
authRoutes.post('/login', async (c) => {
    try {
        const { absUrl, username, password } = await c.req.json();

        if (!username || !password) {
            return c.json({ error: 'Username and password required' }, 400);
        }

        // Determine ABS URL (from existing config, or the passed in value)
        let urlToUse: string | null = null;
        const existingConfig = db.query('SELECT value FROM server_config WHERE key = ?').get('ABS_URL') as { value: string } | undefined;

        if (existingConfig) {
            urlToUse = existingConfig.value;
        } else if (absUrl) {
            urlToUse = absUrl;
        } else {
            return c.json({ error: 'AudioBookShelf URL is required for initial setup' }, 400);
        }

        // Try logging in via the ABS Client
        const client = new ABSClient(urlToUse as string);
        const absUser = await client.login(username, password);

        // Login successful!
        const applySession = db.transaction(() => {
            // 1. Save ABS_URL if it was newly provided
            if (!existingConfig && absUrl) {
                db.query('INSERT INTO server_config (key, value) VALUES (?, ?)').run('ABS_URL', absUrl.replace(/\/$/, ''));
            }

            // 2. Upsert connection record
            db.prepare(`
        INSERT INTO connections (id, abs_user_id, username, token, created_at, last_sync_at) 
        VALUES (?, ?, ?, ?, unixepoch(), unixepoch())
        ON CONFLICT(abs_user_id) DO UPDATE SET 
          username=excluded.username, 
          token=excluded.token, 
          last_sync_at=excluded.last_sync_at
      `).run(
                crypto.randomUUID(), // will be ignored on conflict
                absUser.id,
                absUser.username,
                absUser.token
            );

            const connection = db.query('SELECT id FROM connections WHERE abs_user_id = ?').get(absUser.id) as { id: string };

            // 3. Create Session Record (30 days)
            const sessionToken = crypto.randomUUID().replace(/-/g, '');
            const expiresAt = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60);

            db.query('INSERT INTO sessions (token, connection_id, expires_at) VALUES (?, ?, ?)').run(
                sessionToken,
                connection.id,
                expiresAt
            );

            return sessionToken;
        });

        const token = applySession();

        // Set secure HttpOnly cookie
        setCookie(c, 'fumiki_session', token, {
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            sameSite: 'Lax',
            maxAge: 30 * 24 * 60 * 60 // 30 days
        });

        return c.json({ success: true, username: absUser.username });

    } catch (err: any) {
        return c.json({ error: err.message || 'Login failed' }, 401);
    }
});

authRoutes.post('/logout', (c) => {
    const token = getCookie(c, 'fumiki_session');
    if (token) {
        try {
            db.query('DELETE FROM sessions WHERE token = ?').run(token);
        } catch (e) {
            // Ignore DB errors on logout
        }
    }

    deleteCookie(c, 'fumiki_session', { path: '/' });
    return c.json({ success: true });
});
