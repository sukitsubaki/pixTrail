# PixTrail Architecture

This document provides an overview of the PixTrail application architecture, focusing on its modular design, component interactions, and the reasoning behind key architectural decisions.

## Architectural Overview

PixTrail follows a modular architecture with a clear separation of concerns. The application consists of two main components:

1. **Python Backend**: Handles file processing, EXIF data extraction, and GPX file generation
2. **JavaScript Frontend**: Provides the web interface with interactive maps and visualizations

The architecture follows these key principles:
- **Modularity**: Components have specific responsibilities and can be developed/tested independently
- **Reusability**: Common functionality is extracted into utility modules
- **Extensibility**: New features can be added without modifying existing code
- **Progressive Enhancement**: Core functionality works via command line, while the web interface provides enhanced features

## System Components

### Core Components

```
                 ┌─────────────────┐
                 │  Command Line   │
                 │   Interface     │
                 └────────┬────────┘
                          │
                          ▼
┌─────────────────┐    ┌──────────────────┐
│  Web Interface  │◄───►│    Core API     │
└────────┬────────┘    └──────────┬───────┘
         │                        │
         ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ UI Components   │    │  EXIF Reader     │◄───►│  Image Files   │
│ - Map           │    │  GPX Generator   │    └─────────────────┘
│ - Visualizations│    │  File Utilities  │
└─────────────────┘    └──────────────────┘
```

### Backend Architecture

The Python backend follows a layered architecture:

1. **Interface Layer**: Command-line interface and web server
2. **Core Layer**: Main application logic (PixTrail class)
3. **Service Layer**: Specialized services (EXIF reading, GPX generation)
4. **Utility Layer**: Shared functionality (file handling, GPS calculations)

```
┌───────────────────────────────────────────────────┐
│                 Interface Layer                   │
│  ┌─────────────────┐       ┌──────────────────┐   │
│  │ CLI (cli.py)    │       │ Web Server       │   │
│  └─────────────────┘       └──────────────────┘   │
└───────────────────────────────────────────────────┘
                │                     │
                ▼                     ▼
┌───────────────────────────────────────────────────┐
│                  Core Layer                       │
│  ┌─────────────────────────────────────────────┐  │
│  │            PixTrail Class (core.py)         │  │
│  └─────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────┘
                │                     │
                ▼                     ▼
┌───────────────────────────────────────────────────┐
│                 Service Layer                     │
│  ┌─────────────────┐       ┌──────────────────┐   │
│  │ EXIF Reader     │       │ GPX Generator    │   │
│  └─────────────────┘       └──────────────────┘   │
└───────────────────────────────────────────────────┘
                │                     │
                ▼                     ▼
┌───────────────────────────────────────────────────┐
│                 Utility Layer                     │
│  ┌─────────────────┐       ┌──────────────────┐   │
│  │ File Utils      │       │ Path Utils       │   │
│  └─────────────────┘       └──────────────────┘   │
│  ┌─────────────────┐       ┌──────────────────┐   │
│  │ GPS Utils       │       │ Date/Time Utils  │   │
│  └─────────────────┘       └──────────────────┘   │
└───────────────────────────────────────────────────┘
```

### Frontend Architecture

The JavaScript frontend follows a modular component-based architecture:

1. **Main Application**: Initializes and coordinates all modules
2. **API Client**: Handles communication with the backend server
3. **Feature Modules**: Implement specific UI features (map, heatmap, statistics)
4. **Utility Modules**: Provide shared functionality (DOM helpers, file utilities)

