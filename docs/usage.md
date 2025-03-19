# PixTrail Usage Guide

This guide explains how to use PixTrail, a tool for extracting GPS data from photos and generating GPX files.

## Installation

You can install PixTrail using pip:

```bash
pip install pixtrail
```

Or you can install it from source:

```bash
git clone https://github.com/sukitsubaki/pixtrail.git
cd pixtrail
pip install -e .
```

Or you can install it from your local package:
```bash
python /path/to/pixtrail/setup.py
```

## Command Line Interface

PixTrail provides a simple command-line interface for processing photos and generating GPX files.

### Basic Usage

```bash
pixtrail /path/to/photos
```

This will process all photos in the specified directory and create a GPX file named `track.gpx` in the same directory.

### Options

The following options are available:

- `-o, --output`: Specify the output GPX file path
- `-r, --recursive`: Search for images recursively in subdirectories
- `-v, --verbose`: Enable verbose output

### Automatic GPX Naming

If you don't specify an output file with `-o`, PixTrail will automatically name the GPX file after the directory name containing the photos:

```bash
pixtrail /path/to/Photos-Kyoto
```

This will create a GPX file named `Photos_Paris.gpx` in the same directory.

### Examples

Process photos in a directory and save the GPX file to a custom location:

```bash
pixtrail /path/to/photos -o /path/to/output.gpx
```

Process photos recursively in a directory and its subdirectories:

```bash
pixtrail /path/to/photos -r
```

Enable verbose output:

```bash
pixtrail /path/to/photos -v
```

## Using the Python API

You can also use PixTrail programmatically in your Python code.

### Basic Usage

```python
from pixtrail.core import PixTrail

# Create a PixTrail object
pt = PixTrail()

# Process a directory of images
gps_data = pt.process_directory("/path/to/photos")

# Generate a GPX file
pt.generate_gpx("/path/to/output.gpx")
```

### Process and Generate in One Step

```python
from pixtrail.core import PixTrail

# Create a PixTrail object
pt = PixTrail()

# Process and generate in one step
pt.process_and_generate("/path/to/photos", "/path/to/output.gpx", recursive=True)
```

### Working with GPS Data Directly

You can also work with the GPS data directly:

```python
from pixtrail.core import PixTrail
from pixtrail.gpx_generator import GPXGenerator

# Create a PixTrail object
pt = PixTrail()

# Process a directory of images
gps_data = pt.process_directory("/path/to/photos")

# Manipulate the GPS data as needed
filtered_data = [point for point in gps_data if point["altitude"] > 100]

# Generate a GPX file with the filtered data
GPXGenerator.create_gpx(filtered_data, "/path/to/output.gpx")
```

## Handling Errors

PixTrail is designed to be robust against missing or invalid EXIF data. If an image does not contain GPS data, it will be skipped. If there are errors reading EXIF data with the primary method (exifread), PixTrail will fall back to using Pillow.

If no images with GPS data are found, PixTrail will print an error message and exit with a non-zero status code.

## Using the GPX File

The generated GPX file can be imported into various mapping applications:

- OpenStreetMap
- Google Earth
- GPS viewers
- Mapping applications on smartphones and GPS devices

The GPX file contains both waypoints (each representing a photo) and a track (connecting the waypoints in chronological order).