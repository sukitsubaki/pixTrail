# Contributing to PixTrail

Thank you for your interest in contributing to PixTrail! This guide will help you understand the project structure and how to make effective contributions.

## Code Organization

PixTrail follows a modular architecture that separates concerns and improves maintainability. Understanding this structure is essential for effective contributions.

### JavaScript Modules

The JavaScript code is organized into the following categories:

1. **API Client** (`js/api/`)
   - Contains modules for server communication
   - `apiClient.js` handles all API requests

2. **Feature Modules** (`js/modules/`)
   - Each module encapsulates a specific feature
   - Follows a class-based approach with clear public APIs
   - Examples: `charts.js`, `clustering.js`, `heatmap.js`

3. **Utilities** (`js/utils/`)
   - Provides shared functionality across modules
   - Each utility focuses on a specific domain
   - Examples: `domHelpers.js`, `fileUtils.js`, `gpsUtils.js`

4. **Main Application** (`js/main.js`)
   - Application entry point
   - Initializes and orchestrates all modules

### CSS Modules

The CSS is organized in a similar modular fashion:

1. **Base Styles** (`css/base/`)
   - Foundational styles that apply globally
   - `reset.css`, `typography.css`, `variables.css`

2. **Layout Styles** (`css/layouts/`)
   - Define the overall page structure
   - `container.css`, `grid.css`

3. **Module Styles** (`css/modules/`)
   - Component-specific styles in individual files
   - Each file corresponds to a UI component

4. **Main CSS** (`css/main.css`)
   - Imports all modules in the correct order

## Development Guidelines

### Adding a New JavaScript Module

1. Create a new file in the appropriate directory
2. Use ES6 modules with explicit imports/exports
3. Follow the class-based pattern used in existing modules
4. Document your module with JSDoc comments
5. Import and initialize your module in `main.js`

Example module structure:

```javascript
/**
 * MyFeature Module
 * Description of what this module does
 */

import DOMHelpers from '../utils/domHelpers.js';
import UIUtils from '../utils/uiUtils.js';

class MyFeature {
    /**
     * Initialize module
     * @param {Object} config - Configuration options
     */
    constructor(config) {
        this.config = config;
        // Initialize properties
        
        // Call initialization method
        this.init();
    }
    
    /**
     * Initialize event listeners and setup
     */
    init() {
        // Setup code here
    }
    
    /**
     * Public method example
     * @param {string} param - Parameter description
     * @returns {boolean} Result description
     */
    publicMethod(param) {
        // Method implementation
        return true;
    }
}

export default MyFeature;
```

### Adding a New CSS Module

1. Create a new file in the appropriate directory (`css/modules/` for components)
2. Focus on styling a single component or feature
3. Use CSS variables for colors, spacing, etc.
4. Add your file to the imports in `main.css`

Example CSS module:

```css
/**
 * PixTrail - MyFeature Module
 * Styles for the MyFeature component
 */

.my-feature {
    background-color: var(--bg-light);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-md);
    margin-bottom: var(--spacing-xl);
}

.my-feature__title {
    color: var(--primary-color);
    margin-bottom: var(--spacing-sm);
}

.my-feature__content {
    display: flex;
    gap: var(--spacing-md);
}

@media (max-width: 768px) {
    .my-feature__content {
        flex-direction: column;
    }
}
```

## Testing Your Changes

Before submitting a pull request:

1. Test your changes in multiple browsers
2. Ensure responsive design works on different screen sizes
3. Verify that your changes don't break existing functionality
4. Check for console errors

## Submitting Your Contribution

1. Create a new branch for your feature or bug fix
2. Make your changes following the guidelines above
3. Update relevant documentation
4. Submit a pull request with a clear description of your changes

## Documentation

When adding new features, please update the relevant documentation:

1. Add JSDoc comments to all new functions and methods
2. Update the appropriate documentation files in the `docs/` directory
3. If you've added a major feature, consider adding a new tutorial

## Code Style

- Use ES6+ features where appropriate
- Follow consistent indentation (2 spaces)
- Use meaningful variable and function names
- Keep functions focused on a single responsibility
- Favor composition over inheritance

Thank you for contributing to PixTrail!