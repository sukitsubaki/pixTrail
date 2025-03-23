# PixTrail Core Modules

This page documents the core modules that form the backbone of PixTrail. These modules implement the main features of the application and provide the foundation for both the command-line interface and the web application.

## Core Python Module

The `core.py` module contains the main functionality of PixTrail, providing a high-level interface for processing photos and generating GPX files.

### PixTrail Class

```python
class PixTrail:
    """Main class for processing photos and generating GPX files."""
```

#### Methods

##### `process_directory(input_dir, recursive=False, min_photos=1, file_types=None, exclude_dirs=None, verbose=False)`

```python
def process_directory(self, input_dir, recursive=False, min_photos=1, file_types=None, exclude_dirs=None, verbose=False):
    """
    Process photos in a directory to extract GPS data.
    
    Args:
        input_dir (str): Directory containing photos with GPS data
        recursive (bool): Whether to search subdirectories recursively
        min_photos (int): Minimum number of photos with GPS data required
        file_types (list): List of file extensions to process (default: None = all supported)
        exclude_dirs (list): List of directory names to exclude
        verbose (bool): Whether to print detailed information
        
    Returns:
        dict: Dictionary containing result information
    """
```

Example:
```python
from pixtrail.core import PixTrail

pt = PixTrail()
result = pt.process_directory(
    input_dir="/path/to/photos",
    recursive=True,
    file_types=[".jpg", ".jpeg", ".tiff"]
)

if result["success"]:
    print(f"Processed {result['stats']['processed']} photos with GPS data")
    print(f"Total photos scanned: {result['stats']['total']}")
    
    # Access the extracted GPS data
    gps_data = result["gps_data"]
```

##### `generate_gpx(output_file=None, add_track=True, add_timestamps=True, add_elevations=True, creator=None)`

```python
def generate_gpx(self, output_file=None, add_track=True, add_timestamps=True, add_elevations=True, creator=None):
    """
    Generate a GPX file from previously processed GPS data.
    
    Args:
        output_file (str): Path where GPX file will be saved (default: auto-named)
        add_track (bool): Whether to add a track connecting waypoints
        add_timestamps (bool): Whether to include timestamps
        add_elevations (bool): Whether to include elevation data
        creator (str): GPX creator tag (default: "PixTrail")
        
    Returns:
        dict: Dictionary containing result information
    """
```

Example:
```python
# After processing a directory
result = pt.generate_gpx(
    output_file="/path/to/output.gpx",
    add_track=True,
    creator="MyCustomApplication"
)

if result["success"]:
    print(f"GPX file created at: {result['output_file']}")
```

##### `process_and_generate(input_dir, output_file=None, recursive=False, min_photos=1, file_types=None, exclude_dirs=None, add_track=True, add_timestamps=True, add_elevations=True, creator=None, verbose=False)`

```python
def process_and_generate(self, input_dir, output_file=None, recursive=False, min_photos=1, file_types=None, exclude_dirs=None, add_track=True, add_timestamps=True, add_elevations=True, creator=None, verbose=False):
    """
    Process photos and generate a GPX file in a single step.
    
    Args:
        input_dir (str): Directory containing photos with GPS data
        output_file (str): Path where GPX file will be saved (default: auto-named)
        recursive (bool): Whether to search subdirectories recursively
        min_photos (int): Minimum number of photos with GPS data required
        file_types (list): List of file extensions to process
        exclude_dirs (list): List of directory names to exclude
        add_track (bool): Whether to add a track connecting waypoints
        add_timestamps (bool): Whether to include timestamps
        add_elevations (bool): Whether to include elevation data
        creator (str): GPX creator tag (default: "PixTrail")
        verbose (bool): Whether to print detailed information
        
    Returns:
        dict: Dictionary containing result information
    """
```

Example:
```python
from pixtrail.core import PixTrail

pt = PixTrail()
result = pt.process_and_generate(
    input_dir="/path/to/photos",
    output_file="/path/to/output.gpx",
    recursive=True,
    verbose=True
)

if result["success"]:
    print(f"Successfully processed {result['stats']['processed']} photos")
    print(f"GPX file created at: {result['output_file']}")
else:
    print(f"Failed: {result['message']}")
```

##### `batch_process(input_dirs, output_dir=None, recursive=False, min_photos=1, file_types=None, exclude_dirs=None, add_track=True, add_timestamps=True, add_elevations=True, creator=None, verbose=False)`

