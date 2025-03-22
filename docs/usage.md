# PixTrail Usage Guide

This guide explains how to use PixTrail, a tool for extracting GPS data from photos and generating GPX files.

## Installation

### Basic Installation

You can install PixTrail using pip:

```bash
pip install pixtrail
```

### Installation with Web Interface

If you want to use the web interface, install with the web extras:

```bash
pip install pixtrail[web]
```

### Install from Source

You can also install it from source:

```bash
git clone https://github.com/sukitsubaki/pixtrail.git
cd pixtrail
pip install -e .
```

Or you can install it from your local package:
```bash
python /path/to/pixtrail/setup.py install
```

## Command Line Interface

PixTrail provides a simple command-line interface for processing photos and generating GPX files.

### Basic Usage

```bash
pixtrail -i /path/to/photos
```

This will process all photos in the specified directory and create a GPX file in the same directory.

### Options

The following options are available:

- `-i, --input-dir`: Directory containing photos with GPS data
- `-o, --output`: Specify the output GPX file path
- `-r, --recursive`: Search for images recursively in subdirectories
- `-v, --verbose`: Enable verbose output
- `-w, --web`: Start the web interface
- `--host`: Host for the web interface (default: 127.0.0.1)
- `--port`: Port for the web interface (default: 5000)
- `--no-browser`: Don't automatically open a browser when starting the web interface

### Automatic GPX Naming

If you don't specify an output file with `-o`, PixTrail will automatically name the GPX file after the directory name containing the photos:

```bash
pixtrail -i /path/to/Photos-Kyoto
```

This will create a GPX file named `Photos_Kyoto.gpx` in the same directory.

### Batch Processing

PixTrail supports processing multiple directories at once with separate GPX outputs:

```bash
# Process multiple directories
pixtrail -b /path/to/photos1 /path/to/photos2 /path/to/photos3

# Process multiple directories and save GPX files to a specific directory
pixtrail -b /path/to/photos1 /path/to/photos2 -d /path/to/output_dir

# Process multiple directories recursively
pixtrail -b /path/to/photos1 /path/to/photos2 -r

# Process multiple directories with verbose output
pixtrail -b /path/to/photos1 /path/to/photos2 -v
```

When using batch mode:
- Each directory will be processed separately
- A GPX file will be created for each directory, automatically named after the directory
- You can optionally specify an output directory for all GPX files with `-d`
- The recursive option `-r` applies to all directories in the batch

### Web Interface

PixTrail includes a browser-based web interface that allows you to upload photos, visualize routes, and generate GPX files, all while keeping your data on your local device:

```bash
# Start the web interface with default settings
pixtrail -w

# Start the web interface on a specific host and port
pixtrail -w --host 0.0.0.0 --port 8080

# Start the web interface without automatically opening a browser
pixtrail -w --no-browser
```

For more details on the web interface, see the [Web Interface Documentation](web_interface.md).

### Examples

Process photos in a directory and save the GPX file to a custom location:

```bash
pixtrail -i /path/to/photos -o /path/to/output.gpx
```

Process photos recursively in a directory and its subdirectories:

```bash
pixtrail -i /path/to/photos -r
```

Enable verbose output:

```bash
pixtrail -i /path/to/photos -v
```

Start the web interface:

```bash
pixtrail -w
```

## Using the Python API

You can also use PixTrail programmatically in your Python code.

### Basic Usage

```python
from pixtrail.core import PixTrail

# Create a PixTrail object
pt = PixTrail()

# Process a directory of images
result = pt.process_directory("/path/to/photos")
gps_data = result["gps_data"]

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
result = pt.process_directory("/path/to/photos")
gps_data = result["gps_data"]

# Manipulate the GPS data as needed
filtered_data = [point for point in gps_data if point["altitude"] > 100]

# Generate a GPX file with the filtered data
GPXGenerator.create_gpx(filtered_data, "/path/to/output.gpx")
```

### Starting the Web Interface Programmatically

You can also start the web interface from Python code:

```python
from pixtrail.web import start_server

# Start the web interface
app, server = start_server(host="127.0.0.1", port=5000, open_browser=True)

# The server runs in a background thread, so your code can continue
# Keep your program running to keep the server running
import time
try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    # Shutdown the server when Ctrl+C is pressed
    server.shutdown()
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
