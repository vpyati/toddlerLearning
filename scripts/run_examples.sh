#!/usr/bin/env bash
set -euo pipefail

# Example usage for the media organizer CLI

# Index a directory (replace /path/to/library with your folder)
# python -m media_organizer scan --input /path/to/library --db index.sqlite

# Find exact duplicates from the index and write a CSV report
# python -m media_organizer exact_dupes --db index.sqlite --out exact_dupes.csv
