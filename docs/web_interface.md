# PixTrail Web Interface Documentation

The PixTrail web interface provides an easy-to-use browser-based method to process your photos, extract GPS data, and generate GPX files. This document explains how to use the web interface features.

## Starting the Web Interface

You can start the web interface using the command-line tool:

```bash
# Basic usage - starts the web interface on localhost:5000
pixtrail -w

# Specify a custom host and port
pixtrail -w --host 0.0.0.0 --port 8080

# Start without automatically opening a browser
pixtrail -w --no-browser
```

Once started, your browser will open to the PixTrail web interface (unless `--no-browser` is specified).

## Privacy

All processing happens directly on your local device. Your photos and GPS data never leave your computer - no data is uploaded to any external server. Files are processed in a temporary directory on your local machine.

## Interface Overview

The web interface has several main components:

1. **Input Selection Area**: For selecting photos to process
2. **Map Viewer**: For displaying the extracted route
3. **Controls**: For downloading GPX files and managing data

## Selecting Photos

PixTrail offers multiple ways to select photos for processing:

### File Selection

The **Files** tab allows you to select individual photos:

1. Click the "Select Photos" button to open the file picker
2. Select one or more photos with your mouse
3. Click "Open" to add them to PixTrail

Alternatively, you can drag and drop photos directly onto the drop area.

### Directory Selection

The **Directory** tab allows you to select an entire folder of photos:

1. Click the "Select Directory" button to open the folder picker
2. Navigate to and select the folder containing your photos
3. Click "Open" to add all photos from the directory

When processing a directory, you can enable additional options:

- **Process subdirectories recursively**: When checked, PixTrail will also look for photos in all subfolders
- **Depth level**: When recursive processing is enabled, you can specify how many levels of subfolders to process (or select "All levels" to process the entire directory tree)

You can also drag and drop a folder directly onto the directory drop area.

## Processing Photos

After selecting your photos:

1. Click the "Process Photos" button
2. The progress bar will show the upload and processing progress
3. Once processing is complete, the map will display your extracted route

## Viewing the Map

After processing, your route will be displayed on the map:

- Each photo with GPS data is shown as a marker on the map
- The markers are connected by a blue line representing your route
- Click on a marker to see details about that point (filename, coordinates, and timestamp)
- You can zoom and pan the map using mouse controls

## Downloading GPX Files

Once your photos have been processed:

1. Click the "Download GPX" button
2. Save the GPX file to your preferred location
3. The GPX file will contain waypoints for each photo and a track connecting them

## Clearing Data

To clear the processed data and start over:

1. Click the "Clear Data" button
2. This will remove the displayed route and all processed data
3. You can then select and process a new set of photos

## System Requirements

The web interface works best with:

- A modern browser (Chrome, Firefox, Edge, or Safari)
- JavaScript enabled
- For directory selection and drag and drop, your browser must support the HTML5 File API

## Troubleshooting

If you encounter issues with the web interface:

1. **No photos appear on the map**: Ensure your photos contain GPS data in their EXIF metadata
2. **Directory selection doesn't work**: Make sure you're using a modern browser that supports the webkitdirectory attribute
3. **Processing hangs**: For very large collections, processing may take time. Check for any errors in the status messages area
4. **Drag and drop doesn't work**: Some browsers have limitations with directory drag and drop. Try using the file picker instead

If problems persist, check the console output of the PixTrail server for more detailed error messages.
