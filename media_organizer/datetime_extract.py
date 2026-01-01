from pathlib import Path
import exifread

EXIF_TAGS = ["EXIF DateTimeOriginal", "Image DateTime", "EXIF DateTimeDigitized"]

def extract_exif_datetime(path: Path) -> str | None:
    # Returns ISO-like string or None
    try:
        with path.open("rb") as f:
            tags = exifread.process_file(f, details=False)
        for t in EXIF_TAGS:
            if t in tags:
                # ex: "2020:12:31 23:59:59"
                s = str(tags[t])
                return s.replace(":", "-", 2).replace(" ", "T")
    except Exception:
        return None
    return None
