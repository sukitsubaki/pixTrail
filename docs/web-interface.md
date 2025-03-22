# PixTrail Web Interface

The PixTrail web interface provides a user-friendly way to process photos with GPS data and create route visualizations.

## Overview

The web interface is built using modern JavaScript and CSS with a modular architecture. It offers the following features:

- File selection via upload or drag-and-drop
- Directory selection for batch processing
- Local EXIF data extraction for privacy
- Interactive map visualization with OpenStreetMap
- Marker clustering for dense photo sets
- Heatmap visualization of photo locations
- Detailed route statistics with charts
- GPX file export for use in other applications

## Interface Sections

### Photo Upload Section

The photo upload section allows you to select photos for processing:

- **Files Tab**: Upload individual photo files
  - Select multiple files using the file browser
  - Drag and drop photos directly onto the drop area
  
- **Directory Tab**: Upload all photos from a directory
  - Select a directory to process all photos within it
  - Option to recursively process subdirectories
  - Set maximum depth level for recursive processing

### Map Section

The map section displays your photos as a route on an interactive map:

- **Base Map**: OpenStreetMap tiles showing geographic context
- **Markers**: Individual markers for each photo with popups showing:
  - File name
  - Coordinates
  - Timestamp
  - Altitude (if available)
- **Route Line**: A blue line connecting photos in chronological order
- **Controls**:
  - Download GPX: Export the route as a GPX file
  - Show/Hide Heatmap: Toggle heatmap visualization
  - Enable/Disable Clustering: Toggle marker clustering
  - Show/Hide Statistics: Toggle statistics panel
  - Clear Data: Reset all data and return to initial state

### Statistics Section

The statistics section provides detailed information about your route:

- **Summary Statistics**:
  - Total distance
  - Total duration
  - Start and end times
  - Average and maximum speeds
  - Elevation data
  - Photo count
- **Charts**:
  - Elevation profile showing altitude changes
  - Speed profile showing velocity variations

## Browser Compatibility

The web interface works in modern browsers:

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)

Mobile browsers are supported with a responsive design.

## Data Privacy

PixTrail respects your privacy:

- All processing happens directly in your browser
- Photos with JPEG/TIFF format are processed entirely client-side
- Only necessary GPS data is sent to the server for RAW/PNG formats
- No image content is uploaded to external services
- Full photos never leave your device (only metadata when needed)

## Advanced Features

### Marker Clustering

For routes with many photos, marker clustering groups nearby markers together:

- Adjust cluster radius with the slider
- Click on clusters to zoom in and see individual markers
- Improves performance with large datasets

### Heatmap Visualization

The heatmap view provides a density visualization of your photos:

- Areas with more photos appear hotter (red/yellow)
- Time spent at a location increases intensity
- Useful for analyzing where you spent most time

### Direct EXIF Processing

JPEG and TIFF photos are processed directly in your browser:

- Faster processing as no upload is needed
- Improved privacy as photos stay on your device
- Reduced server load and bandwidth usage

## Technical Architecture

The web interface is built with a modular architecture:

- **JavaScript Modules**: Individual feature modules for better organization
- **CSS Modules**: Component-specific styles for better maintainability
- **Utility Functions**: Reusable utilities for common operations

For more technical details, see the [API Documentation](api/index.md) and [Architecture Overview](architecture.md).

## Performance Considerations

- Large photo collections (100+) may take longer to process
- RAW format photos are processed server-side and may be slower
- Enabling marker clustering improves performance with many markers
- The application uses asynchronous processing to avoid blocking the UI

## Troubleshooting

If you encounter issues with the web interface, see the [Troubleshooting Guide](troubleshooting.md) for common solutions.