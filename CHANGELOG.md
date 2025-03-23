# Changelog

All notable changes to the PixTrail project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - YYYY-MM-DD

### Added
* ...

### Fixed
* ...

## [2.3.2] - 2025-03-23

### Changed
* Comprehensive modularization of CSS and JavaScript files for improved maintainability
* Reorganized JavaScript code into functional modules with clear responsibilities
* Enhanced documentation with comprehensive guides, tutorials, and API references
* Added examples and FAQ to README
* Created team information and documentation
* Added structured CHANGELOG to track version history

### Fixed
* Drag and drop functionality for files and directories now properly processes uploads
* Improved error handling for non-image files with clear messaging about skipped files
* Fixed map viewport display to properly show all markers without manual zooming
* Resolved marker clustering functionality with proper plugin initialization
* Corrected statistics display with accurate calculations and proper timestamp handling

### Technical
* Implemented module pattern for CSS with base, layouts, and component-specific styles
* Reorganized JavaScript into utils, API client, and feature-specific modules
* Added ES modules support for better code organization

## [2.3.1] - 2025-03-22

### Fixed
* Corrected script loading order for the Leaflet.heat library
* Added proper error messages when visualization features are unavailable
* Implemented checks to verify plugin availability before usage

## [2.3.0] - 2025-03-22

### Added
* Heatmap visualization with time and density representation
* Marker clustering with adjustable radius control
* Route statistics and performance analytics
* Interactive charts for elevation and speed profiles
* Time analysis with start/end times calculations

### Changed
* Enhanced map interface with action-state visual indicators
* Optimized performance for large photo collections (300+ waypoints)
* Made statistics panel and controls mobile-responsive

### Fixed
* Added detailed error handling for GPS data inconsistencies

### Technical
* Added Chart.js for statistical visualizations
* Implemented Leaflet.heat for heatmap generation
* Added Leaflet.markercluster for efficient marker management
* Improved data processing algorithms with outlier detection

## [2.2.0] - 2025-03-22

### Added
* Hybrid processing: JPEG/TIFF in browser, RAW/PNG on server
* Support for all common image formats including professional RAW formats
* Client-side extraction of EXIF data for compatible formats
* Automatic cleanup of temporary image files
* Better error messages and improved message placement
* Enhanced upload capabilities with increased size limit

### Changed
* Only GPX files are stored, reducing storage requirements
* Moved cache directory to `__pixtrail-cache__`

### Fixed
* Processing errors for large file uploads
* Improved handling of missing GPS data in images
* Memory usage issues with large image collections

### Technical
* Implemented EXIF.js for client-side metadata extraction
* Added robust error handling throughout the application
* Optimized server-side file processing

## [2.1.0] - 2025-03-22

### Added
* Directory selection in web interface
* Recursive processing of subdirectories with configurable depth levels
* Drag & drop functionality for both files and directories

### Changed
* Redesigned input selection UI with tabbed interface
* Enhanced progress reporting during processing
* Updated documentation with detailed explanations of new features
* Added visual feedback during drag and drop operations

## [2.0.1] - 2025-03-22

### Fixed
* Improved handling of photos without GPS data
* Revised terminology for clarity (#5)

## [2.0.0] - 2025-03-21

### Added
* Web interface with Flask
* Upload and process photos directly in browser
* Route visualization on interactive OpenStreetMap
* One-click GPX file generation and download
* Privacy-focused processing with all data kept local
* Dynamic route plotting with markers and timestamps
* Automatic map centering and zoom based on route

### Changed
* Enhanced command line interface with web options:
  * Start web interface: `pixtrail -w`
  * Configure host and port: `pixtrail -w --host 0.0.0.0 --port 8080`
  * Control browser launch: `pixtrail -w --no-browser`

## [1.3.0] - 2025-03-20

### Added
* Batch processing for multiple photo directories in a single command

## [1.2.0] - 2025-03-20

### Added
* Automatic GPX naming based on photo directory

### Changed
* Default filename changed from `track.gpx` to `PixTrail.gpx` when no explicit name can be derived

## 1.1.1 - 2025-03-19

### Fixed
* Removed redundant "GPX file created successfully" message appearing twice in terminal output

## 1.1.0 - 2025-03-19

### Added
* Support for various RAW formats (CR2, NEF, ARW, DNG, ORF, RW2, PEF, SRW)

## [1.0.0] - 2025-03-19
Initial stable release of PixTrail with the following features:

* Extract GPS coordinates and timestamps from image EXIF metadata
* Process individual photos or entire directories
* Recursive directory processing option
* Generate GPX files with waypoints and tracks
* Support for common image formats (JPG, PNG, TIFF)
* Command-line interface for easy integration

## 0.9.0 - 2025-03-12

### Added
* Release candidate with final polishing
* Installation wizard for common platforms
* Automated dependency resolution

### Changed
* Performance improvements for large photo collections
* Refined command-line interface with better help documentation

### Fixed
* Final bug fixes before stable release
* Edge cases in GPS data interpretation

## 0.7.0 - 2025-03-01

### Added
* Beta release with feature-complete implementation
* Support for all planned image formats
* Export options with customizable GPX features

### Changed
* Code architecture refactored for maintainability
* Installation process simplified

### Fixed
* Timestamp parsing for various camera models
* Path handling on different operating systems

## 0.5.0 - 2025-02-20

### Added
* Alpha release with expanded API for developer integration
* Initial plugin system for extensibility
* Configuration file support

### Changed
* Improved logging system with configurable verbosity
* Enhanced error messages with solution suggestions

## 0.4.0 - 2025-02-12

### Added
* Comprehensive test suite
* Improved error handling
* Man pages and complete documentation

### Changed
* Refactored core processing module for better maintainability
* Optimized memory usage for large directories

## 0.3.0 - 2025-02-01

### Added
* Recursive directory scanning option
* Automatic file type detection
* Basic error reporting

### Fixed
* GPS coordinates parsing issues with certain camera models
* UTC time zone handling in timestamp processing

## 0.2.0 - 2025-01-27

### Added
* Command-line interface with basic options
* Initial support for JPG, PNG and TIFF formats

### Changed
* Improved EXIF data extraction performance
* Better handling of files without GPS data

## 0.1.0 - 2025-01-20

### Added
* Initial experimental version
* Basic EXIF data extraction
* Simple GPX file generation

## 0.0.1 - 2025-01-04

### Added
* Proof of concept
* Minimal EXIF parsing capabilities
* Command-line skeleton

[unreleased]: https://github.com/sukitsubaki/pixTrail/compare/2.3.0...HEAD
[2.3.2]: https://github.com/sukitsubaki/pixTrail/compare/2.3.1...2.3.2
[2.3.1]: https://github.com/sukitsubaki/pixTrail/compare/2.3.0...2.3.1
[2.3.0]: https://github.com/sukitsubaki/pixTrail/compare/2.2.0...2.3.0
[2.2.0]: https://github.com/sukitsubaki/pixTrail/compare/2.1.0...2.2.0
[2.1.0]: https://github.com/sukitsubaki/pixTrail/compare/2.0.1...2.1.0
[2.0.1]: https://github.com/sukitsubaki/pixTrail/compare/2.0.0...2.0.1
[2.0.0]: https://github.com/sukitsubaki/pixTrail/compare/1.3.0...2.0.0
[1.3.0]: https://github.com/sukitsubaki/pixTrail/compare/1.2.0...1.3.0
[1.2.0]: https://github.com/sukitsubaki/pixTrail/compare/1.1.1...1.2.0
[1.0.0]: https://github.com/sukitsubaki/pixTrail/releases/tag/1.0.0
