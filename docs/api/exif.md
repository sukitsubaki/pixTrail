# EXIF Reader API Reference

The `exif_reader` module provides functionality for extracting EXIF data from image files, focusing on GPS information.

## ExifReader Class

```python
class ExifReader:
    """Class for reading EXIF data from image files, focusing on GPS information."""
```

This class is responsible for extracting GPS data from image files.

### Methods

#### `extract_gps_data(image_path)`

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

Example:
```python
from pixtrail.exif_reader import ExifReader

# Extract GPS data from a single image
gps_data = ExifReader.extract_gps_data("/path/to/image.jpg")

if gps_data:
    print(f"Latitude: {gps_data['latitude']}")
    print(f"Longitude: {gps_data['longitude']}")
    if 'altitude' in gps_data:
        print(f"Altitude: {gps_data['altitude']} meters")
    if 'timestamp' in gps_data:
        print(f"Timestamp: {gps_data['timestamp']}")
else:
    print("No GPS data found in the image")
```

The returned GPS data is a dictionary with the following structure:
```python
{
    "latitude": float,     # Latitude in decimal degrees
    "longitude": float,    # Longitude in decimal degrees
    "altitude": float,     # Altitude in meters (optional)
    "timestamp": datetime, # Timestamp from photo (optional)
    "name": str            # Filename or identifier
}
```

#### `_extract_gps_with_pillow(image_path)`

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

This is an internal method that is used as a fallback when the primary extraction method fails. It's not typically called directly but can be useful in specific scenarios where you want to use Pillow explicitly.

Example:
```python
from pixtrail.exif_reader import ExifReader

# Extract GPS data using Pillow specifically
gps_data = ExifReader._extract_gps_with_pillow("/path/to/image.jpg")
```

#### `_convert_to_degrees(value)`

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

This is an internal utility method used during GPS data extraction. It's not typically called directly but can be useful if you're working with raw EXIF GPS coordinates.

Example:
```python
from pixtrail.exif_reader import ExifReader

# Convert DMS (degrees, minutes, seconds) to decimal degrees
dms = (35, 2, 21.84)  # 35 degrees, 2 minutes, 21.84 seconds
decimal_degrees = ExifReader._convert_to_degrees(dms)
print(f"Decimal degrees: {decimal_degrees}")  # Output: 35.03940
```

## How the ExifReader Works

The ExifReader class uses a two-step approach to extract GPS data:

1. First, it tries to use the `exifread` library, which is more reliable for GPS data
2. If that fails (due to unsupported format or missing EXIF data), it falls back to using `Pillow`

This approach provides maximum compatibility with different image formats, including:
- JPEG/JFIF
- TIFF
- RAW formats (CR2, NEF, ARW, etc.)
- PNG (limited EXIF support)

## GPS Data Extraction Process

1. The image file is opened and its EXIF data is read
2. The GPS-related tags are extracted (latitude, longitude, altitude, etc.)
3. The coordinates are converted from degrees, minutes, seconds (DMS) to decimal degrees
4. The timestamp is extracted from the EXIF DateTime tag if available
5. All data is combined into a dictionary and returned

## Error Handling

The ExifReader is designed to be robust against various edge cases:

- Images without EXIF data return `None`
- Images with EXIF data but no GPS information return `None`
- If the primary extraction method fails, the fallback method is tried
- Any exceptions during extraction are caught and logged

## Advanced Usage Examples

### Batch Processing Multiple Images

```python
from pixtrail.exif_reader import ExifReader
import os

def batch_extract_gps(directory):
    """Extract GPS data from all images in a directory."""
    results = []
    
    for filename in os.listdir(directory):
        if filename.lower().endswith(('.jpg', '.jpeg', '.tiff', '.png')):
            filepath = os.path.join(directory, filename)
            gps_data = ExifReader.extract_gps_data(filepath)
            
            if gps_data:
                results.append(gps_data)
    
    return results

# Extract GPS data from all images in a directory
gps_data_list = batch_extract_gps("/path/to/photos")
print(f"Found GPS data in {len(gps_data_list)} images")
```

### Creating a Custom Extraction Function

```python
from pixtrail.exif_reader import ExifReader

def extract_with_custom_handling(image_path):
    """Extract GPS data with custom error handling and default values."""
    try:
        gps_data = ExifReader.extract_gps_data(image_path)
        
        if gps_data:
            # Add default altitude if missing
            if 'altitude' not in gps_data:
                gps_data['altitude'] = 0.0
                
            # Add custom fields
            gps_data['source'] = 'photo'
            gps_data['processed_at'] = datetime.now()
            
            return gps_data
        else:
            print(f"No GPS data found in {image_path}")
            return None
            
    except Exception as e:
        print(f"Error processing {image_path}: {e}")
        return None

# Use the custom function
gps_data = extract_with_custom_handling("/path/to/image.jpg")
```

## Limitations

- Some image formats have limited or no EXIF support
- GPS data accuracy depends on the device that took the photo
- Altitude data may be missing or inaccurate in many photos
- Timestamp formats can vary between camera manufacturers