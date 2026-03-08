import { Hono } from 'hono';
import { db } from '../db/db';
import type { Env } from '../middleware/session';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import type { NoteRow } from '../../../shared/types';

export const notesRoutes = new Hono<Env>();

// Zod schemas for validation
const createNoteSchema = z.object({
    bookId: z.string(),
    type: z.enum(['note', 'highlight', 'bookmark']),
    content: z.string().nullable().optional(),
    color: z.string().nullable().optional(),
    positionType: z.enum(['audio', 'ebook']),
    positionValue: z.record(z.string(), z.any())
});

const updateNoteSchema = z.object({
    content: z.string().nullable().optional(),
    color: z.string().nullable().optional()
});

/**
 * GET /api/notes/export/:bookId
 * Export all notes for a specific book as a Markdown file.
 * Must route before /:bookId to avoid path collisions.
 */
notesRoutes.get('/export/:bookId', async (c) => {
    try {
        const user = c.get('user');
        if (!user) return c.json({ error: 'Unauthorized' }, 401);

        const bookId = c.req.param('bookId');

        // Get notes and book title
        const notes = db.query(`
            SELECT n.*, b.title as bookTitle, b.author as bookAuthor
            FROM notes n 
            LEFT JOIN book_cache b ON n.book_id = b.id 
            WHERE n.connection_id = ? AND n.book_id = ?
            ORDER BY n.created_at ASC
        `).all(user.id, bookId) as NoteRow[];

        if (!notes || notes.length === 0) {
            return c.json({ error: 'No notes found to export' }, 404);
        }

        const bookTitle = notes[0].bookTitle || 'Unknown Book';
        const bookAuthor = notes[0].bookAuthor || 'Unknown Author';

        // Generate Markdown
        let md = `# Notes from ${bookTitle}\n*By ${bookAuthor}*\n\n---\n\n`;

        for (const note of notes) {
            const pos = JSON.parse(note.position_value);

            // Format position header based on media type
            if (note.position_type === 'audio') {
                const chapter = pos.chapterTitle || 'Unknown Chapter';
                const timeStr = new Date(pos.seconds * 1000).toISOString().substring(11, 19);
                md += `### ${chapter} @ ${timeStr}\n\n`;
            } else if (note.position_type === 'ebook') {
                const chapter = pos.chapter || 'Unknown Section';
                md += `### ${chapter}\n\n`;
            }

            // Excerpt (Highlight)
            if (note.type === 'highlight' && pos.excerpt) {
                md += `> ${pos.excerpt.replace(/\n/g, '\n> ')}\n\n`;
            }

            // User Note Content
            if (note.content) {
                md += `${note.content}\n\n`;
            }

            if (note.type === 'bookmark' && !note.content) {
                md += `*Bookmark*\n\n`;
            }
        }

        const filename = `${bookTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_notes.md`;

        // Setting appropriate headers for file download
        c.header('Content-Type', 'text/markdown');
        c.header('Content-Disposition', `attachment; filename="${filename}"`);

        return c.body(md);
    } catch (err: unknown) {
        return c.json({ error: err instanceof Error ? err.message : 'Failed to export notes' }, 500);
    }
});

/**
 * GET /api/notes
 * Paginated list of notes, supports filtering by bookId, type, and search queries.
 */
