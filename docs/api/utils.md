# PixTrail Utility Modules

This page documents the utility modules in PixTrail. These modules provide shared functionality used throughout the application.

## Overview

PixTrail's utilities are organized into domain-specific modules:

- **DOM Helpers** - Utilities for DOM manipulation
- **File Utilities** - Functions for file handling
- **GPS Utilities** - GPS data processing and calculations
- **UI Utilities** - Helper functions for UI interactions

Additionally, several specialized modules provide specific functionality:

- **Chart Manager** - Creates and manages charts
- **Marker Clustering** - Handles map marker clustering
- **Heatmap** - Creates heatmaps from GPS data
- **Drag and Drop** - File drag and drop functionality

## DOM Helpers

`domHelpers.js` provides utilities for working with the DOM.

### Methods

#### Element Selection

```javascript
// Get an element by ID
const element = DOMHelpers.getById('element-id');

// Get elements by selector
const elements = DOMHelpers.getAll('.some-class');

// Get first matching element
const firstElement = DOMHelpers.get('.some-selector');
```

#### Element Creation

```javascript
// Create a new element with options
const button = DOMHelpers.create('button', {
    classes: ['primary-button', 'large'],
    attributes: { 'data-action': 'submit' },
    text: 'Submit',
    // OR
    html: '<span>Submit</span>'
});
```

#### Event Handling

```javascript
// Add event listener
DOMHelpers.on(element, 'click', handleClick);

// Remove event listener
DOMHelpers.off(element, 'click', handleClick);
```

#### Visibility

```javascript
// Show element
DOMHelpers.show(element);

// Hide element
DOMHelpers.hide(element);

// Check visibility
const isVisible = DOMHelpers.isVisible(element);
```

#### Other Utilities

```javascript
// Toggle class based on condition
DOMHelpers.toggleClass(element, 'active', isActive);

// Scroll to element
DOMHelpers.scrollTo(element, { behavior: 'smooth' });
```

## File Utilities

`fileUtils.js` provides utilities for working with files.

### Methods

#### File Type Checking

```javascript
// Check if file is an image
const isImage = FileUtils.isImageFile(file);

// Check if file can be processed client-side
const canProcessInBrowser = FileUtils.canProcessClientSide(file);
```

#### File Information

```javascript
// Get file extension
const extension = FileUtils.getExtension('image.jpg');

// Format file size
const size = FileUtils.formatFileSize(1024); // "1 KB"
```

#### File List Manipulation

```javascript
// Create a FileList from an array of Files
const fileList = FileUtils.createFileList(filesArray);

// Filter files by type
const images = FileUtils.filterByType(files, ['image/jpeg', 'image/png']);
```

#### File Reading

```javascript
// Read file as data URL
FileUtils.readAsDataURL(file).then(dataUrl => {
    // Use dataUrl
});

// Read file as array buffer
FileUtils.readAsArrayBuffer(file).then(buffer => {
    // Use buffer
});

// Read file as text
FileUtils.readAsText(file).then(text => {
    // Use text
});
```

## GPS Utilities

`gpsUtils.js` provides utilities for working with GPS data.

### Methods

#### Coordinate Conversion

```javascript
// Convert DMS to decimal degrees
const dd = GPSUtils.convertDMSToDD(degrees, minutes, seconds, 'N');
```

#### Distance and Speed Calculations

```javascript
// Calculate distance between coordinates
const distance = GPSUtils.calculateDistance(lat1, lon1, lat2, lon2);

// Calculate speed between points
const speed = GPSUtils.calculateSpeed(
    lat1, lon1, timestamp1,
    lat2, lon2, timestamp2
);
```

#### Coordinate Validation

```javascript
// Validate coordinates
const isValid = GPSUtils.validateCoordinates(latitude, longitude);
```

#### Geographic Centers

```javascript
// Get center point of multiple coordinates
const center = GPSUtils.getCenter(points);
```

#### Formatting

```javascript
// Format coordinates for display
const formatted = GPSUtils.formatCoordinates(latitude, longitude);
// "52.520000° N, 13.405000° E"
```

#### Route Statistics

```javascript
// Calculate comprehensive route statistics
const stats = GPSUtils.calculateRouteStatistics(waypoints);
```

The statistics object includes:
- Total distance
- Total duration
- Start/end times
- Average/maximum speed
- Elevation data
- Speed and elevation profiles

## UI Utilities

`uiUtils.js` provides utilities for common UI operations.

### Methods

#### Formatting

