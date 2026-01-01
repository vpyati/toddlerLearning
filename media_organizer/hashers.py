"""Hashing utilities for exact and perceptual comparisons."""

from pathlib import Path
import hashlib
import imagehash
from PIL import Image


def partial_sha256(path: Path, block_size: int = 512 * 1024) -> str:
    """Hash the first and last blocks of a file for quick comparisons."""
    h = hashlib.sha256()
    with path.open("rb") as f:
        start = f.read(block_size)
        h.update(start)
        if path.stat().st_size > block_size:
            f.seek(-block_size, 2)
            h.update(f.read(block_size))
    return h.hexdigest()


def perceptual_hash(path: Path) -> str:
    """Return a perceptual hash (phash) for an image."""
    with Image.open(path) as img:
        return str(imagehash.phash(img))


def hamming_distance(hex_a: str, hex_b: str) -> int:
    """Compute the Hamming distance between two hex-encoded phashes."""
    return (int(hex_a, 16) ^ int(hex_b, 16)).bit_count()
