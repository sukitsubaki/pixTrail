# Testing PixTrail Modules

This document provides guidance on testing PixTrail modules to ensure their quality, reliability, and compatibility.

## Testing Approach

PixTrail uses a modular architecture that makes testing more manageable. Each module can be tested independently, and then integration tests can verify that modules work together correctly.

The testing approach includes:

1. **Unit Testing**: Testing individual functions and methods in isolation
2. **Module Testing**: Testing each module as a whole
3. **Integration Testing**: Testing interactions between modules
4. **UI Testing**: Testing the user interface elements
5. **End-to-End Testing**: Testing complete user workflows

## Testing Environment

### Prerequisites

You'll need the following for testing:

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Development server running
- Test data (sample photos with GPS data)
- Browser developer tools

### Setting Up a Testing Environment

1. Clone the repository
2. Install dependencies
3. Start the development server
4. Open the application in your browser
5. Open browser developer tools (F12 or Ctrl+Shift+I)

## Unit Testing

### Testing Utility Functions

Utility functions can be tested directly in the browser console:

```javascript
// Import utilities
import DOMHelpers from './utils/domHelpers.js';
import GPSUtils from './utils/gpsUtils.js';

// Test DOM helper function
const element = DOMHelpers.create('div', { 
    classes: 'test-class',
    text: 'Test element' 
});
document.body.appendChild(element);
console.assert(element.className === 'test-class', 'Class was not applied correctly');
console.assert(element.textContent === 'Test element', 'Text was not set correctly');

// Test GPS utility function
const distance = GPSUtils.calculateDistance(35.0394, 135.7292, 35.6812, 139.7671);
console.assert(distance > 0, 'Distance calculation failed');
console.log(`Distance: ${distance} km`);
```

### Using a Testing Framework

For more comprehensive testing, consider using a testing framework like Jest or Mocha:

```javascript
// Example Jest test for gpsUtils.js
import GPSUtils from '../utils/gpsUtils.js';

describe('GPSUtils', () => {
  test('calculateDistance should return correct value', () => {
    const distance = GPSUtils.calculateDistance(35.0394, 135.7292, 35.6812, 139.7671);
    expect(distance).toBeGreaterThan(0);
    expect(distance).toBeCloseTo(371.5, 0); // Kyoto to Tokyo ~371.5 km
  });
  
  test('validateCoordinates should detect invalid coordinates', () => {
    expect(GPSUtils.validateCoordinates(35.0394, 135.7292)).toBe(true);
    expect(GPSUtils.validateCoordinates(190, 135.7292)).toBe(false);
    expect(GPSUtils.validateCoordinates(35.0394, 190)).toBe(false);
    expect(GPSUtils.validateCoordinates('abc', 135.7292)).toBe(false);
  });
});
```

## Module Testing

### Testing Class-Based Modules

Most PixTrail feature modules use a class-based approach. Here's how to test them:

```javascript
// Test MapVisualization module
import MapVisualization from './modules/mapVisualization.js';

// Create container elements
const mapContainer = document.createElement('div');
const mapElement = document.createElement('div');
mapContainer.appendChild(mapElement);
document.body.appendChild(mapContainer);

// Initialize the module
const mapViz = new MapVisualization({
  mapContainer: mapContainer,
  mapElement: mapElement
});

// Test map initialization
const map = mapViz.getMap();
console.assert(map !== null, 'Map should be initialized');

// Test waypoint addition
const testWaypoints = [
  { latitude: 35.0394, longitude: 135.7292, name: 'Point 1', timestamp: '2023-01-01T12:00:00Z' },
  { latitude: 35.6812, longitude: 139.7671, name: 'Point 2', timestamp: '2023-01-01T15:00:00Z' }
];
mapViz.setWaypoints(testWaypoints);
console.assert(mapViz.markers.length === 2, 'Markers should be created');
console.assert(mapViz.routeLine !== null, 'Route line should be created');

// Test clearing
mapViz.clearMapLayers();
console.assert(mapViz.markers.length === 0, 'Markers should be cleared');
console.assert(mapViz.routeLine === null, 'Route line should be cleared');
```

### Mock Objects

For modules that interact with external services or APIs, use mock objects:

