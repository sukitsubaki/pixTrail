![Version](https://img.shields.io/badge/version-1.3.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

# PixTrail

PixTrail is a simple yet powerful tool that extracts the GPS information stored in your photos' EXIF metadata and converts it into standard GPX format that can be used in various mapping applications, allowing you to visualize and share your journeys.

## The Story Behind PixTrail
As an avid photographer, I've always enjoyed using the Photos app on iOS and macOS to organize and relive my journeys. While these tools are great for managing photos, I found myself wishing for a way to reconstruct the routes I had taken during day trips or longer journeys based on the photos I captured along the way.

I wanted to see the path I wandered through a city, the trails I hiked in the mountains, or the roads I traveled during a vacation - all visualized on a map using the GPS data already embedded in my photos. This desire to connect my photographic memories with their geographic context led to the creation of PixTrail.

## Features

- Extract GPS coordinates and timestamps from EXIF metadata in photos
- Generate GPX files with waypoints and tracks
- Support for various image formats: JPG, PNG, TIFF, BMP
- Support for various RAW formats: CR2, NEF, ARW, ORF, RW2, PEF, SRW, DNG (Canon, Nikon, Sony, Olympus, Panasonic, Pentax, Samsung, digital negative)
- Command-line interface for easy use
- Support for recursive directory processing

## Privacy

PixTrail processes all photo metadata locally on your device. No data is uploaded to any server, shared with third parties, or sent anywhere outside your computer. Your location data and photos remain completely private and under your control at all times.

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

## Future Roadmap

Here are some features we're planning to add in future releases:

- **Local Web Interface**: A browser-based interface running entirely on your device
  - Processes photos locally without any server uploads
  - Displays the extracted route on OpenStreetMap while keeping all data on your device
  - Creates GPX files directly on your computer
  - Allows sharing only the generated GPX file (never your original photos or personal metadata)
- **Time-based Filtering**: Process only photos within specific time windows
- **Route Smoothing**: Algorithm to reduce GPS inaccuracies
- **Statistics**: Calculate and display statistics like total distance, average speed, elevation profile
- **Video Support**: Extract GPS data from video files

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
pip install -e ".[dev]"

# Run tests
pytest
```

## License

- This project is licensed under the MIT License by <a href="https://github.com/sukitsubaki" target="_blank">Suki Tsubaki</a>.
- The <a href="https://github.com/sukitsubaki/pixTrail/tree/main/examples/example_photos" target="_blank">example photos</a> are licensed under CC BY 4.0 by <a href="https://anil-oeztas.de" target="_blank">Anil Öztas</a>.
