# PixTrail Core Modules

This page documents the core modules that form the backbone of PixTrail. These modules implement the main features of the application.

## API Client

`apiClient.js` handles all communication with the server.

### Methods

#### Submit Photos

```javascript
/**
 * Submit photos for processing
 * @param {FormData} formData - Form data with photos
 * @param {Function} progressCallback - Callback for upload progress
 * @returns {Promise<Object>} Promise resolving to the response data
 */
APIClient.submitPhotos(formData, progressCallback)
  .then(response => {
    // Handle response
  })
  .catch(error => {
    // Handle error
  });
```

The response includes a `session_id` that is used for subsequent operations.

#### Process Photos

```javascript
/**
 * Process uploaded photos to extract GPS data
 * @param {string} sessionId - Session ID from the submission
 * @returns {Promise<Object>} Promise resolving to the extracted GPS data
 */
APIClient.processPhotos(sessionId)
  .then(data => {
    // Handle GPS data
  });
```

#### Create GPX File

```javascript
/**
 * Create a GPX file from GPS data
 * @param {Array} gpsData - Array of GPS data points
 * @returns {Promise<Object>} Promise resolving to the creation result
 */
APIClient.createGPX(gpsData)
  .then(result => {
    // Handle GPX file result
  });
```

#### Download GPX File

```javascript
/**
 * Download a GPX file
 * @param {string} sessionId - Session ID
 * @param {string} filename - GPX filename
 */
APIClient.downloadGPX(sessionId, filename);
```

#### Get Download URL

```javascript
/**
 * Get download URL for a GPX file
 * @param {string} sessionId - Session ID
 * @param {string} filename - GPX filename
 * @returns {string} Download URL
 */
const url = APIClient.getDownloadUrl(sessionId, filename);
```

#### Clean Up Session

```javascript
/**
 * Clean up session data on the server
 * @param {string} sessionId - Session ID to clean up
 * @returns {Promise<Object>} Promise resolving to the cleanup result
 */
APIClient.cleanupSession(sessionId)
  .then(result => {
    // Handle cleanup result
  });
```

## Map Visualization

`mapVisualization.js` handles the display of maps and routes.

### Constructor

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

#### Initialize Map

```javascript
/**
 * Initialize the map and base layer
 * @returns {Object} Leaflet map instance
 */
const map = mapViz.initMap();
```

#### Show Map Container

```javascript
/**
 * Show the map container if it's hidden
 */
mapViz.showMapContainer();
```

#### Set Waypoints

```javascript
/**
 * Set waypoints and display them on the map
 * @param {Array} waypoints - Array of waypoint objects
 */
mapViz.setWaypoints(waypoints);
```

#### Show Waypoints

```javascript
/**
 * Display waypoints on the map
 */
mapViz.showWaypoints();
```

#### Clear Map Layers

```javascript
/**
 * Clear all map layers (markers and route)
 */
mapViz.clearMapLayers();
```

#### Get Map Instance

```javascript
/**
 * Get the map instance
 * @returns {Object} Leaflet map instance
 */
const map = mapViz.getMap();
```

#### Add Control

```javascript
/**
 * Attach a control to the map
 * @param {Object} control - Leaflet control to add
 * @param {string} [position='topright'] - Control position
 * @returns {Object} The added control
 */
const control = mapViz.addControl(customControl, 'bottomleft');
```

#### Add Button Control

```javascript
/**
 * Create and add a simple button control to the map
 * @param {string} html - Button HTML content
 * @param {Function} onClick - Click handler
 * @param {string} [position='topright'] - Control position
 * @param {string} [title=''] - Button title attribute
 * @returns {Object} The created control
 */
const button = mapViz.addButtonControl('<i class="icon"></i>', handleClick, 'topleft', 'Toggle Layer');
```

#### Convert to GeoJSON

```javascript
/**
 * Create a GeoJSON representation of the current route
 * @returns {Object} GeoJSON object
 */
const geoJson = mapViz.toGeoJSON();
```

## File Upload

`fileUpload.js` manages file selection, validation, and uploading.

### Constructor

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

#### Set Active Input

```javascript
/**
 * Set active input type
 * @param {string} inputType - 'file' or 'directory'
 */
fileUpload.setActiveInput('directory');
```

#### Update Submit Button State

```javascript
/**
 * Update submit button state based on form validity
 */
fileUpload.updateSubmitButtonState();
```

#### Show Progress

```javascript
/**
 * Show progress container and reset progress bar
 */
fileUpload.showProgress();
```

#### Hide Progress

```javascript
/**
 * Hide progress container
 */
fileUpload.hideProgress();
```

#### Update Progress

```javascript
/**
 * Update progress bar and text
 * @param {number} current - Current progress value
 * @param {number} total - Total progress value
 * @param {string} [message] - Optional message to display
 */
fileUpload.updateProgress(50, 100, 'Processing files...');
```

#### Show Status Message

