# PixTrail Utility Modules

This page documents the utility modules in PixTrail. These modules provide shared functionality used throughout the application and are designed to be reusable across different parts of the codebase.

## JavaScript Utility Modules

### DOM Helpers

`domHelpers.js` provides utilities for working with the DOM, making common operations more concise and consistent.

#### Key Functions

```javascript
/**
 * Get an element by ID
 * @param {string} id - Element ID
 * @returns {HTMLElement|null} - The element or null if not found
 */
function getById(id) {
    return document.getElementById(id);
}

/**
 * Get elements by selector
 * @param {string} selector - CSS selector
 * @returns {NodeList} - List of matching elements
 */
function getAll(selector) {
    return document.querySelectorAll(selector);
}

/**
 * Get first matching element
 * @param {string} selector - CSS selector
 * @returns {HTMLElement|null} - The element or null if not found
 */
function get(selector) {
    return document.querySelector(selector);
}

/**
 * Create a new element with options
 * @param {string} tag - Element tag name
 * @param {Object} options - Element options
 * @param {string[]} [options.classes] - Classes to add
 * @param {Object} [options.attributes] - Attributes to set
 * @param {string} [options.text] - Text content
 * @param {string} [options.html] - HTML content
 * @returns {HTMLElement} - The created element
 */
function create(tag, options = {}) {
    // Implementation
}

/**
 * Add event listener
 * @param {HTMLElement} element - Element to add listener to
 * @param {string} event - Event name
 * @param {Function} handler - Event handler
 */
function on(element, event, handler) {
    element.addEventListener(event, handler);
}

/**
 * Remove event listener
 * @param {HTMLElement} element - Element to remove listener from
 * @param {string} event - Event name
 * @param {Function} handler - Event handler
 */
function off(element, event, handler) {
    element.removeEventListener(event, handler);
}

/**
 * Show element
 * @param {HTMLElement} element - Element to show
 */
function show(element) {
    element.classList.remove('hidden');
}

/**
 * Hide element
 * @param {HTMLElement} element - Element to hide
 */
function hide(element) {
    element.classList.add('hidden');
}

/**
 * Check if element is visible
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} - Whether the element is visible
 */
function isVisible(element) {
    return !element.classList.contains('hidden');
}

/**
 * Toggle class based on condition
 * @param {HTMLElement} element - Element to modify
 * @param {string} className - Class to toggle
 * @param {boolean} condition - Whether to add or remove
 */
function toggleClass(element, className, condition) {
    if (condition) {
        element.classList.add(className);
    } else {
        element.classList.remove(className);
    }
}

/**
 * Scroll to element
 * @param {HTMLElement} element - Element to scroll to
 * @param {Object} options - Scroll options
 */
function scrollTo(element, options = {}) {
    element.scrollIntoView({
        behavior: options.behavior || 'smooth',
        block: options.block || 'start'
    });
}
```

#### Usage Example

```javascript
import { getById, create, on, show, hide } from '../utils/domHelpers.js';

// Get an element
const container = getById('map-container');

// Create new element
const button = create('button', {
    classes: ['primary-button', 'large'],
    attributes: { 'data-action': 'submit' },
    text: 'Submit'
});
container.appendChild(button);

// Add event listener
on(button, 'click', () => {
    console.log('Button clicked');
});

// Show/hide elements
hide(getById('loading-indicator'));
show(getById('results-container'));
```

### File Utilities

`fileUtils.js` provides utilities for working with files, making file operations more robust.

#### Key Functions

