# Documenting a Photo Journey

**Skill Level: Beginner**

This tutorial will guide you through the process of using PixTrail to document and visualize a journey using your geotagged photos.

## Introduction

When we travel or go on adventures, we often take photos along the way. These photos can contain valuable GPS data that allows us to reconstruct our journey. This tutorial will show you how to use PixTrail to extract this GPS data and create a visual record of your journey.

By the end of this tutorial, you will have:
- Processed your geotagged photos to extract GPS data
- Generated a GPX file containing your route
- Visualized your journey on an interactive map
- Analyzed your route with statistics and charts

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

1. **Organize your photos** in a directory structure
   - For a single journey, place all photos in one directory
   - For multi-day trips, you might want to create subdirectories for each day

2. **Check if your photos have GPS data**
   - Most modern smartphones automatically embed GPS coordinates in photos
   - For digital cameras, you may need to enable GPS tagging in the settings
   - You can use common photo viewers to check if location data is present

## Step 2: Start the PixTrail Web Interface

1. Open a terminal or command prompt
2. Run the following command to start the PixTrail web interface:
   ```bash
   pixtrail -w
   ```
3. PixTrail will start a local web server and automatically open your default browser to the interface
4. If the browser doesn't open automatically, navigate to `http://127.0.0.1:5000` manually

## Step 3: Process Your Photos

1. In the PixTrail web interface, click on the "Directory" tab
2. Click the "Select Directory" button and navigate to the folder containing your photos
3. If your photos are organized in subdirectories, check the "Process subdirectories recursively" option
4. Click the "Process Photos" button
5. Wait while PixTrail extracts GPS data from your photos
   - For JPEG files, processing happens directly in your browser
   - For RAW files, they will be temporarily uploaded to the local server for processing

## Step 4: Explore Your Journey on the Map

Once processing is complete, PixTrail will display a map showing your journey:

1. **View the route** marked by a blue line connecting all photo locations
2. **Examine photo markers** by clicking on them to see details:
   - Photo name
   - Coordinates
   - Timestamp
3. **Navigate the map** using standard controls:
   - Zoom in/out with the mouse wheel or +/- buttons
   - Pan by clicking and dragging
   - Double-click to zoom in on a specific location

## Step 5: Use Advanced Visualization Features

PixTrail offers several advanced visualization options to help you understand your journey better:

1. **Enable the Heat Map** by clicking the "Show Heatmap" button
   - Red/yellow areas show where you spent the most time or took the most photos
   - Blue areas indicate brief stops or fewer photos
   - This helps identify the focal points of your journey

2. **Enable Clustering** by clicking the "Enable Clustering" button
   - This is especially useful for journeys with many photos
   - Adjust the cluster radius using the slider
   - Click on clusters to zoom in and see individual photos

3. **View Statistics** by clicking the "Show Statistics" button
   - Check the total distance traveled
   - See the duration of your journey
   - Review elevation data and speed information
   - Examine the interactive charts for elevation profile and speed variations

## Step 6: Export and Share Your Journey

1. **Download the GPX file** by clicking the "Download GPX" button
2. The GPX file can be imported into various applications:
   - Google Earth
   - OpenStreetMap
   - Strava or other fitness apps
   - GPS devices like Garmin
   - Other mapping applications

3. Share your journey with others:
   - Send them the GPX file
   - Import the GPX file into a shared mapping platform
   - Create screenshots of the map view

## Alternative: Command Line Processing

If you prefer using the command line instead of the web interface:

1. Open a terminal or command prompt
2. Navigate to a directory where you want to save the GPX file
3. Run the following command:
   ```bash
   pixtrail -i /path/to/your/photos -r
   ```
   - Replace `/path/to/your/photos` with the actual path to your photo directory
   - The `-r` flag enables recursive processing of subdirectories
4. PixTrail will process your photos and generate a GPX file in the same directory
5. You can then open this GPX file in any compatible mapping application

## Tips and Tricks

- **For city trips**: Use a smaller cluster radius (40-60px) to distinguish between nearby locations
- **For road trips**: Use a larger cluster radius (80-120px) to reduce clutter on the map
- **For hiking**: Pay attention to the elevation chart to analyze climbs and descents
- **For multi-day journeys**: Process each day separately for clearer visualization
- **For sharing**: Consider taking a screenshot of the map with the heat map enabled to show the highlights of your journey

## Troubleshooting

### No GPS Data Found

If PixTrail reports "No GPS data found in photos":

1. Check if your photos have GPS data using other photo viewing software
2. Ensure you have permission to read the photos
3. Try processing a single photo that you know has GPS data

### Map Shows Incorrect Locations

If the map shows points in unexpected locations:

1. Check the GPS accuracy of your camera or smartphone
2. Look for patterns in the errors (all points shifted in one direction)
3. Verify the timestamps to ensure photos are in the correct sequence

### Performance Issues with Many Photos

If processing many photos (hundreds or thousands):

1. Process smaller batches of photos
2. Use the clustering feature with a larger radius
3. Consider filtering photos before processing (e.g., one photo every few minutes)

## Next Steps

Now that you've successfully documented a photo journey, you might want to explore:

- [Batch Processing Large Photo Collections](batch-processing.md) for handling multiple trips
- [Customizing Visualizations](custom-visualizations.md) for more advanced map options
- [Python API](../api/index.md) for programmatically processing your photos

## Example: A Day in Rome

Here's a concrete example of using PixTrail to document a day trip in Rome:

1. **Prepare Photos**:
   - Collect 87 photos taken on a smartphone during a day in Rome
   - Create a directory called "Rome_Day_Trip" and place all photos in it

2. **Process Photos**:
   - Start the PixTrail web interface: `pixtrail -w`
   - Select the "Rome_Day_Trip" directory
   - Click "Process Photos"

3. **Explore the Map**:
   - The map shows a walking route through central Rome
   - Clusters of photos appear at major attractions: Colosseum, Roman Forum, Trevi Fountain
   - The heat map highlights where the most time was spent

4. **Check Statistics**:
   - Total distance: 8.4 km
   - Duration: 7 hours 15 minutes
   - Elevation gain: 124 meters

5. **Share the Journey**:
   - Download the GPX file
   - Import into Google Maps to share with family

This example shows how PixTrail transforms a collection of vacation photos into a comprehensive record of the journey, complete with route information, highlights, and statistics.
