# GPX Generator API Reference

The `gpx_generator` module provides functionality for creating GPX files from GPS data extracted from photos.

## GPXGenerator Class

```python
class GPXGenerator:
    """Class for generating GPX files from GPS data."""
```

This class is responsible for creating GPX files from GPS data points, allowing you to visualize and share routes based on your photos.

## Key Features

- Creates GPX files from GPS data points
- Supports both waypoints and tracks
- Handles elevation and timestamp data
- Allows for custom metadata
- Provides fault-tolerant file generation

## Method Reference

### `create_gpx(gps_data_list, output_path)`

Creates a GPX file from a list of GPS data points.

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

#### Parameters

- **gps_data_list** (list): List of dictionaries containing GPS data with the following keys:
  - **latitude** (float): Decimal latitude (required)
  - **longitude** (float): Decimal longitude (required)
  - **altitude** (float): Altitude in meters (optional)
  - **timestamp** (datetime or str): Timestamp (optional)
  - **name** (str): Waypoint name (optional)
  
- **output_path** (str): Path where the GPX file will be saved

#### Returns

- **bool**: True if the GPX file was created successfully, False otherwise

#### Example Usage

```python
from pixtrail.gpx_generator import GPXGenerator
from datetime import datetime

# Create sample GPS data
gps_data = [
    {
        "latitude": 35.0394,
        "longitude": 135.7292,
        "altitude": 100.0,
        "timestamp": datetime(2023, 1, 1, 12, 0, 0),
        "name": "photo1.jpg"
    },
    {
        "latitude": 35.6812,
        "longitude": 139.7671,
        "altitude": 200.0,
        "timestamp": datetime(2023, 1, 2, 12, 0, 0),
        "name": "photo2.jpg"
    }
]

# Generate GPX file
success = GPXGenerator.create_gpx(gps_data, "/path/to/output.gpx")

if success:
    print("GPX file created successfully")
else:
    print("Failed to create GPX file")
```

### `add_waypoint_to_gpx(gpx_file, latitude, longitude, name=None, altitude=None, timestamp=None)`

Adds a waypoint to an existing GPX file or creates a new file if it doesn't exist.

```python
@staticmethod
def add_waypoint_to_gpx(gpx_file, latitude, longitude, name=None, altitude=None, timestamp=None):
    """
    Add a waypoint to an existing GPX file. If the file doesn't exist, create it.
    
    Args:
        gpx_file: Path to the GPX file
        latitude: Waypoint latitude
        longitude: Waypoint longitude
        name: Waypoint name (optional)
        altitude: Waypoint altitude (optional)
        timestamp: Waypoint timestamp (optional)
        
    Returns:
        bool: True if the waypoint was added successfully, False otherwise
    """
```

#### Parameters

- **gpx_file** (str): Path to the GPX file
- **latitude** (float): Waypoint latitude
- **longitude** (float): Waypoint longitude
- **name** (str, optional): Waypoint name
- **altitude** (float, optional): Waypoint altitude in meters
- **timestamp** (datetime or str, optional): Waypoint timestamp

#### Returns

- **bool**: True if the waypoint was added successfully, False otherwise

#### Example Usage

```python
from pixtrail.gpx_generator import GPXGenerator
from datetime import datetime

# Add a single waypoint to a GPX file
success = GPXGenerator.add_waypoint_to_gpx(
    "/path/to/output.gpx",
    35.0394,
    135.7292,
    name="Kinkaku-ji",
    altitude=100.0,
    timestamp=datetime.now()
)

if success:
    print("Waypoint added successfully")
else:
    print("Failed to add waypoint")
```

### `create_gpx_with_options(gps_data_list, output_path, add_track=True, add_timestamps=True, add_elevations=True, creator=None, name=None, description=None)`

Creates a GPX file with additional customization options.

