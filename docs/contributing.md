# Contributing to PixTrail

Thank you for your interest in contributing to PixTrail! This guide will help you understand the project structure and how to make effective contributions.

## Table of Contents

- [Team](#project-team-and-governance)
- [Getting Started](#getting-started)
- [Development Environment](#development-environment)
- [Code Organization](#code-organization)
- [Making Contributions](#making-contributions)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)

## Project Team & Governance

PixTrail is developed and maintained by a small dedicated team:

### Core Team

| Name           | Role                                     | Responsibilities                                                 |
|----------------|------------------------------------------|------------------------------------------------------------------|
| Suki Tsubaki   | Founder & Lead Developer                 | Project direction, web interface design, core Python development |
| Yuki Shimizu   | Documentation Specialist                 | Documentation, tutorials, user guides                            |
| Keisuke Tanaka | Quality Assurance & JavaScript Developer | Code review, quality standards, JavaScript components            |

### Team Responsibilities

Our team members focus on specific areas of the project:

- **Suki Tsubaki** initiated PixTrail and leads the development of both the web interface and the Python backend. She reviews pull requests related to core functionality and makes final decisions on feature implementations.

- **Yuki Shimizu** oversees the documentation system and ensures that all features are properly documented. If you're contributing documentation improvements, Yuki will review your pull requests.

- **Keisuke Tanaka** manages our quality assurance process and is responsible for the JavaScript components. He conducts final reviews before releases and maintains our testing framework.

### Getting in Touch with the Team

If you have specific questions for team members:

- For questions about core functionality or project direction: Tag @sukitsubaki in GitHub issues
- For documentation-related questions: Tag @radanana in GitHub issues
- For quality assurance or JavaScript questions: Tag @neoneko87 in GitHub issues

We encourage community contributions and are happy to provide guidance as you work on improvements to PixTrail.

## Getting Started

Before contributing to PixTrail, please:

1. **Read the documentation**: Familiarize yourself with the existing documentation, especially the [Architecture Overview](architecture.md) and [Module Structure](development/module-structure.md).

2. **Check existing issues**: See if someone has already reported the bug or requested the feature you're thinking about.

3. **Discuss major changes**: For significant changes, open an issue first to discuss your ideas with the maintainers.

## Development Environment

### Prerequisites

- Python 3.6 or newer
- Node.js and npm (for JavaScript linting)
- Git

### Setting Up

1. **Fork the repository**:
   - Go to the [PixTrail GitHub repository](https://github.com/sukitsubaki/pixtrail)
   - Click the "Fork" button in the upper right corner

2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR-USERNAME/pixtrail.git
   cd pixtrail
   ```

3. **Create a virtual environment**:
   ```bash
   python -m venv venv
   # On Windows
   venv\Scripts\activate
   # On macOS/Linux
   source venv/bin/activate
   ```

4. **Install development dependencies**:
   ```bash
   pip install -e ".[dev,web]"
   ```

5. **Set up pre-commit hooks** (optional but recommended):
   ```bash
   pre-commit install
   ```

## Code Organization

PixTrail follows a modular architecture that separates concerns and improves maintainability.

### Python Code Structure

```
pixtrail/
├── __init__.py
├── __main__.py
├── cli.py                 # Command-line interface
├── core.py                # Core functionality
├── exif_reader.py         # EXIF metadata extraction
├── gpx_generator.py       # GPX file generation
├── utils.py               # General utilities
└── web/                   # Web interface
    ├── __init__.py
    ├── routes.py          # API routes
    ├── server.py          # Web server
    ├── static/            # Static assets
    └── templates/         # HTML templates
```

### JavaScript Modules

The JavaScript code is organized into the following categories:

1. **API Client** (`static/js/api/`)
   - Contains modules for server communication
   - `apiClient.js` handles all API requests

2. **Feature Modules** (`static/js/modules/`)
   - Each module encapsulates a specific feature
   - Examples: `mapVisualization.js`, `fileUpload.js`, `statistics.js`

3. **Utilities** (`static/js/utils/`)
   - Provides shared functionality across modules
   - Examples: `domHelpers.js`, `fileUtils.js`, `gpsUtils.js`

4. **Main Application** (`static/js/main.js`)
   - Application entry point
   - Initializes and orchestrates all modules

### CSS Structure

The CSS follows a similar modular approach:

1. **Base Styles** (`static/css/base/`)
   - Foundational styles that apply globally
   - `reset.css`, `typography.css`, `variables.css`

2. **Layout Styles** (`static/css/layouts/`)
   - Define the overall page structure
   - `container.css`, `grid.css`

3. **Module Styles** (`static/css/modules/`)
   - Component-specific styles in individual files
   - Examples: `map-section.css`, `file-upload.css`

4. **Main CSS** (`static/css/main.css`)
   - Imports all modules in the correct order

## Making Contributions

### Types of Contributions

We welcome several types of contributions:

1. **Bug fixes**: Fixes for issues in the existing codebase
2. **Feature additions**: New features that enhance the application
3. **Performance improvements**: Changes that make the code faster or more efficient
4. **Documentation**: Improvements to the documentation
5. **UI/UX enhancements**: Visual and user experience improvements

### Workflow

1. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```

2. **Make your changes**: Implement the bug fix or feature

3. **Run tests**: Ensure all tests pass
   ```bash
   pytest
   ```

4. **Write your own tests**: Add tests for your changes

5. **Update documentation**: Update relevant documentation files

6. **Commit your changes** with descriptive messages:
   ```bash
   git commit -m "Add feature: brief description"
   ```

7. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Create a pull request** from your fork to the main repository

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

1. Create a new file in the appropriate directory (`static/css/modules/` for components)
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

### Adding a New Python Feature

1. Determine if the feature belongs in an existing module or deserves a new one
2. Follow the architectural patterns established in the codebase
3. Add comprehensive docstrings and type hints
4. Write unit tests for your new functionality

Example Python module structure:

```python
"""
Module: my_feature.py
Description of what this module does
"""

import os
from typing import Dict, List, Optional

class MyFeature:
    """Main class for implementing my feature."""
    
    def __init__(self, config: Optional[Dict] = None):
        """
        Initialize the feature.
        
        Args:
            config: Optional configuration dictionary
        """
        self.config = config or {}
        # Initialize properties
    
    def process(self, data: List[Dict]) -> Dict:
        """
        Process the provided data.
        
        Args:
            data: Data to process
            
        Returns:
            Dictionary containing processed results
        """
        # Process data
        result = {}
        # Implementation
        return result
```

## Coding Standards

### Python

- Follow [PEP 8](https://www.python.org/dev/peps/pep-0008/) style guide
- Include docstrings for all modules, classes, and functions ([PEP 257](https://www.python.org/dev/peps/pep-0257/))
- Use type hints where appropriate ([PEP 484](https://www.python.org/dev/peps/pep-0484/))
- Write clean, readable code with descriptive variable names
- Keep functions focused on a single responsibility
- Use meaningful variable and function names
- Limit line length to 100 characters

### JavaScript

- Use ES6+ features
- Follow consistent indentation (2 spaces)
- Include JSDoc comments for all functions and methods
- Use `const` for variables that don't need to be reassigned
- Use `let` for variables that need reassignment
- Avoid global variables
- Use camelCase for variables and functions
- Use PascalCase for classes
- Use descriptive variable and function names

### CSS

- Use the BEM naming convention for classes
- Use CSS variables for colors, spacing, etc.
- Keep selectors specific to their component
- Organize properties logically
- Include responsive styles for each component
- Add comments for complex styles

## Testing

### Python Testing

1. Write unit tests using pytest for all new functionality
2. Ensure all tests pass before submitting a pull request
3. Test structure should follow the same structure as the code
4. Use descriptive test names
5. Use fixtures where appropriate

Example test:

```python
import pytest
from pixtrail.my_feature import MyFeature

def test_my_feature_initialization():
    """Test that MyFeature initializes correctly."""
    feature = MyFeature()
    assert feature.config == {}
    
    feature = MyFeature({"option": "value"})
    assert feature.config == {"option": "value"}

def test_my_feature_processing():
    """Test that MyFeature processes data correctly."""
    feature = MyFeature()
    data = [{"field": "value"}]
    result = feature.process(data)
    assert "processed_field" in result
    assert result["processed_field"] == "expected_value"
```

### JavaScript Testing

1. Test JavaScript modules with Jest or similar framework
2. Focus on testing the public API of each module
3. Use mocks and stubs for external dependencies
4. Include both unit and integration tests

Example test:

```javascript
import MyFeature from '../modules/myFeature.js';

describe('MyFeature', () => {
  let myFeature;
  let mockConfig;
  
  beforeEach(() => {
    mockConfig = {
      container: document.createElement('div')
    };
    myFeature = new MyFeature(mockConfig);
  });
  
  test('initializes correctly', () => {
    expect(myFeature.config).toBe(mockConfig);
  });
  
  test('publicMethod returns expected value', () => {
    const result = myFeature.publicMethod('test');
    expect(result).toBe(true);
  });
});
```

## Documentation

Documentation is a crucial part of PixTrail. When adding new features:

1. Update or create relevant documentation files
2. Add comprehensive docstrings to Python code
3. Add JSDoc comments to JavaScript code
4. Include examples of how to use the new feature
5. Update any diagrams or architecture documentation if necessary

### Documentation Structure

- `README.md`: Main project overview
- `/docs/`: Technical documentation
  - `architecture.md`: Architectural overview
  - `api/`: API documentation
  - `development/`: Development guidelines
  - `tutorials/`: User tutorials

## Pull Request Process

1. **Ensure your code meets all requirements**:
   - Tests pass
   - Documentation is updated
   - Code follows style guidelines

2. **Create a clear pull request description**:
   - Explain the purpose of the changes
   - Reference any related issues
   - Describe how to test the changes
   - Mention any significant design decisions

3. **Review process**:
   - A maintainer will review your code
   - Address any feedback or requested changes
   - Tests will be run automatically

4. **Approval and merge**:
   - Once approved, a maintainer will merge your changes
   - Your contribution will become part of PixTrail!

### Pull Request Title Format

Use descriptive titles that indicate the type of change:

- `Fix: Description of the bug fix`
- `Feature: Description of the new feature`
- `Docs: Description of documentation changes`
- `Refactor: Description of code refactoring`
- `Test: Description of test additions/changes`
- `Perf: Description of performance improvements`

## Issue Guidelines

### Reporting Bugs

When reporting a bug, please include:

1. **Description**: Clear and concise description of the bug
2. **Steps to reproduce**: Detailed steps to reproduce the issue
3. **Expected behavior**: What you expected to happen
4. **Actual behavior**: What actually happened
5. **Screenshots/logs**: If applicable
6. **Environment**: OS, Python version, browser, etc.
7. **Additional context**: Any other relevant information

### Feature Requests

When suggesting a feature, please include:

1. **Description**: Clear and concise description of the feature
2. **Problem**: The problem this feature would solve
3. **Proposed solution**: How you envision the feature working
4. **Alternatives**: Any alternative solutions you've considered
5. **Additional context**: Any other relevant information

## Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please be respectful and considerate of others when participating in this project.

## Recognition

Contributors will be acknowledged in the project's README and/or CONTRIBUTORS file.

Thank you for contributing to PixTrail!