```javascript
// Format duration in seconds to HH:MM:SS
const time = UIUtils.formatDuration(3665); // "01:01:05"

// Format date
const dateStr = UIUtils.formatDate(new Date());

// Format number with units
const formatted = UIUtils.formatNumber(12.345, 2, 'km'); // "12.35 km"
```

#### UI Components

```javascript
// Update progress bar
UIUtils.updateProgressBar(progressBar, progressText, current, total, message);

// Show status message
UIUtils.showStatusMessage(container, 'Operation successful', 'success', 5000);

// Toggle element visibility
const isNowVisible = UIUtils.toggleVisibility(element, true);
```

#### UI Initialization

```javascript
// Initialize tabs
UIUtils.initTabs('.tab-button', '.tab-content', callback);
```

#### Performance Optimization

```javascript
// Debounce function (limit how often it can be called)
const debouncedFunc = UIUtils.debounce(function() {
    // Function that shouldn't be called too frequently
}, 200);

// Throttle function
const throttledFunc = UIUtils.throttle(function() {
    // Function that shouldn't be called too frequently
}, 200);
```

## Chart Manager

`charts.js` provides a wrapper around Chart.js for creating and managing charts.

### Usage

```javascript
// Create a chart manager
const chart = new ChartManager({
    container: document.getElementById('chart-container'),
    type: 'line',
    data: { /* Chart.js data object */ },
    options: { /* Chart.js options object */ }
});

// Update chart data
chart.updateChart(newData);

// Update chart options
chart.updateOptions(newOptions);

// Create a pre-configured line chart
const lineChart = ChartManager.createLineChart(
    container, 'Elevation', labels, data, 'Elevation (m)'
);
```

## Marker Clustering

`clustering.js` provides marker clustering functionality for maps.

### Usage

```javascript
// Initialize clustering with a map instance
const clustering = new MarkerClustering({
    map: leafletMap,
    toggleButton: document.getElementById('toggle-clustering'),
    radiusSlider: document.getElementById('cluster-radius'),
    radiusValue: document.getElementById('radius-value'),
    clusterOptions: document.getElementById('cluster-options'),
    initialRadius: 80
});

// Set markers to be clustered
clustering.setMarkers(markers);

// Enable clustering
clustering.enable();

// Disable clustering
clustering.disable();

// Toggle clustering
clustering.toggle();
```

## Heatmap

`heatmap.js` provides heatmap visualization for maps.

### Usage

```javascript
// Initialize heatmap with a map instance
const heatmap = new Heatmap({
    map: leafletMap,
    toggleButton: document.getElementById('toggle-heatmap'),
    heatmapOptions: {
        radius: 25,
        blur: 15,
        maxZoom: 17
    }
});

// Set waypoints for the heatmap
heatmap.setWaypoints(waypoints);

// Show heatmap
heatmap.show();

// Hide heatmap
heatmap.hide();

// Toggle heatmap
heatmap.toggle();
```

## Drag and Drop

`dragAndDrop.js` manages file and directory drag and drop functionality.

### Usage

```javascript
// Initialize drag and drop
const dragDrop = new DragAndDrop({
    fileDropArea: document.getElementById('file-drop-area'),
    directoryDropArea: document.getElementById('directory-drop-area'),
    fileInput: document.getElementById('file-input'),
    directoryInput: document.getElementById('directory-input'),
    onFileDrop: handleFileDrop,
    onDirectoryDrop: handleDirectoryDrop,
    onFilesSelected: handleFileSelection,
    onDirectorySelected: handleDirectorySelection,
    onError: handleError,
    onInfo: handleInfo
});
```

## Best Practices

When using these utility modules:

1. **Import Only What You Need**
   ```javascript
   import { getById, show, hide } from '../utils/domHelpers.js';
   ```

2. **Combine with Other Modules**
   ```javascript
   import DOMHelpers from '../utils/domHelpers.js';
   import UIUtils from '../utils/uiUtils.js';
   
   // Show loading indicator
   DOMHelpers.show(loadingElement);
   
   // Process data
   process().then(() => {
       // Show success message
       UIUtils.showStatusMessage(container, 'Success!', 'success');
       // Hide loading indicator
       DOMHelpers.hide(loadingElement);
   });
   ```

3. **Use for Common Patterns**
   
   The utility functions are designed to standardize common operations. Using them consistently makes the code more maintainable.

4. **Extend When Needed**
   
   If you find yourself repeating similar patterns that aren't covered by the utilities, consider extending the appropriate utility module.
