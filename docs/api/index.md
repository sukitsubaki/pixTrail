# PixTrail API Documentation

This section provides comprehensive documentation for the PixTrail API, covering both the JavaScript client-side API and the Python backend API.

## API Overview

PixTrail's API is organized into several modules that provide specific functionality:

### Python Backend API

- [Core Module](core.md) - Main functionality for processing photos and generating GPX files
- [EXIF Reader](exif.md) - Extracts GPS and other metadata from image files
- [GPX Generator](gpx.md) - Creates GPX files from GPS data
- [Utilities](utils.md) - Helper functions for various operations

### JavaScript Client API

- [API Client](core.md#api-client) - Handles communication with the server
- [Map Visualization](core.md#map-visualization) - Displays maps and routes
- [Statistics](core.md#statistics) - Calculates and displays route statistics
- [File Upload](core.md#file-upload) - Manages file selection and uploading
- [EXIF Reader Client](core.md#exif-reader) - Client-side EXIF data extraction
- [Utilities](utils.md) - Browser-side helper functions

## Getting Started with the Python API

To use PixTrail in your Python code, start by importing the core module:

```python
from pixtrail.core import PixTrail

# Create a PixTrail instance
pt = PixTrail()

# Process photos and generate a GPX file
result = pt.process_and_generate(
    input_dir="/path/to/photos", 
    output_file="/path/to/output.gpx",
    recursive=True
)

if result['success']:
    print(f"Successfully processed {result['stats']['processed']} photos")
    print(f"GPX file created at: {result['output_file']}")
else:
    print("Processing failed:", result['message'])
```

## Getting Started with the JavaScript API

The JavaScript API is primarily used within the web interface, but you can also integrate it into your own web applications:

```javascript
// Import the required modules
import { APIClient } from './api/apiClient.js';
import { MapVisualization } from './modules/mapVisualization.js';
import { Statistics } from './modules/statistics.js';

// Initialize the map
const map = new MapVisualization({
    mapContainer: document.getElementById('map-container'),
    mapElement: document.getElementById('map')
});

// Process photos using the API client
const formData = new FormData();
formData.append('photos', fileInput.files);

APIClient.submitPhotos(formData, (progress) => {
    console.log(`Upload progress: ${Math.round((progress.loaded / progress.total) * 100)}%`);
})
.then(response => {
    return APIClient.processPhotos(response.session_id);
})
.then(data => {
    // Display waypoints on the map
    map.setWaypoints(data.waypoints);
    
    // Initialize statistics with the waypoints
    const statistics = new Statistics({
        container: document.getElementById('statistics-container')
    });
    statistics.setWaypoints(data.waypoints);
    statistics.show();
})
.catch(error => {
    console.error('Error processing photos:', error);
});
```

## API Modules in Detail

Each API module is documented in detail on its own page:

- [Core Module](core.md) - The heart of PixTrail, handling photo processing and GPX generation
- [EXIF Reader](exif.md) - Specialized module for extracting EXIF data from images
- [GPX Generator](gpx.md) - Creates and manipulates GPX files
- [Utilities](utils.md) - Common utility functions used throughout the application

## Using the Python API

### Basic Photo Processing

```python
from pixtrail.core import PixTrail

pt = PixTrail()

# Process a directory of photos
result = pt.process_directory("/path/to/photos", recursive=True)

# Extract the GPS data
gps_data = result['gps_data']

# Generate a GPX file from the GPS data
pt.generate_gpx("/path/to/output.gpx")
```

### Advanced Processing Options

The Python API supports various options for customized processing:

```python
from pixtrail.core import PixTrail

pt = PixTrail()

# Process with custom options
result = pt.process_directory(
    input_dir="/path/to/photos",
    recursive=True,
    min_photos=5,  # Require at least 5 photos with GPS data
    file_types=[".jpg", ".jpeg"],  # Process only these file types
    exclude_dirs=["private", "unwanted"],  # Skip these directories
    verbose=True  # Show detailed progress
)

# Generate GPX with custom options
if result['stats']['processed'] > 0:
    pt.generate_gpx(
        output_file="/path/to/output.gpx",
        add_track=True,  # Include a track connecting waypoints
        add_elevations=True,  # Include elevation data
        add_timestamps=True,  # Include timestamps
        creator="My Custom Application"  # Custom creator tag
    )
```

### Direct GPX Generation

You can also generate GPX files directly from GPS data:

```python
from pixtrail.gpx_generator import GPXGenerator

# Custom GPS data
gps_data = [
    {
        "latitude": 35.0394,
        "longitude": 135.7292,
        "altitude": 100.0,
        "timestamp": "2023-01-01T12:00:00Z",
        "name": "Kinkaku-ji Temple"
    },
    {
        "latitude": 35.0395,
        "longitude": 135.7296,
        "altitude": 101.0,
        "timestamp": "2023-01-01T12:15:00Z",
        "name": "Garden View"
    }
]

# Generate a GPX file from the custom data
GPXGenerator.create_gpx(gps_data, "/path/to/custom.gpx")
```

## Using the JavaScript API

### Map Visualization

```javascript
import { MapVisualization } from './modules/mapVisualization.js';

// Initialize the map
const map = new MapVisualization({
    mapContainer: document.getElementById('map-container'),
    mapElement: document.getElementById('map')
});

// Set waypoints
const waypoints = [
    { latitude: 35.0394, longitude: 135.7292, name: "Point 1", timestamp: "2023-01-01T12:00:00Z" },
    { latitude: 35.0395, longitude: 135.7296, name: "Point 2", timestamp: "2023-01-01T12:15:00Z" }
];
map.setWaypoints(waypoints);

// Enable additional features
map.showHeatmap();
map.enableClustering();
```

### Browser-Side EXIF Extraction

```javascript
import { ExifReader } from './modules/exifReader.js';

// Get file input element
const fileInput = document.getElementById('file-input');

// Process files when selected
fileInput.addEventListener('change', async () => {
    const files = fileInput.files;
    
    try {
        // Extract GPS data directly in the browser
        const gpsData = await ExifReader.extractGpsDataFromImages(files, (current, total) => {
            const percent = Math.round((current / total) * 100);
            console.log(`Processing: ${percent}%`);
        });
        
        // Use the extracted GPS data
        console.log('GPS data extracted:', gpsData);
    } catch (error) {
        console.error('Error extracting GPS data:', error);
    }
});
```

## API Integration Examples

### Creating a Custom Processing Script

```python
#!/usr/bin/env python3
import os
import sys
from pixtrail.core import PixTrail
from pixtrail.gpx_generator import GPXGenerator

def process_trip_photos(base_dir, output_dir):
    """Process photos from a trip organized by day."""
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Get all day directories
    day_dirs = [d for d in os.listdir(base_dir) if os.path.isdir(os.path.join(base_dir, d))]
    
    # Initialize PixTrail
    pt = PixTrail()
    
    # Process each day
    all_gps_data = []
    for day_dir in sorted(day_dirs):
        day_path = os.path.join(base_dir, day_dir)
        day_output = os.path.join(output_dir, f"{day_dir}.gpx")
        
        print(f"Processing {day_dir}...")
        
        # Process the day's photos
        result = pt.process_and_generate(day_path, day_output)
        
        if result['success']:
            print(f"  Created {day_output} with {result['stats']['processed']} photos")
            # Collect all GPS data for the combined file
            all_gps_data.extend(result['gps_data'])
        else:
            print(f"  Failed to process {day_dir}: {result.get('message', 'Unknown error')}")
    
    # Create a combined GPX file for the entire trip
    if all_gps_data:
        combined_output = os.path.join(output_dir, "complete_trip.gpx")
        if GPXGenerator.create_gpx(all_gps_data, combined_output):
            print(f"Created combined GPX file: {combined_output}")
    
    return len(all_gps_data)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: process_trip.py <photos_directory> <output_directory>")
        sys.exit(1)
    
    total_points = process_trip_photos(sys.argv[1], sys.argv[2])
    print(f"Total GPS points processed: {total_points}")
```

### Building a Custom Web Interface

```javascript
// This is a simplified example to demonstrate API usage
import { APIClient } from './api/apiClient.js';
import { MapVisualization } from './modules/mapVisualization.js';
import { Statistics } from './modules/statistics.js';
import { ExifReader } from './modules/exifReader.js';
import { FileUpload } from './modules/fileUpload.js';

// Initialize map
const map = new MapVisualization({
    mapContainer: document.getElementById('map-container'),
    mapElement: document.getElementById('map')
});

// Initialize file upload
const fileUpload = new FileUpload({
    formElement: document.getElementById('upload-form'),
    fileInput: document.getElementById('file-input'),
    submitButton: document.getElementById('submit-button'),
    progressContainer: document.getElementById('progress-container'),
    progressBar: document.getElementById('progress-bar'),
    progressText: document.getElementById('progress-text'),
    onSuccess: (result) => {
        // Process the result
        processGpsData(result.gps_data);
    }
});

// Initialize statistics
const statistics = new Statistics({
    container: document.getElementById('statistics-container'),
    toggleButton: document.getElementById('toggle-statistics')
});

// Process client-side or send to server depending on file type
async function processPhotos(files) {
    const jpegFiles = Array.from(files).filter(file => 
        file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/tiff');
    const otherFiles = Array.from(files).filter(file => 
        !(file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/tiff'));
    
    let allGpsData = [];
    
    // Process JPEG files in the browser
    if (jpegFiles.length > 0) {
        try {
            const gpsData = await ExifReader.extractGpsDataFromImages(jpegFiles, updateProgress);
            allGpsData = allGpsData.concat(gpsData);
        } catch (error) {
            console.error('Error processing JPEG files:', error);
        }
    }
    
    // Process other files via server
    if (otherFiles.length > 0) {
        try {
            const formData = new FormData();
            otherFiles.forEach(file => formData.append('photos', file));
            
            const response = await APIClient.submitPhotos(formData, updateProgress);
            const result = await APIClient.processPhotos(response.session_id);
            allGpsData = allGpsData.concat(result.gps_data);
        } catch (error) {
            console.error('Error processing files via server:', error);
        }
    }
    
    return allGpsData;
}

function processGpsData(gpsData) {
    // Set waypoints on the map
    map.setWaypoints(gpsData);
    
    // Update statistics
    statistics.setWaypoints(gpsData);
    statistics.show();
    
    // Enable map features
    document.getElementById('map-controls').classList.remove('hidden');
}

function updateProgress(progress) {
    const percent = Math.round((progress.loaded / progress.total) * 100);
    document.getElementById('progress-bar').style.width = `${percent}%`;
    document.getElementById('progress-text').textContent = `${percent}%`;
}

// Set up event listeners for the custom UI
document.getElementById('toggle-heatmap').addEventListener('click', () => {
    map.toggleHeatmap();
});

document.getElementById('toggle-clustering').addEventListener('click', () => {
    map.toggleClustering();
});

document.getElementById('download-gpx').addEventListener('click', async () => {
    try {
        const gpsData = map.getWaypoints();
        if (gpsData.length > 0) {
            const response = await APIClient.createGPX(gpsData);
            if (response.success) {
                APIClient.downloadGPX(response.session_id, response.filename);
            }
        }
    } catch (error) {
        console.error('Error creating GPX file:', error);
    }
});
```

## Data Structures

### GPS Data Format

The standard GPS data format used throughout the API:

```javascript
{
    latitude: Number,    // Decimal degrees (required)
    longitude: Number,   // Decimal degrees (required)
    altitude: Number,    // Meters above sea level (optional)
    timestamp: String,   // ISO 8601 timestamp (optional)
    name: String         // Identifier, typically filename (optional)
}
```

### Processing Result Format

The standard result object returned by processing functions:

```javascript
{
    success: Boolean,    // Whether processing was successful
    message: String,     // Status message or error description
    stats: {
        processed: Number,  // Number of photos with GPS data
        total: Number,      // Total number of photos processed
        skipped: Number     // Number of photos without GPS data
    },
    gps_data: Array,     // Array of GPS data objects
    output_file: String  // Path to the generated GPX file (if applicable)
}
```

## API Change Log

### Version 1.0.0
- Initial API release

### Version 1.1.0
- Added client-side EXIF extraction for JPEG and TIFF files
- Improved error handling in GPX generation
- Added support for batch processing in Python API

### Version 1.2.0
- Added heatmap visualization module
- Added marker clustering module
- Enhanced statistics calculation and visualization
- Improved handling of photos without timestamps

## API Roadmap

Planned future API enhancements:

- Video file GPS extraction
- Support for custom GPX track styling
- Filtering and analysis functions
- Integration with online mapping services
- Mobile-friendly APIs
- Geofencing and region detection
