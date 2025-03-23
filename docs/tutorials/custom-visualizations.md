# Customizing Visualizations

**Skill Level: Intermediate**

This tutorial will guide you through the process of customizing the visualization features in PixTrail's web interface to create more insightful and useful views of your journey data.

## Introduction

PixTrail's web interface offers several powerful visualization tools that can be customized to better understand and analyze your photo journeys. By learning how to effectively use these tools, you can extract deeper insights from your GPS data and create more compelling visualizations.

By the end of this tutorial, you will know how to:
- Customize the map view for different types of journeys
- Configure and interpret heat maps effectively
- Optimize marker clustering for different scenarios
- Use statistics and charts to analyze your routes
- Combine multiple visualization techniques for comprehensive analysis

## Prerequisites

Before starting, make sure you have:

1. **PixTrail installed** with web interface support:
   ```bash
   pip install pixtrail[web]
   ```

2. **Processed photo data** from at least one journey
   - For best results, use a journey with at least 20-30 photos
   - Having photos from different types of activities (urban exploration, hiking, etc.) is useful for comparison

3. **Basic familiarity with PixTrail's web interface**
   - If you're new to PixTrail, complete the [Documenting a Photo Journey](photo-journey.md) tutorial first

## Step 1: Customizing the Base Map

Let's start by understanding how to customize the basic map view:

1. **Start the web interface**:
   ```bash
   pixtrail -w
   ```

2. **Process your photos** using either:
   - The "Files" tab for individual photos
   - The "Directory" tab for a folder of photos

3. **Adjust the map view**:
   - Zoom in/out using the mouse wheel or +/- buttons
   - Pan by clicking and dragging
   - Double-click to zoom in on a specific location

4. **Find the optimal zoom level**:
   - For city tours: Zoom in close to see street details
   - For hiking trips: Zoom out slightly to see terrain context
   - For road trips: Zoom out to see the entire route

5. **Center the map** on the most important part of your journey by double-clicking that area

## Step 2: Mastering Heat Maps

Heat maps are a powerful way to visualize where you spent the most time during your journey:

1. **Enable the heat map** by clicking the "Show Heatmap" button

2. **Understand how heat maps work**:
   - Red/yellow areas: High intensity (many photos or long duration)
   - Green areas: Medium intensity
   - Blue areas: Low intensity (few photos or brief visits)

3. **Adjust your viewing zoom level**:
   - Zoom in to see detailed heat patterns in specific areas
   - Zoom out to see the overall heat distribution across your journey

4. **Interpreting heat map patterns**:
   - **Point hotspots**: Indicate locations where you spent significant time (e.g., tourist attractions, viewpoints)
   - **Line hotspots**: Indicate slow movement along a path (e.g., scenic routes)
   - **Scattered patterns**: Indicate exploration of an area without specific focus points

5. **Use heat maps for different journey types**:
   - **Urban exploration**: Identify which attractions held your interest longest
   - **Hiking**: Find rest spots or viewpoints where you took multiple photos
   - **Road trips**: Identify stopover points versus transit areas

6. **Combine with base map features**:
   - Look for correlations between heat intensity and map features (e.g., scenic viewpoints, museums)
   - Identify patterns in your behavior (e.g., spending more time at historical sites)

## Step 3: Optimizing Marker Clustering

For journeys with many photos, marker clustering helps manage visual complexity:

1. **Enable clustering** by clicking the "Enable Clustering" button

2. **Adjust the cluster radius** using the slider that appears:
   - Lower values (20-40px): Create more clusters with fewer markers each
   - Higher values (100-200px): Create fewer clusters with more markers each

3. **Find the optimal radius for different journey types**:
   - **Urban journeys** (40-60px): Differentiate between nearby attractions
   - **Hiking trips** (60-80px): Group photos taken at viewpoints
   - **Road trips** (100-150px): Group photos by general areas/stops

4. **Interact with clusters**:
   - Click on clusters to zoom in and see the contained markers
   - Hover over clusters to see their boundaries
   - Notice how clusters dynamically break apart as you zoom in

5. **Advanced clustering techniques**:
   - **Staged analysis**: Start with a high radius for overview, then reduce to see details
   - **Comparison**: Toggle clustering on/off to compare individual markers with clustered patterns
   - **Combined with heat map**: Use both together to see density (heat map) and grouping (clusters)

## Step 4: Utilizing Statistics and Charts

The statistics panel provides quantitative insights into your journey:

1. **Open the statistics panel** by clicking the "Show Statistics" button

2. **Understand the summary statistics**:
   - Total distance traveled
   - Journey duration
   - Average and maximum speeds
   - Elevation data
   - Photo count

3. **Interpret the elevation chart**:
   - **Sharp peaks**: Steep climbs or descents
   - **Plateaus**: Flat sections at consistent elevation
   - **Gradual slopes**: Gentle climbs or descents

4. **Analyze the speed chart**:
   - **High values**: Rapid movement (e.g., driving, cycling)
   - **Low values**: Slow movement or stops
   - **Variations**: Changes in transportation mode or terrain difficulty

5. **Correlate statistics with map features**:
   - Match speed drops with points of interest on the map
   - Identify challenging sections of a hike based on speed and elevation
   - Recognize rest stops or photo opportunities