```javascript
/**
 * Check if file is an image
 * @param {File} file - File to check
 * @returns {boolean} - Whether the file is an image
 */
function isImageFile(file) {
    return file.type.startsWith('image/');
}

/**
 * Check if file can be processed client-side
 * @param {File} file - File to check
 * @returns {boolean} - Whether the file can be processed in browser
 */
function canProcessClientSide(file) {
    const clientSideTypes = ['image/jpeg', 'image/jpg', 'image/tiff'];
    return clientSideTypes.includes(file.type.toLowerCase());
}

/**
 * Get file extension
 * @param {string} filename - Filename
 * @returns {string} - File extension
 */
function getExtension(filename) {
    return filename.split('.').pop().toLowerCase();
}

/**
 * Format file size
 * @param {number} bytes - Size in bytes
 * @returns {string} - Formatted size
 */
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
}

/**
 * Create a FileList from an array of Files
 * @param {File[]} files - Array of File objects
 * @returns {FileList} - FileList-like object
 */
function createFileList(files) {
    // Implementation
}

/**
 * Filter files by type
 * @param {FileList} files - Files to filter
 * @param {string[]} types - MIME types to include
 * @returns {File[]} - Filtered files
 */
function filterByType(files, types) {
    return Array.from(files).filter(file => types.includes(file.type));
}

/**
 * Read file as data URL
 * @param {File} file - File to read
 * @returns {Promise<string>} - Promise resolving to data URL
 */
function readAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Read file as array buffer
 * @param {File} file - File to read
 * @returns {Promise<ArrayBuffer>} - Promise resolving to array buffer
 */
function readAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

/**
 * Read file as text
 * @param {File} file - File to read
 * @returns {Promise<string>} - Promise resolving to text
 */
function readAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsText(file);
    });
}
```

#### Usage Example

```javascript
import { isImageFile, readAsArrayBuffer, filterByType, formatFileSize } from '../utils/fileUtils.js';

// Handle file input change
document.getElementById('file-input').addEventListener('change', async (event) => {
    const files = event.target.files;
    
    // Filter for images
    const imageFiles = filterByType(files, ['image/jpeg', 'image/png', 'image/tiff']);
    console.log(`Selected ${imageFiles.length} images`);
    
    // Display file sizes
    imageFiles.forEach(file => {
        console.log(`${file.name}: ${formatFileSize(file.size)}`);
    });
    
    // Process files that can be handled in browser
    for (const file of imageFiles) {
        if (isImageFile(file)) {
            try {
                const buffer = await readAsArrayBuffer(file);
                // Process the file buffer
            } catch (error) {
                console.error(`Error reading ${file.name}:`, error);
            }
        }
    }
});
```

### GPS Utilities

`gpsUtils.js` provides utilities for working with GPS data, including coordinate conversion, distance calculations, and validation.

#### Key Functions

```javascript
/**
 * Convert DMS to decimal degrees
 * @param {number} degrees - Degrees
 * @param {number} minutes - Minutes
 * @param {number} seconds - Seconds
 * @param {string} direction - Direction ('N', 'S', 'E', 'W')
 * @returns {number} - Decimal degrees
 */
function convertDMSToDD(degrees, minutes, seconds, direction) {
    let dd = degrees + minutes / 60 + seconds / 3600;
    if (direction === 'S' || direction === 'W') {
        dd = -dd;
    }
    return dd;
}

/**
 * Calculate distance between coordinates
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} - Distance in kilometers
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    // Implementation using Haversine formula
}

/**
 * Calculate speed between points
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {Date|string} timestamp1 - Timestamp of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @param {Date|string} timestamp2 - Timestamp of point 2
 * @returns {number} - Speed in km/h
 */
function calculateSpeed(lat1, lon1, timestamp1, lat2, lon2, timestamp2) {
    // Implementation
}

/**
 * Validate coordinates
 * @param {number} latitude - Latitude to validate
 * @param {number} longitude - Longitude to validate
 * @returns {boolean} - Whether coordinates are valid
 */
function validateCoordinates(latitude, longitude) {
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        return false;
    }
    return latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
}

/**
 * Get center point of multiple coordinates
 * @param {Array} points - Array of {latitude, longitude} objects
 * @returns {Object} - Center point {latitude, longitude}
 */
function getCenter(points) {
    // Implementation
}

/**
 * Format coordinates for display
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @returns {string} - Formatted coordinates
 */
function formatCoordinates(latitude, longitude) {
    const latDir = latitude >= 0 ? 'N' : 'S';
    const lonDir = longitude >= 0 ? 'E' : 'W';
    return `${Math.abs(latitude).toFixed(6)}° ${latDir}, ${Math.abs(longitude).toFixed(6)}° ${lonDir}`;
}

/**
 * Calculate comprehensive route statistics
 * @param {Array} waypoints - Array of waypoint objects
 * @returns {Object} - Statistics object
 */
function calculateRouteStatistics(waypoints) {
    // Implementation
}
```

