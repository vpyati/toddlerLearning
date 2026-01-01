import typer
from pathlib import Path
from .scan import scan_library
from .dedupe import find_exact_duplicates, find_near_duplicates
from .organize import plan_moves, write_manifest, apply_manifest

app = typer.Typer(help="Deduplicate + organize a media library safely.")

@app.command()
def scan(
    input: Path = typer.Option(..., exists=True, file_okay=False),
    db: Path = typer.Option(Path("index.sqlite")),
    phash: bool = typer.Option(False, help="Compute perceptual hashes for near-duplicate detection."),
    skip_full_hash: bool = typer.Option(False, help="Skip full SHA256 hashing (useful for quick drafts)."),
    partial_block_size: int = typer.Option(512 * 1024, help="Bytes to read for the quick hash head/tail."),
    hash_chunk_size: int = typer.Option(1024 * 1024, help="Chunk size for full SHA256 hashing."),
):
    """Index files into a SQLite DB (no changes to your library)."""
    scan_library(
        input_dir=input,
        db_path=db,
        include_phash=phash,
        full_hash=not skip_full_hash,
        partial_block_size=partial_block_size,
        hash_chunk_size=hash_chunk_size,
    )

@app.command()
def exact_dupes(db: Path = typer.Option(Path("index.sqlite")),
                out: Path = typer.Option(Path("exact_dupes.csv"))):
    """Find byte-identical duplicates and write a report."""
    find_exact_duplicates(db_path=db, out_csv=out)


@app.command()
def near_dupes(db: Path = typer.Option(Path("index.sqlite")),
               out: Path = typer.Option(Path("near_dupes.csv")),
               max_distance: int = typer.Option(5, help="Maximum phash Hamming distance to consider near-duplicates.")):
    """Find perceptual near-duplicates and write a report."""
    find_near_duplicates(db_path=db, out_csv=out, max_distance=max_distance)


@app.command()
def organize(db: Path = typer.Option(Path("index.sqlite")),
             output_dir: Path = typer.Option(..., file_okay=False),
             manifest: Path = typer.Option(Path("organize_manifest.csv")),
             apply: bool = typer.Option(False, help="Move files according to the manifest (default is dry run).")):
    """Create a dated move manifest and optionally apply it."""
    moves = plan_moves(db_path=db, output_dir=output_dir)
    write_manifest(moves, manifest_path=manifest)
    if apply:
        results = apply_manifest(moves)
        typer.echo(f"Moved {results['moved']} files (skipped {results['skipped']} existing destinations).")
    else:
        typer.echo(f"Wrote manifest with {len(moves)} planned moves (dry run).")

if __name__ == "__main__":
    app()