```
┌─────────────────────────────────────────────────────────────┐
│                   Main Application (main.js)                │
└───────────────────────────────┬─────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────┐
│                       Core Modules                           │
│  ┌─────────────────┐  ┌──────────────────┐  ┌──────────────┐ │
│  │ API Client      │  │ Map Visualization │  │ File Upload  │ │
│  └─────────────────┘  └──────────────────┘  └──────────────┘ │
└──────────────────────────────────────────────────────────────┘
                                │
        ┌─────────────────────┬─┴────────────────┐
        ▼                     ▼                  ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ Feature Modules  │  │ Feature Modules  │  │ Feature Modules  │
│ - Heatmap        │  │ - Statistics     │  │ - Clustering     │
│ - Charts         │  │ - EXIF Reader    │  │ - Drag & Drop    │
└──────────────────┘  └──────────────────┘  └──────────────────┘
        │                     │                      │
        └─────────────────────┼──────────────────────┘
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                       Utility Modules                        │
│  ┌─────────────────┐  ┌──────────────────┐  ┌──────────────┐ │
│  │ DOM Helpers     │  │ File Utilities   │  │ GPS Utils    │ │
│  └─────────────────┘  └──────────────────┘  └──────────────┘ │
│  ┌─────────────────┐  ┌──────────────────┐                   │
│  │ UI Utilities    │  │ Date/Time Utils  │                   │
│  └─────────────────┘  └──────────────────┘                   │
└──────────────────────────────────────────────────────────────┘
```

## Module Structure

### Backend Module Structure

The Python backend consists of the following key modules:

