# Troubleshooting PixTrail

This guide provides solutions to common issues you might encounter when using PixTrail.

## Application Issues

### Application Won't Start

If the application doesn't start or load properly:

1. **Check Console Errors**: Open browser developer tools (F12 or Ctrl+Shift+I) and check the console for error messages
2. **Check Network Requests**: In the Network tab, look for failed resource requests
3. **Clear Browser Cache**: Try clearing your browser cache and reloading
4. **Try Another Browser**: Test in a different browser to isolate browser-specific issues

### Module Loading Errors

If you see errors related to module loading:

```
Uncaught SyntaxError: The requested module '/static/js/utils/domHelpers.js' does not provide an export named 'X'
```

1. **Check Import Statements**: Ensure that imports match exports in the module
2. **Check File Paths**: Verify that file paths in import statements are correct
3. **Check Module Type**: Ensure script tags have `type="module"` where needed
4. **CORS Issues**: Local development may require a web server rather than opening files directly

## File Upload Issues

### No Files Appear in Upload

If no files appear after selecting them:

1. **Check File Types**: Ensure you're selecting image files
2. **Check File Size**: There may be size limits (check browser console for errors)
3. **Check Input Permissions**: Some browsers restrict file access
4. **Try Drag and Drop**: If the file browser dialog isn't working, try drag and drop instead

### Drag and Drop Not Working

If drag and drop isn't working:

1. **Check Browser Support**: Ensure your browser supports the HTML5 Drag and Drop API
2. **Check Event Handlers**: Open console and check if events are firing with:
   ```javascript
   document.getElementById('file-drop-area').addEventListener('dragover', e => {
     console.log('Dragover event fired');
   });
   ```
3. **Check CSS**: The drop area should be visible and have sufficient size
4. **Try Files vs. Directories**: Some browsers handle file drops differently from directory drops

### No GPS Data in Photos

If the application processes photos but reports no GPS data:

1. **Check EXIF Data**: Verify that your photos actually contain GPS data
   - You can use online EXIF viewers or tools like ExifTool
2. **Check File Types**: Some file formats (like PNG) may not store GPS metadata
3. **Check Privacy Settings**: Some applications and services strip location data
4. **Try Different Photos**: Test with photos known to have GPS data

## Map Issues

### Map Not Displaying

If the map doesn't appear:

1. **Check Network Access**: The base map tiles require internet access
2. **Check Console Errors**: Look for Leaflet-related errors
3. **Check Container Size**: The map container must have a height
4. **Check Map Initialization**: Verify the map is properly initialized
   ```javascript
   console.log(document.getElementById('map')._leaflet_id);
   ```

### Markers Not Appearing

If markers don't appear on the map:

1. **Check Waypoint Data**: Verify that waypoints have valid coordinates
   ```javascript
   console.log(window.pixTrail.waypoints);
   ```
2. **Check Map Bounds**: Ensure the map is zoomed to include marker locations
3. **Check Clustering**: If clustering is enabled, markers might be grouped
4. **Check Z-Index**: Other elements might be overlaying the markers

### Heatmap or Clustering Not Working

If heatmap or clustering features aren't working:

1. **Check Plugin Loading**: Verify that required Leaflet plugins are loaded
   ```javascript
   console.log(typeof L.heatLayer);  // For heatmap
   console.log(typeof L.MarkerClusterGroup);  // For clustering
   ```
2. **Check Data Points**: Ensure there are enough data points for meaningful visualization
3. **Check Control Initialization**: Verify that controls are properly initialized
4. **Check Module Dependencies**: These features depend on the map and waypoints

## JavaScript Module Issues

### Module Not Found

If you get a "Module not found" error:

1. **Check File Path**: Verify the file exists at the specified path
2. **Check Import Statement**: Ensure the import statement uses the correct path
   ```javascript
   // Correct absolute path from root
   import Module from '/static/js/modules/module.js';
   // Or correct relative path
   import Module from '../modules/module.js';
   ```
3. **Check Web Server**: Modules require a proper web server, not file:// URLs
4. **Check File Permissions**: Ensure the web server has permission to read the files

### Undefined Module Properties

If module properties are undefined:

1. **Check Module Initialization**: Ensure the module is properly initialized
   ```javascript
   console.log(module);  // Should be an instance, not a class definition
   ```
2. **Check Constructor Parameters**: Verify that required configuration is provided
3. **Check Lifecycle Methods**: Some modules need explicit initialization
4. **Check Dependency Initialization**: Dependencies should be initialized first

### Feature Module Not Working

If a specific feature module isn't working:

1. **Check Module Dependencies**: Verify all dependencies are loaded
2. **Check Initialization Order**: Modules should be initialized in the correct order
3. **Check Configuration**: Verify that the module is properly configured
4. **Check DOM Elements**: The module might depend on specific DOM elements
5. **Isolate the Issue**: Try using the module in isolation

For example, to debug the Heatmap module:

```javascript
// Create a minimal configuration
const minimalConfig = { 
  map: window.pixTrail.mapVisualization.getMap(),
  waypoints: window.pixTrail.waypoints
};

// Test the module directly
const testHeatmap = new Heatmap(minimalConfig);
testHeatmap.show();
```