notesRoutes.get('/', async (c) => {
    try {
        const user = c.get('user');
        if (!user) return c.json({ error: 'Unauthorized' }, 401);

        const bookId = c.req.query('bookId');
        const type = c.req.query('type');
        const search = c.req.query('search');
        const limit = parseInt(c.req.query('limit') || '50');
        const page = parseInt(c.req.query('page') || '0');
        const offset = page * limit;

        let query = `
            SELECT n.*, b.title as bookTitle 
            FROM notes n 
            LEFT JOIN book_cache b ON n.book_id = b.id 
            WHERE n.connection_id = ?
        `;
        const params: (string | number)[] = [user.id];

        if (bookId) {
            query += ` AND n.book_id = ?`;
            params.push(bookId);
        }
        if (type) {
            query += ` AND n.type = ?`;
            params.push(type);
        }
        if (search) {
            query += ` AND n.content LIKE ?`;
            params.push(`%${search}%`);
        }

        query += ` ORDER BY n.created_at DESC LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        // Mapper to camelCase
        const mapNote = (n: NoteRow) => ({
            id: n.id,
            bookId: n.book_id,
            bookTitle: n.bookTitle || undefined,
            type: n.type,
            content: n.content,
            color: n.color,
            positionType: n.position_type,
            positionValue: JSON.parse(n.position_value),
            createdAt: n.created_at,
            updatedAt: n.updated_at
        });

        const notes = (db.query(query).all(...params) as NoteRow[]).map(mapNote);

        let countQuery = `SELECT COUNT(*) as count FROM notes WHERE connection_id = ?`;
        const countParams: string[] = [user.id];
        if (bookId) { countQuery += ` AND book_id = ?`; countParams.push(bookId); }
        if (type) { countQuery += ` AND type = ?`; countParams.push(type); }
        if (search) { countQuery += ` AND content LIKE ?`; countParams.push(`%${search}%`); }

        const totalResult = db.query(countQuery).get(...countParams) as { count: number };

        return c.json({ data: notes, total: totalResult.count });
    } catch (err: unknown) {
        return c.json({ error: err instanceof Error ? err.message : 'Failed to fetch notes' }, 500);
    }
});

/**
 * GET /api/notes/:bookId
 * Fetch all notes specifically for one book (non-paginated for in-reader syncing).
 */
notesRoutes.get('/:bookId', async (c) => {
    try {
        const user = c.get('user');
        if (!user) return c.json({ error: 'Unauthorized' }, 401);

        const bookId = c.req.param('bookId');
        const type = c.req.query('type');

        let query = `
            SELECT n.*, b.title as bookTitle 
            FROM notes n 
            LEFT JOIN book_cache b ON n.book_id = b.id 
            WHERE n.connection_id = ? AND n.book_id = ?
        `;
        const params: (string | number)[] = [user.id, bookId];

        if (type) {
            query += ` AND n.type = ?`;
            params.push(type);
        }

        query += ` ORDER BY n.created_at DESC`;

        // Mapper to camelCase
        const mapNote = (n: NoteRow) => ({
            id: n.id,
            bookId: n.book_id,
            bookTitle: n.bookTitle || undefined,
            type: n.type,
            content: n.content,
            color: n.color,
            positionType: n.position_type,
            positionValue: JSON.parse(n.position_value),
            createdAt: n.created_at,
            updatedAt: n.updated_at
        });

        const notes = (db.query(query).all(...params) as NoteRow[]).map(mapNote);

        return c.json({ data: notes });
    } catch (err: unknown) {
        return c.json({ error: err instanceof Error ? err.message : 'Failed to fetch book notes' }, 500);
    }
});

/**
 * POST /api/notes
 * Create a new note, highlight, or bookmark.
 */
notesRoutes.post('/', zValidator('json', createNoteSchema), async (c) => {
    try {
        const user = c.get('user');
        if (!user) return c.json({ error: 'Unauthorized' }, 401);

        const body = c.req.valid('json');

        const stmt = db.prepare(`
            INSERT INTO notes (connection_id, book_id, type, content, color, position_type, position_value)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            RETURNING *
        `);

        const result = stmt.get(
            user.id,
            body.bookId,
            body.type,
            body.content || null,
            body.color || null,
            body.positionType,
            JSON.stringify(body.positionValue)
        ) as Pick<NoteRow, 'id' | 'book_id' | 'type' | 'content' | 'color' | 'position_type' | 'position_value' | 'created_at' | 'updated_at'>;

        // Map response to camelCase
        const mappedResult = {
            id: result.id,
            bookId: result.book_id,
            type: result.type,
            content: result.content,
            color: result.color,
            positionType: result.position_type,
            positionValue: JSON.parse(result.position_value),
            createdAt: result.created_at,
            updatedAt: result.updated_at
        };

        return c.json({ data: mappedResult }, 201);
    } catch (err: unknown) {
        return c.json({ error: err instanceof Error ? err.message : 'Failed to create note' }, 500);
    }
});

/**
 * PATCH /api/notes/:id
 * Update an existing note's content or color.
 */
notesRoutes.patch('/:id', zValidator('json', updateNoteSchema), async (c) => {
    try {
        const user = c.get('user');
        if (!user) return c.json({ error: 'Unauthorized' }, 401);

        const id = c.req.param('id');
        const body = c.req.valid('json');

        const existing = db.query('SELECT * FROM notes WHERE id = ? AND connection_id = ?').get(id, user.id);
        if (!existing) return c.json({ error: 'Note not found' }, 404);

        const stmt = db.prepare(`
            UPDATE notes 
            SET content = COALESCE(?, content), 
                color = COALESCE(?, color),
                updated_at = unixepoch()
            WHERE id = ? AND connection_id = ?
            RETURNING *
        `);

        const result = stmt.get(
            body.content !== undefined ? body.content : null,
            body.color !== undefined ? body.color : null,
            id,
            user.id
        ) as Pick<NoteRow, 'id' | 'book_id' | 'type' | 'content' | 'color' | 'position_type' | 'position_value' | 'created_at' | 'updated_at'>;

        // Map response to camelCase
        const mappedResult = {
            id: result.id,
            bookId: result.book_id,
            type: result.type,
            content: result.content,
            color: result.color,
            positionType: result.position_type,
            positionValue: JSON.parse(result.position_value),
            createdAt: result.created_at,
            updatedAt: result.updated_at
        };

        return c.json({ data: mappedResult });
    } catch (err: unknown) {
        return c.json({ error: err instanceof Error ? err.message : 'Failed to update note' }, 500);
    }
});

/**
 * DELETE /api/notes/:id
 * Deletes a specific note.
 */
notesRoutes.delete('/:id', async (c) => {
    try {
        const user = c.get('user');
        if (!user) return c.json({ error: 'Unauthorized' }, 401);

        const id = c.req.param('id');

        const stmt = db.prepare('DELETE FROM notes WHERE id = ? AND connection_id = ?');
        const result = stmt.run(id, user.id);

        if (result.changes === 0) {
            return c.json({ error: 'Note not found' }, 404);
        }

        return c.json({ data: { deleted: true } });
    } catch (err: unknown) {
        return c.json({ error: err instanceof Error ? err.message : 'Failed to delete note' }, 500);
    }
});
