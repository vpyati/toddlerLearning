import csv
from pathlib import Path
from .db import connect
from .hashers import hamming_distance

def find_exact_duplicates(db_path: Path, out_csv: Path) -> None:
    conn = connect(db_path)
    cur = conn.cursor()

    rows = cur.execute("""
      SELECT sha256, size_bytes, COUNT(*) as n
      FROM files
      WHERE sha256 IS NOT NULL
      GROUP BY sha256, size_bytes
      HAVING n > 1
      ORDER BY n DESC
    """).fetchall()

    with out_csv.open("w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["sha256", "size_bytes", "count", "paths"])
        for sha, size, n in rows:
            paths = cur.execute("SELECT path FROM files WHERE sha256=? AND size_bytes=?",
                                (sha, size)).fetchall()
            w.writerow([sha, size, n, " | ".join(p[0] for p in paths)])

    conn.close()


def find_near_duplicates(db_path: Path, out_csv: Path, max_distance: int = 5) -> None:
    """Report near-duplicate photos using perceptual hashing."""
    conn = connect(db_path)
    cur = conn.cursor()

    rows = cur.execute(
        "SELECT path, phash FROM files WHERE phash IS NOT NULL ORDER BY path"
    ).fetchall()

    pairs: list[tuple[int, str, str, str, str]] = []
    total = len(rows)
    for i in range(total):
        path_a, phash_a = rows[i]
        for j in range(i + 1, total):
            path_b, phash_b = rows[j]
            dist = hamming_distance(phash_a, phash_b)
            if dist <= max_distance:
                pairs.append((dist, path_a, path_b, phash_a, phash_b))

    pairs.sort(key=lambda r: (r[0], r[1], r[2]))

    with out_csv.open("w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["distance", "path_a", "path_b", "phash_a", "phash_b"])
        writer.writerows(pairs)

    conn.close()