```python
def batch_process(self, input_dirs, output_dir=None, recursive=False, min_photos=1, file_types=None, exclude_dirs=None, add_track=True, add_timestamps=True, add_elevations=True, creator=None, verbose=False):
    """
    Process multiple directories in batch mode.
    
    Args:
        input_dirs (list): List of directories to process
        output_dir (str): Directory where GPX files will be saved (default: same as input)
        recursive (bool): Whether to search subdirectories recursively
        min_photos (int): Minimum number of photos with GPS data required
        file_types (list): List of file extensions to process
        exclude_dirs (list): List of directory names to exclude
        add_track (bool): Whether to add a track connecting waypoints
        add_timestamps (bool): Whether to include timestamps
        add_elevations (bool): Whether to include elevation data
        creator (str): GPX creator tag (default: "PixTrail")
        verbose (bool): Whether to print detailed information
        
    Returns:
        dict: Dictionary containing result information for each input directory
    """
```

Example:
```python
from pixtrail.core import PixTrail

pt = PixTrail()
results = pt.batch_process(
    input_dirs=["/path/to/trip1", "/path/to/trip2", "/path/to/trip3"],
    output_dir="/path/to/gpx_files",
    recursive=True
)

for dir_name, result in results.items():
    if result["success"]:
        print(f"{dir_name}: Success - {result['stats']['processed']} photos - {result['output_file']}")
    else:
        print(f"{dir_name}: Failed - {result['message']}")
```

### Return Value Format

Most methods in the PixTrail class return a dictionary with the following structure:

```python
{
    "success": bool,       # Whether the operation was successful
    "message": str,        # Status message or error description
    "stats": {
        "processed": int,  # Number of photos with GPS data
        "total": int,      # Total number of photos processed
        "skipped": int     # Number of photos without GPS data
    },
    "gps_data": list,      # List of GPS data dictionaries
    "output_file": str     # Path to the generated GPX file (if applicable)
}
```

## JavaScript API Client

The API Client handles all communication between the browser and the local server in the web interface.

```javascript
/**
 * API Client for PixTrail web interface
 */
class APIClient {
    // Methods for communicating with the server
}
```

### Methods

#### `submitPhotos(formData, progressCallback)`

```javascript
/**
 * Submit photos for processing
 * @param {FormData} formData - Form data with photos
 * @param {Function} progressCallback - Callback for upload progress
 * @returns {Promise<Object>} Promise resolving to the response data
 */
static submitPhotos(formData, progressCallback) {
    // Implementation
}
```

Example:
```javascript
// Create form data with files
const formData = new FormData();
fileInput.files.forEach(file => formData.append('photos', file));

// Submit photos and track progress
APIClient.submitPhotos(formData, (progress) => {
  const percent = Math.round((progress.loaded / progress.total) * 100);
  console.log(`Upload progress: ${percent}%`);
})
.then(response => {
  console.log('Photos submitted successfully:', response);
  return response.session_id;
})
.catch(error => {
  console.error('Error submitting photos:', error);
});
```

#### `processPhotos(sessionId)`

```javascript
/**
 * Process uploaded photos to extract GPS data
 * @param {string} sessionId - Session ID from the submission
 * @returns {Promise<Object>} Promise resolving to the extracted GPS data
 */
static processPhotos(sessionId) {
    // Implementation
}
```

Example:
```javascript
// After submitting photos
APIClient.submitPhotos(formData, progressCallback)
  .then(response => {
    return APIClient.processPhotos(response.session_id);
  })
  .then(data => {
    console.log('GPS data extracted:', data.waypoints);
    // Use the waypoints data
  })
  .catch(error => {
    console.error('Error processing photos:', error);
  });
```

#### `createGPX(gpsData)`

```javascript
/**
 * Create a GPX file from GPS data
 * @param {Array} gpsData - Array of GPS data points
 * @returns {Promise<Object>} Promise resolving to the creation result
 */
static createGPX(gpsData) {
    // Implementation
}
```

Example:
```javascript
// After processing photos
APIClient.createGPX(waypoints)
  .then(result => {
    console.log('GPX file created:', result);
    if (result.success) {
      window.location.href = APIClient.getDownloadUrl(result.session_id, result.filename);
    }
  })
  .catch(error => {
    console.error('Error creating GPX file:', error);
  });
```

#### `downloadGPX(sessionId, filename)`

