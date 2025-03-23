# Statistics and Charts

PixTrail provides comprehensive statistics and interactive charts to help you understand the quantitative aspects of your journey, including distance, time, speed, and elevation data. These metrics transform your photo collection into a detailed record of your adventure.

## Statistics Overview

The statistics feature offers two main components:

1. **Summary Statistics**: Key metrics about your journey in a tabular format
2. **Interactive Charts**: Visual representations of elevation and speed data

## Accessing Statistics

To view statistics for your processed photos:

1. After processing your photos and viewing the map, click the "Show Statistics" button in the map controls
2. The statistics panel will appear below the map
3. Click the button again (now labeled "Hide Statistics") to toggle it off

## Summary Statistics

The summary statistics table includes the following metrics:

| Statistic | Description |
|-----------|-------------|
| Total Distance | The cumulative distance traveled between photo locations (in kilometers) |
| Total Duration | The time between the first and last photo (in HH:MM:SS format) |
| Start Time | The timestamp of the first photo |
| End Time | The timestamp of the last photo |
| Avg. Speed | Average traveling speed between photo locations (in km/h) |
| Max. Speed | Maximum recorded speed between any two consecutive photo locations (in km/h) |
| Min Elevation | Lowest recorded elevation (in meters) |
| Max Elevation | Highest recorded elevation (in meters) |
| Elevation Gain | The total climb during the journey (only positive changes in elevation) |
| Photo Count | Total number of photos with GPS data used in the analysis |

## Interactive Charts

### Elevation Profile

The elevation profile chart shows how elevation changed throughout your journey:

- **X-axis**: Photo index (sequence of photos)
- **Y-axis**: Elevation (in meters)
- **Line**: Smooth curve connecting elevation points
- **Hover**: Shows exact elevation at any point

This chart helps visualize:
- Uphill and downhill sections
- Flat portions of the journey
- Maximum and minimum elevation points
- Overall elevation trends

### Speed Profile

The speed profile chart shows how your speed varied between photo locations:

- **X-axis**: Segment index (segments between photos)
- **Y-axis**: Speed (in km/h)
- **Line**: Connected line showing speed changes
- **Hover**: Shows exact speed for any segment

This chart helps visualize:
- Fast and slow portions of the journey
- Consistent vs. variable pace
- Stops (near-zero speed segments)
- Transportation changes (e.g., walking vs. driving)

## How Statistics Are Calculated

PixTrail calculates statistics based on the GPS coordinates and timestamps in your photos:

### Distance Calculation

- Uses the Haversine formula to calculate distances between coordinates
- Accounts for the Earth's curvature
- Provides distances in kilometers (with two decimal places precision)
- Excludes unreasonable jumps (>10km between consecutive photos) to avoid GPS errors

### Speed Calculation

- Based on distance and time between consecutive photos
- Reported in kilometers per hour (km/h)
- Excludes unreasonable speeds (>300 km/h) to avoid GPS or timestamp errors
- Average speed calculated only from valid speed measurements

### Elevation Analysis

- Uses elevation data from photo EXIF metadata (if available)
- Elevation gain only counts upward changes (not downward)
- All elevation measurements are in meters
- Filters out anomalous elevation changes that likely represent GPS errors

### Time Calculation

