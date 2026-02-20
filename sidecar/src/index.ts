import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { serveStatic } from 'hono/bun';
import { join } from 'node:path';
import { readFileSync } from 'node:fs';

// Database & Setup
import { runMigrations } from './db/migrations';
import { seedDatabase } from './db/seed';
import { sessionMiddleware, type Env } from './middleware/session';

// Initialize Database on Boot
console.log('--- Starting Fumiki Sidecar ---')
runMigrations();
seedDatabase();

// Setup Hono Application
const app = new Hono<Env>();
app.use('*', logger());
app.use('/api/*', sessionMiddleware);

// API Routes
app.get('/api/health', (c) => {
    return c.json({ data: { status: 'ok' } });
});

// Serve frontend build dynamically
app.use('/*', serveStatic({ root: 'client/build' }));

// SPA fallback for unhandled GUI routes
app.get('*', (c) => {
    if (c.req.path.startsWith('/api/')) {
        return c.notFound();
    }

    try {
        const path = join(import.meta.dir, '../../client/build/index.html');
        const html = readFileSync(path, 'utf-8');
        return c.html(html);
    } catch (err) {
        return c.text('Fumiki Client Build Not Found. Run `bun run build` in client.', 404);
    }
});

const port = parseInt(process.env.PORT || '11111', 10);
console.log(`🚀 Fumiki API serving on http://localhost:${port}`);

export default {
    port,
    fetch: app.fetch
};