```javascript
/**
 * Download a GPX file
 * @param {string} sessionId - Session ID
 * @param {string} filename - GPX filename
 */
static downloadGPX(sessionId, filename) {
    // Implementation
}
```

Example:
```javascript
document.getElementById('download-button').addEventListener('click', () => {
  APIClient.downloadGPX(sessionId, 'track.gpx');
});
```

#### `getDownloadUrl(sessionId, filename)`

```javascript
/**
 * Get download URL for a GPX file
 * @param {string} sessionId - Session ID
 * @param {string} filename - GPX filename
 * @returns {string} Download URL
 */
static getDownloadUrl(sessionId, filename) {
    // Implementation
}
```

Example:
```javascript
const url = APIClient.getDownloadUrl(sessionId, 'track.gpx');
console.log('Download URL:', url);
```

#### `cleanupSession(sessionId)`

```javascript
/**
 * Clean up session data on the server
 * @param {string} sessionId - Session ID to clean up
 * @returns {Promise<Object>} Promise resolving to the cleanup result
 */
static cleanupSession(sessionId) {
    // Implementation
}
```

Example:
```javascript
// Clean up when done
window.addEventListener('beforeunload', () => {
  if (sessionId) {
    APIClient.cleanupSession(sessionId);
  }
});
```

## Map Visualization

The `mapVisualization.js` module handles the display of maps and routes.

```javascript
/**
 * Map visualization module for PixTrail
 */
class MapVisualization {
    /**
     * Initialize map visualization
     * @param {Object} config - Configuration options
     */
    constructor(config) {
        // Implementation
    }
    
    // Methods for map handling
}
```

### Constructor Options

```javascript
/**
 * Initialize map visualization
 * @param {Object} config - Configuration options
 * @param {HTMLElement} config.mapContainer - Container element for the map
 * @param {HTMLElement} config.mapElement - The map element itself
 * @param {Object} [config.mapOptions] - Leaflet map options
 * @param {Object} [config.tileLayerOptions] - Tile layer options
 * @param {string} [config.tileLayerUrl] - Tile layer URL template
 * @param {string} [config.attribution] - Map attribution text
 */
const mapViz = new MapVisualization({
  mapContainer: document.getElementById('map-container'),
  mapElement: document.getElementById('map')
});
```

### Methods

#### `initMap()`

```javascript
/**
 * Initialize the map and base layer
 * @returns {Object} Leaflet map instance
 */
initMap() {
    // Implementation
}
```

#### `showMapContainer()`

```javascript
/**
 * Show the map container if it's hidden
 */
showMapContainer() {
    // Implementation
}
```

#### `setWaypoints(waypoints)`

```javascript
/**
 * Set waypoints and display them on the map
 * @param {Array} waypoints - Array of waypoint objects
 */
setWaypoints(waypoints) {
    // Implementation
}
```

Example:
```javascript
// After processing photos
mapViz.setWaypoints(data.waypoints);
```

#### `showWaypoints()`

```javascript
/**
 * Display waypoints on the map
 */
showWaypoints() {
    // Implementation
}
```

#### `clearMapLayers()`

```javascript
/**
 * Clear all map layers (markers and route)
 */
clearMapLayers() {
    // Implementation
}
```

#### `getMap()`

```javascript
/**
 * Get the map instance
 * @returns {Object} Leaflet map instance
 */
getMap() {
    // Implementation
}
```

#### `showHeatmap()` / `hideHeatmap()`

```javascript
/**
 * Show/hide the heat map visualization
 */
showHeatmap() {
    // Implementation
}

hideHeatmap() {
    // Implementation
}
```

#### `enableClustering()` / `disableClustering()`

```javascript
/**
 * Enable/disable marker clustering
 */
enableClustering() {
    // Implementation
}

disableClustering() {
    // Implementation
}
```

#### `addControl()`

```javascript
/**
 * Attach a control to the map
 * @param {Object} control - Leaflet control to add
 * @param {string} [position='topright'] - Control position
 * @returns {Object} The added control
 */
addControl(control, position) {
    // Implementation
}
```

#### `addButtonControl()`

```javascript
/**
 * Create and add a simple button control to the map
 * @param {string} html - Button HTML content
 * @param {Function} onClick - Click handler
 * @param {string} [position='topright'] - Control position
 * @param {string} [title=''] - Button title attribute
 * @returns {Object} The created control
 */
addButtonControl(html, onClick, position, title) {
    // Implementation
}
```