- Based on the timestamps in photo EXIF metadata
- Reported in consistent time zone (based on the first photo's timezone)
- Duration calculated as the difference between first and last photo times
- Times displayed in local format based on your browser settings

## Practical Applications

### Hiking Analysis

For hiking trips, statistics help you:
- Measure the total distance hiked
- Calculate your average hiking pace
- Quantify the elevation gain (important for difficulty assessment)
- Identify the steepest sections from the elevation chart
- Detect rest periods from the speed chart
- Compare difficulty between different hikes

### City Tour Review

For urban explorations, statistics help you:
- Track how far you walked in a day
- Measure the total time spent exploring
- Identify periods of rest or attraction visits (low speed)
- See elevation changes in hilly cities
- Plan future visits based on distances and times

### Road Trip Documentation

For road trips, statistics help you:
- Measure total distance driven
- Calculate average driving speed
- Identify highways vs. local roads from speed patterns
- Detect stops and breaks in the journey
- Track mountainous sections from elevation data
- Analyze your travel patterns for better planning

## Advanced Interpretations

### Speed Patterns

Different speed patterns can reveal insights about your journey:

- **Consistent speed**: Typically indicates highway driving or steady hiking
- **Varying speeds**: Often shows urban exploration or technical trail sections
- **Near-zero segments**: Represent stops at attractions, rest areas, or traffic
- **Sharp peaks**: May indicate transportation changes (e.g., walking to driving)
- **Gradual changes**: Often correlate with terrain changes or traffic conditions

### Elevation Patterns

The elevation chart can be particularly revealing:

- **Sharp peaks and valleys**: Indicate steep terrain or mountainous areas
- **Gradual slopes**: Show gentle hills or mountain passes
- **Plateaus**: Represent flat sections at consistent elevation
- **Sawtooth patterns**: Often indicate ridge hiking or rolling hills
- **Long climbs followed by quick descents**: Typical for summit hikes

### Correlating Charts with Map

For deeper insights, correlate the charts with your map visualizations:

- Match elevation peaks with geographic features
- Identify where speed drops correlate with points of interest
- Look for patterns in clusters and heat map intensity that match speed changes
- Compare the elevation profile with the terrain visible on the map

## Troubleshooting and Limitations

### Missing or Inaccurate Timestamps

If your photos lack accurate timestamps:
- Speed calculations will be omitted or unreliable
- Duration may show as "Unknown"
- The route line will still be drawn, but without time-based information

### GPS Accuracy Issues

GPS accuracy affects statistical calculations:
- Inaccurate GPS coordinates may lead to overestimated distances
- Urban canyons (tall buildings) often reduce GPS accuracy
- Elevation data from consumer cameras is generally less accurate than horizontal position

### Time Gaps Between Photos

Large time gaps between photos can affect your statistics:
- Average speed may not represent your actual pace during gaps
- The route line assumes direct travel between consecutive photos
- Very large gaps may be filtered out as unreasonable

### Speed and Distance Anomalies

If you see unusual speed or distance values:
- Very high speeds may indicate timestamp errors or large jumps
- Distances may be overestimated if GPS data has significant noise
- Photos taken in approximately the same location may show artificially low speeds

## Best Practices

To get the most accurate statistics:

1. **Ensure accurate timestamps**: Set your camera's clock correctly before your journey
2. **Take photos at regular intervals**: This provides more consistent tracking
3. **Use a camera with good GPS**: Higher-end cameras and smartphones generally have better GPS accuracy
4. **Take more photos on complex routes**: More data points improve the accuracy of the route representation
5. **Let your camera/phone establish GPS fix**: Avoid taking photos immediately after turning on GPS

## Exporting Statistics

Currently, statistics can be viewed in the web interface. To save this information:

- Take a screenshot of the statistics panel for visual records
- Export the GPX file, which includes all coordinate and timestamp data
- Future versions may include direct export options for statistics reports

## Comparing Multiple Journeys

While PixTrail doesn't currently offer direct journey comparison, you can:

1. Process each journey separately
2. Record the statistics for each
3. Compare them manually or in a spreadsheet
4. Look for patterns and differences in distance, speed, elevation, etc.

## Technical Details

The statistics and charts are powered by the following technologies:

- Distance and speed calculations use the Haversine formula for accuracy
- Charts are rendered using Chart.js for interactive visualization
- All calculations happen locally in your browser
- GPS data cleaning algorithms remove outliers for more accurate statistics

## Frequently Asked Questions

### Why do my speed calculations seem inaccurate?

Speed calculations depend on both distance and time between photos. Inaccuracies can result from:
- GPS errors in the original photos
- Incorrect camera clock settings
- Too few photos to accurately represent your journey
- Large gaps between photos

### Why is my total distance different from what my fitness tracker recorded?

Several factors can cause differences:
- PixTrail calculates straight lines between photo points (missing any detours)
- GPS accuracy varies between devices
- Fitness trackers typically record more frequent data points
- PixTrail filters out anomalous jumps that might be included in other tracking

### Can I customize the charts or statistics?

Currently, the charts and statistics have preset configurations. Future versions may include options for customization.

### How accurate is the elevation data?

Elevation accuracy depends on your camera's GPS capabilities:
- Smartphones generally have moderate elevation accuracy (±10-20 meters)
- Dedicated GPS cameras may have better accuracy
- Elevation is typically less accurate than horizontal position
- Some cameras don't record elevation at all

### Are statistics available when using the command line?

Basic statistics are printed to the console when using verbose mode (`-v` flag). For detailed statistics and charts, use the web interface.

## Related Features

- [Heat Maps](heatmap.md) - Visualize where you spent the most time during your journey
- [Marker Clustering](clustering.md) - Group nearby markers for cleaner map displays
- [Custom Visualizations](../tutorials/custom-visualizations.md) - Advanced visualization techniques

By analyzing the statistical aspects of your journeys, you can gain deeper insights into your travel patterns and create more informative records of your adventures.
