# EXIF Reader API Reference

The `exif_reader` module provides functionality for extracting EXIF data from image files, focusing on GPS information.

## ExifReader Class

```python
class ExifReader:
    """Class for reading EXIF data from image files, focusing on GPS information."""
```

This class is responsible for extracting GPS data from image files using multiple methods to ensure maximum compatibility with different image formats.

## Key Features

- Supports a wide range of image formats including JPEG, TIFF, and RAW
- Extracts GPS coordinates, altitude, and timestamps
- Uses a fallback mechanism when primary extraction methods fail
- Handles error cases gracefully
- Provides detailed error information in verbose mode

## Method Reference

### `extract_gps_data(image_path)`

Extracts GPS data from an image file.

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

#### Parameters

- **image_path** (str): Path to the image file

#### Returns

- **dict or None**: Dictionary containing GPS information or None if no GPS data is found

#### Return Dictionary Structure

```python
{
    "latitude": float,     # Latitude in decimal degrees
    "longitude": float,    # Longitude in decimal degrees
    "altitude": float,     # Altitude in meters (optional)
    "timestamp": datetime, # Timestamp from photo (optional)
    "name": str            # Filename or identifier
}
```

#### Example Usage

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

### `_extract_gps_with_pillow(image_path)`

Extracts GPS data using Pillow as a fallback method.

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

This is an internal method that serves as a fallback when the primary extraction method fails. While not typically called directly, it's documented here for cases where specific Pillow-based extraction is needed.

### `_convert_to_degrees(value)`

Converts GPS coordinates from degrees, minutes, seconds format to decimal degrees.

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

This utility method is used internally during GPS data extraction but may be useful for custom processing of raw GPS data.

## How the ExifReader Works

The ExifReader uses a multi-strategy approach to extract GPS data:

1. **Primary Extraction** - Tries the `exifread` library first, which provides detailed and accurate EXIF information from most image formats
2. **Fallback Extraction** - If the primary method fails, falls back to Pillow (PIL) for basic EXIF data extraction
3. **Error Handling** - Catches exceptions from both methods and returns None if all extraction attempts fail
4. **Data Normalization** - Standardizes the extracted data into a consistent format regardless of the extraction method used

### Extraction Process Flow

```
+-------------------+
| Image File Input  |
+-------------------+
         |
         v
+-------------------+
| Try exifread      | --> Success --> Extract GPS Data
+-------------------+                      |
         |                                 v
         | Fail                    +-------------------+
         v                         | Convert to        |
+-------------------+              | Standard Format   |
| Try Pillow        | --> Success --> and Return      |
+-------------------+                      |
         |                                 v
         | Fail                    +-------------------+
         v                         | Return GPS Data   |
+-------------------+              | Dictionary        |
| Return None       |              +-------------------+
+-------------------+
```

## Supported Image Formats

The ExifReader is designed to work with a wide range of image formats:

- **JPEG/JFIF** - Full support through both extraction methods
- **TIFF** - Good support through both extraction methods
- **RAW Formats** - Support varies by format:
  - Canon CR2: Good support via exifread
  - Nikon NEF: Good support via exifread
  - Sony ARW: Good support via exifread
  - DNG: Good support via exifread
  - Others: Support depends on exifread's capabilities
- **PNG** - Limited EXIF support, as PNG typically doesn't contain much EXIF data
- **BMP** - No EXIF support (will always return None)

## Example Applications

### Batch Processing Multiple Images

```python
from pixtrail.exif_reader import ExifReader
import os
import csv

def extract_gps_to_csv(directory, output_csv):
    """Extract GPS data from all images in a directory and write to CSV."""
    results = []
    
    for filename in os.listdir(directory):
        if filename.lower().endswith(('.jpg', '.jpeg', '.tiff', '.png', '.nef', '.cr2', '.arw')):
            filepath = os.path.join(directory, filename)
            gps_data = ExifReader.extract_gps_data(filepath)
            
            if gps_data:
                results.append({
                    'filename': filename,
                    'latitude': gps_data['latitude'],
                    'longitude': gps_data['longitude'],
                    'altitude': gps_data.get('altitude', ''),
                    'timestamp': gps_data.get('timestamp', '')
                })
    
    # Write results to CSV
    with open(output_csv, 'w', newline='') as csvfile:
        fieldnames = ['filename', 'latitude', 'longitude', 'altitude', 'timestamp']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for data in results:
            writer.writerow(data)
    
    return len(results)

# Usage
count = extract_gps_to_csv('/path/to/photos', 'gps_data.csv')
print(f"Extracted GPS data from {count} images")
```

