# Getting Started with PixTrail

This guide will help you quickly get up and running with PixTrail. It covers installation, basic usage, and points you to more detailed documentation for advanced features.

## Requirements

Before installing PixTrail, make sure you have:

- Python 3.6 or newer
- pip (Python package installer)
- Photos with GPS data in their EXIF metadata

## Quick Installation

The fastest way to install PixTrail is using pip:

```bash
pip install pixtrail
```

If you want to use the web interface (recommended for most users):

```bash
pip install pixtrail[web]
```

For more detailed installation instructions, including platform-specific guidance, see the [Installation Guide](installation.md).

## Basic Usage

### Command Line

After installation, you can use PixTrail from the command line. Here's a simple example:

```bash
# Process photos in a directory
pixtrail -i /path/to/photos
```

This will:
1. Scan all photos in the specified directory
2. Extract GPS data from their EXIF metadata
3. Create a GPX file in the same directory

### Web Interface

For a more visual experience, use the web interface:

```bash
# Start the web interface
pixtrail -w
```

This will:
1. Start a local web server
2. Open your default browser to the PixTrail interface
3. Allow you to upload photos or select directories for processing

## First Steps

### 1. Prepare Your Photos

Make sure your photos have GPS data. Most smartphones automatically embed GPS coordinates in photos. For cameras without built-in GPS, you can use various applications to geotag your photos.

### 2. Process Your Photos

Using either the command line or web interface, select the directory containing your photos.

### 3. View Your Route

After processing, PixTrail will generate a GPX file. If you're using the web interface, you'll see your route displayed on a map immediately. If you're using the command line, you can import the GPX file into your favorite mapping application.

## Common Tasks

### Processing a Directory of Photos

```bash
# Basic directory processing
pixtrail -i /path/to/photos

# Process recursively (including subdirectories)
pixtrail -i /path/to/photos -r

# Specify a custom output file
pixtrail -i /path/to/photos -o my_journey.gpx
```

### Batch Processing Multiple Directories

```bash
# Process multiple directories at once
pixtrail -b /path/to/trip1 /path/to/trip2 /path/to/trip3

# Save all output files to a specific directory
pixtrail -b /path/to/trip1 /path/to/trip2 -d /path/to/gpx_files
```

### Using the Web Interface

1. Start the web interface with `pixtrail -w`
2. Click on the "Directory" tab
3. Click "Select Directory" and choose your photos folder
4. Click "Process Photos"
5. Explore the map, enable features like the heatmap or clustering
6. Download the GPX file using the "Download GPX" button

## Next Steps

Now that you've processed your first set of photos, you might want to explore:

- [Detailed usage instructions](usage.md) for more command options
- [Web interface documentation](web-interface.md) for advanced features
- [Visualization features](visualization/index.md) for understanding the heat map and clustering options
- [Tutorials](tutorials/index.md) for step-by-step guides for specific tasks

## Example Workflow

Here's a complete example workflow:

1. Take photos during your hike or city tour
2. Copy photos to your computer
3. Run PixTrail:
   ```bash
   pixtrail -i ~/Photos/MyJourney
   ```
4. Import the generated GPX file into Google Earth, OpenStreetMap, or any GPX-compatible application
5. Explore your journey on the map, seeing exactly where each photo was taken

You now have a visual record of your journey based on the photos you took!

## Troubleshooting

If you encounter any issues:

- Check that your photos contain GPS data
- Ensure you have the proper permissions to read/write the specified directories
- Run with the verbose flag for more information: `pixtrail -i /path/to/photos -v`
- See the [Troubleshooting Guide](troubleshooting.md) for solutions to common problems

For additional help, check the [FAQ](faq.md) or visit our GitHub repository.
