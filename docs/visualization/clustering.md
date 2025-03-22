# Marker Clustering

Marker clustering in PixTrail helps manage routes with many photos by grouping nearby markers into clusters. This keeps the map clean and navigable, even with hundreds of photo locations.

## What is Marker Clustering?

Marker clustering is a technique that combines multiple map markers that are close together into a single cluster marker. This:

- Reduces visual clutter on the map
- Improves map performance with large datasets
- Makes it easier to identify general areas of activity
- Allows for dynamic expansion when zooming in

## How PixTrail Implements Clustering

PixTrail uses the Leaflet.markercluster plugin to provide a sophisticated clustering system:

- Nearby markers are combined into a single cluster marker
- Clusters display the number of markers they contain
- Clusters dynamically split and recombine as you zoom in and out
- Clicking a cluster zooms the map to show its contents
- At maximum zoom, all individual markers are visible

## Using the Clustering Feature

### Enabling Clustering

1. After processing your photos and viewing the map, click the "Enable Clustering" button in the map controls
2. The markers will reorganize into clusters where appropriate
3. Click the button again (now labeled "Disable Clustering") to toggle it off

### Adjusting Cluster Radius

When clustering is enabled, a radius slider appears in the map controls:

1. Move the slider left (smaller radius) to create more clusters with fewer markers each
2. Move the slider right (larger radius) to create fewer clusters with more markers each
3. The radius value (in pixels) is displayed next to the slider
4. Changes take effect immediately as you move the slider

### Interacting with Clusters

- **Clicking a cluster**: Zooms the map to show the markers in that cluster
- **Hovering over a cluster**: Shows the bounds of the contained markers
- **Zooming in**: Breaks large clusters into smaller clusters or individual markers
- **Zooming out**: Combines markers and small clusters into larger clusters

## When to Use Clustering

Marker clustering is particularly useful in the following scenarios:

### Dense Urban Areas

When photos are taken in a city or densely populated area, markers can become extremely cluttered. Clustering helps by:

- Grouping markers for each neighborhood or attraction
- Allowing you to explore areas of interest by clicking on clusters
- Maintaining performance even with hundreds of photos

### Large Photo Collections

For journeys with many photos (50+), clustering helps maintain usability:

- Prevents the map from becoming overwhelmed with markers
- Makes it easier to identify general areas of activity
- Improves the performance of the map interface

### Multiple Day Trips

For multi-day journeys covering large areas, clustering helps organize the data:

- Each day's activities might form natural clusters
- Different locations visited during the trip are clearly separated
- The overall journey structure becomes more apparent

## Technical Details

The marker clustering in PixTrail has the following default settings:

- **Default cluster radius**: 80 pixels
- **Adjustable range**: 20-200 pixels
- **Spider mode**: On (spreads markers when clicked at maximum zoom)
- **Show coverage on hover**: On (shows the bounds of contained markers)
- **Zoom to bounds on click**: On (zooms to show all markers in a cluster)
- **Chunked loading**: On (for better performance with large datasets)

## Combining Clustering with Other Features

Marker clustering works well with other PixTrail features:

- **With heat maps**: See both clusters and heat intensity
- **With statistics**: Maintain statistics accuracy while simplifying the map view

## Tips for Using Clustering

- **For large datasets**: Use a larger cluster radius to simplify the map
- **For detailed exploration**: Use a smaller cluster radius to see more detail
- **For city tours**: A medium radius (60-80px) usually works well
- **For road trips**: A larger radius (100-120px) often works better

## Limitations

- Very small clusters (2-3 markers) may not significantly improve map readability
- At maximum zoom, clustering may not activate even if enabled
- The visual weight of clusters may not perfectly represent the number of contained markers
- Clusters are based on screen distance (pixels), not geographic distance
