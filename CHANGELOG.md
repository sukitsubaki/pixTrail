# Changelog

All notable changes to the PixTrail project will be documented in this file.

## [2.3.0] - 2025-03-22

### New Features
#### Heatmap Visualization
* **Time & density visualization**: Color-coded overlay showing where you spent the most time or took the most photos
* **Intensity calculation**: Smart algorithm that combines photo count and dwell duration for accurate representation
* **Toggle functionality**: Simple on/off switch for comparing with standard map view
* **Compatible with other views**: Can be used alongside standard markers or clustering

#### Marker Clustering
* **Smart grouping**: Automatically combines nearby markers to reduce map clutter
* **Adjustable radius**: Slider control to fine-tune the clustering sensitivity (20-200px)
* **Quantity indicators**: Clear display of photo count within each cluster
* **Interactive expansion**: Click to zoom and reveal individual photos within clusters

#### Route Statistics and Analytics
* **Performance metrics**: Calculations for total distance, average/max speed, and journey duration
* **Elevation analysis**: Min/max altitude and total elevation gain
* **Interactive charts**: Visual representations of elevation profile and speed variations
* **Time analysis**: Start/end times and timestamp-based calculations

### Improvements
* Enhanced map interface with action-state visual indicators
* Optimized performance for large photo collections (300+ waypoints)
* Mobile-responsive statistics panel and controls
* Added detailed error handling for GPS data inconsistencies

### Technical Enhancements
* Added Chart.js for statistical visualizations
* Implemented Leaflet.heat for heatmap generation
* Added Leaflet.markercluster for efficient marker management
* Improved data processing algorithms with outlier detection

### Contributors
* @sukitsubaki in #8, #13
* @neoneko87 in #9, #10, #11, #12

## [2.2.0] - 2025-03-22

### New Features
#### Hybrid Image Processing (Web Interface)
* **New 2-way processing**: JPEG/TIFF files are now processed directly in the browser, while RAW/PNG files are processed on the server
* **Complete format support**: Supports all common image formats, including JPEG, PNG, TIFF, and various RAW formats (CR2, NEF, ARW, ORF, RW2, PEF, SRW, DNG)
* **Faster processing**: Client-side extraction of EXIF data for compatible formats significantly reduces processing time

#### Optimized Resource Usage (Web Interface)
* **Automatic cleanup**: Temporary image files are automatically deleted after GPS data extraction
* **Reduced disk usage**: Only GPX files are stored, dramatically reducing the storage requirements
* **Relocated cache**: Cache directory moved to `__pixtrail-cache__` within the project directory

#### Improved User Interface (Web Interface)
* **Better error messages**: More detailed and informative error messages
* **Optimized message placement**: Status messages now appear directly below action buttons for better visibility
* **Enhanced upload capabilities**: Increased maximum upload size limit

### Technical Improvements (Web Interface)
* Implemented EXIF.js for client-side metadata extraction
* Added robust error handling throughout the application
* Optimized server-side file processing

### Bug Fixes
* Web interface: Fixed processing errors for large file uploads
* Web interface: Improved handling of missing GPS data in images
* Web interface: Fixed memory usage issues with large image collections

## [2.1.0] - 2025-03-22

### New Features
* **Directory Selection**: Added ability to select and process entire directories of photos directly in the web interface
* **Recursive Processing**: Support for recursively scanning subdirectories with configurable depth levels
* **Drag & Drop Support**: Added intuitive drag & drop functionality for both files and directories

### Improvements
* Redesigned input selection UI with tabbed interface for switching between file and directory modes
* Enhanced progress reporting during processing
* Updated documentation with detailed explanations of new features
* Added visual feedback during drag and drop operations

## [2.0.1] - 2025-03-22

### Bug Fixes
* Improved handling of photos without GPS data and revised terminology (#5)

## [2.0.0] - 2025-03-21

This major update introduces a powerful new web interface with Flask that makes it easier than ever to visualize and share your journeys, while keeping your data private and secure.

### New Features
#### Web Interface
* Upload and process photos directly in your browser
* Visualize your routes on an interactive OpenStreetMap
* Generate and download GPX files with a single click
* Keep all your data private - nothing is uploaded to any server

#### Privacy Focused
* All processing happens completely locally on your device
* Your photos and location data never leave your computer
* No tracking, no data collection, no server uploads

#### Interactive Maps
* Dynamic route plotting on OpenStreetMap
* Markers for each photo with timestamp and location information
* Automatic map centering and zoom based on your route
* Full route line connecting all waypoints chronologically

### Improvements
#### Command Line Enhancements
* Start the web interface with a simple command: `pixtrail -w`
* Configure host and port: `pixtrail -w --host 0.0.0.0 --port 8080`
* Control browser launch behavior: `pixtrail -w --no-browser`

## [1.3.0] - 2025-03-20

### New Features
* **Batch Processing**: Process multiple photo directories in a single command with the new batch processing feature. Perfect for photographers who want to generate GPX tracks for multiple events or trips at once.

## [1.2.0] - 2025-03-20

### New Features
* **Automatic GPX Naming**: GPX files are now automatically named after the photo directory. For example, if you run `pixtrail /path/to/Photos_Kyoto`, a file named `Photos_Kyoto.gpx` will be created in the same directory.

### Minor Changes
* The default filename has been changed from `track.gpx` to `PixTrail.gpx` when no explicit name can be derived.

## [1.1.1] - 2025-03-19

### Bug Fixes
* **Fixed duplicate success messages**: Removed redundant "GPX file created successfully" message that was appearing twice in terminal output

## [1.1.0] - 2025-03-19

### New Features
* **Added RAW file support**: Now supporting various RAW formats (CR2, NEF, ARW, DNG, ORF, RW2, PEF, SRW)

## [1.0.0] - 2025-03-19 - Initial Release

PixTrail is a Python-based tool that extracts GPS data from photo EXIF metadata and generates GPX files for mapping and route visualization.

### Features
* Extract geographical coordinates and timestamps from EXIF metadata in images
* Process individual photos or entire directories (with recursive option)
* Generate GPX files containing waypoints and tracks from your photos
* Support for various image formats (JPG, PNG, TIFF)
* Command-line interface for easy integration
