# PixTrail CSS Architecture

This document explains the CSS architecture of PixTrail, focusing on its modular structure, naming conventions, and best practices for extending the styling.

## Overview

PixTrail uses a modular CSS approach with separate files for different components and concerns. This architecture provides several benefits:

- **Maintainability**: Smaller files are easier to understand and maintain
- **Organization**: Clear structure makes it easier to locate styles
- **Reusability**: Common styles are abstracted and reused
- **Scalability**: New styles can be added without affecting existing ones

## Directory Structure

The CSS is organized into a hierarchical structure:

```
css/
├── base/                   # Base styles
│   ├── reset.css           # Resets browser defaults
│   ├── typography.css      # Text and font styles
│   └── variables.css       # CSS variables for theming
├── layouts/                # Layout styles
│   ├── container.css       # Main container styles
│   └── grid.css            # Grid and flexbox layouts
├── modules/                # Component-specific styles
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

## Import System

All CSS modules are imported in `main.css` in a specific order to manage the cascade and specificity:

```css
/* Base styles first */
@import 'base/variables.css';
@import 'base/reset.css';
@import 'base/typography.css';

/* Layouts next */
@import 'layouts/container.css';
@import 'layouts/grid.css';

/* Modules last */
@import 'modules/header.css';
@import 'modules/footer.css';
/* Other modules... */
@import 'modules/utilities.css';
```

The import order is important because:
1. Variables need to be available first
2. Reset styles provide a consistent foundation
3. Layout styles define the overall page structure
4. Module styles build on top of the foundation
5. Utility classes come last to override other styles when needed

## CSS Variables

PixTrail uses CSS custom properties (variables) extensively for theming and consistency. These are defined in `variables.css`:

```css
:root {
    /* Color palette */
    --primary-color: #3498db;
    --primary-dark: #2980b9;
    --secondary-color: #2ecc71;
    --tertiary-color: #f39c12;
    
    /* Text colors */
    --text-color: #333;
    --text-light: #666;
    --text-muted: #999;
    
    /* Background colors */
    --bg-light: #f8f9fa;
    --bg-medium: #f4f4f4;
    --bg-dark: #eaeaea;
    
    /* Border colors */
    --border-light: #ddd;
    --border-medium: #ccc;
    --border-dark: #aaa;
    
    /* Status colors */
    --error-color: #e74c3c;
    --success-color: #2ecc71;
    --warning-color: #f39c12;
    --info-color: #3498db;
    
    /* Spacing */
    --spacing-xs: 0.25rem;  /* 4px */
    --spacing-sm: 0.5rem;   /* 8px */
    --spacing-md: 1rem;     /* 16px */
    --spacing-lg: 1.5rem;   /* 24px */
    --spacing-xl: 2rem;     /* 32px */
    
    /* Font sizes */
    --font-size-xs: 0.75rem;   /* 12px */
    --font-size-sm: 0.875rem;  /* 14px */
    --font-size-md: 1rem;      /* 16px */
    --font-size-lg: 1.25rem;   /* 20px */
    --font-size-xl: 1.5rem;    /* 24px */
    
    /* Border radius */
    --border-radius-sm: 4px;
    --border-radius-md: 8px;
    --border-radius-lg: 12px;
    
    /* Shadows */
    --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
    --shadow-md: 0 2px 10px rgba(0, 0, 0, 0.05);
    --shadow-lg: 0 5px 15px rgba(0, 0, 0, 0.1);
    
    /* Transitions */
    --transition-fast: 0.2s;
    --transition-medium: 0.3s;
    --transition-slow: 0.5s;
    
    /* Z-index layers */
    --z-index-dropdown: 1000;
    --z-index-modal: 2000;
    --z-index-tooltip: 3000;
}
```

Using these variables ensures consistency throughout the application and makes theming easier.

## Naming Conventions

PixTrail uses a modified BEM (Block, Element, Modifier) naming convention:

- **Blocks**: Main components (`.map-section`, `.button`, `.dropdown`)
- **Elements**: Parts of a block (`.map-section__title`, `.button__icon`)
- **Modifiers**: Variations of blocks or elements (`.button--primary`, `.status-message--error`)

Example:

```css
/* Block */
.photo-section {
    background-color: white;
    border-radius: var(--border-radius-md);
    padding: var(--spacing-md);
}

