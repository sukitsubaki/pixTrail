# Statistics and Charts

PixTrail provides comprehensive statistics and interactive charts to help you understand the quantitative aspects of your journey, including distance, time, speed, and elevation data.

## Overview

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
- Provides distances in kilometers
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

### Time Calculation

- Based on the timestamps in photo EXIF metadata
- Reported in consistent time zone (based on the first photo's timezone)
- Duration calculated as the difference between first and last photo times

## Example Use Cases

### Hiking Analysis
- Review the elevation profile to understand the difficulty of the trail
- Compare speed with elevation to identify challenging sections
- Look at the elevation gain to quantify the climb

### City Tour Review
- Check the total distance to quantify how far you walked
- Review the duration to plan future visits more effectively
- Look at speed variations to identify areas where you lingered

### Road Trip Documentation
- Analyze average speed to understand your pace
- Look at the elevation profile to recall mountain passes or valleys
- Check total distance for trip records

## Technical Details

The statistics and charts are powered by the following technologies:

- Distance and speed calculations use the Haversine formula for accuracy
- Charts are rendered using Chart.js for interactive visualization
- All calculations happen locally in your browser
- GPS data cleaning algorithms remove outliers for more accurate statistics

## Limitations

The accuracy of statistics depends on several factors:

- **GPS accuracy** in your photos affects distance and elevation measurements
- **Timestamp accuracy** affects duration and speed calculations
- **Photo frequency** affects speed accuracy (more frequent photos = more accurate speeds)
- **Missing elevation data** in some photo formats may limit elevation statistics
- **Time gaps** between photos can make average speed calculations less representative

Despite these limitations, the statistics provide valuable insights into your journey when used with appropriate context.
