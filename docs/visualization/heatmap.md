# Heat Map Visualization

The heat map feature in PixTrail visualizes where you spent the most time during your journey, creating a color-coded overlay on the map to show areas of high activity or interest.

## What is a Heat Map?

A heat map is a graphical representation of data where values are represented by colors. In PixTrail, the heat map shows the intensity of photo activity at different locations:

- **Red/Yellow areas**: Locations with high activity (many photos or long duration)
- **Green areas**: Locations with moderate activity
- **Blue areas**: Locations with low activity (few photos or brief stops)

This visualization helps identify the focal points of your journey - the places where you spent the most time or took the most photos.

## How PixTrail Creates Heat Maps

PixTrail uses two factors to determine the intensity at each location:

1. **Photo density**: The number of photos taken at or near a location
2. **Time spent**: The duration between the first and last photo at a location (when timestamps are available)

These factors are combined to create a weighted heat map that reflects both the number of photos and the time spent at each location.

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

## Technical Details

The heat map is created using the Leaflet.heat plugin with the following parameters:

- **Radius**: 25 pixels (determines the smoothness of the heat map)
- **Blur**: 15 pixels (determines how fuzzy the heat map appears)
- **Max Zoom**: 17 (determines at what zoom level the heat map stops scaling)
- **Gradient**: A custom color gradient from blue (low) through green and yellow to red (high)

The intensity values are calculated using a combination of:

1. The number of photos within approximately a 5-meter radius
2. The time span between photos in that area (if timestamps are available)

## Examples

### City Tour Example

In a city tour heat map, you might see:

- Red hotspots at major attractions where you spent time and took many photos
- Yellow areas along main streets or transit hubs
- Green/blue areas along the routes between attractions

### Hiking Example

In a hiking trip heat map, you might see:

- Red/yellow spots at viewpoints, rest areas, or particularly scenic sections
- Green areas along regular trail sections
- Blue areas where you moved quickly without stopping

## Tips for Using Heat Maps

- Look for unexpected hotspots to discover patterns in your travel behavior
- Compare hotspots with map features to understand what attracted your attention
- Use the heat map to plan future trips by identifying popular spots worth more time
- For journeys with many photos, the heat map often provides a clearer overview than individual markers

## Limitations

- Heat map accuracy depends on GPS accuracy in your photos
- Areas with poor GPS reception may show displaced hotspots
- Very short journeys with few photos may not show meaningful patterns
- Heat map calculation is based on a grid approach, so very close locations may be merged
