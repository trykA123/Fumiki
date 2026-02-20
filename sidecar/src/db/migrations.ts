import { db } from './db';
import fs from 'node:fs';
import path from 'node:path';

export function runMigrations() {
    console.log('--- Migrations ---');

    // Ensure migrations tracking table exists
    db.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL UNIQUE,
      applied_at INTEGER DEFAULT (unixepoch())
    );
  `);

    const migrationsDir = path.join(import.meta.dir, 'migrations');

    if (!fs.existsSync(migrationsDir)) {
        console.warn(`Migrations directory not found at ${migrationsDir}`);
        return;
    }

    // Get sequentially ordered migration files
    const files = fs.readdirSync(migrationsDir)
        .filter(f => f.endsWith('.sql'))
        .sort();

    for (const file of files) {
        // Check if migration has already run
        const existing = db.query('SELECT filename FROM _migrations WHERE filename = ?').get(file);

        if (!existing) {
            console.log(`Running migration: ${file}`);
            const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');

            const applyMigration = db.transaction(() => {
                db.exec(sql);
                db.query('INSERT INTO _migrations (filename) VALUES (?)').run(file);
            });

            try {
                applyMigration();
                console.log(`✅  Finished ${file}`);
            } catch (err) {
                console.error(`❌ Migration failed on ${file}:`, err);
                throw err; // Stop application boot on failed migration
            }
        }
    }

    console.log('--- DB up to date ---');
}
