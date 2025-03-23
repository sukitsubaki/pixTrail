# Marker Clustering

Marker clustering in PixTrail helps manage routes with many photos by grouping nearby markers into clusters. This keeps the map clean and navigable, even with hundreds of photo locations, while still allowing you to explore your journey in detail.

## What is Marker Clustering?

Marker clustering is a technique that combines multiple map markers that are close together into a single cluster marker. This:

- Reduces visual clutter on the map
- Improves map performance with large datasets
- Makes it easier to identify general areas of activity
- Allows for dynamic exploration when zooming in

## How PixTrail Implements Clustering

PixTrail uses the Leaflet.markercluster plugin to provide a sophisticated clustering system:

- Nearby markers are combined into a single cluster marker
- Clusters display the number of markers they contain
- Clusters are color-coded based on the number of contained markers
- Clusters dynamically split and recombine as you zoom in and out
- Clicking a cluster zooms the map to show its contents
- At maximum zoom, all individual markers are visible

## Using the Clustering Feature

### Enabling Clustering

1. After processing your photos and viewing the map, click the "Enable Clustering" button in the map controls
2. The markers will immediately reorganize into clusters where appropriate
3. Click the button again (now labeled "Disable Clustering") to toggle it off

### Adjusting Cluster Radius

When clustering is enabled, a radius slider appears in the map controls:

1. Move the slider left (smaller radius) to create more clusters with fewer markers each
2. Move the slider right (larger radius) to create fewer clusters with more markers each
3. The radius value (in pixels) is displayed next to the slider
4. Changes take effect immediately as you move the slider

The cluster radius represents the maximum distance (in screen pixels) between markers that will be grouped into a single cluster. This is different from geographic distance—it's based on the current zoom level and screen position.

### Interacting with Clusters

- **Clicking a cluster**: Zooms the map to show the markers in that cluster
- **Hovering over a cluster**: Shows the bounds of the contained markers
- **Zooming in**: Breaks large clusters into smaller clusters or individual markers
- **Zooming out**: Combines markers and small clusters into larger clusters

### Understanding Cluster Colors

Clusters are automatically color-coded based on the number of markers they contain:

- **Small clusters** (few markers): Blue/green
- **Medium clusters**: Yellow/orange
- **Large clusters** (many markers): Red/purple

This color coding helps you quickly identify areas with high concentration of photos.

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
- Provides a cleaner visual presentation

### Multiple Day Trips

For multi-day journeys covering large areas, clustering helps organize the data:

- Each day's activities might form natural clusters
- Different locations visited during the trip are clearly separated
- The overall journey structure becomes more apparent

## Advanced Usage

### Finding the Optimal Radius

The optimal cluster radius depends on several factors:

- **Type of journey**: Urban explorations typically benefit from smaller radii (40-60px), while road trips work better with larger radii (80-120px)
- **Number of photos**: More photos generally require a larger radius
- **Geographic spread**: Widely dispersed photos need a larger radius than concentrated ones
- **Desired level of detail**: Smaller radius shows more detail but can be cluttered

Experiment with the radius slider to find the best setting for your specific dataset.

### Multi-level Exploration

Clustering enables a multi-level exploration approach:

1. **Overview level**: Start with a zoomed-out view with clustering enabled to see the overall journey structure
2. **Area level**: Click on clusters to zoom in and see sub-areas
3. **Detail level**: Continue zooming until you see individual markers
4. **Photo level**: Click on individual markers to see photo details

This hierarchical approach is especially useful for complex journeys with many stops.

### Combining with Other Visualizations

Clustering works well in combination with other PixTrail features:

- **With heat maps**: See both clusters and heat intensity for a more complete picture
- **With statistics**: Understand the quantitative aspects while keeping the map clean
- **With time filtering**: Focus on specific parts of your journey while maintaining order

## Technical Details

The marker clustering in PixTrail has the following default settings:

- **Default cluster radius**: 80 pixels
- **Adjustable range**: 20-200 pixels
- **Spider mode**: On (spreads markers when clicked at maximum zoom)
- **Show coverage on hover**: On (shows the bounds of contained markers)
- **Zoom to bounds on click**: On (zooms to show all markers in a cluster)
- **Chunked loading**: On (for better performance with large datasets)

These settings provide a balance between visual clarity and detailed exploration, while maintaining good performance even with large datasets.

## Performance Considerations

Clustering significantly improves map performance with large datasets:

- **Without clustering**: Each marker is individually rendered and managed by the browser
- **With clustering**: Fewer objects need to be rendered, especially at lower zoom levels

This difference becomes more pronounced with larger datasets:

| Number of Photos | Without Clustering | With Clustering |
|------------------|--------------------|--------------------|
| 50 photos        | Good performance   | Excellent performance |
| 100-200 photos   | Moderate performance | Good performance |
| 300+ photos      | Poor performance   | Good performance |
| 1000+ photos     | Very poor/unusable | Moderate performance |

For very large collections (1000+ photos), consider processing your journey in segments.

## Tips for Using Clustering Effectively

### For City Tours

- Use a smaller radius (40-60px) to distinguish between nearby attractions
- Zoom in to specific neighborhoods to explore in detail
- Look for natural clusters that form around major points of interest

### For Road Trips

- Use a larger radius (80-120px) to create clearer stops
- Each cluster typically represents a destination or stop
- The space between clusters helps visualize the journey structure

### For Hiking Trips

- Use a medium radius (60-80px)
- Clusters often represent viewpoints or rest areas
- Combine with the elevation chart to understand the relationship between clusters and terrain

### For Event Documentation

- Use a smaller radius for detail
- Clusters typically form around key moments or locations
- The density of clusters indicates the focus of the event

## Limitations

- Very small clusters (2-3 markers) may not significantly improve map readability
- At maximum zoom, clustering may not activate even if enabled
- The visual weight of clusters may not perfectly represent the number of contained markers
- Clusters are based on screen distance (pixels), not geographic distance

## Frequently Asked Questions

### Why do markers seem to jump around when I enable clustering?

This is normal and happens because:
- The clustering algorithm groups nearby markers based on screen position
- The center of a cluster is calculated as the average position of all contained markers
- As you zoom in or out, the relative screen positions change, causing clusters to split or combine

### Can I customize cluster colors or appearance?

Currently, the cluster colors are preset based on the number of contained markers. Future versions may include more customization options.

### Will clustering affect my GPX file export?

No, clustering is purely a visualization feature. When you export a GPX file, all individual photo locations are included in their original form.

### What happens with photos that have inaccurate GPS data?

Clustering can actually help mitigate GPS inaccuracy by grouping markers that are likely part of the same location, even if their exact coordinates vary slightly.

### Is there a limit to how many photos can be clustered?

While there's no hard limit, performance may degrade with extremely large datasets (thousands of photos). For best results with very large collections, consider batch processing or filtering your dataset.

## Related Features

- [Heat Maps](heatmap.md) - Visualize where you spent the most time during your journey
- [Statistics and Charts](statistics.md) - Quantify your journey with detailed metrics
- [Custom Visualizations](../tutorials/custom-visualizations.md) - Advanced visualization techniques

By combining clustering with other visualization features, you can create a clearer and more insightful representation of your journeys.
