# Heat Map Visualization

The heat map feature in PixTrail creates a powerful visual representation of your journey, showing where you spent the most time and took the most photos. This color-coded overlay helps identify the focal points and patterns in your travels.

## What is a Heat Map?

A heat map is a graphical representation of data where values are depicted by colors. In PixTrail, the heat map shows the intensity of photo activity at different locations:

- **Red/Yellow areas**: Locations with high activity (many photos or long duration)
- **Green areas**: Locations with moderate activity
- **Blue areas**: Locations with low activity (few photos or brief stops)

This visualization helps identify the focal points of your journey - the places where you spent the most time or took the most photos.

## How PixTrail Creates Heat Maps

PixTrail uses two primary factors to determine the intensity at each location:

1. **Photo density**: The number of photos taken at or near a location
2. **Time spent**: The duration between the first and last photo at a location (when timestamps are available)

These factors are combined to create a weighted heat map that reflects both the number of photos and the time spent at each location.

### Heat Map Algorithm

The heat map is generated using the following approach:

1. Each photo location becomes a data point with an initial intensity value
2. Photos taken close together (within approximately 25 meters) contribute to the same "hot spot"
3. When timestamps are available, locations where you spent more time receive higher intensity
4. The intensity values are normalized across the entire dataset
5. A gradient color scale is applied, ranging from blue (low) through green and yellow to red (high)

## Using the Heat Map Feature

### Enabling the Heat Map

1. After processing your photos and viewing the map, click the "Show Heatmap" button in the map controls
2. The heat map overlay will appear on the map
3. Click the button again (now labeled "Hide Heatmap") to toggle it off

### Reading the Heat Map

The heat map uses a color gradient to show intensity:

- **Red**: Highest intensity (most photos/time spent)
- **Yellow**: High intensity
- **Green**: Medium intensity
- **Blue**: Low intensity (few photos/brief visits)

Look for red and yellow "hotspots" to identify the places where you spent the most time or took the most photos.

### Combining with Other Features

The heat map can be used alongside other visualization features:

- **With marker clustering**: See both photo clusters and areas of high activity
- **With statistics**: Compare hotspots with elevation and speed changes
- **With the basic map**: Relate hotspots to actual map features (landmarks, roads, etc.)

## Practical Applications

### City Tour Analysis

In a city tour heat map, you might see:

- **Red hotspots**: Major attractions where you spent significant time
- **Yellow/green areas**: Secondary attractions or brief stops
- **Blue traces**: Transit routes between attractions

This visualization helps you:
- Identify which attractions captured your attention the longest
- Discover patterns in your urban exploration
- Remember key locations when revisiting the area
- Plan future trips by identifying popular spots worth more time

### Hiking Trip Analysis

In a hiking trip heat map, you might see:

- **Red/yellow spots**: Viewpoints, rest areas, or particularly scenic sections
- **Green areas**: Regular trail sections where you took occasional photos
- **Blue areas**: Transit sections with few photos

This visualization helps you:
- Identify the most scenic or interesting parts of a trail
- Locate rest spots and viewpoints
- Plan future hikes by focusing on high-interest areas
- Share recommendations with others

### Road Trip Documentation

In a road trip heat map, you might see:

- **Red/yellow clusters**: Major stops and destinations
- **Green spots**: Brief roadside attractions or photo opportunities
- **Blue lines**: Routes where you drove without stopping much

This visualization helps you:
- Distinguish between transit and exploration phases
- Identify major destinations versus quick stops
- Recall the relative importance of different locations
- Plan future trips with better time allocation

## Technical Details

The heat map is created using the Leaflet.heat plugin with the following parameters:

- **Radius**: 25 pixels (determines the smoothness of the heat map)
- **Blur**: 15 pixels (determines how fuzzy the heat map appears)
- **Max Zoom**: 17 (determines at what zoom level the heat map stops scaling)
- **Gradient**: A custom color gradient from blue (low) through green and yellow to red (high)

Each point's intensity is calculated using:

- Base intensity value for each photo
- Proximity multiplier for nearby photos
- Time factor when timestamps are available

## Advanced Usage Tips

### Interpreting Different Patterns

Different heat map patterns can reveal insights about your journey:

- **Distinct hotspots**: Indicate specific points of interest where you spent time
- **Linear hotspots**: Suggest interesting paths or routes you explored thoroughly
- **Diffuse patterns**: Indicate general exploration without specific focus points
- **Isolated points**: Show brief stops or single photo opportunities

### Combining with Map Features

For deeper insights, relate heat patterns to actual map features:

- Compare hotspots with landmarks on the map
- Look for patterns related to terrain features (for hiking)
- Notice correlations with urban features (for city tours)
- Identify patterns related to transportation hubs

### Time-Based Patterns

If your photos have accurate timestamps, look for time-based patterns:

- Morning vs. afternoon exploration patterns
- Changes in exploration intensity throughout a multi-day journey
- Time spent at different types of locations (museums vs. outdoor attractions)

## Best Practices

To get the most out of heat map visualization:

1. **Include enough photos**: Heat maps work best with at least 20-30 photos
2. **Ensure photo timestamps are accurate**: This improves time-based intensity calculation
3. **Take photos at consistent intervals**: For more accurate representation of your journey
4. **Combine with other visualizations**: Use clustering and statistics for a complete picture
5. **Zoom to explore**: Different zoom levels reveal different patterns

## Limitations

While heat maps are powerful, they have some limitations to be aware of:

- **GPS accuracy**: Heat map accuracy depends on the GPS accuracy in your photos
- **Timestamp reliability**: Time-based intensity requires accurate photo timestamps
- **Sampling bias**: You might take more photos at interesting places regardless of time spent
- **Interpretation subjectivity**: Patterns may be subject to different interpretations
- **Map scale influence**: Different zoom levels can suggest different patterns

## Frequently Asked Questions

### Why don't I see any clear hotspots in my heat map?

This could be due to:
- Too few photos in your dataset
- Photos spread out over a large area
- Similar time spent at all locations
- GPS inaccuracy in your photos

Try processing a journey with more photos or photos taken in a more concentrated area.

### Why are some areas showing high intensity when I only took one photo there?

If you have timestamps in your photos, an area might show high intensity if:
- You spent a long time there between photos
- There are several photos taken very close together
- GPS inaccuracy grouped photos that were actually spread out

### Can I adjust the heat map sensitivity?

Currently, the heat map parameters are preset for optimal visualization in most cases. Future versions may include customizable settings for radius, blur, and intensity calculation.

### Does the heat map take elevation into account?

No, the current heat map is based only on horizontal position (latitude/longitude). Elevation is not considered in the intensity calculation.

### Can I export or save the heat map visualization?

You can take a screenshot of the current view. Future versions may include direct export options for visualizations.

## Related Features

- [Marker Clustering](clustering.md) - Group nearby markers for cleaner map displays
- [Statistics and Charts](statistics.md) - Quantify your journey with detailed metrics
- [Custom Visualizations](../tutorials/custom-visualizations.md) - Advanced visualization techniques

By combining heat maps with other visualizations, you can gain deeper insights into your journeys and create more compelling visual stories of your adventures.
