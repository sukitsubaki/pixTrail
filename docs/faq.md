# Frequently Asked Questions

This page answers common questions about PixTrail, its features, and how to use it effectively.

## General Questions

### What is PixTrail?

PixTrail is a tool that extracts GPS data from the EXIF metadata of your photos and generates GPX files that can be used in mapping applications. It allows you to visualize and share your journeys based on the places where you've taken photos.

### How does PixTrail work?

PixTrail works by:
1. Reading the EXIF metadata from your photos, which includes GPS coordinates and timestamps
2. Extracting the location data from each photo
3. Creating a GPX file with waypoints for each photo location
4. Creating a track that connects these waypoints in chronological order
5. Optionally visualizing this data on a map via the web interface

### Is PixTrail free to use?

Yes, PixTrail is an open-source project licensed under the MIT License. You can use it for free, both for personal and commercial purposes.

### What platforms does PixTrail support?

PixTrail runs on:
- Windows
- macOS
- Linux

Any platform that supports Python 3.6 or newer can run PixTrail.

## Photo and File Format Questions

### What photo formats does PixTrail support?

PixTrail supports the following image formats:
- JPEG/JPG (most common)
- PNG (limited EXIF support)
- TIFF
- RAW formats:
  - CR2 (Canon)
  - NEF (Nikon)
  - ARW (Sony)
  - DNG (Digital Negative)
  - ORF (Olympus)
  - RW2 (Panasonic)
  - PEF (Pentax)
  - SRW (Samsung)

### How do I know if my photos have GPS data?

Most modern smartphones automatically embed GPS coordinates when taking photos. For digital cameras, you may need to enable GPS tagging in the settings or use a camera with built-in GPS.

You can check if your photos have GPS data by:
- Looking at the photo properties in your operating system's file explorer
- Using photo management software like Adobe Lightroom, Apple Photos, or Google Photos
- Using online EXIF viewers or tools like ExifTool

### Can PixTrail process videos?

Currently, PixTrail focuses on still images. Video support may be added in future versions.

### What if some of my photos don't have GPS data?

PixTrail will automatically skip photos that don't have GPS data and only process those that do. If none of your photos have GPS data, PixTrail will notify you that no GPS data was found.

### Does PixTrail modify my original photos?

No, PixTrail only reads data from your photos; it never modifies the original files. It extracts the GPS information and creates a separate GPX file.

## GPX Files and Mapping

### What is a GPX file?

GPX (GPS Exchange Format) is an XML file format for storing GPS data. It can contain waypoints, tracks, and routes, and is supported by many mapping and GPS applications.

### How can I use the generated GPX files?

You can use the GPX files with:
- Google Earth
- OpenStreetMap
- Garmin GPS devices
- Strava and other fitness tracking apps
- Most hiking and navigation apps
- GIS software

### Can I customize the GPX output?

Using the command line or Python API, you can:
- Specify the output filename and location
- Filter which photos to include based on various criteria
- Customize the waypoint information

Advanced customization requires using the Python API.

### Why doesn't my GPX file show up correctly in my mapping software?

This could be due to:
- GPS data errors in the original photos
- Incompatible GPX features being used
- Software-specific limitations

Try opening the GPX file in a different application to determine if it's a file issue or a software issue.

## Web Interface Questions

### How do I start the web interface?

Run the following command:
```bash
pixtrail -w
```

This will start a local web server and automatically open your browser to the interface. If the browser doesn't open automatically, navigate to `http://127.0.0.1:5000`.

### Is the web interface sending my data to the internet?

No. The web interface runs completely locally on your machine. No data is sent to external servers. All processing happens on your computer, and your photos and location data never leave your device.

### Can I access the web interface from another device?

By default, the web interface is only accessible from the local machine. However, you can make it accessible on your local network by specifying the host:

```bash
pixtrail -w --host 0.0.0.0 --port 8080
```

Then, other devices on your network can access it at `http://YOUR_IP_ADDRESS:8080`.

### Why can't I see the heat map or clustering options?

These features are only available after you've processed photos and the map is displayed. If you don't see these options after processing photos, try:
- Checking if your photos have GPS data
- Refreshing the page
- Restarting the web interface

## Data Privacy Questions

### Does PixTrail upload my photos or data anywhere?

