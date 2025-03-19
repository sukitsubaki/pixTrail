# PixTrail

A Python tool to extract GPS data from geotagged photos and create GPX files for visualizing your journey on maps.

## Features

- Extract GPS coordinates and timestamps from EXIF metadata in photos
- Generate GPX files with waypoints and tracks
- Support for various image formats (JPG, PNG, TIFF, BMP)
- Command-line interface for easy use
- Support for recursive directory processing

## Installation

```bash
pip install pixtrail
```

Or install from source:
```bash
git clone https://github.com/sukitsubaki/pixtrail.git
cd pixtrail
pip install -e .
```

Or install from local package:
```bash
python /path/to/pixtrail/setup.py
```

## Usage

### Command Line

```bash
# Basic usage
pixtrail /path/to/photos

# Specify output file
pixtrail /path/to/photos -o /path/to/output.gpx

# Search recursively in subdirectories
pixtrail /path/to/photos -r

# Enable verbose output
pixtrail /path/to/photos -v
```

### Python API

```python
from pixtrail.core import PixTrail

# Create a PixTrail object
pt = PixTrail()

# Process a directory of images
gps_data = pt.process_directory("/path/to/photos", recursive=True)

# Generate a GPX file
pt.generate_gpx("/path/to/output.gpx")

# Or do both in one step
pt.process_and_generate("/path/to/photos", "/path/to/output.gpx", recursive=True)
```

## Requirements

- Python 3.6 or newer
- exifread
- gpxpy
- Pillow

## Example

After running PixTrail on a directory of geotagged photos, you'll get a GPX file that can be imported into mapping software like:

- OpenStreetMap
- Google Earth
- GPX viewers
- Mapping applications on smartphones and GPS devices