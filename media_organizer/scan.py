import os
import hashlib
from pathlib import Path
from tqdm import tqdm
from .db import connect
from .datetime_extract import extract_exif_datetime
from .hashers import partial_sha256, perceptual_hash

IMAGE_EXT = {".jpg", ".jpeg", ".png", ".heic", ".webp", ".tif", ".tiff"}
VIDEO_EXT = {".mp4", ".mov", ".m4v", ".mkv", ".avi", ".webm"}

def media_type(p: Path) -> str:
    ext = p.suffix.lower()
    if ext in IMAGE_EXT: return "image"
    if ext in VIDEO_EXT: return "video"
    return "other"

def sha256_file(path: Path, chunk_size: int = 1024 * 1024) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        while True:
            b = f.read(chunk_size)
            if not b: break
            h.update(b)
    return h.hexdigest()

def scan_library(
    input_dir: Path,
    db_path: Path,
    *,
    include_phash: bool = False,
    full_hash: bool = True,
    partial_block_size: int = 512 * 1024,
    hash_chunk_size: int = 1024 * 1024,
) -> None:
    conn = connect(db_path)
    cur = conn.cursor()

    # collect first for progress bar count
    all_files = []
    for root, _, files in os.walk(input_dir):
        for name in files:
            p = Path(root) / name
            if p.is_file():
                all_files.append(p)

    for p in tqdm(all_files, desc="Indexing"):
        try:
            st = p.stat()
            mt = media_type(p)

            exif_dt = None
            phash = None
            if mt == "image":
                exif_dt = extract_exif_datetime(p)
                if include_phash:
                    phash = perceptual_hash(p)

            digest = sha256_file(p, chunk_size=hash_chunk_size) if full_hash and mt in ("image", "video") else None
            quick = partial_sha256(p, block_size=partial_block_size)

            cur.execute(
                """
              INSERT OR REPLACE INTO files(path, size_bytes, mtime, ctime, media_type, sha256, quick_hash, phash, exif_datetime)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
                (str(p), st.st_size, st.st_mtime, st.st_ctime, mt, digest, quick, phash, exif_dt),
            )
        except Exception:
            # log later; keep scanning
            continue

    conn.commit()
    conn.close()