```python
@staticmethod
def create_gpx_with_options(gps_data_list, output_path, add_track=True, add_timestamps=True, 
                           add_elevations=True, creator=None, name=None, description=None):
    """
    Create a GPX file with customization options.
    
    Args:
        gps_data_list: List of dictionaries containing GPS data
        output_path: Path where the GPX file will be saved
        add_track: Whether to add a track connecting the waypoints (default: True)
        add_timestamps: Whether to include timestamps in the GPX (default: True)
        add_elevations: Whether to include elevation data in the GPX (default: True)
        creator: GPX creator tag (default: "PixTrail")
        name: GPX name tag (optional)
        description: GPX description tag (optional)
        
    Returns:
        bool: True if the GPX file was created successfully, False otherwise
    """
```

This method provides more control over GPX file generation than the basic `create_gpx` method.

#### Example Usage

```python
from pixtrail.gpx_generator import GPXGenerator

# Create a custom GPX file
success = GPXGenerator.create_gpx_with_options(
    gps_data_list,
    "/path/to/custom.gpx",
    add_track=True,
    add_timestamps=True,
    add_elevations=True,
    creator="My Custom Application",
    name="My Journey",
    description="Photos from my vacation"
)
```

## GPX File Structure

The GPX files generated by the GPXGenerator include:

1. **Metadata**: Information about the GPX file itself
   - **Creator**: Application that created the file
   - **Name**: Optional name for the GPX file
   - **Description**: Optional description
   - **Time**: Creation time

2. **Waypoints**: Individual points representing each photo
   - **Latitude/Longitude**: Geographic coordinates
   - **Elevation**: Altitude data (if available)
   - **Time**: Timestamp (if available)
   - **Name**: Photo filename or custom name

3. **Track**: A continuous path connecting all the waypoints
   - **Track Segment**: A collection of track points
   - **Track Points**: Points matching the waypoints but arranged in a segment

### Example GPX Structure

```xml
<?xml version="1.0" encoding="UTF-8"?>
<gpx xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd" version="1.1" creator="PixTrail">
  <metadata>
    <name>My Journey</name>
    <desc>Photos from my vacation</desc>
    <time>2023-01-10T12:00:00Z</time>
  </metadata>
  <wpt lat="35.0394" lon="135.7292">
    <ele>100.0</ele>
    <time>2023-01-01T12:00:00Z</time>
    <name>photo1.jpg</name>
  </wpt>
  <wpt lat="35.6812" lon="139.7671">
    <ele>200.0</ele>
    <time>2023-01-02T12:00:00Z</time>
    <name>photo2.jpg</name>
  </wpt>
  <trk>
    <name>My Journey</name>
    <trkseg>
      <trkpt lat="35.0394" lon="135.7292">
        <ele>100.0</ele>
        <time>2023-01-01T12:00:00Z</time>
      </trkpt>
      <trkpt lat="35.6812" lon="139.7671">
        <ele>200.0</ele>
        <time>2023-01-02T12:00:00Z</time>
      </trkpt>
    </trkseg>
  </trk>
</gpx>
```

## How the GPX Generator Works

The GPXGenerator uses the `gpxpy` library to create and manipulate GPX files. The process is as follows:

1. Create a new GPX object or load an existing one
2. Add metadata (creator, name, description, time)
3. Add waypoints for each GPS data point
4. Create a track to connect the waypoints (if requested)
5. Add track points to match the waypoints
6. Sort waypoints and track points by timestamp if available
7. Write the GPX file to the specified output path

## Advanced Usage Examples

### Creating a GPX File with Custom Metadata

