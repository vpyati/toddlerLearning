"""Configuration helpers for the media organizer.

This module can later load settings from env vars or config files.
"""

from dataclasses import dataclass
from pathlib import Path

@dataclass
class ScanConfig:
    input_dir: Path
    db_path: Path