## CSS Issues

### Styles Not Applied

If styles aren't being applied:

1. **Check CSS Loading**: Verify that CSS files are loaded
   ```javascript
   const styles = document.styleSheets;
   for (let i = 0; i < styles.length; i++) {
     console.log(styles[i].href);
   }
   ```
2. **Check CSS Import Order**: CSS imports should be in the correct order
3. **Check Selector Specificity**: More specific selectors might override your styles
4. **Check for CSS Errors**: Syntax errors can break CSS parsing

### Layout Issues

If the layout doesn't look right:

1. **Check Responsive Design**: Verify that elements adapt to different screen sizes
2. **Check Container Sizes**: Elements might need explicit widths/heights
3. **Check CSS Variables**: Ensure variables are defined and used correctly
4. **Check Browser Compatibility**: Some CSS features aren't supported in all browsers

### Module Style Conflicts

If there are conflicts between CSS modules:

1. **Check Selector Scope**: Selectors should be scoped to their components
2. **Check CSS Variable Usage**: Use variables for consistent styling
3. **Check Import Order**: Later imports can override earlier ones
4. **Use More Specific Selectors**: Increase specificity to override conflicts

## Performance Issues

### Slow Application Startup

If the application takes a long time to start:

1. **Check Module Size**: Large modules take longer to load
2. **Check Network Requests**: Slow responses can delay startup
3. **Check Initialization Code**: Complex initialization can slow startup
4. **Use Performance Profiling**: Browser developer tools include performance profiling

### Sluggish Map Performance

If the map is slow or unresponsive:

1. **Check Marker Count**: Too many markers can slow performance
   - Try enabling clustering for better performance
2. **Check Map Tile Server**: The tile server might be slow
3. **Check Event Handlers**: Too many event handlers can cause lag
4. **Reduce Map Complexity**: Simplify map visualizations

### Memory Usage Issues

If the application uses too much memory:

1. **Check File Processing**: Large files consume more memory
2. **Check for Memory Leaks**: Use the Memory tab in developer tools
3. **Close Unused Resources**: Release resources when they're no longer needed
4. **Limit Data Size**: Process smaller batches of data

## Browser Compatibility Issues

### Browser-Specific Problems

If the application works in some browsers but not others:

1. **Check Feature Support**: Use [caniuse.com](https://caniuse.com/) to check feature support
2. **Check Console Errors**: Different browsers may show different errors
3. **Test Across Browsers**: Test in Chrome, Firefox, Safari, and Edge
4. **Use Polyfills**: Add polyfills for unsupported features

### Mobile Browser Issues

If the application doesn't work well on mobile:

1. **Check Responsive Design**: Verify that the layout adapts to small screens
2. **Check Touch Interactions**: Mobile uses touch instead of mouse events
3. **Check File Access**: Mobile browsers have stricter file access limitations
4. **Check Performance**: Mobile devices may have limited resources

## Module Communication Issues

In the modular architecture, issues can arise from module communication:

1. **Check Module Dependencies**: Verify that dependent modules are initialized
2. **Check Event Handling**: Events should be properly propagated between modules
3. **Check Callback Functions**: Callbacks should be passed and called correctly
4. **Check State Synchronization**: Modules should share state appropriately

For example, if the heatmap isn't updating with new waypoints:

```javascript
// Check if waypoints are being passed to the heatmap module
console.log('Waypoints:', window.pixTrail.waypoints);
console.log('Heatmap waypoints:', window.pixTrail.heatmap.waypoints);

// Manually update the heatmap
window.pixTrail.heatmap.setWaypoints(window.pixTrail.waypoints);
window.pixTrail.heatmap.show();
```

## Advanced Troubleshooting

### Debugging Module Interactions

For complex issues involving multiple modules:

1. **Use Breakpoints**: Set breakpoints in key methods to trace execution
2. **Log Module State**: Log the state of modules at different points
3. **Isolate Components**: Test components in isolation
4. **Check Event Flow**: Track events between modules

### Fixing Module Import Issues

If you encounter persistent module import issues:

1. **Use Absolute Paths**: Start paths from the web root
   ```javascript
   import Module from '/static/js/modules/module.js';
   ```
2. **Check Import/Export Match**: Ensure named imports match named exports
3. **Use Default Exports**: Default exports can simplify imports
4. **Check Browser Support**: Ensure your browser supports ES modules

### Resolving CSS Module Conflicts

For CSS conflicts in the modular architecture:

1. **Use Namespaced Classes**: Prefix classes with module names
   ```css
   .map-section__control vs .heatmap__control
   ```
2. **Use CSS Variables**: Define and use variables consistently
3. **Check Specificity**: More specific selectors take precedence
4. **Check Import Order**: Later imports override earlier ones

## Getting Additional Help

If you're still having issues:

1. **Check Documentation**: Review the relevant documentation sections
2. **Search Issues**: Check if others have reported similar issues
3. **Provide Details**: When reporting issues, include:
   - Browser and version
   - Steps to reproduce
   - Console errors
   - Screenshots or recordings
   - Code samples if applicable