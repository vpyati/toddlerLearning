"""Dry-run planning helpers for organizing media by date."""

from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
import csv
import shutil
from .db import connect


@dataclass
class PlannedMove:
    source: Path
    destination: Path


def _best_datetime(exif_dt: str | None, mtime: float, ctime: float) -> datetime:
    if exif_dt:
        try:
            return datetime.fromisoformat(exif_dt)
        except ValueError:
            pass
    try:
        return datetime.fromtimestamp(mtime)
    except (OSError, ValueError):
        return datetime.fromtimestamp(ctime)


def plan_moves(db_path: Path, output_dir: Path) -> list[PlannedMove]:
    """Return a list of dated move operations without applying them."""
    conn = connect(db_path)
    cur = conn.cursor()
    rows = cur.execute(
        "SELECT path, exif_datetime, mtime, ctime FROM files WHERE media_type IN ('image', 'video')"
    ).fetchall()
    conn.close()

    moves: list[PlannedMove] = []
    for path_str, exif_dt, mtime, ctime in rows:
        src = Path(path_str)
        if not src.exists():
            continue

        dt = _best_datetime(exif_dt, mtime, ctime)
        year = str(dt.year)
        month = f"{dt.year}-{dt.month:02d}"
        dest = output_dir / year / month / src.name
        moves.append(PlannedMove(source=src, destination=dest))

    return moves


def write_manifest(moves: list[PlannedMove], manifest_path: Path) -> None:
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    with manifest_path.open("w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["source", "destination"])
        for move in moves:
            writer.writerow([str(move.source), str(move.destination)])


def apply_manifest(moves: list[PlannedMove]) -> dict[str, int]:
    """Execute planned moves and return counts for moved/skipped items."""
    moved = 0
    skipped = 0
    for move in moves:
        move.destination.parent.mkdir(parents=True, exist_ok=True)
        if move.destination.exists():
            skipped += 1
            continue
        shutil.move(str(move.source), str(move.destination))
        moved += 1
    return {"moved": moved, "skipped": skipped}
