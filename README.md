# Media Organizer

Local-first pipeline to index, deduplicate, and organize images and videos. The initial milestones focus on safe indexing and duplicate detection with perceptual hashing, dry-run manifests, and room to expand into optional theme clustering.

## Features
- SQLite-backed index of images and videos, including EXIF datetimes when available.
- Quick head/tail hashing plus optional full SHA-256 to speed up large scans.
- Perceptual hashing (pHash) for near-duplicate photo detection.
- Exact duplicate and near-duplicate CSV reports.
- Dry-run organization manifest that arranges media into `Year/Year-Month` folders with an optional apply step.

## Quickstart
1. **Install dependencies** (Python 3.10+):
   ```bash
   pip install -e .
   ```
2. **Scan a library** without modifying files (add `--phash` to compute perceptual hashes):
   ```bash
   python -m media_organizer scan --input /path/to/media --db index.sqlite --phash
   ```
3. **Report exact duplicates** into a CSV:
   ```bash
   python -m media_organizer exact_dupes --db index.sqlite --out exact_dupes.csv
   ```
4. **Report near-duplicate photos** (uses pHash distances):
   ```bash
   python -m media_organizer near_dupes --db index.sqlite --out near_dupes.csv --max-distance 5
   ```
5. **Plan organization** into dated folders with a dry-run manifest (set `--apply` to move files):
   ```bash
   python -m media_organizer organize --db index.sqlite --output-dir ./Output --manifest organize_manifest.csv
   ```

`script.js` and `memory.html` from the original toddler learning game are still present for reference and are unaffected by the Python CLI utilities.
