import { Hono } from 'hono';
import { db } from '../db/db';
import type { Env } from '../middleware/session';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { createProvider } from '../services/ai/provider';
import type { AIProviderConfig } from '../services/ai/provider';
import type { AISummaryRow, ABSItem } from '../../../shared/types';

export const summaryRoutes = new Hono<Env>();

const generateSchema = z.object({
    bookId: z.string(),
    promptType: z.enum(['character', 'plot', 'thematic']),
    forceRefresh: z.boolean().optional().default(false)
});

// Settings Schema
const settingsSchema = z.object({
    provider: z.enum(['ollama', 'openai', 'anthropic']),
    baseUrl: z.string().optional(),
    apiKey: z.string().optional(),
    model: z.string()
});

/**
 * GET /api/summaries/settings
 * Retrieves the currently configured AI settings (excluding API keys).
 */
summaryRoutes.get('/settings', async (c) => {
    try {
        const user = c.get('user');
        if (!user) return c.json({ error: 'Unauthorized' }, 401);

        const configRow = db.query('SELECT value FROM server_config WHERE key = ?').get('AI_SETTINGS') as { value: string } | undefined;
        let settings: AIProviderConfig = { provider: 'ollama', model: 'llama3' };

        if (configRow) {
            settings = JSON.parse(configRow.value);
        }

        // Strip API key for client safety
        const safeSettings = { ...settings };
        if (safeSettings.apiKey) {
            safeSettings.apiKey = '********';
        }

        return c.json({ data: safeSettings });
    } catch (err: unknown) {
        return c.json({ error: err instanceof Error ? err.message : 'Internal server error' }, 500);
    }
});

/**
 * POST /api/summaries/settings
 * Saves the AI provider settings.
 */
summaryRoutes.post('/settings', zValidator('json', settingsSchema), async (c) => {
    try {
        const user = c.get('user');
        if (!user) return c.json({ error: 'Unauthorized' }, 401);

        const body = c.req.valid('json');

        // If API key is masked, preserve the existing one
        if (body.apiKey === '********') {
            const existingRow = db.query('SELECT value FROM server_config WHERE key = ?').get('AI_SETTINGS') as { value: string } | undefined;
            if (existingRow) {
                const existing = JSON.parse(existingRow.value);
                body.apiKey = existing.apiKey;
            } else {
                delete body.apiKey;
            }
        }

        db.prepare(`
            INSERT INTO server_config (key, value, updated_at) 
            VALUES (?, ?, unixepoch())
            ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
        `).run('AI_SETTINGS', JSON.stringify(body));

        // Return stripped
        const safeSettings = { ...body };
        if (safeSettings.apiKey) safeSettings.apiKey = '********';

        return c.json({ data: safeSettings });
    } catch (err: unknown) {
        return c.json({ error: err instanceof Error ? err.message : 'Internal server error' }, 500);
    }
});

/**
 * POST /api/summaries/generate
 * Generates or fetches a cached AI summary for a book.
 */
summaryRoutes.post('/generate', zValidator('json', generateSchema), async (c) => {
    try {
        const user = c.get('user');
        if (!user) return c.json({ error: 'Unauthorized' }, 401);

        const { bookId, promptType, forceRefresh } = c.req.valid('json');

        // Check Cache unless forced
        if (!forceRefresh) {
            const cached = db.query(`
                SELECT * FROM ai_summaries 
                WHERE book_id = ? AND prompt_type = ? 
                ORDER BY created_at DESC LIMIT 1
            `).get(bookId, promptType) as AISummaryRow | null;

            if (cached) {
                return c.json({
                    data: {
                        id: cached.id,
                        bookId: cached.book_id,
                        provider: cached.provider,
                        promptType: cached.prompt_type,
                        content: cached.content,
                        createdAt: cached.created_at,
                        cached: true
                    }
                });
            }
        }

        // Get AI settings
        const configRow = db.query('SELECT value FROM server_config WHERE key = ?').get('AI_SETTINGS') as { value: string } | undefined;
        if (!configRow) {
            return c.json({ error: 'AI provider not configured. Please set up AI settings first.' }, 400);
        }

        const config: AIProviderConfig = JSON.parse(configRow.value);
        const provider = createProvider(config);

        // Fetch book context from ABS proxy. This could be long.
        // We'll proxy through the same sidecar API URL or fetch directly from ABS
        const absUrlConfig = db.query('SELECT value FROM server_config WHERE key = ?').get('ABS_URL') as { value: string } | undefined;
        const absUrl = process.env.ABS_URL || absUrlConfig?.value;
        if (!absUrl) return c.json({ error: 'ABS connection not found' }, 500);

        const absRes = await fetch(`${absUrl}/api/items/${bookId}?expanded=1`, {
            headers: { 'Authorization': `Bearer ${user.token}` }
        });

        if (!absRes.ok) return c.json({ error: 'Failed to fetch book metadata' }, 500);
        const bookData = await absRes.json() as ABSItem;

        // Assemble context. We pass the title, author, description, genres.
        const contextText = `
Title: ${bookData.media?.metadata?.title || 'Unknown title'}
Author: ${bookData.media?.metadata?.authorName || 'Unknown author'}
Description: ${bookData.media?.metadata?.description || 'N/A'}
Genres: ${bookData.media?.metadata?.genres?.join(', ') || 'N/A'}
        `.trim();

        // Generate response
        const generatedText = await provider.generateSummary(contextText, promptType);

        // Save to DB
        const stmt = db.prepare(`
            INSERT INTO ai_summaries (book_id, provider, prompt_type, content)
            VALUES (?, ?, ?, ?)
            RETURNING *
        `);

        const result = stmt.get(bookId, config.provider, promptType, generatedText) as AISummaryRow;

        return c.json({
            data: {
                id: result.id,
                bookId: result.book_id,
                provider: result.provider,
                promptType: result.prompt_type,
                content: result.content,
                createdAt: result.created_at,
                cached: false
            }
        });

    } catch (err: unknown) {
        return c.json({ error: err instanceof Error ? err.message : 'Failed to generate summary' }, 500);
    }
});