/* Element */
.photo-section__title {
    color: var(--primary-color);
    margin-bottom: var(--spacing-sm);
}

/* Modifier */
.photo-section--compact {
    padding: var(--spacing-sm);
}
```

## Module Structure

Each CSS module focuses on a specific component or concern. Here's the typical structure of a module file:

```css
/**
 * PixTrail - Component Name
 * Brief description of the component
 */

/* Main component styles */
.component {
    /* Base styles */
}

/* Component elements */
.component__header {
    /* Element styles */
}

.component__body {
    /* Element styles */
}

.component__footer {
    /* Element styles */
}

/* Component modifiers */
.component--large {
    /* Modifier styles */
}

.component--small {
    /* Modifier styles */
}

/* States */
.component.is-active {
    /* State styles */
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .component {
        /* Mobile styles */
    }
}
```

## Utility Classes

For common styling patterns, PixTrail provides utility classes in `utilities.css`:

```css
/* Visibility */
.hidden { display: none !important; }
.invisible { visibility: hidden !important; }

/* Spacing */
.mt-1 { margin-top: var(--spacing-xs); }
.mt-2 { margin-top: var(--spacing-sm); }
/* More spacing utilities... */

/* Text alignment */
.text-left { text-align: left; }
.text-center { text-align: center; }
.text-right { text-align: right; }

/* More utilities... */
```

These utilities help avoid repetition and provide a consistent way to apply common styles.

## Responsive Design

PixTrail uses a mobile-first approach with media queries for larger screens:

```css
/* Base styles (mobile first) */
.component {
    width: 100%;
    padding: var(--spacing-sm);
}

/* Tablet and desktop adjustments */
@media (min-width: 768px) {
    .component {
        padding: var(--spacing-md);
        display: flex;
    }
}
```

Media queries are included within each component's CSS rather than in separate files to keep related styles together.

## Adding New Styles

To add styles for a new feature:

1. Determine if the styles fit into an existing module
2. If not, create a new CSS file in the appropriate directory
3. Follow the naming conventions and file structure
4. Import the new file in `main.css`

Example for a new component:

```css
/**
 * PixTrail - New Feature
 * Styles for the new feature component
 */

.new-feature {
    background-color: var(--bg-light);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-md);
    margin-bottom: var(--spacing-md);
}

.new-feature__title {
    color: var(--primary-color);
    margin-bottom: var(--spacing-sm);
}

.new-feature__content {
    display: flex;
    gap: var(--spacing-sm);
}

@media (max-width: 768px) {
    .new-feature__content {
        flex-direction: column;
    }
}
```

Then import in `main.css`:

```css
/* Add to the appropriate section in main.css */
@import 'modules/new-feature.css';
```

## Best Practices

1. **Use CSS Variables**: Always use variables for colors, spacing, etc.
2. **Follow Naming Conventions**: Use the BEM-style naming for consistency
3. **Mobile-First**: Start with mobile styles and add media queries for larger screens
4. **Component Isolation**: Keep styles for one component in one file
5. **Minimize Nesting**: Keep selectors simple and avoid deep nesting
6. **Comment Your Code**: Add comments for complex or non-obvious styles
7. **Reuse Patterns**: Use utility classes for common patterns
8. **Responsive Testing**: Test styles on various screen sizes
9. **Performance**: Avoid expensive selectors and animations
10. **Maintainability**: Keep files small and focused

## Related Documentation

- [Module Structure](module-structure.md)
- [Architecture Overview](../architecture.md)
- [Contributing Guide](../contributing.md)