## File Upload

The `fileUpload.js` module manages file selection, validation, and uploading.

```javascript
/**
 * File upload module for PixTrail
 */
class FileUpload {
    /**
     * Initialize file upload functionality
     * @param {Object} config - Configuration options
     */
    constructor(config) {
        // Implementation
    }
    
    // Methods for file upload handling
}
```

### Constructor Options

```javascript
/**
 * Initialize file upload functionality
 * @param {Object} config - Configuration options
 * @param {HTMLElement} config.formElement - Form element
 * @param {HTMLElement} config.progressContainer - Progress container element
 * @param {HTMLElement} config.progressBar - Progress bar element
 * @param {HTMLElement} config.progressText - Progress text element
 * @param {HTMLElement} config.statusContainer - Status message container
 * @param {HTMLInputElement} config.submitButton - Submit button
 * @param {string} config.activeInput - Active input type ('file' or 'directory')
 * @param {HTMLInputElement} config.fileInput - File input element
 * @param {HTMLInputElement} config.directoryInput - Directory input element
 * @param {HTMLInputElement} config.recursiveCheckbox - Recursive processing checkbox
 * @param {HTMLSelectElement} config.depthSelect - Recursive depth select element
 * @param {Function} config.onSuccess - Callback on successful processing
 * @param {Function} config.onError - Callback on error
 */
const fileUpload = new FileUpload({
  formElement: document.getElementById('upload-form'),
  progressContainer: document.getElementById('progress-container'),
  progressBar: document.getElementById('progress-bar'),
  progressText: document.getElementById('progress-text'),
  statusContainer: document.getElementById('status-messages'),
  submitButton: document.getElementById('submit-button'),
  activeInput: 'file',
  fileInput: document.getElementById('file-input'),
  directoryInput: document.getElementById('directory-input'),
  recursiveCheckbox: document.getElementById('recursive-checkbox'),
  depthSelect: document.getElementById('depth-select'),
  onSuccess: handleSuccess,
  onError: handleError
});
```

### Methods

#### `setActiveInput(inputType)`

```javascript
/**
 * Set active input type
 * @param {string} inputType - 'file' or 'directory'
 */
setActiveInput(inputType) {
    // Implementation
}
```

#### `updateSubmitButtonState()`

```javascript
/**
 * Update submit button state based on form validity
 */
updateSubmitButtonState() {
    // Implementation
}
```

#### `showProgress()` / `hideProgress()`

```javascript
/**
 * Show/hide progress container
 */
showProgress() {
    // Implementation
}

hideProgress() {
    // Implementation
}
```

#### `updateProgress(current, total, message)`

```javascript
/**
 * Update progress bar and text
 * @param {number} current - Current progress value
 * @param {number} total - Total progress value
 * @param {string} [message] - Optional message to display
 */
updateProgress(current, total, message) {
    // Implementation
}
```

#### `showStatusMessage(message, type, timeout)`

```javascript
/**
 * Show a status message
 * @param {string} message - Message to display
 * @param {string} [type='info'] - Message type: 'success', 'error', 'warning', 'info'
 * @param {number} [timeout=10000] - Auto-removal timeout in ms (0 to disable)
 */
showStatusMessage(message, type, timeout) {
    // Implementation
}
```

## EXIF Reader

The `exifReader.js` extracts GPS and other metadata from image files directly in the browser.

```javascript
/**
 * EXIF Reader module for PixTrail
 */
class ExifReader {
    // Methods for EXIF data extraction
}
```

### Methods

#### `extractGpsDataFromImages(files, progressCallback)`

```javascript
/**
 * Extract GPS data from images directly in the browser
 * @param {File[]} files - Array of image files
 * @param {Function} progressCallback - Callback for processing progress updates
 * @returns {Promise<Array>} Promise resolving to extracted GPS data
 */
static extractGpsDataFromImages(files, progressCallback) {
    // Implementation
}
```

Example:
```javascript
// Extract GPS data from files in the browser
ExifReader.extractGpsDataFromImages(fileInput.files, (current, total) => {
  const percent = Math.round((current / total) * 100);
  console.log(`Processing: ${percent}%`);
})
.then(gpsData => {
  console.log('Extracted GPS data:', gpsData);
  // Use the extracted GPS data
})
.catch(error => {
  console.error('Error extracting GPS data:', error);
});
```

#### `extractGpsFromExif(tags, file)`