```javascript
// Mock APIClient for testing
const mockAPIClient = {
  submitPhotos: (formData, progressCallback) => {
    // Simulate progress updates
    setTimeout(() => progressCallback({ loaded: 50, total: 100 }), 100);
    setTimeout(() => progressCallback({ loaded: 100, total: 100 }), 200);
    
    // Return mock response
    return Promise.resolve({ session_id: 'test-session-123' });
  },
  
  processPhotos: (sessionId) => {
    console.log(`Processing session ${sessionId}`);
    return Promise.resolve({
      success: true,
      waypoints: [
        { latitude: 35.0394, longitude: 135.7292, name: 'Test1.jpg', timestamp: '2023-01-01T12:00:00Z' },
        { latitude: 35.6812, longitude: 139.7671, name: 'Test2.jpg', timestamp: '2023-01-01T15:00:00Z' }
      ]
    });
  }
};

// Replace actual API client with mock
window.originalAPIClient = window.APIClient;
window.APIClient = mockAPIClient;

// Test code that uses APIClient
// ...

// Restore original API client
window.APIClient = window.originalAPIClient;
```

## Integration Testing

Integration tests verify that modules work together correctly:

```javascript
// Integration test for Map Visualization + Heatmap
import MapVisualization from './modules/mapVisualization.js';
import Heatmap from './modules/heatmap.js';

// Set up containers
// ...

// Initialize modules
const mapViz = new MapVisualization({ /* config */ });
const heatmap = new Heatmap({ 
  map: mapViz.getMap(),
  toggleButton: document.getElementById('toggle-heatmap')
});

// Test data
const testWaypoints = [/* waypoints */];

// Test integration
mapViz.setWaypoints(testWaypoints);
heatmap.setWaypoints(testWaypoints);

// Verify heatmap works
heatmap.show();
console.assert(heatmap.isVisible(), 'Heatmap should be visible');
console.assert(heatmap.heatLayer !== null, 'Heat layer should be created');

// Verify toggle works
document.getElementById('toggle-heatmap').click();
console.assert(!heatmap.isVisible(), 'Heatmap should be hidden after toggle');
```

## UI Testing

Test UI components to ensure they work correctly:

### Event Handling

```javascript
// Test button click handling
const button = document.getElementById('process-button');
button.click();
// Verify expected behavior occurred

// Test drag and drop
const dropArea = document.getElementById('file-drop-area');
const dragEvent = new Event('dragover');
dropArea.dispatchEvent(dragEvent);
console.assert(dropArea.classList.contains('drag-over'), 
               'Drop area should have drag-over class');
```

### Form Submission

```javascript
// Test form submission
const form = document.getElementById('process-form');
const submitEvent = new Event('submit', { cancelable: true });
form.dispatchEvent(submitEvent);
// Verify form submission was handled
```

### Responsive Design

Test on different screen sizes:

```javascript
// Test responsive behavior
const originalWidth = window.innerWidth;
const originalHeight = window.innerHeight;

// Simulate mobile
window.innerWidth = 375;
window.innerHeight = 667;
window.dispatchEvent(new Event('resize'));
// Verify mobile layout

// Restore size
window.innerWidth = originalWidth;
window.innerHeight = originalHeight;
window.dispatchEvent(new Event('resize'));
```

## End-to-End Testing

End-to-end tests simulate complete user workflows:

```javascript
// End-to-end test for photo processing workflow
async function testPhotoProcessingWorkflow() {
  console.log('Starting E2E test: Photo processing workflow');
  
  // 1. Select photos
  console.log('Selecting photos...');
  const fileInput = document.getElementById('photo-input');
  // Create mock file
  const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(file);
  fileInput.files = dataTransfer.files;
  fileInput.dispatchEvent(new Event('change'));
  
  // 2. Submit form
  console.log('Submitting form...');
  const form = document.getElementById('process-form');
  const submitEvent = new Event('submit', { cancelable: true });
  form.dispatchEvent(submitEvent);
  
  // 3. Wait for processing
  console.log('Waiting for processing...');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // 4. Verify map is displayed
  console.log('Verifying map display...');
  const mapContainer = document.getElementById('map-container');
  console.assert(!mapContainer.classList.contains('hidden'), 
                'Map should be visible after processing');
  
  // 5. Test map controls
  console.log('Testing map controls...');
  document.getElementById('toggle-heatmap').click();
  document.getElementById('toggle-clustering').click();
  document.getElementById('toggle-statistics').click();
  
  // 6. Verify statistics
  console.log('Verifying statistics...');
  const statsContainer = document.getElementById('statistics-container');
  console.assert(!statsContainer.classList.contains('hidden'), 
                'Statistics should be visible');
  
  console.log('E2E test completed successfully');
}

// Run the E2E test
testPhotoProcessingWorkflow()
  .catch(error => console.error('E2E test failed:', error));
```

