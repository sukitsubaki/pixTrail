# Changelog

All notable changes to the PixTrail project will be documented in this file.

## [1.1.1] - 2025-03-19

### Bug Fixes
* **Fixed duplicate success messages**: Removed redundant "GPX file created successfully" message that was appearing twice in terminal output

## [1.1.0] - 2025-03-19

### New Features
* **Added RAW file support**: Now supporting various RAW formats (CR2, NEF, ARW, DNG, ORF, RW2, PEF, SRW)

## [1.0.0] - 2025-03-19 - Initial Release

PixTrail is a Python-based tool that extracts GPS data from photo EXIF metadata and generates GPX files for mapping and route visualization.

### Features
* Extract geographical coordinates and timestamps from EXIF metadata in images
* Process individual photos or entire directories (with recursive option)
* Generate GPX files containing waypoints and tracks from your photos
* Support for various image formats (JPG, PNG, TIFF)
* Command-line interface for easy integration
