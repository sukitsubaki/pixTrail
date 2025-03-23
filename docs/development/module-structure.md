# PixTrail Module Structure

This document explains the modular architecture of PixTrail's JavaScript and CSS codebase for developers who want to understand, maintain, or extend the application.

## JavaScript Module Structure

The JavaScript code is organized into a modular structure that emphasizes separation of concerns and reusability. Each module focuses on a specific functionality, has clear dependencies, and provides a well-defined public API.

### Directory Structure

```
js/
├── api/                    # API communication modules
│   └── apiClient.js        # Handles server communication
├── modules/                # Feature modules
│   ├── charts.js           # Chart creation and management
│   ├── clustering.js       # Map marker clustering
│   ├── dragAndDrop.js      # File drag and drop functionality
│   ├── exifReader.js       # Extract EXIF metadata
│   ├── fileUpload.js       # File upload handling
│   ├── heatmap.js          # Heatmap visualization
│   ├── mapVisualization.js # Map display and manipulation
│   └── statistics.js       # Statistics calculations and display
├── utils/                  # Utility functions
│   ├── domHelpers.js       # DOM manipulation utilities
│   ├── fileUtils.js        # File handling utilities
│   ├── gpsUtils.js         # GPS data processing utilities
│   └── uiUtils.js          # UI helper functions
└── main.js                 # Main application entry point
```

### Module Types

1. **API Modules**: Handle communication with the server
   - `apiClient.js`: Provides methods for all server interactions

2. **Feature Modules**: Implement specific application features
   - Use class-based approach with constructor for initialization
   - Provide public methods for interaction
   - Handle their own internal state

3. **Utility Modules**: Provide shared functionality
   - Typically export a collection of related functions
   - Focus on a specific domain (DOM, files, GPS, UI)
   - Stateless to promote reusability

4. **Main Application**: Orchestrates the modules
   - Initializes all modules
   - Manages application state
   - Handles cross-module communication

### Dependency Management

Modules declare their dependencies explicitly using ES6 import/export syntax:

```javascript
// Example from heatmap.js
import DOMHelpers from '../utils/domHelpers.js';
import UIUtils from '../utils/uiUtils.js';

class Heatmap {
    // Implementation
}

export default Heatmap;
```

The dependency graph is designed to avoid circular dependencies and minimize coupling between modules.

## CSS Module Structure

The CSS is similarly modularized to improve maintainability and organization.

### Directory Structure

```
css/
├── base/                   # Base styles
│   ├── reset.css           # CSS reset
│   ├── typography.css      # Typography styles
│   └── variables.css       # CSS variables (colors, sizes, etc.)
├── layouts/                # Layout styles
│   ├── container.css       # Container layout
│   └── grid.css            # Grid layouts
├── modules/                # Feature-specific styles
│   ├── buttons.css         # Button styles
│   ├── dropdown.css        # Dropdown menu styles
│   ├── forms.css           # Form element styles
│   ├── header.css          # Header styles
│   ├── footer.css          # Footer styles
│   ├── map-section.css     # Map section styles
│   ├── photo-section.css   # Photo upload section styles
│   ├── statistics-section.css # Statistics section styles
│   ├── status-messages.css # Status message styles
│   └── utilities.css       # Utility classes
└── main.css                # Main CSS file that imports all modules
```

### CSS Module Types

1. **Base Styles**: Foundational styles that apply globally
   - `reset.css`: Normalizes browser differences
   - `typography.css`: Text styles
   - `variables.css`: CSS custom properties for theming

2. **Layout Styles**: Define the page structure
   - `container.css`: Main content container
   - `grid.css`: Grid and flexbox layouts

3. **Module Styles**: Component-specific styles
   - Each file corresponds to a UI component or section
   - Follows BEM-like naming conventions
   - Encapsulates styling for a specific feature

4. **Main CSS**: Imports all modules
   - Controls the import order to manage specificity
   - Entry point for the entire CSS system

### CSS Variables

The `variables.css` file defines custom properties used throughout the application:

```css
:root {
    /* Color palette */
    --primary-color: #3498db;
    --primary-dark: #2980b9;
    
    /* Spacing */
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    
    /* Other variables */
    /* ... */
}
```

These variables are used in all modules to ensure consistent styling and make theming easier.

## Adding New Modules

### Adding a JavaScript Module

1. Create a new file in the appropriate directory
2. Use ES6 imports to declare dependencies
3. Implement your feature using a class or function approach
4. Export your module
5. Import and initialize it in `main.js`

Example:

```javascript
// js/modules/newFeature.js
import DOMHelpers from '../utils/domHelpers.js';

class NewFeature {
    constructor(config) {
        this.config = config;
        this.init();
    }
    
    init() {
        // Initialization code
    }
    
    // Public methods
}

export default NewFeature;

// In main.js
import NewFeature from './modules/newFeature.js';

// Initialize with the application
this.newFeature = new NewFeature({
    // Configuration
});
```

### Adding a CSS Module

1. Create a new CSS file in the appropriate directory
2. Use CSS variables for consistent styling
3. Focus on a single component or feature
4. Add your import to `main.css`

Example:

```css
/* css/modules/new-feature.css */
.new-feature {
    background-color: var(--bg-light);
    padding: var(--spacing-md);
    border-radius: var(--border-radius-sm);
}

.new-feature__title {
    color: var(--primary-color);
    margin-bottom: var(--spacing-sm);
}

/* In main.css */
@import 'modules/new-feature.css';
```

## Best Practices

1. **Single Responsibility**: Each module should focus on a single feature or concern
2. **Explicit Dependencies**: Declare all dependencies using imports
3. **Encapsulation**: Use private methods/properties for internal implementation
4. **Consistent Naming**: Follow the established naming conventions
5. **Documentation**: Use JSDoc comments for all public methods
6. **Avoid Global State**: Keep state within modules when possible
7. **Event-Based Communication**: Use events for loose coupling between modules
8. **CSS Scoping**: Prefix CSS classes to avoid conflicts between modules

## Related Documentation

- [Architecture Overview](../architecture.md)
- [Contributing Guide](../contributing.md)
- [API Documentation](../api/index.md)
- [Tutorial: Extending Modules](../tutorials/extending-modules.md)