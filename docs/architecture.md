# PixTrail Architecture

This document provides an overview of the PixTrail application architecture, focusing on its modular structure and component interactions.

## Overview

PixTrail is built using a modular architecture that separates concerns and promotes code reusability. The application follows a client-side architecture with the following key components:

- **Core Application Logic**: Handles the main application flow and orchestrates the different modules
- **UI Components**: Modular components for different UI sections (map, statistics, file upload)
- **API Client**: Manages communication with the backend server
- **Utility Functions**: Reusable utilities for common operations

## Directory Structure

```
static/
├── css/
│   ├── base/               # Base CSS styles
│   │   ├── reset.css       # CSS reset
│   │   ├── typography.css  # Typography styles
│   │   └── variables.css   # CSS variables
│   ├── layouts/            # Layout styles
│   │   ├── container.css   # Container styles
│   │   └── grid.css        # Grid layouts
│   ├── modules/            # Feature-specific styles
│   │   ├── buttons.css
│   │   ├── dropdown.css
│   │   ├── forms.css
│   │   ├── header.css
│   │   ├── map-section.css
│   │   └── ...
│   └── main.css            # Main CSS file importing all modules
├── js/
│   ├── api/                     # API communication
│   │   └── apiClient.js         # Client for server API calls
│   ├── modules/                 # Feature modules
│   │   ├── charts.js            # Chart creation and management
│   │   ├── clustering.js        # Marker clustering
│   │   ├── dragAndDrop.js       # Drag and drop file handling
│   │   ├── exifReader.js        # EXIF metadata extraction
│   │   ├── fileUpload.js        # File upload handling
│   │   ├── heatmap.js           # Heatmap visualization
│   │   ├── mapVisualization.js  # Map display and controls
│   │   └── statistics.js        # Statistics calculations and display
│   ├── utils/                   # Utility functions
│   │   ├── domHelpers.js        # DOM manipulation helpers
│   │   ├── fileUtils.js         # File handling utilities
│   │   ├── gpsUtils.js          # GPS data utilities
│   │   └── uiUtils.js           # UI helper functions
│   └── main.js                  # Application entry point
```

## Module Relationships

The application follows a composition-based architecture where the main application (`main.js`) instantiates and composes the various modules:

1. **Main Application** (`main.js`)
   - Initializes all modules
   - Manages application state
   - Handles event routing between modules

2. **API Client** (`apiClient.js`)
   - Handles all server communication
   - Provides methods for file submission, processing, and GPX file creation
   - Manages server-side session data

3. **Feature Modules**
   - Each module encapsulates a specific feature (maps, statistics, etc.)
   - Modules expose a clean public API but hide implementation details
   - Modules can interact with each other through the main application

4. **Utilities**
   - Provide shared functionality used across multiple modules
   - Focus on a single responsibility (DOM, files, GPS, UI)

## CSS Architecture

The CSS follows a similar modular approach:

1. **Base Styles**
   - CSS reset for consistent rendering
   - Typography styles for text elements
   - CSS variables for consistent theming

2. **Layout Styles**
   - Container and grid layouts
   - Responsive behavior

3. **Module Styles**
   - Component-specific styles isolated in individual files
   - Each module focuses on a single component

4. **Main CSS**
   - Imports all modules in the correct order
   - Manages potential style conflicts

## Module Communication

Modules communicate through:

1. **Direct method calls**: When modules are explicitly dependent on each other
2. **Callbacks**: For asynchronous operations and event handling
3. **Event delegation**: For looser coupling between components

## Extending the Application

To add a new feature to PixTrail:

1. Create a new JavaScript module in the appropriate directory
2. Create corresponding CSS styles in a new module file
3. Import the CSS module in `main.css`
4. Initialize the new module in `main.js`
5. Update the documentation to reflect the new feature

See the [Contributing Guide](contributing.md) for more detailed information on development practices.
