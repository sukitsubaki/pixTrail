# Documenting a Photo Journey

**Skill Level: Beginner**

This tutorial will guide you through the process of using PixTrail to document and visualize a journey using your geotagged photos. You'll learn how to transform your travel photos into an interactive map that tells the story of your adventure.

## Introduction

When we travel or go on adventures, we often take photos along the way. These photos can contain valuable GPS data that allows us to reconstruct our journey. This tutorial will show you how to use PixTrail to extract this GPS data and create a visual record of your journey.

By the end of this tutorial, you will have:
- Processed your geotagged photos to extract GPS data
- Generated a GPX file containing your route
- Visualized your journey on an interactive map
- Analyzed your route with statistics and charts
- Created a shareable record of your adventure

## Prerequisites

Before starting, make sure you have:

1. **PixTrail installed** with web interface support:
   ```bash
   pip install pixtrail[web]
   ```

2. **A collection of geotagged photos** from a journey or trip
   - Most smartphone photos are automatically geotagged
   - If using a digital camera, ensure GPS tagging was enabled

3. **Photos organized in a directory** on your computer

## Step 1: Prepare Your Photos

### Check for GPS Data

First, ensure your photos contain GPS data:

1. Most modern smartphones automatically embed GPS coordinates in photos
2. For digital cameras, you may need to enable GPS tagging in the settings
3. You can check if location data is present using:
   - The Properties or Info panel in your operating system's file browser
   - Photo management software like Adobe Lightroom, Apple Photos, or Google Photos
   - Online EXIF viewers that can show GPS coordinates

### Organize Your Photos

For best results, organize your photos in a logical structure:

1. **Create a dedicated directory** for the journey you want to document
2. **Include only relevant photos** from the specific journey
3. **Maintain chronological order** if possible (based on file timestamps)
4. **For multi-day trips**, you might want to create subdirectories for each day

Example directory structure:
```
Italy_Vacation/
├── Day1_Rome/
│   ├── IMG_0001.jpg
│   ├── IMG_0002.jpg
│   └── ...
├── Day2_Florence/
│   ├── IMG_0045.jpg
│   ├── IMG_0046.jpg
│   └── ...
└── Day3_Venice/
    ├── IMG_0098.jpg
    ├── IMG_0099.jpg
    └── ...
```

## Step 2: Start the PixTrail Web Interface

1. Open a terminal or command prompt
2. Run the following command to start the PixTrail web interface:
   ```bash
   pixtrail -w
   ```
3. PixTrail will start a local web server and automatically open your default browser to the interface
4. If the browser doesn't open automatically, navigate to `http://127.0.0.1:5000` manually

## Step 3: Process Your Photos

### Using the Directory Tab

1. In the PixTrail web interface, click on the "Directory" tab
2. Click the "Select Directory" button and navigate to the folder containing your photos
3. If your photos are organized in subdirectories, check the "Process subdirectories recursively" option
4. If using recursive processing, you can set the maximum depth level
5. Click the "Process Photos" button
6. Wait while PixTrail extracts GPS data from your photos
   - For JPEG files, processing happens directly in your browser
   - For RAW files, they will be temporarily uploaded to the local server for processing

### Using the Files Tab

Alternatively, you can upload individual photo files:

1. Click on the "Files" tab
2. Click the "Choose Files" button and select your photos, or drag and drop them onto the designated area
3. Click the "Process Photos" button
4. Wait for processing to complete

### Processing Status

During processing, you'll see:
1. A progress bar showing the current status
2. Status messages indicating what's happening
3. Upon completion, the map will automatically display your route

## Step 4: Explore Your Journey on the Map

Once processing is complete, PixTrail will display a map showing your journey:

### Basic Map Navigation

1. **View the route** marked by a blue line connecting all photo locations
2. **Examine photo markers** by clicking on them to see details:
   - Photo name
   - Coordinates
   - Timestamp
   - Altitude (if available)
3. **Navigate the map** using standard controls:
   - Zoom in/out with the mouse wheel or +/- buttons
   - Pan by clicking and dragging
   - Double-click to zoom in on a specific location

### Understanding the Route Line

The blue line connecting your photo markers represents your journey:
- The line follows the chronological order of your photos based on their timestamps
- Straighter lines indicate direct travel between points
- The line assumes direct paths between consecutive photo locations

## Step 5: Use Advanced Visualization Features

PixTrail offers several advanced visualization options to help you understand your journey better:

### Enable the Heat Map

The heat map shows where you spent the most time or took the most photos:

1. Click the "Show Heatmap" button
2. Observe the color overlay that appears on the map:
   - Red/yellow areas show where you spent the most time or took the most photos
   - Blue areas indicate brief stops or fewer photos
3. Use this visualization to identify the focal points of your journey
4. Click "Hide Heatmap" to turn off this feature when done

### Enable Clustering

For journeys with many photos, clustering helps keep the map organized:

1. Click the "Enable Clustering" button
2. Notice how nearby markers are grouped into clusters with numbers indicating how many photos they contain
3. Adjust the cluster radius using the slider that appears
   - Smaller radius (left) creates more smaller clusters
   - Larger radius (right) creates fewer larger clusters
4. Click on clusters to zoom in and see individual photos
5. Click "Disable Clustering" to turn off this feature when done

### View Journey Statistics

To analyze the quantitative aspects of your journey:

1. Click the "Show Statistics" button
2. Review the statistics panel that appears below the map:
   - Check the total distance traveled
   - See the duration of your journey
   - Review elevation data and speed information
