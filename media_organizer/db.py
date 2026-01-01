import sqlite3
from pathlib import Path

SCHEMA = """
CREATE TABLE IF NOT EXISTS files (
  id INTEGER PRIMARY KEY,
  path TEXT UNIQUE NOT NULL,
  size_bytes INTEGER NOT NULL,
  mtime REAL NOT NULL,
  ctime REAL NOT NULL,
  media_type TEXT NOT NULL,
  sha256 TEXT,
  quick_hash TEXT,
  phash TEXT,
  exif_datetime TEXT
);
"""

INDEXES = """
CREATE INDEX IF NOT EXISTS idx_files_size ON files(size_bytes);
CREATE INDEX IF NOT EXISTS idx_files_sha ON files(sha256);
CREATE INDEX IF NOT EXISTS idx_files_quick_hash ON files(quick_hash);
CREATE INDEX IF NOT EXISTS idx_files_phash ON files(phash);
"""

EXPECTED_COLUMNS = {
    "path",
    "size_bytes",
    "mtime",
    "ctime",
    "media_type",
    "sha256",
    "quick_hash",
    "phash",
    "exif_datetime",
}


def _ensure_columns(conn: sqlite3.Connection) -> None:
    cur = conn.execute("PRAGMA table_info(files)")
    existing = {row[1] for row in cur.fetchall()}
    missing = [col for col in EXPECTED_COLUMNS if col not in existing]
    for col in missing:
        if col in {"quick_hash", "phash", "sha256", "exif_datetime"}:
            conn.execute(f"ALTER TABLE files ADD COLUMN {col} TEXT")
        else:
            # Default to REAL for times, INTEGER for sizes, TEXT otherwise.
            col_type = "REAL" if col in {"mtime", "ctime"} else "INTEGER"
            if col in {"media_type", "path"}:
                col_type = "TEXT"
            conn.execute(f"ALTER TABLE files ADD COLUMN {col} {col_type}")

def connect(db_path: Path) -> sqlite3.Connection:
    conn = sqlite3.connect(str(db_path))
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.executescript(SCHEMA)
    _ensure_columns(conn)
    conn.executescript(INDEXES)
    return conn
