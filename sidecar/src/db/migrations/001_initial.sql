-- ==========================================
-- SYSTEM CONFIGURATION
-- ==========================================

CREATE TABLE server_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at INTEGER DEFAULT (unixepoch())
);

-- ==========================================
-- AUTHENTICATION & USERS (ABS)
-- ==========================================

CREATE TABLE connections (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
  abs_user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  token TEXT NOT NULL,                            -- ABS auth token
  is_admin INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (unixepoch()),
  last_sync_at INTEGER DEFAULT NULL,
  UNIQUE(abs_user_id)
);

CREATE TABLE sessions (
  token TEXT PRIMARY KEY DEFAULT (hex(randomblob(32))),
  connection_id TEXT NOT NULL REFERENCES connections(id),
  expires_at INTEGER NOT NULL,
  created_at INTEGER DEFAULT (unixepoch())
);

-- ==========================================
-- USER PREFERENCES & THEME
-- ==========================================

CREATE TABLE preferences (
  connection_id TEXT PRIMARY KEY REFERENCES connections(id),
  active_theme TEXT DEFAULT 'sumi',
  active_title TEXT DEFAULT 'Shoshin',
  playback_speed REAL DEFAULT 1.0,
  reader_font_size INTEGER DEFAULT 16,
  reader_font TEXT DEFAULT 'default',
  reader_line_height REAL DEFAULT 1.6,
  ai_provider TEXT DEFAULT NULL,          -- 'ollama' | 'openai' | 'anthropic'
  ai_model TEXT DEFAULT NULL,
  ai_endpoint TEXT DEFAULT NULL,
  ai_api_key TEXT DEFAULT NULL
);

-- ==========================================
-- NOTES & HIGHLIGHTS
-- ==========================================

CREATE TABLE notes (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
  connection_id TEXT NOT NULL REFERENCES connections(id),
  book_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('note', 'highlight', 'bookmark')),
  content TEXT,
  color TEXT DEFAULT NULL,
  position_type TEXT NOT NULL CHECK(position_type IN ('audio', 'ebook')),
  position_value TEXT NOT NULL,           -- JSON: audio={seconds}, ebook={cfi, chapter}
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

-- ==========================================
-- AI SUMMARIES
-- ==========================================

CREATE TABLE summaries (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
  book_id TEXT NOT NULL,
  chapter_index INTEGER NOT NULL,
  chapter_title TEXT,
  summary TEXT NOT NULL,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  created_at INTEGER DEFAULT (unixepoch()),
  UNIQUE(book_id, chapter_index)
);

-- ==========================================
-- PROGRESSION
-- ==========================================

CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  display_order INTEGER DEFAULT 0
);

CREATE TABLE genre_category_map (
  genre TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES categories(id)
);

CREATE TABLE kp_events (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
  connection_id TEXT NOT NULL REFERENCES connections(id),
  book_id TEXT NOT NULL,
  category_id TEXT NOT NULL REFERENCES categories(id),
  kp_amount INTEGER NOT NULL,
  multiplier REAL NOT NULL DEFAULT 1.0,
  source TEXT NOT NULL CHECK(source IN ('reading', 'listening', 'completion_bonus')),
  session_seconds INTEGER,
  created_at INTEGER DEFAULT (unixepoch())
);

CREATE TABLE user_progress (
  connection_id TEXT PRIMARY KEY REFERENCES connections(id),
  total_kp INTEGER DEFAULT 0,
  current_title TEXT DEFAULT 'Shoshin',
  books_completed INTEGER DEFAULT 0,
  total_hours REAL DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_reading_date TEXT DEFAULT NULL
);

CREATE TABLE category_progress (
  connection_id TEXT NOT NULL REFERENCES connections(id),
  category_id TEXT NOT NULL REFERENCES categories(id),
  total_kp INTEGER DEFAULT 0,
  PRIMARY KEY (connection_id, category_id)
);

