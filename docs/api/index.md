# PixTrail API Documentation

This section provides documentation for the PixTrail JavaScript API, covering the modular structure and usage of each component.

## API Overview

PixTrail's API is organized into several modules that provide specific functionality:

### Core Modules

- [API Client](core.md#api-client) - Handles communication with the server
- [Map Visualization](core.md#map-visualization) - Displays maps and routes
- [Statistics](core.md#statistics) - Calculates and displays route statistics
- [File Upload](core.md#file-upload) - Manages file selection and uploading

### Utility Modules

- [DOM Helpers](utils.md#dom-helpers) - Utilities for DOM manipulation
- [File Utilities](utils.md#file-utilities) - Functions for file handling
- [GPS Utilities](utils.md#gps-utilities) - GPS data processing and calculations
- [UI Utilities](utils.md#ui-utilities) - Helper functions for UI interactions

### Feature Modules

- [Chart Manager](utils.md#chart-manager) - Creates and manages charts
- [Marker Clustering](utils.md#marker-clustering) - Handles map marker clustering
- [Heatmap](utils.md#heatmap) - Creates heatmaps from GPS data
- [Drag and Drop](utils.md#drag-and-drop) - File drag and drop functionality
- [EXIF Reader](exif.md) - Extracts EXIF data from images
- [GPX Generation](gpx.md) - Creates GPX files from GPS data

## Module Structure

PixTrail uses ES6 modules for better organization and maintainability. Each module follows a similar pattern:

```javascript
// Import dependencies
import DependencyA from '../path/to/dependency-a.js';
import DependencyB from '../path/to/dependency-b.js';

// Module implementation (class-based or function-based)
class ModuleName {
    constructor(config) {
        // Initialize properties
        this.init();
    }
    
    init() {
        // Setup and initialization
    }
    
    // Public methods
    publicMethod() { }
}

// Export the module
export default ModuleName;
```

## Module Dependencies

The diagram below illustrates the main dependencies between modules:

```
main.js
  ├── apiClient.js
  ├── fileUpload.js
  │     ├── dragAndDrop.js
  │     └── exifReader.js
  ├── mapVisualization.js
  │     ├── clustering.js
  │     └── heatmap.js
  └── statistics.js
        └── charts.js

All modules
  ├── domHelpers.js
  ├── fileUtils.js
  ├── gpsUtils.js
  └── uiUtils.js
```

## CSS Structure

The CSS is also modularized following a similar pattern:

```
main.css (imports all modules)
  ├── Base Styles
  │     ├── reset.css
  │     ├── typography.css
  │     └── variables.css
  ├── Layout Styles
  │     ├── container.css
  │     └── grid.css
  └── Module Styles
        ├── header.css
        ├── footer.css
        ├── buttons.css
        ├── forms.css
        └── [other component styles]
```

## Using the API

To use PixTrail's API in your own projects:

1. Import the needed modules
2. Initialize them with appropriate configuration
3. Call their methods to perform actions

Example:

```javascript
import MapVisualization from './modules/mapVisualization.js';
import GPSUtils from './utils/gpsUtils.js';

// Initialize map visualization
const map = new MapVisualization({
    mapContainer: document.getElementById('map-container'),
    mapElement: document.getElementById('map')
});

// Set waypoints and display on map
const waypoints = [
    { latitude: 52.5200, longitude: 13.4050, name: "Point 1", timestamp: "2023-01-01T12:00:00Z" },
    { latitude: 52.5300, longitude: 13.4150, name: "Point 2", timestamp: "2023-01-01T12:30:00Z" }
];

map.setWaypoints(waypoints);

// Calculate statistics
const stats = GPSUtils.calculateRouteStatistics(waypoints);
console.log(`Total distance: ${stats.totalDistance.toFixed(2)} km`);
```

For more detailed information on each module, please see the specific documentation pages linked above.