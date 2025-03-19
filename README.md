# PixTrail

PixTrail is a simple yet powerful tool that extracts the GPS information stored in your photos' EXIF metadata and converts it into standard GPX format that can be used in various mapping applications, allowing you to visualize and share your journeys.

## The Story Behind PixTrail
As an avid photographer, I've always enjoyed using the Photos app on iOS and macOS to organize and relive my journeys. While these tools are great for managing photos, I found myself wishing for a way to reconstruct the routes I had taken during day trips or longer journeys based on the photos I captured along the way.

I wanted to see the path I wandered through a city, the trails I hiked in the mountains, or the roads I traveled during a vacation - all visualized on a map using the GPS data already embedded in my photos. This desire to connect my photographic memories with their geographic context led to the creation of PixTrail.

## Features

- Extract GPS coordinates and timestamps from EXIF metadata in photos
- Generate GPX files with waypoints and tracks
- Support for various image formats: JPG, PNG, TIFF, BMP
- Support for various raw formats: CR2 (Canon), NEF (Nikon), ARW (Sony), ORF (Olympus), RW2 (Panasonic), PEF (Pentax), SRW (Samsung), DNG
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

## Future Roadmap

Here are some features we're planning to add in future releases:

- **Automatic GPX Naming**: Name GPX files automatically after the photo directory
- **Local Web Interface**: A browser-based interface running entirely on your device
  - Processes photos locally without any server uploads
  - Displays the extracted route on OpenStreetMap while keeping all data on your device
  - Creates GPX files directly on your computer
  - Allows sharing only the generated GPX file (never your original photos or personal metadata)
- **Time-based Filtering**: Process only photos within specific time windows
- **Route Smoothing**: Algorithm to reduce GPS inaccuracies
- **Statistics**: Calculate and display statistics like total distance, average speed, elevation profile
- **Batch Processing**: Process multiple directories at once with separate GPX outputs
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

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

The [example photos](examples/example_photos) are licensed under CC BY 4.0 by <a href="https://anil-oeztas.de" target="_blank">Anil Öztas</a>.