3. Examine the interactive charts for:
   - Elevation profile showing altitude changes during your journey
   - Speed variations throughout your trip
4. Hover over the charts to see exact values at specific points
5. Click "Hide Statistics" to collapse this panel when done

## Step 6: Export and Share Your Journey

### Download the GPX File

To save and share your journey data:

1. Click the "Download GPX" button
2. Choose where to save the GPX file on your computer
3. The GPX file will contain:
   - Waypoints for each photo location
   - A track connecting all points in chronological order
   - Timestamps and elevation data (when available)

### Using Your GPX File

The GPX file can be imported into various applications:

- **Google Earth**: Import for 3D visualization
- **OpenStreetMap**: View on web-based maps
- **GPS Devices**: Load onto Garmin, TomTom, and other GPS units
- **Fitness Apps**: Import into Strava, Komoot, and similar platforms
- **GIS Software**: Use in professional geographic information systems

### Sharing Options

Share your journey with others:

1. **Share the GPX file** directly
2. **Create screenshots** of the map view with interesting visualizations
3. **Combine with photos** in a presentation or blog post
4. **Import into travel sharing platforms** that support GPX files

## Alternative: Command Line Processing

If you prefer using the command line instead of the web interface:

1. Open a terminal or command prompt
2. Navigate to a directory where you want to save the GPX file
3. Run the following command:
   ```bash
   pixtrail -i /path/to/your/photos -o /path/to/output.gpx
   ```
   - Replace `/path/to/your/photos` with the actual path to your photo directory
   - Replace `/path/to/output.gpx` with your desired output file path
4. For recursive processing of subdirectories, add the `-r` flag:
   ```bash
   pixtrail -i /path/to/your/photos -o /path/to/output.gpx -r
   ```
5. For more detailed output, add the `-v` (verbose) flag:
   ```bash
   pixtrail -i /path/to/your/photos -o /path/to/output.gpx -v
   ```

## Tips and Tricks

### For More Accurate Routes

- **Take photos regularly** along your journey, not just at major stops
- **Ensure your camera's time is correctly set** for accurate timestamps
- **Let your camera/phone establish a GPS fix** before taking photos
- **Take more photos at complex parts** of your route (e.g., winding trails)

### For Better Visualization

- **For city trips**: Use a smaller cluster radius (40-60px) to distinguish between nearby locations
- **For road trips**: Use a larger cluster radius (80-120px) to reduce clutter on the map
- **For hiking**: Pay attention to the elevation chart to analyze climbs and descents
- **For multi-day journeys**: Process each day separately for clearer visualization

### For Performance

- **Optimize large collections**: If processing hundreds of photos, consider selecting a representative subset
- **Use clustering**: Enable clustering when displaying many photos for better performance
- **Process in batches**: For very large collections, process smaller batches separately

## Troubleshooting

### No GPS Data Found

If PixTrail reports "No GPS data found in photos":

1. Verify that your photos actually contain GPS data using other software
2. Ensure you have permission to read the photos (file access rights)
3. Check that you're processing supported file formats
4. Try processing a single photo that you know has GPS data
5. Use the verbose flag (`-v`) with the command line to see detailed information

### Map Shows Incorrect Locations

If the map shows points in unexpected locations:

1. Check the GPS accuracy of your camera or smartphone
2. Look for patterns in the errors (all points shifted in one direction)
3. Verify the timestamps to ensure photos are in the correct sequence
4. Consider the possibility of GPS interference during photo capture (buildings, canyons, etc.)

### Performance Issues with Many Photos

If processing many photos (hundreds or thousands):

1. Process smaller batches of photos
2. Use the clustering feature with a larger radius
3. Consider filtering photos before processing (e.g., one photo every few minutes)
4. Close other browser tabs and applications to free up memory

## Next Steps

Now that you've successfully documented a photo journey, you might want to explore:

- [Batch Processing Large Photo Collections](batch-processing.md) for handling multiple trips
- [Customizing Visualizations](custom-visualizations.md) for more advanced map options
- [Advanced Statistics](custom-visualizations.md#advanced-statistics) for deeper journey analysis
- [Command Line Interface](../cli.md) for automation and scripting

## Example: A Day in Rome

Here's a concrete example of using PixTrail to document a day trip in Rome:

### 1. Prepare Photos

- Collect 87 photos taken on a smartphone during a day in Rome
- Create a directory called "Rome_Day_Trip" and place all photos in it

### 2. Process Photos

- Start PixTrail web interface: `pixtrail -w`
- Select the "Rome_Day_Trip" directory
- Click "Process Photos"

### 3. Explore the Map

- The map shows a walking route through central Rome
- Photo markers appear at locations like the Colosseum, Roman Forum, Trevi Fountain
- The route line shows the walking path between attractions

### 4. Enable Visualizations

- Enable the heat map to see that most time was spent at major attractions
- Enable clustering with a radius of 50px to group photos taken at each landmark
- View statistics to see a total walking distance of 8.4 km over 7 hours 15 minutes

### 5. Analyze the Journey

- The elevation chart shows several hills (Rome's famous seven hills!)
- The speed chart reveals regular patterns of walking and stopping
- Clusters reveal that the most photos were taken at the Colosseum and Vatican

### 6. Export and Share

- Download the GPX file
- Import into Google Maps to share with family
- Take screenshots of the heat map to show where most time was spent

This example demonstrates how PixTrail transforms a collection of vacation photos into a comprehensive record of the journey, complete with route information, highlights, and statistics.

By following this tutorial, you've learned how to document your own journeys with PixTrail, creating meaningful visualizations and data that enhance your travel memories.
