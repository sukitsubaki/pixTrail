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
- The server runs only on your local machine (not on the internet)
- The interface is responsive and works on various screen sizes