### Creating a Custom Extraction Function

```python
from pixtrail.exif_reader import ExifReader
from datetime import datetime

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
            
            # Add photo quality rating based on GPS accuracy (example)
            # This is hypothetical - EXIF doesn't typically include accuracy metrics
            lat_minutes = (gps_data['latitude'] % 1) * 60
            long_minutes = (gps_data['longitude'] % 1) * 60
            
            if lat_minutes % 1 == 0 and long_minutes % 1 == 0:
                # Even minutes suggest rounded data, possibly less accurate
                gps_data['quality'] = 'medium'
            else:
                gps_data['quality'] = 'high'
                
            return gps_data
        else:
            print(f"No GPS data found in {image_path}")
            return None
            
    except Exception as e:
        print(f"Error processing {image_path}: {e}")
        return None

# Usage
gps_data = extract_with_custom_handling("/path/to/image.jpg")
```

### Filtering Photos by Location

```python
from pixtrail.exif_reader import ExifReader
import os
import math

def distance_between_points(lat1, lon1, lat2, lon2):
    """Calculate distance between two points in kilometers using the Haversine formula."""
    # Earth radius in kilometers
    R = 6371.0
    
    # Convert degrees to radians
    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)
    
    # Differences
    dlat = lat2_rad - lat1_rad
    dlon = lon2_rad - lon1_rad
    
    # Haversine formula
    a = math.sin(dlat / 2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    return R * c

def find_photos_near_location(directory, target_lat, target_lon, radius_km):
    """Find photos taken within a specified radius of a target location."""
    nearby_photos = []
    
    for filename in os.listdir(directory):
        if filename.lower().endswith(('.jpg', '.jpeg', '.tiff', '.png', '.nef', '.cr2')):
            filepath = os.path.join(directory, filename)
            gps_data = ExifReader.extract_gps_data(filepath)
            
            if gps_data:
                distance = distance_between_points(
                    target_lat, target_lon, 
                    gps_data['latitude'], gps_data['longitude']
                )
                
                if distance <= radius_km:
                    nearby_photos.append({
                        'filename': filename,
                        'distance_km': round(distance, 2),
                        'gps_data': gps_data
                    })
    
    # Sort by distance
    nearby_photos.sort(key=lambda x: x['distance_km'])
    
    return nearby_photos

# Usage example: Find photos taken within 1km of the Eiffel Tower
photos = find_photos_near_location(
    '/path/to/photos',
    48.8584, 2.2945,  # Eiffel Tower coordinates
    1.0  # 1km radius
)

for photo in photos:
    print(f"{photo['filename']} - {photo['distance_km']}km away")
```

## Error Handling

The ExifReader includes robust error handling to deal with various issues:

- **Missing EXIF Data**: Returns None without raising exceptions
- **Corrupted EXIF Data**: Catches and logs exceptions, returns None
- **Unsupported File Formats**: Gracefully handles unsupported formats
- **File Access Issues**: Reports permission problems
- **Memory Limitations**: Manages memory efficiently when processing large RAW files

## Performance Considerations

When processing large numbers of images, consider the following:

- JPEG and TIFF files process much faster than RAW formats
- Consider using a multiprocessing approach for large batches
- Pillow-based extraction is faster but less accurate than exifread
- Memory usage can be high when processing RAW files

## Limitations

- Some image formats have limited or no EXIF support
- GPS data accuracy depends on the device that took the photo
- Altitude data may be missing or inaccurate in many photos
- Timestamp formats can vary between camera manufacturers
- Extracting GPS data from RAW files requires additional dependencies

## Related Modules

- [GPX Generator](gpx.md) - For creating GPX files from extracted GPS data
- [Core Module](core.md) - For high-level photo processing functionality
- [Utilities](utils.md) - For helper functions related to GPS data processing
