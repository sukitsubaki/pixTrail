# PixTrail Documentation

Welcome to the PixTrail documentation. PixTrail is a tool that extracts GPS data from photos and generates GPX files that can be used in mapping applications.

## What is PixTrail?

PixTrail extracts the GPS information stored in your photos' EXIF metadata and converts it into standard GPX format that can be used in various mapping applications. This allows you to visualize and share your journeys based on the places where you've taken photos.

## Key Features

- Extract GPS coordinates and timestamps from EXIF metadata in photos
- Generate GPX files with waypoints and tracks
- Support for various image formats (JPG, PNG, TIFF, BMP)
- Support for various RAW formats (CR2, NEF, ARW, ORF, etc.)
- Command-line interface for easy use
- Web interface for browser-based operation
- Process directories recursively
- Drag & drop interface in the web version
- Visualize routes on OpenStreetMap

## Privacy

PixTrail processes all photo metadata locally on your device. No data is uploaded to any server, shared with third parties, or sent anywhere outside your computer. Your location data and photos remain completely private and under your control at all times.

## Documentation Sections

- **[User Guide](usage.md)**: Learn how to install and use PixTrail
- **[Web Interface](web_interface.md)**: Documentation for the browser-based interface
- **[API Reference](api.md)**: Detailed reference for the Python API

## Quick Start

### Installation

```bash
# Basic installation
pip install pixtrail

# With web interface support
pip install pixtrail[web]
```

### Command Line Usage

```bash
# Process photos in a directory
pixtrail -i /path/to/photos

# Start the web interface
pixtrail -w
```

### Python API

```python
from pixtrail.core import PixTrail

# Create a PixTrail object
pt = PixTrail()

# Process and generate in one step
pt.process_and_generate("/path/to/photos", "/path/to/output.gpx", recursive=True)
```