```javascript
/**
 * Extract GPS data from EXIF metadata tags
 * @param {Object} tags - EXIF tags extracted by EXIF.js
 * @param {File} file - Original file
 * @returns {Object|null} Extracted GPS data or null if not available
 */
static extractGpsFromExif(exifTags, file) {
    // Implementation
}
```

## Statistics

The `statistics.js` module handles route statistics calculation and visualization.

```javascript
/**
 * Statistics module for PixTrail
 */
class Statistics {
    /**
     * Initialize statistics functionality
     * @param {Object} config - Configuration options
     */
    constructor(config) {
        // Implementation
    }
    
    // Methods for statistics handling
}
```

### Constructor Options

```javascript
/**
 * Initialize statistics functionality
 * @param {Object} config - Configuration options
 * @param {HTMLElement} config.container - Statistics container element
 * @param {HTMLElement} [config.toggleButton] - Button to toggle statistics panel
 * @param {Object} [config.elements] - Object mapping statistic IDs to their display elements
 * @param {HTMLElement} [config.elevationChartContainer] - Elevation chart container
 * @param {HTMLElement} [config.speedChartContainer] - Speed chart container
 */
const statistics = new Statistics({
  container: document.getElementById('statistics-container'),
  toggleButton: document.getElementById('toggle-statistics'),
  elements: {
    'total-distance': document.getElementById('total-distance'),
    'total-duration': document.getElementById('total-duration'),
    // Other elements...
  },
  elevationChartContainer: document.getElementById('elevation-chart'),
  speedChartContainer: document.getElementById('speed-chart')
});
```

### Methods

#### `setWaypoints(waypoints)`

```javascript
/**
 * Set waypoints data and calculate statistics
 * @param {Array} waypoints - Array of waypoint objects
 */
setWaypoints(waypoints) {
    // Implementation
}
```

#### `calculateStatistics()`

```javascript
/**
 * Calculate statistics from waypoints
 */
calculateStatistics() {
    // Implementation
}
```

#### `toggle()` / `show()` / `hide()`

```javascript
/**
 * Toggle, show, or hide statistics panel
 */
toggle() {
    // Implementation
}

show() {
    // Implementation
}

hide() {
    // Implementation
}
```

#### `updateDisplay()`

```javascript
/**
 * Update statistics display
 */
updateDisplay() {
    // Implementation
}
```

#### `updateCharts()`

```javascript
/**
 * Update charts with current statistics data
 */
updateCharts() {
    // Implementation
}
```

#### `getStatistics()`

```javascript
/**
 * Get the current route statistics object
 * @returns {Object} Statistics object
 */
getStatistics() {
    // Implementation
}
```

#### `exportReport()`

```javascript
/**
 * Export statistics as a formatted text report
 * @returns {string} Report text
 */
exportReport() {
    // Implementation
}
```

## Heatmap

The `heatmap.js` provides heat map visualization on the map.

```javascript
/**
 * Heatmap module for PixTrail
 */
class Heatmap {
    /**
     * Initialize heatmap functionality
     * @param {Object} config - Configuration options
     */
    constructor(config) {
        // Implementation
    }
    
    // Methods for heatmap handling
}
```

### Constructor Options

```javascript
/**
 * Initialize heatmap functionality
 * @param {Object} config - Configuration options
 * @param {Object} config.map - Leaflet map instance
 * @param {HTMLElement} [config.toggleButton] - Button to toggle heatmap
 * @param {Object} [config.heatmapOptions] - Leaflet.heat options
 */
const heatmap = new Heatmap({
  map: leafletMap,
  toggleButton: document.getElementById('toggle-heatmap'),
  heatmapOptions: {
    radius: 25,
    blur: 15,
    maxZoom: 17
  }
});
```

### Methods

#### `setWaypoints(waypoints)`

```javascript
/**
 * Set waypoints data
 * @param {Array} waypoints - Array of waypoint objects
 */
setWaypoints(waypoints) {
    // Implementation
}
```

#### `toggle()` / `show()` / `hide()`

```javascript
/**
 * Toggle, show, or hide heatmap
 */
toggle() {
    // Implementation
}

show() {
    // Implementation
}

hide() {
    // Implementation
}
```

#### `updateOptions(options)`

```javascript
/**
 * Update heatmap options
 * @param {Object} options - New options to apply
 */
updateOptions(options) {
    // Implementation
}
```

