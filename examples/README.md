# PixTrail Examples

This directory contains examples and sample files for using PixTrail.

## Structure

- `example_photos/`: Contains sample photos with GPS EXIF data for testing PixTrail
- `example_output/`: Contains sample output GPX files generated from the example photos

## Usage Examples

### Basic Example

```python
from pixtrail.core import PixTrail

# Create a PixTrail object
pt = PixTrail()

# Process the example photos and generate a GPX file
pt.process_and_generate(
    "examples/example_photos", 
    "examples/example_output/basic_track.gpx"
)
```

### Advanced Example

```python
from pixtrail.core import PixTrail
from pixtrail.gpx_generator import GPXGenerator
import os

# Create a PixTrail object
pt = PixTrail()

# Process directory with recursive search
gps_data = pt.process_directory("examples/example_photos", recursive=True)

# Filter points by altitude (if available)
filtered_data = [
    point for point in gps_data 
    if point.get('altitude', 0) > 100  # Only include points above 100m
]

# Generate a filtered GPX file
output_path = os.path.join("examples/example_output", "filtered_track.gpx")
GPXGenerator.create_gpx(filtered_data, output_path)
```

## Adding Your Own Examples

To add your own examples:

1. Place geotagged photos in the `example_photos/` directory
2. Run PixTrail on these photos to generate GPX files in the `example_output/` directory
3. Ensure that you don't commit large photo files to the repository (they are excluded in `.gitignore`)

For privacy reasons, the sample photos are not included in the repository by default. You should use your own geotagged photos for testing PixTrail.