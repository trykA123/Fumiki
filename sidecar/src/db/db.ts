import { Database } from 'bun:sqlite';
import path from 'node:path';
import fs from 'node:fs';

const dataDir = process.env.DATA_DIR || path.join(process.cwd(), 'data');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Open database connection
export const db = new Database(path.join(dataDir, 'fumiki.db'), { create: true });

// Enforce required PRAGMAs for performance and safety
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');
db.exec('PRAGMA busy_timeout = 5000;');

// Make sure that process termination cleanly closes the database
process.on('SIGINT', () => db.close());
process.on('SIGTERM', () => db.close());