#### Usage Example

```javascript
import { calculateDistance, validateCoordinates, formatCoordinates } from '../utils/gpsUtils.js';

// Validate coordinates from user input
const lat = parseFloat(document.getElementById('latitude').value);
const lon = parseFloat(document.getElementById('longitude').value);

if (validateCoordinates(lat, lon)) {
    console.log(`Valid coordinates: ${formatCoordinates(lat, lon)}`);
    
    // Calculate distance to another point
    const distance = calculateDistance(lat, lon, 35.6812, 139.7671);
    console.log(`Distance to Tokyo: ${distance.toFixed(2)} km`);
} else {
    console.error('Invalid coordinates');
}
```

### UI Utilities

`uiUtils.js` provides utilities for common UI operations, such as formatting, status messages, and user interface interactions.

#### Key Functions

```javascript
/**
 * Format duration in seconds to HH:MM:SS
 * @param {number} seconds - Duration in seconds
 * @returns {string} - Formatted duration
 */
function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format date
 * @param {Date} date - Date to format
 * @returns {string} - Formatted date
 */
function formatDate(date) {
    return date.toLocaleString();
}

/**
 * Format number with units
 * @param {number} value - Value to format
 * @param {number} decimals - Number of decimal places
 * @param {string} unit - Unit to append
 * @returns {string} - Formatted number
 */
function formatNumber(value, decimals, unit) {
    return `${value.toFixed(decimals)} ${unit}`;
}

/**
 * Update progress bar
 * @param {HTMLElement} progressBar - Progress bar element
 * @param {HTMLElement} progressText - Progress text element
 * @param {number} current - Current progress value
 * @param {number} total - Total progress value
 * @param {string} [message] - Optional message
 */
function updateProgressBar(progressBar, progressText, current, total, message) {
    const percent = Math.round((current / total) * 100);
    progressBar.style.width = `${percent}%`;
    progressText.textContent = message ? `${percent}% - ${message}` : `${percent}%`;
}

/**
 * Show status message
 * @param {HTMLElement} container - Status message container
 * @param {string} message - Message to display
 * @param {string} type - Message type ('success', 'error', 'warning', 'info')
 * @param {number} [timeout] - Auto-removal timeout in ms
 */
function showStatusMessage(container, message, type, timeout) {
    // Implementation
}

/**
 * Toggle element visibility
 * @param {HTMLElement} element - Element to toggle
 * @param {boolean} [show] - Whether to show or hide (toggle if undefined)
 * @returns {boolean} - New visibility state
 */
function toggleVisibility(element, show) {
    // Implementation
}

/**
 * Initialize tabs
 * @param {string} tabButtonSelector - Tab button selector
 * @param {string} tabContentSelector - Tab content selector
 * @param {Function} [callback] - Callback when tab changes
 */
function initTabs(tabButtonSelector, tabContentSelector, callback) {
    // Implementation
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit in ms
 * @returns {Function} - Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
```

#### Usage Example

```javascript
import { formatDuration, showStatusMessage, debounce } from '../utils/uiUtils.js';

// Format a duration
const duration = 3665; // seconds
document.getElementById('duration').textContent = formatDuration(duration); // "01:01:05"

// Show a status message
showStatusMessage(
    document.getElementById('status-container'),
    'Operation successful',
    'success',
    5000 // Auto-hide after 5 seconds
);

// Debounce a resize handler
window.addEventListener('resize', debounce(() => {
    console.log('Window resized');
    // Update layout
}, 250));
```

