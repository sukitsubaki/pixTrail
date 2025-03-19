# PixTrail API Reference

This document provides a detailed reference for the PixTrail Python API.

## Core Module

The `core` module provides the main functionality of PixTrail.

### PixTrail Class

```python
class PixTrail:
    """Main class for extracting GPS data from images and generating GPX files."""
```

#### Methods

##### `__init__()`

Initialize a new PixTrail object.

```python
def __init__(self):
    """Initialize the PixTrail object."""
```

##### `process_directory(input_dir, recursive=False)`

Process all image files in a directory and extract GPS data.

```python
def process_directory(self, input_dir, recursive=False):
    """
    Process all image files in a directory and extract GPS data.
    
    Args:
        input_dir: Directory containing image files
        recursive: Whether to search recursively in subdirectories
    
    Returns:
        List of dictionaries containing GPS data extracted from images
    """
```

##### `generate_gpx(output_path, gps_data_list=None)`

Generate a GPX file from the extracted GPS data.

```python
def generate_gpx(self, output_path, gps_data_list=None):
    """
    Generate a GPX file from the extracted GPS data.
    
    Args:
        output_path: Path where the GPX file will be saved
        gps_data_list: List of dictionaries containing GPS data
                      (if None, use the data extracted by process_directory)
    
    Returns:
        bool: True if the GPX file was generated successfully, False otherwise
    """
```

##### `process_and_generate(input_dir, output_path=None, recursive=False)`

Process all images in a directory and generate a GPX file.

```python
def process_and_generate(self, input_dir, output_path=None, recursive=False):
    """
    Process all images in a directory and generate a GPX file.
    
    Args:
        input_dir: Directory containing image files
        output_path: Path where the GPX file will be saved
        recursive: Whether to search recursively in subdirectories
    
    Returns:
        bool: True if the GPX file was generated successfully, False otherwise
    """
```

## EXIF Reader Module

The `exif_reader` module provides functionality for extracting EXIF data from image files.

### ExifReader Class

```python
class ExifReader:
    """Class for reading EXIF data from image files, focusing on GPS information."""
```

#### Methods

##### `extract_gps_data(image_path)`

Extract GPS data from an image file.

```python
@staticmethod
def extract_gps_data(image_path):
    """
    Extract GPS data from an image file.

    Args:
        image_path: Path to the image file

    Returns:
        Dictionary containing GPS information (latitude, longitude, altitude, timestamp)
        or None if no GPS data is found
    """
```

##### `_extract_gps_with_pillow(image_path)`

Extract GPS data using Pillow as a fallback method.

```python
@staticmethod
def _extract_gps_with_pillow(image_path):
    """
    Extract GPS data using Pillow as a fallback method.
    
    Args:
        image_path: Path to the image file
        
    Returns:
        Dictionary containing GPS information or None if no GPS data is found
    """
```

##### `_convert_to_degrees(value)`

Convert GPS coordinates from degrees, minutes, seconds format to decimal degrees.

```python
@staticmethod
def _convert_to_degrees(value):
    """
    Convert GPS coordinates from degrees, minutes, seconds format to decimal degrees.
    
    Args:
        value: Tuple of (degrees, minutes, seconds)
        
    Returns:
        Decimal degrees as a float
    """
```

## GPX Generator Module

The `gpx_generator` module provides functionality for generating GPX files.

### GPXGenerator Class

```python
class GPXGenerator:
    """Class for generating GPX files from GPS data."""
```

#### Methods

##### `create_gpx(gps_data_list, output_path)`

Create a GPX file from a list of GPS data points.

```python
@staticmethod
def create_gpx(gps_data_list, output_path):
    """
    Create a GPX file from a list of GPS data points.
    
    Args:
        gps_data_list: List of dictionaries containing GPS data
                       (latitude, longitude, altitude, timestamp, name)
        output_path: Path where the GPX file will be saved
        
    Returns:
        bool: True if the GPX file was created successfully, False otherwise
    """
```

##### `add_waypoint_to_gpx(gpx_file, latitude, longitude, name=None, altitude=None, timestamp=None)`

Add a waypoint to an existing GPX file.

```python
@staticmethod
def add_waypoint_to_gpx(gpx_file, latitude, longitude, name=None, altitude=None, timestamp=None):
    """
    Add a waypoint to an existing GPX file. If the file doesn't exist, create it.
    
    Args:
        gpx_file: Path to the GPX file
        latitude: Waypoint latitude
        longitude: Waypoint longitude
        name: Waypoint name
        altitude: Waypoint altitude
        timestamp: Waypoint timestamp
        
    Returns:
        bool: True if the waypoint was added successfully, False otherwise
    """
```

## Utils Module

The `utils` module provides utility functions for the PixTrail package.

### Functions

#### `get_image_files(directory, recursive=False)`

Get a list of image files from a directory.

```python
def get_image_files(directory, recursive=False):
    """
    Get a list of image files from a directory.
    
    Args:
        directory: Directory to search for image files
        recursive: Whether to search recursively in subdirectories
        
    Returns:
        List of paths to image files
    """
```

#### `ensure_directory(directory)`

Ensure that a directory exists, create it if it doesn't.

```python
def ensure_directory(directory):
    """
    Ensure that a directory exists, create it if it doesn't.
    
    Args:
        directory: Directory path to ensure exists
        
    Returns:
        True if directory exists or was created successfully, False otherwise
    """
```

#### `get_default_output_path(input_dir, filename="track.gpx")`

Generate a default output path for the GPX file based on the input directory.

```python
def get_default_output_path(input_dir, filename="track.gpx"):
    """
    Generate a default output path for the GPX file based on the input directory.
    
    Args:
        input_dir: Input directory path
        filename: Name of the output file
        
    Returns:
        Default output path for the GPX file
    """
```

#### `validate_coordinates(latitude, longitude)`

Validate GPS coordinates.

```python
def validate_coordinates(latitude, longitude):
    """
    Validate GPS coordinates.
    
    Args:
        latitude: Latitude value to validate (-90 to 90)
        longitude: Longitude value to validate (-180 to 180)
        
    Returns:
        Tuple of (is_valid, error_message)
    """
```

## CLI Module

The `cli` module provides the command-line interface for PixTrail.

### Functions

#### `parse_args(args=None)`

Parse command-line arguments.

```python
def parse_args(args=None):
    """
    Parse command-line arguments.
    
    Args:
        args: Command-line arguments (if None, use sys.argv)
        
    Returns:
        Parsed arguments
    """
```

#### `main(args=None)`

Main entry point for the command-line interface.

```python
def main(args=None):
    """
    Main entry point for the command-line interface.
    
    Args:
        args: Command-line arguments (if None, use sys.argv)
        
    Returns:
        Exit code (0 for success, non-zero for failure)
    """
```