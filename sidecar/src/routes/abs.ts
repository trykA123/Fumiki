import { Hono } from 'hono';
import { db } from '../db/db';
import type { Env } from '../middleware/session';
import { ABSProxy } from '../services/abs-proxy';

export const absRoutes = new Hono<Env>();

absRoutes.get('/libraries', async (c) => {
    try {
        const user = c.get('user');
        if (!user) return c.json({ error: 'Unauthorized' }, 401);

        const config = db.query('SELECT value FROM server_config WHERE key = ?').get('ABS_URL') as { value: string } | undefined;
        if (!config) return c.json({ error: 'ABS_URL not configured' }, 400);

        const proxy = new ABSProxy(config.value, user.token);
        const data = await proxy.getLibraries();
        return c.json({ data });

    } catch (err: any) {
        return c.json({ error: err.message || 'Failed to fetch libraries' }, 502);
    }
});

absRoutes.get('/libraries/:id/items', async (c) => {
    try {
        const user = c.get('user');
        if (!user) return c.json({ error: 'Unauthorized' }, 401);

        const config = db.query('SELECT value FROM server_config WHERE key = ?').get('ABS_URL') as { value: string } | undefined;
        if (!config) return c.json({ error: 'ABS_URL not configured' }, 400);

        const id = c.req.param('id');
        const limit = c.req.query('limit') || '50';
        const page = c.req.query('page') || '0';
        const sort = c.req.query('sort') || 'media.metadata.title';
        const desc = c.req.query('desc') || '0';
        const filter = c.req.query('filter');

        const proxy = new ABSProxy(config.value, user.token);
        const SearchQuery = new URLSearchParams({
            limit,
            page,
            sort,
            desc
        });
        if (filter) SearchQuery.append('filter', filter);

        const data = await proxy.getItems(id, SearchQuery.toString());
        return c.json({ data: data.results, total: data.total });

    } catch (err: any) {
        return c.json({ error: err.message || 'Failed to fetch items' }, 502);
    }
});

absRoutes.get('/items/:id', async (c) => {
    try {
        const user = c.get('user');
        if (!user) return c.json({ error: 'Unauthorized' }, 401);

        const config = db.query('SELECT value FROM server_config WHERE key = ?').get('ABS_URL') as { value: string } | undefined;
        if (!config) return c.json({ error: 'ABS_URL not configured' }, 400);

        const id = c.req.param('id');
        const proxy = new ABSProxy(config.value, user.token);
        const data = await proxy.getItem(id);

        // Cache the metadata lookup asynchronously
        try {
            db.prepare(`
                INSERT INTO book_cache (id, title, author, cover_url, type, progress) 
                VALUES (?, ?, ?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET 
                    title=excluded.title, author=excluded.author, 
                    cover_url=excluded.cover_url, progress=excluded.progress
            `).run(
                data.id,
                data.media.metadata.title,
                data.media.metadata.authorName,
                `/api/abs/items/${data.id}/cover`,
                data.mediaType === 'book' && data.media.audioFiles ? 'audiobook' : 'ebook',
                data.userMediaProgress ? data.userMediaProgress.progress : 0
            );
        } catch (e) {
            console.error('Failed to cache book metadata', e);
        }

        return c.json({ data });

    } catch (err: any) {
        return c.json({ error: err.message || 'Failed to fetch item' }, 502);
    }
});

absRoutes.get('/items/:id/cover', async (c) => {
    try {
        const user = c.get('user');
        if (!user) return c.json({ error: 'Unauthorized' }, 401);

        const config = db.query('SELECT value FROM server_config WHERE key = ?').get('ABS_URL') as { value: string } | undefined;
        if (!config) return c.json({ error: 'ABS_URL not configured' }, 400);

        const id = c.req.param('id');
        const proxy = new ABSProxy(config.value, user.token);

        const response = await proxy.getCoverStream(id);
        const buffer = await response.arrayBuffer();

        c.header('Content-Type', response.headers.get('Content-Type') || 'image/jpeg');
        c.header('Cache-Control', 'public, max-age=86400'); // 24 hours
        return c.body(buffer);

    } catch (err: any) {
        return c.json({ error: err.message || 'Failed to fetch cover stream' }, 502);
    }
});

absRoutes.get('/items/:id/stream', async (c) => {
    try {
        const user = c.get('user');
        if (!user) return c.json({ error: 'Unauthorized' }, 401);

        const config = db.query('SELECT value FROM server_config WHERE key = ?').get('ABS_URL') as { value: string } | undefined;
        if (!config) return c.json({ error: 'ABS_URL not configured' }, 400);

        const id = c.req.param('id');
        const range = c.req.header('Range');

        const proxy = new ABSProxy(config.value, user.token);
        const response = await proxy.getAudioStream(id, range);

        // Pass through essential streaming headers
        const headersToKeep = ['Content-Type', 'Content-Length', 'Content-Range', 'Accept-Ranges', 'Last-Modified'];
        headersToKeep.forEach(header => {
            const val = response.headers.get(header);
            if (val) c.header(header, val);
        });

        c.status(response.status as any);
        return c.body(response.body as any);

    } catch (err: any) {
        return c.json({ error: err.message || 'Failed to proxy audio stream' }, 502);
    }
});

absRoutes.get('/items/:id/ebook', async (c) => {
    try {
        const user = c.get('user');
        if (!user) return c.json({ error: 'Unauthorized' }, 401);

        const config = db.query('SELECT value FROM server_config WHERE key = ?').get('ABS_URL') as { value: string } | undefined;
        if (!config) return c.json({ error: 'ABS_URL not configured' }, 400);

        const id = c.req.param('id');

        const proxy = new ABSProxy(config.value, user.token);
        const response = await proxy.getMediaFile(id);

        c.header('Content-Type', response.headers.get('Content-Type') || 'application/epub+zip');
        c.header('Content-Disposition', response.headers.get('Content-Disposition') || `attachment; filename="book.epub"`);

        const buffer = await response.arrayBuffer();
        return c.body(buffer);

    } catch (err: any) {
        return c.json({ error: err.message || 'Failed to proxy ebook file' }, 502);
    }
});

absRoutes.patch('/items/:id/progress', async (c) => {
    try {
        const user = c.get('user');
        if (!user) return c.json({ error: 'Unauthorized' }, 401);

        const config = db.query('SELECT value FROM server_config WHERE key = ?').get('ABS_URL') as { value: string } | undefined;
        if (!config) return c.json({ error: 'ABS_URL not configured' }, 400);

        const id = c.req.param('id');
        const body = await c.req.json();

        const proxy = new ABSProxy(config.value, user.token);
        const data = await proxy.updateProgress(id, body);

        // Asynchronously update the local cache
        if (body.progress !== undefined) {
            try {
                db.prepare('UPDATE book_cache SET progress = ? WHERE id = ?').run(body.progress, id);
            } catch (e) {
                // ignore
            }
        }

        return c.json({ data });

    } catch (err: any) {
        return c.json({ error: err.message || 'Failed to sync progress' }, 502);
    }
});