## Python Utility Modules

### File Handling

`file_utils.py` provides utilities for working with files in the backend.

#### Key Functions

```python
def get_supported_image_extensions():
    """
    Get a list of supported image file extensions.
    
    Returns:
        list: List of supported extensions
    """
    return ['.jpg', '.jpeg', '.tiff', '.tif', '.png', '.nef', '.cr2', '.arw', '.dng']

def is_image_file(file_path):
    """
    Check if a file is an image based on extension.
    
    Args:
        file_path: Path to the file
        
    Returns:
        bool: Whether the file is an image
    """
    return os.path.splitext(file_path.lower())[1] in get_supported_image_extensions()

def get_files_in_directory(directory, recursive=False, file_types=None, exclude_dirs=None):
    """
    Get a list of files in a directory.
    
    Args:
        directory: Directory to search
        recursive: Whether to search subdirectories
        file_types: List of file extensions to include
        exclude_dirs: List of directory names to exclude
        
    Returns:
        list: List of file paths
    """
    # Implementation
```

### Path Utilities

`path_utils.py` provides utilities for working with file paths.

#### Key Functions

```python
def sanitize_filename(filename):
    """
    Sanitize a filename to be safe for all operating systems.
    
    Args:
        filename: Filename to sanitize
        
    Returns:
        str: Sanitized filename
    """
    # Implementation

def generate_output_filename(input_dir, output_dir=None, extension=".gpx"):
    """
    Generate an output filename based on input directory.
    
    Args:
        input_dir: Input directory
        output_dir: Output directory (optional)
        extension: File extension
        
    Returns:
        str: Output filename
    """
    # Implementation
```

### GPS Utilities

`gps_utils.py` provides utilities for working with GPS data in the backend.

#### Key Functions

```python
def calculate_distance(lat1, lon1, lat2, lon2):
    """
    Calculate distance between two points using Haversine formula.
    
    Args:
        lat1: Latitude of point 1
        lon1: Longitude of point 1
        lat2: Latitude of point 2
        lon2: Longitude of point 2
        
    Returns:
        float: Distance in kilometers
    """
    # Implementation

def calculate_speed(lat1, lon1, timestamp1, lat2, lon2, timestamp2):
    """
    Calculate speed between two points.
    
    Args:
        lat1: Latitude of point 1
        lon1: Longitude of point 1
        timestamp1: Timestamp of point 1
        lat2: Latitude of point 2
        lon2: Longitude of point 2
        timestamp2: Timestamp of point 2
        
    Returns:
        float: Speed in km/h
    """
    # Implementation

def calculate_bearing(lat1, lon1, lat2, lon2):
    """
    Calculate initial bearing between two points.
    
    Args:
        lat1: Latitude of point 1
        lon1: Longitude of point 1
        lat2: Latitude of point 2
        lon2: Longitude of point 2
        
    Returns:
        float: Bearing in degrees
    """
    # Implementation
```

## Best Practices for Using Utility Modules

### 1. Import Only What You Need

For better performance and readability, import only the functions you need:

```javascript
// Good
import { getById, show, hide } from '../utils/domHelpers.js';

// Avoid unless you need everything
import * as DOMHelpers from '../utils/domHelpers.js';
```

### 2. Combine with Other Modules

```javascript
import { getById } from '../utils/domHelpers.js';
import { showStatusMessage } from '../utils/uiUtils.js';

// Show loading indicator
const loadingElement = getById('loading-indicator');
loadingElement.style.display = 'block';

// Process data
processData()
    .then(result => {
        // Show success message
        showStatusMessage(getById('status-container'), 'Success!', 'success');
        // Hide loading indicator
        loadingElement.style.display = 'none';
    })
    .catch(error => {
        // Show error message
        showStatusMessage(getById('status-container'), error.message, 'error');
        // Hide loading indicator
        loadingElement.style.display = 'none';
    });
```