## Marker Clustering

The `clustering.js` provides marker clustering functionality.

```javascript
/**
 * Marker clustering module for PixTrail
 */
class MarkerClustering {
    /**
     * Initialize marker clustering functionality
     * @param {Object} config - Configuration options
     */
    constructor(config) {
        // Implementation
    }
    
    // Methods for clustering handling
}
```

### Constructor Options

```javascript
/**
 * Initialize marker clustering functionality
 * @param {Object} config - Configuration options
 * @param {Object} config.map - Leaflet map instance
 * @param {HTMLElement} [config.toggleButton] - Button to toggle clustering
 * @param {HTMLElement} [config.radiusSlider] - Slider to control cluster radius
 * @param {HTMLElement} [config.radiusValue] - Element to display radius value
 * @param {HTMLElement} [config.clusterOptions] - Container for cluster options
 * @param {Object} [config.clusteringOptions] - Leaflet.markercluster options
 */
const clustering = new MarkerClustering({
  map: leafletMap,
  toggleButton: document.getElementById('toggle-clustering'),
  radiusSlider: document.getElementById('cluster-radius'),
  radiusValue: document.getElementById('radius-value'),
  clusterOptions: document.getElementById('cluster-options'),
  initialRadius: 80
});
```

### Methods

#### `setWaypoints(waypoints)` / `setMarkers(markers)`

```javascript
/**
 * Set waypoints data
 * @param {Array} waypoints - Array of waypoint objects
 */
setWaypoints(waypoints) {
    // Implementation
}

/**
 * Set individual markers that will be clustered
 * @param {Array} markers - Array of Leaflet marker objects
 */
setMarkers(markers) {
    // Implementation
}
```

#### `toggle()` / `enable()` / `disable()`

```javascript
/**
 * Toggle, enable, or disable clustering
 */
toggle() {
    // Implementation
}

enable() {
    // Implementation
}

disable() {
    // Implementation
}
```

#### `updateClusterRadius()` / `setRadius(radius)`

```javascript
/**
 * Update cluster radius
 */
updateClusterRadius() {
    // Implementation
}

/**
 * Set cluster radius
 * @param {number} radius - New radius in pixels
 */
setRadius(radius) {
    // Implementation
}
```

## Integration Example

Here's an example showing how these core modules work together:

```javascript
// Initialize map visualization
const mapViz = new MapVisualization({
  mapContainer: document.getElementById('map-container'),
  mapElement: document.getElementById('map')
});

// Initialize additional features
const heatmap = new Heatmap({ map: mapViz.getMap() });
const clustering = new MarkerClustering({ map: mapViz.getMap() });
const statistics = new Statistics({
  container: document.getElementById('statistics-container')
});

// Initialize file upload
const fileUpload = new FileUpload({
  // Configuration...
  onSuccess: (result) => {
    // Set waypoints to map and features
    mapViz.setWaypoints(result.waypoints);
    heatmap.setWaypoints(result.waypoints);
    clustering.setMarkers(mapViz.markers);
    statistics.setWaypoints(result.waypoints);
    
    // Show UI elements
    mapViz.showMapContainer();
    document.getElementById('map-controls').classList.remove('hidden');
  }
});

// Add toggle buttons for features
document.getElementById('toggle-heatmap').addEventListener('click', () => {
  heatmap.toggle();
});

document.getElementById('toggle-clustering').addEventListener('click', () => {
  clustering.toggle();
});

document.getElementById('toggle-statistics').addEventListener('click', () => {
  statistics.toggle();
});

document.getElementById('download-gpx').addEventListener('click', () => {
  const gpsData = mapViz.getWaypoints();
  if (gpsData.length > 0) {
    APIClient.createGPX(gpsData)
      .then(result => {
        if (result.success) {
          APIClient.downloadGPX(result.session_id, result.filename);
        }
      });
  }
});
```

## Module Dependencies

The core modules generally depend on the utility modules and sometimes on each other:

- All modules use `domHelpers.js` for DOM manipulation
- All modules use `uiUtils.js` for UI operations
- `mapVisualization.js` uses `gpsUtils.js` for coordinate validation
- `fileUpload.js` uses `fileUtils.js` for file handling
- `statistics.js` uses `charts.js` for chart creation
- `heatmap.js` and `clustering.js` depend on `mapVisualization.js` for the map instance

See the [Module Structure](../development/module-structure.md) document for more details on module dependencies.
