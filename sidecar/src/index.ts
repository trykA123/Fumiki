import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { serveStatic } from 'hono/bun';

const app = new Hono();

app.use('*', logger());

app.get('/api/health', (c) => {
    return c.json({ data: { status: 'ok' } });
});

import { join } from 'node:path';
import { readFileSync } from 'node:fs';

// Serve defined static files
app.use('/*', serveStatic({ root: '../client/build' }));

// SPA fallback for all other routes that aren't API
app.get('*', (c) => {
    if (c.req.path.startsWith('/api/')) {
        return c.notFound();
    }

    try {
        const html = readFileSync(join(process.cwd(), '../client/build/index.html'), 'utf-8');
        return c.html(html);
    } catch (err) {
        return c.text('Fumiki Client Build Not Found', 404);
    }
});

const port = parseInt(process.env.PORT || '11111', 10);

console.log(`Fumiki sidecar running on port ${port}`);

export default {
    port,
    fetch: app.fetch
};