### 3. Use for Common Patterns

The utility functions are designed to standardize common operations. Using them consistently makes the code more maintainable:

```javascript
// Without utilities
document.getElementById('my-button').addEventListener('click', function() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('error-message').textContent = '';
    
    // Process data
});

// With utilities
import { getById, on, show, hide } from '../utils/domHelpers.js';

on(getById('my-button'), 'click', () => {
    show(getById('loading'));
    getById('error-message').textContent = '';
    
    // Process data
});
```

### 4. Extend When Needed

If you find yourself repeating similar patterns that aren't covered by the utilities, consider extending the appropriate utility module:

```javascript
// Add to domHelpers.js
/**
 * Add multiple event listeners at once
 * @param {HTMLElement} element - Element to add listeners to
 * @param {Object} events - Object mapping event names to handlers
 */
function addEvents(element, events) {
    for (const [event, handler] of Object.entries(events)) {
        element.addEventListener(event, handler);
    }
}

// Usage
import { addEvents } from '../utils/domHelpers.js';

addEvents(dropArea, {
    dragenter: handleDragEnter,
    dragover: handleDragOver,
    dragleave: handleDragLeave,
    drop: handleDrop
});
```

## Charts Module

`charts.js` provides a wrapper around Chart.js for creating and managing charts.

### Key Methods

```javascript
/**
 * Chart manager for PixTrail
 */
class ChartManager {
    /**
     * Initialize chart manager
     * @param {Object} config - Configuration options
     * @param {HTMLElement} config.container - Container element
     * @param {string} config.type - Chart type
     * @param {Object} config.data - Chart data
     * @param {Object} config.options - Chart options
     */
    constructor(config) {
        // Implementation
    }
    
    /**
     * Update chart data
     * @param {Object} newData - New chart data
     */
    updateChart(newData) {
        // Implementation
    }
    
    /**
     * Update chart options
     * @param {Object} newOptions - New chart options
     */
    updateOptions(newOptions) {
        // Implementation
    }
    
    /**
     * Create a pre-configured line chart
     * @param {HTMLElement} container - Container element
     * @param {string} title - Chart title
     * @param {string[]} labels - X-axis labels
     * @param {number[]} data - Y-axis data
     * @param {string} yAxisLabel - Y-axis label
     * @returns {ChartManager} - Chart manager instance
     */
    static createLineChart(container, title, labels, data, yAxisLabel) {
        // Implementation
    }
}
```

## Drag and Drop

`dragAndDrop.js` manages file and directory drag and drop functionality.

### Key Methods

```javascript
/**
 * Drag and drop handler for PixTrail
 */
class DragAndDrop {
    /**
     * Initialize drag and drop
     * @param {Object} config - Configuration options
     * @param {HTMLElement} config.fileDropArea - File drop area
     * @param {HTMLElement} config.directoryDropArea - Directory drop area
     * @param {HTMLInputElement} config.fileInput - File input
     * @param {HTMLInputElement} config.directoryInput - Directory input
     * @param {Function} config.onFileDrop - File drop handler
     * @param {Function} config.onDirectoryDrop - Directory drop handler
     */
    constructor(config) {
        // Implementation
    }
    
    /**
     * Initialize event listeners
     */
    init() {
        // Implementation
    }
    
    /**
     * Handle file drop
     * @param {DragEvent} event - Drop event
     */
    handleFileDrop(event) {
        // Implementation
    }
    
    /**
     * Handle directory drop
     * @param {DragEvent} event - Drop event
     */
    handleDirectoryDrop(event) {
        // Implementation
    }
}
```

## Related Documentation

- [Module Structure](../development/module-structure.md)
- [Core Modules Documentation](core.md)
- [EXIF Reader Documentation](exif.md)
- [GPX Generator Documentation](gpx.md)