-- ==========================================
-- BONSAI
-- ==========================================

CREATE TABLE bonsai (
  connection_id TEXT PRIMARY KEY REFERENCES connections(id),
  seed TEXT NOT NULL DEFAULT (hex(randomblob(4))),   -- Deterministic seed for generation
  stage INTEGER DEFAULT 0,                            -- Growth stage index
  branch_params TEXT DEFAULT '{}',                    -- JSON: genre-influenced branch config
  last_snapshot TEXT DEFAULT NULL,                     -- SVG string of last rendered state
  updated_at INTEGER DEFAULT (unixepoch())
);

-- ==========================================
-- SEASONS
-- ==========================================

CREATE TABLE seasons (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
  connection_id TEXT NOT NULL REFERENCES connections(id),
  season_number INTEGER NOT NULL,
  start_date INTEGER NOT NULL,
  end_date INTEGER NOT NULL,
  total_kp INTEGER DEFAULT 0,
  books_completed INTEGER DEFAULT 0,
  hours_spent REAL DEFAULT 0,
  reflection TEXT,
  bonsai_snapshot TEXT,                               -- SVG at season end
  created_at INTEGER DEFAULT (unixepoch())
);

-- ==========================================
-- UNLOCKS
-- ==========================================

CREATE TABLE unlocks (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
  connection_id TEXT NOT NULL REFERENCES connections(id),
  feature TEXT NOT NULL,                              -- 'stats', 'accent_color', 'calendar', etc.
  unlocked_at INTEGER DEFAULT (unixepoch()),
  UNIQUE(connection_id, feature)
);

-- ==========================================
-- BOOK METADATA CACHE
-- ==========================================

CREATE TABLE book_cache (
  book_id TEXT PRIMARY KEY,
  connection_id TEXT NOT NULL REFERENCES connections(id),
  title TEXT,
  author TEXT,
  cover_url TEXT,
  media_type TEXT DEFAULT 'ebook',                      -- 'ebook', 'audiobook', 'both'
  primary_category TEXT REFERENCES categories(id),
  secondary_category TEXT REFERENCES categories(id),
  is_manual_category INTEGER DEFAULT 0,
  total_pages INTEGER,
  total_duration INTEGER,                             -- seconds (audiobooks)
  cached_at INTEGER DEFAULT (unixepoch())
);

-- Progress sync queue (for when ABS is unreachable)
CREATE TABLE progress_sync_queue (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
  connection_id TEXT NOT NULL REFERENCES connections(id),
  book_id TEXT NOT NULL,
  progress REAL NOT NULL,
  current_time REAL,
  ebook_location TEXT,
  is_finished INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (unixepoch())
);

-- Book requests (Phase 4 — external book discovery)
CREATE TABLE book_requests (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
  connection_id TEXT NOT NULL REFERENCES connections(id),
  title TEXT NOT NULL,
  author TEXT,
  isbn TEXT,
  cover_url TEXT,
  source TEXT NOT NULL,                               -- 'google_books', 'open_library'
  source_id TEXT,
  status TEXT DEFAULT 'pending',                      -- 'pending', 'approved', 'fulfilled', 'declined'
  admin_note TEXT,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch()),
  UNIQUE(connection_id, isbn)
);

-- ==========================================
-- INDEXES
-- ==========================================

CREATE INDEX idx_notes_book ON notes(book_id);
CREATE INDEX idx_notes_connection ON notes(connection_id);
CREATE INDEX idx_kp_connection ON kp_events(connection_id);
CREATE INDEX idx_kp_category ON kp_events(category_id);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_book_cache_connection ON book_cache(connection_id);
CREATE INDEX idx_sync_queue_connection ON progress_sync_queue(connection_id);
CREATE INDEX idx_book_requests_connection ON book_requests(connection_id);
CREATE INDEX idx_book_requests_status ON book_requests(status);