## Step 5: Combined Visualization Techniques

For the most insightful analysis, combine multiple visualization techniques:

1. **Heat Map + Clustering** for high-density areas:
   - Enable both heat map and clustering
   - Look for clusters that align with heat intensity
   - This combination works well for busy urban areas

2. **Clustering + Statistics** for pattern recognition:
   - Use clustering to identify major stops
   - Check the statistics to see time spent and distance between clusters
   - Correlate clusters with speed changes in the chart

3. **Heat Map + Statistics** for detailed analysis:
   - Compare heat intensity with elevation changes
   - Identify areas of high interest that also coincide with speed drops
   - Check if elevation viewpoints correspond to heat map hotspots

4. **All three together** for comprehensive analysis:
   - Start with clustering for an organized overview
   - Add the heat map to see intensity patterns
   - Open statistics to quantify the observations
   - This provides the most complete picture of your journey

## Step 6: Creating Custom Views for Different Journey Types

Different types of journeys benefit from different visualization settings:

### Urban Exploration Settings

Best for city tours, museum visits, or urban photography:

1. **Base map**: Zoom level 15-17 to see street details
2. **Clustering**: Enable with 40-60px radius
3. **Heat map**: Enable to identify major attractions
4. **Statistics**: Focus on total distance walked and duration

### Hiking Trip Settings

Best for trail hikes, mountain climbing, or nature walks:

1. **Base map**: Zoom level 13-15 to see terrain features
2. **Clustering**: Enable with 60-80px radius
3. **Heat map**: Enable to identify viewpoints and rest areas
4. **Statistics**: Focus on elevation chart and elevation gain

### Road Trip Settings

Best for long-distance journeys by car or motorcycle:

1. **Base map**: Zoom level 10-12 to see the entire route
2. **Clustering**: Enable with 100-150px radius
3. **Heat map**: Enable to identify major stopover points
4. **Statistics**: Focus on total distance and average speed

### Photography Session Settings

Best for dedicated photography outings where many photos are taken in a small area:

1. **Base map**: Zoom level 16-18 for maximum detail
2. **Clustering**: Disable or use very small radius (20-30px)
3. **Heat map**: Enable to see the focus of your photography
4. **Statistics**: Less relevant, focus on the map view

## Advanced Tips and Tricks

### Creating Multi-Journey Visualizations

To compare or combine multiple journeys:

1. Process each journey separately
2. Note the patterns and heat map hotspots in each
3. Look for common patterns or differences in your behavior

### Time-Based Analysis

To understand your journey in terms of time:

1. Check timestamps in photo markers by clicking on them
2. Correlate the time of day with heat map intensity
3. Look for patterns in your behavior at different times (e.g., attractions in the morning, restaurants in the evening)

### Learning from Visualization Patterns

Over time, your visualizations can reveal insights about your travel style:

1. Do you tend to spend more time at certain types of locations?
2. How does your pace vary between different environments?
3. Are there patterns in your photo-taking behavior?

## Troubleshooting Visualization Issues

### Heat Map Not Showing Clear Patterns

If your heat map looks uniform or unclear:

1. Check if your photos have accurate timestamps
2. Ensure you have enough photos to create meaningful patterns
3. Try zooming in to see more detailed heat patterns
4. Consider if your journey actually had uniform movement without major stops

### Clustering Creates Too Many or Too Few Clusters

If you're not happy with the clustering results:

1. Adjust the radius slider to find the sweet spot
2. For dense areas, use a smaller radius
3. For sparse areas, use a larger radius
4. If clustering doesn't improve visualization, try disabling it

### Statistics Showing Unlikely Values

If your statistics seem incorrect:

1. Check for outliers in your GPS data (e.g., erroneous GPS readings)
2. Verify that your photos have accurate timestamps
3. Be aware that gaps between photos can lead to misleading speed calculations
4. For elevation data, note that not all cameras record accurate altitude

## Next Steps

After mastering visualization customization, you might want to explore:

- Using the [Python API](../api/index.md) to create custom visualizations
- [Batch Processing](batch-processing.md) multiple journeys for comparison
- Creating a portfolio of journey visualizations for different trips

## Example: Analyzing a Mixed Urban/Nature Journey

Here's a practical example of customizing visualizations for a day trip that includes both urban exploration and a nature hike:

1. **Process the photos** from the mixed journey

2. **Initial assessment**:
   - The map shows a route starting in a city, moving to a natural area, and returning
   - Photos are clustered both in the urban area and at points along the hiking trail

3. **Urban section analysis**:
   - Zoom in to the urban area
   - Set clustering radius to 50px for detailed grouping
   - Enable heat map to see major points of interest
   - Note the statistics showing slower speed in this section

4. **Nature section analysis**:
   - Zoom to the hiking trail section
   - Increase clustering radius to 70px
   - Keep heat map enabled to identify viewpoints
   - Check the elevation chart to correlate viewpoints with elevation changes

5. **Comprehensive analysis**:
   - Zoom out to see the entire journey
   - Set clustering radius at 80px for a balanced view
   - Compare the heat patterns between urban and nature sections
   - Note the speed differences between walking in the city and hiking on trails

This example demonstrates how you can adjust visualization settings as you analyze different portions of a mixed journey, gaining insights into each section's unique characteristics.