No. PixTrail processes all data locally on your device. In the web interface, JPEG/TIFF files are processed directly in your browser, and only the extracted GPS coordinates are sent to the local server. RAW files are temporarily cached locally during processing and then automatically deleted.

### Where are temporary files stored?

Temporary files are stored in the `__pixtrail-cache__` directory, which is typically located in the same directory as the PixTrail package. These files are automatically cleaned up after processing.

### Is my location data secure?

Yes. Since all processing happens locally on your device, your location data remains private. The generated GPX files are stored only on your computer unless you explicitly share them.

## Technical Questions

### What are the system requirements for PixTrail?

- Python 3.6 or newer
- Approximately 50MB of disk space for installation
- Additional temporary space for processing RAW files
- For the web interface: A modern web browser (Chrome, Firefox, Edge, or Safari)

### How can I process a large number of photos efficiently?

For large collections:
- Use the batch processing mode (`-b` flag)
- Process photos in smaller batches
- Use the recursive flag (`-r`) to process subdirectories
- Use a computer with sufficient RAM, especially for RAW files

See the [Batch Processing](tutorials/batch-processing.md) tutorial for more details.

### Can I use PixTrail in my own Python scripts?

Yes, PixTrail provides a Python API that you can import and use in your own scripts:

```python
from pixtrail.core import PixTrail

pt = PixTrail()
pt.process_and_generate("/path/to/photos", "/path/to/output.gpx")
```

See the [API Reference](api/index.md) for more details.

### How accurate is the GPS data extraction?

The accuracy depends on:
- The quality of the GPS data in your original photos
- The camera or smartphone that took the photos
- Environmental conditions when the photos were taken (e.g., clear sky vs. urban canyon)

PixTrail extracts the data exactly as recorded in your photos' metadata.

### How are timestamps handled across time zones?

PixTrail uses the original timestamps from the EXIF data, including time zone information if available. If no time zone is specified in the EXIF data, the local time zone of the computer running PixTrail is used.

### Does PixTrail interpolate missing data points?

No, PixTrail only uses the actual GPS data found in your photos. It doesn't estimate or interpolate coordinates for photos without GPS data or for gaps between photos.

## Troubleshooting

### PixTrail is not finding any GPS data in my photos

Check:
- That your photos actually contain GPS data
- That you have permission to read the photos
- That you're pointing to the correct directory
- If using RAW files, that the required libraries are installed

### The generated GPX file is empty or incomplete

This could be because:
- Not enough photos had GPS data
- There were errors processing some photos
- The output directory is not writable

Try running with the verbose flag (`-v`) to see more detailed information.

### The web interface is not starting

Check:
- That you have installed PixTrail with web interface support: `pip install pixtrail[web]`
- That the port is not already in use by another application
- That you have permission to start a server on your machine

### I get a "Permission denied" error

This can happen if:
- You don't have permission to read the input photos
- You don't have permission to write to the output directory
- You are trying to overwrite an existing GPX file that is read-only

Try running with elevated permissions or changing the output path.

## Feature Requests and Contributions

### How can I request a new feature?

You can suggest new features by:
- Opening an issue on the [PixTrail GitHub repository](https://github.com/sukitsubaki/pixtrail/issues)
- Contributing to the project by implementing the feature yourself

### How can I contribute to PixTrail?

See the [Contributing Guidelines](contributing.md) for information on how to contribute to the project, including:
- Submitting bug reports
- Suggesting enhancements
- Writing documentation
- Contributing code

### Is there a roadmap for future development?

Current planned features include:
- Video file support
- More advanced filtering options
- Enhanced visualization tools
- Mobile app support
- Integration with online mapping services

Check the README file in the GitHub repository for the latest roadmap.

## Advanced Usage

### Can I process photos without GPS data?

Not directly with PixTrail. You would first need to geotag your photos using specialized software, and then process them with PixTrail.

### Can I combine multiple GPX files?

PixTrail doesn't have a built-in feature to merge GPX files, but you can:
1. Use the web interface to visualize multiple GPX files by uploading them sequentially
2. Use third-party GPX editing tools to merge files
3. Write a custom script using the PixTrail Python API to combine data from multiple sources

### Can I schedule automatic processing?

Yes, you can set up scheduled tasks or cron jobs to run PixTrail commands automatically. For example:
- Process photos every time you connect your camera
- Monitor a directory for new photos and process them automatically
- Create nightly batches of processed GPX files