```python
import gpxpy
import gpxpy.gpx
from datetime import datetime
from pixtrail.gpx_generator import GPXGenerator

# Create a custom GPX file with detailed metadata
def create_custom_gpx(gps_data_list, output_path, journey_name, author=None, keywords=None):
    # Create a new GPX object
    gpx = gpxpy.gpx.GPX()
    
    # Set the creator
    gpx.creator = "PixTrail - Custom GPX Creator"
    
    # Add metadata
    gpx.name = journey_name
    
    # Create metadata extensions for additional information
    if author or keywords:
        gpx.metadata = gpxpy.gpx.GPXMetadata()
        gpx.metadata.author_name = author
        
        # Add custom extensions
        if keywords:
            nsmap = {None: 'http://www.topografix.com/GPX/1/1', 
                    'pixtrail': 'http://www.example.com/pixtrail/1/0'}
            
            keywords_str = ','.join(keywords)
            extension = f'<pixtrail:keywords>{keywords_str}</pixtrail:keywords>'
            gpx.metadata.extensions = extension
    
    # Add waypoints
    for point in gps_data_list:
        # Create waypoint
        waypoint = gpxpy.gpx.GPXWaypoint(
            latitude=point['latitude'],
            longitude=point['longitude'],
            elevation=point.get('altitude', 0),
            time=point.get('timestamp'),
            name=point.get('name', 'Unknown')
        )
        gpx.waypoints.append(waypoint)
    
    # Create a track
    track = gpxpy.gpx.GPXTrack()
    track.name = journey_name
    gpx.tracks.append(track)
    
    # Create a segment
    segment = gpxpy.gpx.GPXTrackSegment()
    track.segments.append(segment)
    
    # Sort points by timestamp if available
    sorted_points = sorted(gps_data_list, 
                          key=lambda x: x.get('timestamp', datetime.min))
    
    # Add track points
    for point in sorted_points:
        track_point = gpxpy.gpx.GPXTrackPoint(
            latitude=point['latitude'],
            longitude=point['longitude'],
            elevation=point.get('altitude', 0),
            time=point.get('timestamp')
        )
        segment.points.append(track_point)
    
    # Write to file
    try:
        with open(output_path, 'w') as f:
            f.write(gpx.to_xml())
        return True
    except Exception as e:
        print(f"Error creating GPX file: {e}")
        return False

# Usage example
gps_data = [
    {"latitude": 35.0394, "longitude": 135.7292, "timestamp": datetime(2023, 1, 1, 12, 0, 0)},
    {"latitude": 35.6812, "longitude": 139.7671, "timestamp": datetime(2023, 1, 2, 12, 0, 0)}
]

success = create_custom_gpx(
    gps_data,
    "/path/to/custom.gpx",
    journey_name="Japan Trip 2023",
    author="Traveler",
    keywords=["japan", "kyoto", "tokyo", "vacation"]
)
```

### Creating Multiple GPX Files by Date

```python
from pixtrail.exif_reader import ExifReader
from pixtrail.gpx_generator import GPXGenerator
import os
from datetime import datetime
from collections import defaultdict

def process_by_date(photo_directory, output_dir):
    """Process photos and create separate GPX files by date."""
    # Ensure output directory exists
    os.makedirs(output_dir, exist_ok=True)
    
    # Get all image files
    image_files = []
    for root, _, files in os.walk(photo_directory):
        for file in files:
            if file.lower().endswith(('.jpg', '.jpeg', '.tiff', '.png', '.nef', '.cr2')):
                image_files.append(os.path.join(root, file))
    
    # Extract GPS data
    gps_data_list = []
    for image_file in image_files:
        gps_data = ExifReader.extract_gps_data(image_file)
        if gps_data:
            gps_data_list.append(gps_data)
    
    # Group by date
    data_by_date = defaultdict(list)
    for point in gps_data_list:
        if 'timestamp' in point:
            # Extract date string (YYYY-MM-DD)
            if isinstance(point['timestamp'], datetime):
                date_str = point['timestamp'].strftime('%Y-%m-%d')
            else:
                # If timestamp is already a string, extract date part
                date_str = str(point['timestamp']).split('T')[0]
            
            data_by_date[date_str].append(point)
        else:
            # If no timestamp, put in "unknown" group
            data_by_date["unknown"].append(point)
    
    # Create GPX files for each date
    results = {}
    for date_str, data in data_by_date.items():
        output_path = os.path.join(output_dir, f"{date_str}.gpx")
        success = GPXGenerator.create_gpx_with_options(
            data, 
            output_path,
            name=f"Journey on {date_str}",
            description=f"Photos taken on {date_str}"
        )
        results[date_str] = {
            'success': success,
            'count': len(data),
            'path': output_path
        }
    
    return results

# Usage example
results = process_by_date("/path/to/photos", "/path/to/output")

# Print results
for date, result in results.items():
    status = "Success" if result['success'] else "Failed"
    print(f"{date}: {status} - {result['count']} photos - {result['path']}")
```

