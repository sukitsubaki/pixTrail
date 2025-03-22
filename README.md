<a href="https://github.com/sukitsubaki/pixTrail/releases">![Version](https://img.shields.io/badge/version-2.2.0-blue)</a>
<a href="https://github.com/sukitsubaki/pixTrail/blob/main/LICENSE">![License](https://img.shields.io/badge/license-MIT-green)</a>
<a href="https://github.com/sukitsubaki/pixTrail/blob/main/pyproject.toml">![Python](https://img.shields.io/badge/python-3.6%2B-blue)</a>
<a href="https://pypi.org/project/pixtrail/">![PyPI](https://img.shields.io/pypi/dm/pixtrail)</a>
<a href="https://github.com/sukitsubaki/pixTrail/tree/main/docs">![Documentation](https://img.shields.io/badge/docs-passing-brightgreen)</a>

# PixTrail

PixTrail is a simple yet powerful tool that extracts the GPS information stored in your photos' EXIF metadata and converts it into standard GPX format that can be used in various mapping applications, allowing you to visualize and share your journeys.

## The Story Behind PixTrail
As an avid photographer, I've always enjoyed using the Photos app on iOS and macOS to organize and relive my journeys. While these tools are great for managing photos, I found myself wishing for a way to reconstruct the routes I had taken during day trips or longer journeys based on the photos I captured along the way.

I wanted to see the path I wandered through a city, the trails I hiked in the mountains, or the roads I traveled during a vacation - all visualized on a map using the GPS data already embedded in my photos. This desire to connect my photographic memories with their geographic context led to the creation of PixTrail.

## Features

- Extract GPS coordinates and timestamps from EXIF metadata in photos
- Generate GPX files with waypoints and tracks
- Hybrid processing approach:
  - JPEG/TIFF files are processed directly in your browser for faster performance
  - RAW/PNG and other formats are processed on the server with full metadata extraction
- Support for various image formats: JPG, PNG, TIFF, BMP
- Support for various RAW formats: CR2, NEF, ARW, ORF, RW2, PEF, SRW, DNG (Canon, Nikon, Sony, Olympus, Panasonic, Pentax, Samsung, digital negative)
- Command-line interface for easy use
- Web interface for browser-based operation
- Directory selection and recursive processing support
- Drag & drop interface for files and directories
- Visualize routes on OpenStreetMap
- Automatic cleanup of temporary files to save disk space

## Privacy

PixTrail processes all photo metadata locally on your device. No data is uploaded to any server, shared with third parties, or sent anywhere outside your computer. Your location data and photos remain completely private and under your control at all times.

When using the web interface:
- JPEG/TIFF files are processed entirely in your browser - only extracted GPS coordinates are sent to the local server
- RAW/PNG files are temporarily cached (local) during processing and automatically deleted afterward
- Only the generated GPX files are stored (local)

## Installation

### Basic Installation

```bash
pip install pixtrail
```

### Installation with Web Interface

```bash
pip install pixtrail[web]
```

### Install from Source

```bash
git clone https://github.com/sukitsubaki/pixtrail.git
cd pixtrail
pip install -e .
```

## Usage

### Command Line

```bash
# Basic usage
pixtrail -i /path/to/photos

# Specify output file
pixtrail -i /path/to/photos -o /path/to/output.gpx

# Search recursively in subdirectories
pixtrail -i /path/to/photos -r

# Enable verbose output
pixtrail -i /path/to/photos -v

# Batch process multiple directories
pixtrail -b /path/to/photos1 /path/to/photos2 /path/to/photos3

# Batch process with a common output directory
pixtrail -b /path/to/photos1 /path/to/photos2 -d /path/to/gpx_output

# Start the web interface
pixtrail -w

# Start the web interface on a specific host and port
pixtrail -w --host 0.0.0.0 --port 8080

# Start the web interface without automatically opening a browser
pixtrail -w --no-browser
```

### Web Interface

The web interface provides a user-friendly way to upload photos, extract GPS data, visualize routes on a map, and download GPX files:

1. Start the web interface:
   ```bash
   pixtrail -w
   ```

2. Your browser will automatically open to the PixTrail interface
3. Select photos using one of the following methods:
   - Click "Select Photos" to choose individual files
   - Click "Select Directory" to choose an entire folder
   - Drag and drop images directly into the interface
4. For directory processing, you can enable recursive subdirectory scanning
5. PixTrail will process the photos and display the route on a map
6. Download the GPX file for use in other applications

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
- Flask (for web interface)

## Example

After running PixTrail on a directory of geotagged photos, you'll get a GPX file that can be imported into mapping software like:

- OpenStreetMap
- Google Earth
- GPX viewers
- Mapping applications on smartphones and GPS devices

## Documentation

The PixTrail documentation is available in several formats:

- **Online Documentation**: Visit the [documentation website](https://sukitsubaki.github.io/pixtrail/)
- **Local Documentation**: Build the documentation locally by installing the development dependencies and running:
  ```bash
  # Install development dependencies
  pip install -e ".[dev]"
  
  # Build documentation
  python build_docs.py
  
  # OR serve locally with live reloading
  python build_docs.py --serve
  ```
- **Source Documentation**: Browse the documentation in the [docs](docs/) directory:
  - [User Guide](docs/usage.md)
  - [Web Interface](docs/web_interface.md)
  - [API Reference](docs/api.md)

## Future Roadmap

Here are some features we're planning to add in future releases:

- **Time-based Filtering**: Process only photos within specific time windows
- **Route Smoothing**: Algorithm to reduce GPS inaccuracies
- **Statistics**: Calculate and display statistics like total distance, average speed, elevation profile
- **Video Support**: Extract GPS data from video files
- **Map Enhancements**: 
  - Support for multiple map providers
  - Customizable map styles 
  - More detailed route information

## Contributing

Contributions and suggestions for additional features are welcome! Here's how you can help:

- **Bug Reports**: If you encounter any issues, please open an issue on GitHub with details about the problem, including steps to reproduce it.
- **Feature Requests**: Have an idea for a new feature? Feel free to create an issue describing your suggestion.
- **Code Contributions**: Want to contribute code? Fork the repository, make your changes, and submit a pull request.
- **Documentation**: Help improve the documentation by fixing errors or adding examples.

Please follow these guidelines when contributing:
- Follow the existing code style
- Add tests for new functionality
- Update documentation as needed
- Keep pull requests focused on a single change

### Development Setup

```bash
# Clone the repository
git clone https://github.com/sukitsubaki/pixtrail.git
cd pixtrail

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install development dependencies
pip install -e ".[dev,web]"

# Run tests
pytest
```

## License

- This project is licensed under the MIT License by <a href="https://github.com/sukitsubaki" target="_blank">Suki Tsubaki</a>.
- The <a href="https://github.com/sukitsubaki/pixTrail/tree/main/examples/example_photos" target="_blank">example photos</a> are licensed under CC BY 4.0 by <a href="https://anil-oeztas.de" target="_blank">Anil Öztas</a>.
