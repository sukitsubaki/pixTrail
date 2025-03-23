# PixTrail Web Interface

The PixTrail web interface provides a user-friendly way to process photos with GPS data and create interactive route visualizations.

## Getting Started

To start the web interface:

```bash
pixtrail -w
```

This launches a local web server and automatically opens your default browser to the PixTrail interface. If the browser doesn't open automatically, navigate to `http://127.0.0.1:5000`.

You can customize the server settings:

```bash
# Use a custom host and port
pixtrail -w --host 0.0.0.0 --port 8080

# Start the server without opening a browser
pixtrail -w --no-browser
```

## Interface Overview

The web interface is divided into several key sections:

1. **Header**: Contains the application title and main controls
2. **Photo Input**: Options for selecting photos to process
3. **Map View**: Displays the route and photo locations
4. **Statistics Panel**: Shows journey metrics and charts (when enabled)
5. **Status Messages**: Provides feedback on operations

## Photo Input Options

### Files Tab

The Files tab allows you to upload individual photo files:

1. Click the "Choose Files" button or drag and drop photos onto the drop area
2. Select multiple files using Ctrl/Cmd+click or Shift+click
3. Click "Process Photos" to extract GPS data and generate the route

### Directory Tab

The Directory tab lets you process an entire directory of photos:

1. Click "Select Directory" to choose a folder containing photos
2. Optionally check "Process subdirectories recursively" to include nested folders
3. If using recursive processing, you can set the maximum depth level
4. Click "Process Photos" to begin

## Map Features

After photos are processed, the map view shows your journey:

### Basic Map Controls

- **Zoom**: Use the +/- buttons or mouse wheel
- **Pan**: Click and drag the map
- **Reset View**: Double-click to zoom to your full route
- **Photo Markers**: Click markers to see details about each photo

### Advanced Visualization

The map includes several advanced visualization options:

#### Marker Clustering

For routes with many photos, marker clustering groups nearby markers:

1. Click "Enable Clustering" to activate
2. Use the radius slider to adjust the clustering sensitivity
3. Click on clusters to zoom in and see individual markers
4. Click "Disable Clustering" to turn it off

#### Heat Map

The heat map visualizes where you spent the most time:

1. Click "Show Heatmap" to display the heat map overlay
2. Areas with more photos or longer stays appear in red/yellow
3. Less frequented areas show in blue/green
4. Click "Hide Heatmap" to remove the overlay

### Map Controls

The controls panel includes:

- **Download GPX**: Save your route as a GPX file
- **Show/Hide Heatmap**: Toggle the heat map visualization
- **Enable/Disable Clustering**: Toggle marker clustering
- **Show/Hide Statistics**: Toggle the statistics panel
- **Clear Data**: Reset and start fresh

## Statistics Panel

Click "Show Statistics" to view detailed metrics about your journey:

### Summary Statistics

The summary includes:

- **Total Distance**: The cumulative distance traveled
- **Total Duration**: Time between first and last photo
- **Start/End Times**: Timestamps from the first and last photos
- **Avg. Speed**: Average traveling speed calculated from timestamps
- **Max. Speed**: Maximum speed between any two consecutive photos
- **Elevation Data**: Minimum, maximum, and total elevation gain
- **Photo Count**: Number of photos with GPS data

### Interactive Charts

The statistics panel includes two interactive charts:

1. **Elevation Profile**: Shows elevation changes throughout your journey
2. **Speed Profile**: Shows speed variations between photo locations

Hover over the charts to see exact values at any point.

## Privacy Features

PixTrail respects your privacy:

- All processing happens locally on your device
- JPEG and TIFF photos are processed directly in your browser
- RAW and other formats are processed locally by the server
- No data is sent to external services
- Photos are never uploaded to the internet

## Browser Compatibility

The web interface works best in modern browsers:

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)

The interface is also mobile-responsive, though file selection may be limited on some mobile devices.

## Technical Details

### Client-Side Processing

JPEG and TIFF files are processed entirely in the browser:

1. Files are read using the JavaScript File API
2. EXIF data is extracted using client-side JavaScript
3. GPS coordinates and timestamps are collected
4. The map is updated with the extracted data
5. The original photos never leave your device

### Server-Side Processing

For RAW and other non-browser-friendly formats:

1. Files are temporarily uploaded to the local server
2. The server extracts EXIF data using Python libraries
3. Only the extracted GPS data is returned to the browser
4. Temporary files are automatically deleted

## Troubleshooting

### Common Issues

- **No files appear when selecting a directory**: Some browsers have limited directory support; try the Files tab instead
- **No route appears after processing**: Your photos may not contain GPS data
- **Map doesn't load**: Check your internet connection (needed for map tiles)
- **Slow performance with many photos**: Try enabling clustering for improved performance

For more troubleshooting help, see the [Troubleshooting Guide](troubleshooting.md).

## Keyboard Shortcuts

The web interface supports several keyboard shortcuts:

- **Ctrl+O**: Open file selection dialog
- **Ctrl+D**: Open directory selection dialog
- **Ctrl+P**: Process selected photos
- **Esc**: Close popups or cancel operations
- **H**: Toggle heatmap
- **C**: Toggle clustering
- **S**: Toggle statistics panel
- **D**: Download GPX file (when available)

## Next Steps

After visualizing your route, you might want to:

- [Customize the visualization](visualization/index.md) with different map styles or settings
- [Process multiple directories](tutorials/batch-processing.md) to compare different journeys
- [Analyze your route statistics](visualization/statistics.md) to gain insights about your journey