### Merging Multiple GPX Files

```python
import gpxpy
import os
from datetime import datetime
from pixtrail.gpx_generator import GPXGenerator

def merge_gpx_files(input_files, output_file):
    """Merge multiple GPX files into a single file."""
    # Create a new GPX object for the merged output
    merged_gpx = gpxpy.gpx.GPX()
    merged_gpx.creator = "PixTrail GPX Merger"
    
    # Add metadata
    merged_gpx.name = "Merged GPX File"
    merged_gpx.description = f"Merged from {len(input_files)} GPX files"
    merged_gpx.time = datetime.now()
    
    # Create a track for the merged data
    merged_track = gpxpy.gpx.GPXTrack()
    merged_track.name = "Merged Track"
    merged_gpx.tracks.append(merged_track)
    
    # Create a segment
    merged_segment = gpxpy.gpx.GPXTrackSegment()
    merged_track.segments.append(merged_segment)
    
    # Store all waypoints
    all_waypoints = []
    all_points = []
    
    # Process each input file
    for input_file in input_files:
        try:
            with open(input_file, 'r') as f:
                gpx = gpxpy.parse(f)
                
                # Add waypoints
                for waypoint in gpx.waypoints:
                    all_waypoints.append(waypoint)
                
                # Extract track points
                for track in gpx.tracks:
                    for segment in track.segments:
                        for point in segment.points:
                            all_points.append(point)
        except Exception as e:
            print(f"Error processing {input_file}: {e}")
    
    # Sort points by time if available
    all_points_with_time = [(p, p.time) for p in all_points]
    all_points_with_time.sort(key=lambda x: x[1] if x[1] else datetime.min)
    
    # Add sorted points to the merged segment
    for point, _ in all_points_with_time:
        merged_segment.points.append(point)
    
    # Sort and add waypoints
    all_waypoints_with_time = [(w, w.time) for w in all_waypoints]
    all_waypoints_with_time.sort(key=lambda x: x[1] if x[1] else datetime.min)
    
    for waypoint, _ in all_waypoints_with_time:
        merged_gpx.waypoints.append(waypoint)
    
    # Write the merged GPX to file
    try:
        with open(output_file, 'w') as f:
            f.write(merged_gpx.to_xml())
        return True
    except Exception as e:
        print(f"Error writing merged GPX file: {e}")
        return False

# Usage example
input_files = [
    "/path/to/day1.gpx",
    "/path/to/day2.gpx",
    "/path/to/day3.gpx"
]

success = merge_gpx_files(input_files, "/path/to/merged_trip.gpx")
if success:
    print("Successfully merged GPX files")
else:
    print("Failed to merge GPX files")
```

## Error Handling

The GPXGenerator includes error handling for various scenarios:

- If the GPS data list is empty, the function returns `False`
- If there is an error creating the output directory, an error message is printed
- If there is an error writing the GPX file, an error message is printed
- Any other exceptions during GPX creation are caught and logged

## GPX Compatibility

The GPX files generated by PixTrail are compatible with most GPS and mapping applications, including:

- Google Earth
- OpenStreetMap
- Garmin GPS devices
- Strava and other fitness tracking apps
- GIS software like QGIS

The GPX files follow the GPX 1.1 schema, which is the most widely supported version.

## Limitations

- The GPX file format has some limitations, such as not supporting image embedding
- Large numbers of waypoints can make the GPX file large and potentially slow to load in some applications
- Some GPX viewers might not support all features (like elevation or timestamps)
- Custom extensions might not be recognized by all GPX viewers

## Related Modules

- [EXIF Reader](exif.md) - For extracting GPS data from photos
- [Core Module](core.md) - For high-level photo processing functionality
- [Utilities](utils.md) - For helper functions related to GPX file handling
