# PixTrail Usage Guide

This guide explains how to use PixTrail effectively, covering command-line options, the Python API, and best practices for different scenarios.

## Command Line Interface

PixTrail provides a versatile command-line interface for processing photos and generating GPX files.

### Basic Usage

```bash
pixtrail -i /path/to/photos
```

This processes all photos in the specified directory and creates a GPX file in the same directory.

### Command Modes

PixTrail operates in one of three modes:

1. **Single Directory Mode**: Process one directory of photos
2. **Batch Mode**: Process multiple directories at once
3. **Web Interface Mode**: Start the browser-based UI

You must specify exactly one of these modes for each command.

### Core Options

| Option | Short | Description |
|--------|-------|-------------|
| `--input-dir` | `-i` | Directory containing photos with GPS data |
| `--output` | `-o` | Output GPX file path (default: auto-named in the input directory) |
| `--batch` | `-b` | Process multiple directories (batch mode) |
| `--output-dir` | `-d` | Output directory for batch mode (default: each input directory) |
| `--web` | `-w` | Start the web interface |
| `--recursive` | `-r` | Search for images recursively in subdirectories |
| `--verbose` | `-v` | Enable verbose output |
| `--help` | `-h` | Show the help message and exit |
| `--version` | | Show program's version number and exit |

### Web Interface Options

| Option | Description |
|--------|-------------|
| `--host` | Host for the web interface (default: 127.0.0.1) |
| `--port` | Port for the web interface (default: 5000) |
| `--no-browser` | Don't automatically open a browser when starting the web interface |

### Automatic GPX Naming

If you don't specify an output file with `-o`, PixTrail automatically names the GPX file after the directory containing the photos:

```bash
pixtrail -i /path/to/Photos-Kyoto
# Creates: /path/to/Photos-Kyoto.gpx
```

Special characters in directory names are converted to underscores for the output filename.

### Batch Processing Examples

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
- Each directory is processed separately
- A GPX file is created for each directory, automatically named after the directory
- You can optionally specify an output directory for all GPX files with `-d`
- The recursive option `-r` applies to all directories in the batch

### Common Command Examples

Process photos in a directory and save the GPX file to a custom location:

```bash
pixtrail -i /path/to/photos -o /path/to/output.gpx
```

Process photos recursively in a directory and its subdirectories:

```bash
pixtrail -i /path/to/photos -r
```

Enable verbose output for detailed processing information:

```bash
pixtrail -i /path/to/photos -v
```

Start the web interface with custom host and port:

```bash
pixtrail -w --host 0.0.0.0 --port 8080
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

### Advanced API Usage

You can customize the processing with various parameters:

```python
from pixtrail.core import PixTrail

pt = PixTrail()

# Process with custom parameters
result = pt.process_directory(
    input_dir="/path/to/photos",
    recursive=True,
    file_types=[".jpg", ".jpeg", ".tiff"],  # Only process these file types
    min_photos=3,  # Minimum number of photos with GPS data required
    verbose=True   # Show detailed output
)

# Check if we have enough GPS data points
if result["stats"]["processed"] >= 3:
    # Custom GPX file creation with options
    pt.generate_gpx(
        output_file="/path/to/output.gpx",
        add_track=True,       # Include a track connecting waypoints
        add_timestamps=True,  # Include timestamps in waypoints
        add_elevations=True   # Include elevation data when available
    )
```

### Working with GPS Data Directly

You can manipulate the GPS data before generating a GPX file:

```python
from pixtrail.core import PixTrail
from pixtrail.gpx_generator import GPXGenerator

# Create a PixTrail object
pt = PixTrail()

# Process a directory of images
result = pt.process_directory("/path/to/photos")
gps_data = result["gps_data"]

# Filter or modify the GPS data as needed
filtered_data = [point for point in gps_data if point.get("altitude", 0) > 100]

# Sort data points by timestamp
from operator import itemgetter
sorted_data = sorted(filtered_data, key=itemgetter("timestamp"))

# Generate a GPX file with the custom data
GPXGenerator.create_gpx(sorted_data, "/path/to/output.gpx")
```

### Starting the Web Interface Programmatically

You can start the web interface from Python code:

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

## Best Practices

### Organizing Your Photos

For the best results:

- Keep photos from a single journey in one directory
- Use descriptive directory names (they become default GPX filenames)
- For multi-day trips, consider creating subdirectories for each day
- Use the recursive option (`-r`) for nested directories

### Performance Tips

- For large collections (1000+ photos), process in smaller batches
- RAW photo formats take longer to process than JPEG
- Use the web interface for better visual feedback during processing
- On slower machines, use the command line interface for better performance

### GPX File Usage

The generated GPX file can be used with:

- **Google Earth**: Import to view your route on a 3D globe
- **OpenStreetMap**: View your route on open-source maps
- **GPS Devices**: Many Garmin/TomTom devices can import GPX files
- **Smartphone Apps**: Apps like OsmAnd, Maps.me, and AllTrails support GPX
- **Sports Trackers**: Strava, Komoot, and similar platforms accept GPX imports

### Troubleshooting

If PixTrail doesn't find GPS data in your photos:

1. Check if your photos actually contain GPS data using other software
2. Make sure you have permission to read the input directory
3. Try the verbose mode (`-v`) to see what's happening
4. For RAW formats, ensure you have the necessary dependencies installed

If all else fails, check the [Troubleshooting Guide](troubleshooting.md) for more solutions.

## Return Codes

The PixTrail CLI returns the following exit codes:

| Code | Description |
|------|-------------|
| 0    | Success     |
| 1    | General error (invalid options, no photos found, etc.) |

You can use these codes in scripts to determine if processing was successful.
