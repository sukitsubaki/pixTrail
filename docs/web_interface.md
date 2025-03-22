# Web Interface Documentation

This document provides details about the PixTrail web interface, including how to start it, its features, and how it processes photos.

## Starting the Web Interface

You can start the web interface using the command-line interface with the `-w` or `--web` option:

```bash
# Start with default settings (localhost:5000)
pixtrail -w

# Specify host and port
pixtrail -w --host 0.0.0.0 --port 8080

# Start without automatically opening a browser
pixtrail -w --no-browser
```

The web interface starts a local web server on your machine and automatically opens a browser window pointing to the interface.

## Processing Photos

The PixTrail web interface offers two main methods for processing photos:

1. **Individual Photos**: Upload and process individual image files
2. **Directory**: Process an entire directory of photos

### Hybrid Processing Approach

PixTrail uses a hybrid approach to process different types of image files:

- **Client-side Processing (In-Browser)**:
  - JPEG/TIFF files are processed directly in your browser
  - EXIF data is extracted using the browser's JavaScript capabilities
  - Only the extracted GPS coordinates are sent to the server
  - This provides faster processing and reduced bandwidth usage

- **Local Server-side Processing**:
  - RAW files (CR2, NEF, ARW, etc.) and other formats are processed on the server
  - These files are temporarily uploaded to the server for processing
  - After extracting GPS data, the original files are automatically deleted
  - Only the generated GPX file is stored

### File Selection

You can select files in several ways:

- Click the "Select Photos" button to choose individual files
- Click the "Select Directory" button to choose an entire folder
- Drag and drop image files directly into the interface

### Recursive Directory Processing

When processing a directory, you can choose to process subdirectories recursively:

1. Check the "Process subdirectories recursively" option
2. Optionally specify a depth level (0 = all levels)

## Viewing Results

After processing, PixTrail will:

1. Display a map showing the route derived from your photos
2. Add markers for each photo location
3. Show a timeline of the journey based on photo timestamps
4. Provide statistics about the processed photos

## Advanced Visualization Features

### Heat Map

The heat map feature visualizes where you spent the most time during your journey:

1. Click the "Show Heatmap" button in the map controls to toggle the heat map
2. Areas with higher intensity (red/yellow) indicate:
   - More photos taken at that location
   - Longer time spent at that location (based on photo timestamps)
3. Areas with lower intensity (blue/green) indicate brief or single-photo stops
4. The heat map can be enabled simultaneously with the clustering feature

### Marker Clustering

For routes with many photos, clustering helps keep the map clean and navigable:

1. Click the "Enable Clustering" button to group nearby photos into clusters
2. Each cluster shows the number of photos it contains
3. Click a cluster to zoom in and see individual photos
4. Use the radius slider to adjust how aggressively photos are grouped
   - Smaller radius: More individual markers, fewer clusters
   - Larger radius: Fewer, larger clusters
5. The clustering feature works well for dense city tours or locations with many photos

### Route Statistics

The statistics panel provides detailed metrics about your journey:

1. Click the "Show Statistics" button to open the statistics panel
2. View summary statistics:
   - Total distance traveled
   - Journey duration
   - Average and maximum speeds
   - Elevation data (min/max elevation and total elevation gain)
   - Start and end times
   - Total number of photos
3. Interactive charts visualize:
   - Elevation profile throughout your journey
   - Speed variations between waypoints
4. These calculations are based on the GPS coordinates and timestamps from your photos

## Downloading GPX Files

You can download the generated GPX file by clicking the "Download GPX" button. This file can be imported into:

- Google Earth
- Garmin GPS devices
- OpenStreetMap
- Any GPX-compatible mapping application

## Privacy and Data Handling

The PixTrail web interface runs entirely on your local machine. No photo data is sent to external servers:

- For JPEG/TIFF files, only the extracted GPS coordinates are sent to the local server
- For RAW/PNG files, files are temporarily cached locally during processing
- All temporary files are automatically deleted after processing
- Only the generated GPX files are stored in the `__pixtrail-cache__` directory

## Technical Details

- The web interface is built with Flask and modern web technologies
- The client-side uses JavaScript and the EXIF.js library for metadata extraction
- Chart visualizations are powered by Chart.js
- The server runs only on your local machine (not on the internet)
- The interface is responsive and works on various screen sizes