## Testing Modular CSS

Test CSS modules to ensure they apply correctly:

```javascript
// Test CSS module application
function testCSSModules() {
  console.log('Testing CSS modules...');
  
  // Test button styles
  const button = document.createElement('button');
  button.className = 'primary-button';
  document.body.appendChild(button);
  
  const style = window.getComputedStyle(button);
  console.assert(style.backgroundColor !== 'rgba(0, 0, 0, 0)', 
                'Button should have background color');
  console.assert(style.color === 'rgb(255, 255, 255)', 
                'Primary button should have white text');
  
  document.body.removeChild(button);
  
  // Test responsive behavior
  // ...
  
  console.log('CSS module tests completed');
}

testCSSModules();
```

## Automated Testing Setup

For ongoing development and CI/CD pipelines, consider setting up automated testing:

1. **Add Testing Framework**:
   ```bash
   npm install --save-dev jest
   ```

2. **Configure Jest for ES Modules**:
   ```javascript
   // jest.config.js
   module.exports = {
     transform: {
       '^.+\\.js$': 'babel-jest',
     },
     moduleFileExtensions: ['js'],
     testEnvironment: 'jsdom',
   };
   ```

3. **Create Test Scripts**:
   ```json
   // package.json
   {
     "scripts": {
       "test": "jest",
       "test:watch": "jest --watch"
     }
   }
   ```

4. **Write Test Files**:
   ```javascript
   // __tests__/utils/gpsUtils.test.js
   import GPSUtils from '../../static/js/utils/gpsUtils.js';
   
   describe('GPSUtils', () => {
     // Tests...
   });
   ```

## Testing Custom Modules

When testing custom modules you've developed:

1. **Create a Test Plan**: Define what you want to test
2. **Test in Isolation**: First test your module by itself
3. **Test Integration**: Test how it works with existing modules
4. **Test Edge Cases**: Consider boundary conditions and errors
5. **Test Performance**: Ensure the module performs well with large data sets

Example test for a custom module:

```javascript
// Test for a custom PhotoCarousel module
import PhotoCarousel from './modules/photoCarousel.js';

function testPhotoCarousel() {
  console.log('Testing PhotoCarousel module...');
  
  // Create container
  const container = document.createElement('div');
  document.body.appendChild(container);
  
  // Initialize carousel
  const carousel = new PhotoCarousel({
    container: container,
    onPhotoChange: (index, photo) => {
      console.log(`Photo changed to ${index}: ${photo.name}`);
    }
  });
  
  // Test setting photos
  const photos = [
    { url: 'test1.jpg', name: 'Test 1' },
    { url: 'test2.jpg', name: 'Test 2' },
    { url: 'test3.jpg', name: 'Test 3' }
  ];
  carousel.setPhotos(photos);
  
  // Test showing the carousel
  carousel.show();
  console.assert(carousel.isVisible(), 'Carousel should be visible');
  
  // Test navigation
  carousel.showNext();
  console.assert(carousel.currentIndex === 1, 'Should advance to next photo');
  
  carousel.showPrevious();
  console.assert(carousel.currentIndex === 0, 'Should go back to previous photo');
  
  // Test hiding
  carousel.hide();
  console.assert(!carousel.isVisible(), 'Carousel should be hidden');
  
  // Clean up
  document.body.removeChild(container);
  
  console.log('PhotoCarousel tests completed');
}

testPhotoCarousel();
```

## Common Testing Issues

Watch out for these common testing issues:

1. **Asynchronous Operations**: Use `async/await` or callbacks for asynchronous tests
2. **DOM Dependencies**: Ensure test DOM elements exist before testing
3. **Browser Differences**: Test in multiple browsers
4. **CSS Isolation**: CSS modules should not affect each other
5. **Module Dependencies**: Mock dependencies when testing individual modules
6. **Performance Testing**: Test with realistic data volumes

## Test Documentation

When writing tests, document:

1. **Purpose**: What aspect is being tested
2. **Setup**: Required environment and initial conditions
3. **Actions**: Steps to execute
4. **Expected Results**: What should happen
5. **Cleanup**: How to restore the system after testing

## Conclusion

Testing is essential for maintaining the quality and reliability of PixTrail. By testing both individual modules and their integration, you can ensure that changes and extensions work correctly without breaking existing functionality.

Remember to test across different browsers, screen sizes, and with various inputs to ensure a robust application.