```javascript
/**
 * Show a status message
 * @param {string} message - Message to display
 * @param {string} [type='info'] - Message type: 'success', 'error', 'warning', 'info'
 * @param {number} [timeout=10000] - Auto-removal timeout in ms (0 to disable)
 */
fileUpload.showStatusMessage('Files uploaded successfully', 'success');
```

## EXIF Reader

`exifReader.js` extracts GPS and other metadata from image files.

### Methods

#### Extract GPS Data From Images

```javascript
/**
 * Extract GPS data from images directly in the browser
 * @param {File[]} files - Array of image files
 * @param {Function} progressCallback - Callback for processing progress updates
 * @returns {Promise<Array>} Promise resolving to extracted GPS data
 */
ExifReader.extractGpsDataFromImages(files, (current, total) => {
  const percent = Math.round((current / total) * 100);
  console.log(`Processing: ${percent}%`);
})
.then(gpsData => {
  // Use extracted GPS data
});
```

#### Extract GPS From EXIF

```javascript
/**
 * Extract GPS data from EXIF metadata tags
 * @param {Object} tags - EXIF tags extracted by EXIF.js
 * @param {File} file - Original file
 * @returns {Object|null} Extracted GPS data or null if not available
 */
const gpsData = ExifReader.extractGpsFromExif(exifTags, file);
```

The GPS data object includes:
- `name`: File name
- `latitude`: Decimal latitude
- `longitude`: Decimal longitude
- `altitude`: Elevation in meters
- `timestamp`: ISO timestamp

## Statistics

`statistics.js` handles route statistics calculation and visualization.

### Constructor

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

#### Set Waypoints

```javascript
/**
 * Set waypoints data and calculate statistics
 * @param {Array} waypoints - Array of waypoint objects
 */
statistics.setWaypoints(waypoints);
```

#### Calculate Statistics

```javascript
/**
 * Calculate statistics from waypoints
 */
statistics.calculateStatistics();
```

#### Toggle, Show, Hide

```javascript
/**
 * Toggle statistics panel visibility
 */
statistics.toggle();

/**
 * Show statistics panel
 */
statistics.show();

/**
 * Hide statistics panel
 */
statistics.hide();
```

#### Update Display

```javascript
/**
 * Update statistics display
 */
statistics.updateDisplay();
```

#### Update Charts

```javascript
/**
 * Update charts with current statistics data
 */
statistics.updateCharts();
```

#### Get Statistics

```javascript
/**
 * Get the current route statistics object
 * @returns {Object} Statistics object
 */
const stats = statistics.getStatistics();
```

#### Export Report

```javascript
/**
 * Export statistics as a formatted text report
 * @returns {string} Report text
 */
const report = statistics.exportReport();
```

## Heatmap

`heatmap.js` provides heat map visualization on the map.

### Constructor

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

#### Set Waypoints

```javascript
/**
 * Set waypoints data
 * @param {Array} waypoints - Array of waypoint objects
 */
heatmap.setWaypoints(waypoints);
```

#### Toggle, Show, Hide

```javascript
/**
 * Toggle heatmap visibility
 */
heatmap.toggle();

/**
 * Show heatmap
 */
heatmap.show();

/**
 * Hide heatmap
 */
heatmap.hide();
```

#### Update Options

```javascript
/**
 * Update heatmap options
 * @param {Object} options - New options to apply
 */
heatmap.updateOptions({
  radius: 35,
  blur: 20
});
```

## Marker Clustering

`clustering.js` provides marker clustering functionality.

### Constructor

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

#### Set Waypoints/Markers

```javascript
/**
 * Set waypoints data
 * @param {Array} waypoints - Array of waypoint objects
 */
clustering.setWaypoints(waypoints);

/**
 * Set individual markers that will be clustered
 * @param {Array} markers - Array of Leaflet marker objects
 */
clustering.setMarkers(markers);
```

#### Toggle, Enable, Disable

```javascript
/**
 * Toggle clustering on/off
 */
clustering.toggle();

/**
 * Enable clustering
 */
clustering.enable();

/**
 * Disable clustering
 */
clustering.disable();
```

#### Radius Control

```javascript
/**
 * Update cluster radius
 */
clustering.updateClusterRadius();

/**
 * Set cluster radius
 * @param {number} radius - New radius in pixels
 */
clustering.setRadius(100);
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
  }
});

// Add toggle button for heatmap
mapViz.addButtonControl(
  'Toggle Heatmap',
  () => heatmap.toggle(),
  'topright',
  'Toggle heatmap visualization'
);
```

## Module Dependencies

The core modules generally depend on the utility modules:

- All modules use `domHelpers.js` for DOM manipulation
- All modules use `uiUtils.js` for UI operations
- `mapVisualization.js` uses `gpsUtils.js` for coordinate validation
- `fileUpload.js` uses `fileUtils.js` for file handling
- `statistics.js` uses `charts.js` for chart creation

See the [Module Structure](../development/module-structure.md) document for more details on module dependencies.