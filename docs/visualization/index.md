# Visualization Features

PixTrail offers several visualization features to help you understand and analyze your journeys. These features are available in the web interface and provide different ways to view and interact with your photo location data.

## Overview

The visualization features in PixTrail include:

1. **Basic Route Mapping**: View your photo locations as markers on an interactive map
2. **Heat Maps**: Visualize where you spent the most time during your journey
3. **Marker Clustering**: Group nearby photos for cleaner map displays
4. **Route Statistics**: View detailed metrics about your journey
5. **Interactive Charts**: Visualize elevation profiles and speed variations

## Basic Route Mapping

After processing your photos, PixTrail will display a map showing:

- Markers for each photo location
- A line connecting the markers in chronological order (when timestamps are available)
- Pop-up information when clicking on markers, including:
  - Photo name
  - Coordinates
  - Timestamp (when available)

The map is based on OpenStreetMap and provides standard map controls:
- Zoom in/out
- Pan by dragging
- Reset view to show the entire route

## Advanced Visualization Features

### Heat Maps

The [heat map feature](heatmap.md) visualizes where you spent the most time during your journey by creating a color-coded overlay on the map. Areas with higher intensity indicate more photos or longer time spent at that location.

### Marker Clustering

The [marker clustering feature](clustering.md) helps manage routes with many photos by grouping nearby markers into clusters. This keeps the map clean and navigable, even with hundreds of photo locations.

### Route Statistics and Charts

The [statistics feature](statistics.md) provides detailed metrics about your journey, including distance traveled, duration, speed, elevation data, and interactive charts visualizing the elevation profile and speed variations.

## Using Visualization Features Together

You can combine multiple visualization features to gain deeper insights:

- Enable both heat map and clustering to see where you spent the most time while keeping the map clean
- View statistics alongside the map to understand the quantitative aspects of your journey
- Compare the elevation chart with the map view to understand terrain changes during your trip

## Example Use Cases

### City Tour Analysis
- Use marker clustering to manage the many close-together photos
- Enable the heat map to see which attractions you spent the most time at
- Check the statistics to see how far you walked and how long the tour took

### Hiking Trip Review
- View the elevation chart to analyze the climbs and descents
- Look at the speed chart to identify difficult sections (slower speed)
- Use the heat map to identify rest stops and viewpoints

### Road Trip Documentation
- See the entire route across a large area
- Use statistics to track daily distances and travel times
- Cluster markers to manage the many stops along the way

## Map Controls

The map interface includes several controls:

- **Show Heatmap**: Toggle the heat map overlay
- **Enable Clustering**: Toggle marker clustering
- **Show Statistics**: Show/hide the statistics panel
- **Download GPX**: Download the generated GPX file
- **Clear Data**: Remove all loaded data and reset the interface

## Next Steps

For more detailed information about specific visualization features, see:

- [Heat Maps](heatmap.md)
- [Marker Clustering](clustering.md)
- [Statistics and Charts](statistics.md)