- **core.py**: Main PixTrail class with high-level functionality
- **exif_reader.py**: EXIF metadata extraction from image files
- **gpx_generator.py**: GPX file creation from GPS data
- **cli.py**: Command-line interface
- **web/**: Web server and API endpoints
- **utils/**: Utility functions (file, path, GPS calculations)

### Frontend Module Structure

The JavaScript frontend is organized into:

- **main.js**: Application entry point and initialization
- **api/apiClient.js**: Communication with the backend server
- **modules/**: Feature modules
  - **mapVisualization.js**: Map display and controls
  - **fileUpload.js**: File selection and uploading
  - **exifReader.js**: Browser-based EXIF extraction
  - **statistics.js**: Route statistics calculation
  - **heatmap.js**: Heatmap visualization
  - **clustering.js**: Marker clustering
  - **charts.js**: Chart creation and management
  - **dragAndDrop.js**: Drag and drop file handling
- **utils/**: Utility modules
  - **domHelpers.js**: DOM manipulation utilities
  - **fileUtils.js**: File handling utilities
  - **gpsUtils.js**: GPS data utilities
  - **uiUtils.js**: UI helper functions

## Data Flow

### Command-Line Data Flow

```
┌───────────────┐     ┌────────────┐     ┌───────────────┐
│ Photos Dir    │────►│ EXIF Reader│────►│ GPS Data      │
└───────────────┘     └────────────┘     └───────┬───────┘
                                                 │
                                                 ▼
                                          ┌───────────────┐
                                          │GPX Generator  │
                                          └───────┬───────┘
                                                 │
                                                 ▼
                                          ┌───────────────┐
                                          │ GPX File      │
                                          └───────────────┘
```

### Web Interface Data Flow

#### Server-Based Processing

```
┌───────────────┐    ┌────────────┐    ┌───────────────┐    ┌────────────┐
│ Upload Photos │───►│ Web Server │───►│ EXIF Reader   │───►│ GPS Data   │
└───────────────┘    └────────────┘    └───────────────┘    └─────┬──────┘
                           ▲                                      │
                           │                                      ▼
┌───────────────┐    ┌─────┴──────┐    ┌───────────────┐    ┌────────────┐
│ Map Display   │◄───┤ API Client │◄───┤ GPX Generator │◄───┤ Process    │
└───────────────┘    └────────────┘    └───────────────┘    └────────────┘
```

#### Browser-Based Processing

```
┌───────────────┐    ┌────────────┐    ┌───────────────┐
│ Select Photos │───►│Browser EXIF│───►│ GPS Data      │
└───────────────┘    │ Processing │    └───────┬───────┘
                     └────────────┘            │
                                               ▼
┌───────────────┐                       ┌───────────────┐
│ Map Display   │◄──────────────────────┤ Visualize     │
└───┬───────────┘                       └───────────────┘
    │
    ▼
┌───────────────┐    ┌────────────┐    ┌───────────────┐
│ Download GPX  │───►│ API Client │───►│ GPX Generator │
└───────────────┘    └────────────┘    └───────────────┘
```

## Key Architectural Decisions

### 1. Hybrid Processing Model

**Decision**: Implement a hybrid model with server-side processing for complex formats and client-side processing for JPEG/TIFF.

**Rationale**:
- Server-side processing supports all image formats including RAW
- Client-side processing improves privacy and performance for common formats
- Hybrid approach balances versatility, performance, and user experience

### 2. Modular Component Architecture

**Decision**: Organize the codebase into modular components with clear responsibilities.

**Rationale**:
- Easier maintenance as components can be updated independently
- Better testability with isolated components
- Facilitates collaborative development
- Enables feature extensions without modifying existing code

### 3. Progressive Enhancement

**Decision**: Implement core functionality as a command-line tool with optional web interface.

**Rationale**:
- Command-line interface works in all environments
- Web interface provides enhanced user experience when available
- Enables integration with scripts and automation
- Supports headless operation for batch processing

### 4. Local-First Approach

**Decision**: Process all data locally without external services.

**Rationale**:
- Respects user privacy by keeping data on their device
- Works offline without internet requirements
- No dependency on external APIs that could change or be discontinued
- Faster processing without network latency

### 5. Separation of Data Processing and Visualization

**Decision**: Separate the data processing logic from visualization components.

**Rationale**:
- Allows processing to work independently of visualization
- Enables different visualization approaches using the same processed data
- Better organization of codebase
- Clearer separation of concerns

## Technology Stack

### Backend

- **Python 3.6+**: Core language for backend functionality
- **exifread / Pillow**: EXIF metadata extraction
- **gpxpy**: GPX file creation and manipulation
- **Flask**: Web server for the web interface
- **argparse**: Command-line argument parsing

### Frontend

- **JavaScript (ES6+)**: Core language for frontend functionality
- **Leaflet**: Interactive maps
- **Chart.js**: Statistical charts and visualizations
- **Leaflet.heat**: Heatmap visualization
- **Leaflet.markercluster**: Marker clustering
- **EXIF.js**: Client-side EXIF extraction

## Security Considerations

### File Handling

- Temporary files are automatically cleaned up
- File paths are sanitized to prevent directory traversal
- File type detection uses content inspection, not just extensions

### Web Interface

- Web server only accepts connections from localhost by default
- No external API dependencies or data sharing
- Explicitly allowed file extensions
- Rate limiting for file uploads

## Performance Considerations

### Large File Handling

- Progressive file uploads with progress tracking
- Memory-efficient processing for large RAW files
- Streaming processing for large collections
- Asynchronous processing to avoid blocking the UI

### Map Visualization

- Marker clustering for better performance with many points
- On-demand loading of advanced features
- Optimized track rendering for complex routes
- Efficient handling of large datasets

## Deployment Model

PixTrail is designed as a local application with several deployment options:

1. **Desktop Application**: Installed on user's computer via pip
2. **Web Application**: Run as a local web server for browser access
3. **Command-Line Utility**: Used in scripts and batch processing
4. **Development Library**: Integrated into other Python applications

## Future-Proofing

The architecture is designed to accommodate future enhancements:

- **Video Support**: Extension points for video file processing
- **Mobile Integration**: API structure suitable for mobile app integration
- **Cloud Synchronization**: Data model supports optional cloud sync
- **Plugin System**: Modular design could evolve into a full plugin architecture

## Related Documentation

- [Module Structure](development/module-structure.md)
- [CSS Architecture](development/css-architecture.md)
- [API Reference](api/index.md)
- [Contributing Guide](contributing.md)
