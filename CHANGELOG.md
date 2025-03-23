# Changelog

All notable changes to the PixTrail project will be documented in this file.

## [1.3.0] - 2025-03-20

### New Features
* **Batch Processing**: Process multiple photo directories in a single command with the new batch processing feature. Perfect for photographers who want to generate GPX tracks for multiple events or trips at once.

## [1.2.0] - 2025-03-20

### New Features
* **Automatic GPX Naming**: GPX files are now automatically named after the photo directory. For example, if you run `pixtrail /path/to/Photos_Kyoto`, a file named `Photos_Kyoto.gpx` will be created in the same directory.

### Minor Changes
* The default filename has been changed from `track.gpx` to `PixTrail.gpx` when no explicit name can be derived.

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
