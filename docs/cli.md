# Command Line Interface

This document provides detailed information about the PixTrail command-line interface (CLI), including all available options, usage examples, and automation techniques.

## Overview

The PixTrail CLI provides a powerful and flexible way to extract GPS data from photos and generate GPX files directly from the command line. This interface is particularly useful for:

- Processing large batches of photos
- Integrating with scripts and workflows
- Automating route generation
- Server-side processing without a GUI

## Installation

Before using the CLI, ensure PixTrail is properly installed:

```bash
# Install the base package
pip install pixtrail

# Or for additional features
pip install pixtrail[web]
```

## Basic Syntax

The basic syntax for using the PixTrail CLI is:

```bash
pixtrail [OPTIONS] [COMMAND]
```

## Command Modes

PixTrail operates in one of three modes, and you must specify exactly one of them:

### 1. Single Directory Mode

Process all photos in a single directory and generate one GPX file:

```bash
pixtrail -i /path/to/photos [OPTIONS]
```

### 2. Batch Mode

Process multiple directories, generating one GPX file per directory:

```bash
pixtrail -b /path/to/photos1 /path/to/photos2 [OPTIONS]
```

### 3. Web Interface Mode

Start the web interface for browser-based operation:

```bash
pixtrail -w [OPTIONS]
```

## Core Options

### Input Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--input-dir` | `-i` | Directory containing photos with GPS data | - |
| `--batch` | `-b` | Process multiple directories (batch mode) | - |
| `--web` | `-w` | Start the web interface | - |

### Output Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--output` | `-o` | Output GPX file path | Auto-named in the input directory |
| `--output-dir` | `-d` | Output directory for batch mode | Same as each input directory |

### Processing Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--recursive` | `-r` | Search for images recursively in subdirectories | `False` |
| `--min-photos` | `-m` | Minimum number of photos with GPS data required | `1` |
| `--file-types` | `-f` | Comma-separated list of file extensions to process | All supported types |
| `--exclude-dirs` | `-e` | Comma-separated list of directory names to exclude | None |
| `--verbose` | `-v` | Enable verbose output | `False` |

### Web Interface Options

| Option | Description | Default |
|--------|-------------|---------|
| `--host` | Host for the web interface | `127.0.0.1` |
| `--port` | Port for the web interface | `5000` |
| `--no-browser` | Don't automatically open a browser when starting the web interface | `False` |

### GPX Generation Options

| Option | Description | Default |
|--------|-------------|---------|
| `--no-track` | Don't add a track connecting waypoints | Track is added |
| `--no-timestamps` | Don't include timestamps in GPX file | Timestamps are included |
| `--no-elevations` | Don't include elevation data in GPX file | Elevations are included |
| `--creator` | Specify the creator tag for the GPX file | `"PixTrail"` |

### Other Options

| Option | Short | Description |
|--------|-------|-------------|
| `--help` | `-h` | Show the help message and exit |
| `--version` | | Show program's version number and exit |

## Usage Examples

### Basic Operations

#### Process a Directory of Photos

```bash
# Basic operation - process directory and create GPX file
pixtrail -i /path/to/photos
```

This command:
1. Processes all supported image files in the specified directory
2. Extracts GPS data from their EXIF metadata
3. Creates a GPX file named after the directory in the same location

#### Specify Output Path

```bash
# Specify output GPX file location
pixtrail -i /path/to/photos -o /path/to/output.gpx
```

#### Recursive Processing

```bash
# Process directory and all subdirectories
pixtrail -i /path/to/photos -r
```

#### Verbose Output

```bash
# Show detailed processing information
pixtrail -i /path/to/photos -v
```

### Batch Processing

#### Process Multiple Directories

```bash
# Process multiple directories in one command
pixtrail -b /path/to/trip1 /path/to/trip2 /path/to/trip3
```

This creates a separate GPX file in each directory.

#### Save Batch Output to a Specific Directory

```bash
# Place all GPX files in a specified output directory
pixtrail -b /path/to/trip1 /path/to/trip2 -d /path/to/gpx_files
```

#### Batch Processing with Recursion

```bash
# Process multiple directories recursively
pixtrail -b /path/to/trip1 /path/to/trip2 -r
```

### Advanced Options

#### Filter File Types

```bash
# Process only JPEG files
pixtrail -i /path/to/photos -f .jpg,.jpeg
```

#### Exclude Directories

```bash
# Skip certain subdirectories during recursive processing
pixtrail -i /path/to/photos -r -e thumbnails,private
```

#### Set Minimum Photo Threshold

```bash
# Require at least 5 photos with GPS data
pixtrail -i /path/to/photos -m 5
```

#### Custom GPX Creator Tag

```bash
# Set a custom creator tag in the GPX file
pixtrail -i /path/to/photos --creator "My Photo Mapper"
```

### Web Interface

#### Start Web Interface

```bash
# Start the web interface with default options
pixtrail -w
```

#### Custom Host and Port

```bash
# Make web interface available on local network
pixtrail -w --host 0.0.0.0 --port 8080
```

#### Start Without Browser

```bash
# Start web server without automatically opening browser
pixtrail -w --no-browser
```

## Automation Examples

### Process New Photos Script

Create a script that automatically processes photos added to a specific directory:

```bash
#!/bin/bash
# process_new_photos.sh
# Usage: ./process_new_photos.sh [watch_directory] [output_directory]

WATCH_DIR="${1:-/path/to/photos}"
OUTPUT_DIR="${2:-/path/to/gpx_files}"

# Ensure output directory exists
mkdir -p "$OUTPUT_DIR"

# Find directories modified in the last day
find "$WATCH_DIR" -type d -mtime -1 | while read dir; do
    echo "Processing newly modified directory: $dir"
    pixtrail -i "$dir" -o "$OUTPUT_DIR/$(basename "$dir").gpx" -v
done
```

Make it executable and run:
```bash
chmod +x process_new_photos.sh
./process_new_photos.sh
```

### Batch Processing with Filtering

This script processes multiple directories but skips those with too few photos:

```bash
#!/bin/bash
# batch_process.sh
# Usage: ./batch_process.sh [base_directory] [output_directory]

BASE_DIR="${1:-/path/to/photos}"
OUTPUT_DIR="${2:-/path/to/gpx_files}"

# Ensure output directory exists
mkdir -p "$OUTPUT_DIR"

# Get a list of all subdirectories
DIRS=$(find "$BASE_DIR" -type d -maxdepth 1 -mindepth 1 | sort)

# Process each directory with minimum 5 photos
for dir in $DIRS; do
    dir_name=$(basename "$dir")
    echo "Processing directory: $dir_name"
    
    # Count photos
    photo_count=$(find "$dir" -type f \( -name "*.jpg" -o -name "*.jpeg" \) | wc -l)
    
    if [ $photo_count -ge 5 ]; then
        pixtrail -i "$dir" -o "$OUTPUT_DIR/$dir_name.gpx" -v
        echo "✓ Processed $dir_name ($photo_count photos)"
    else
        echo "✗ Skipped $dir_name (only $photo_count photos, minimum 5 required)"
    fi
done
```

### Window Batch Script

A Windows batch file (.bat) for processing photos:

```batch
@echo off
setlocal enabledelayedexpansion

REM Set directories
set PHOTO_BASE=C:\Users\username\Photos
set OUTPUT_DIR=C:\Users\username\GPX_Files

REM Ensure output directory exists
if not exist "%OUTPUT_DIR%" mkdir "%OUTPUT_DIR%"

REM Process all year directories
for /D %%Y in ("%PHOTO_BASE%\*") do (
    set YEAR_NAME=%%~nxY
    echo Processing year: !YEAR_NAME!
    
    REM Create year subdirectory in output
    if not exist "%OUTPUT_DIR%\!YEAR_NAME!" mkdir "%OUTPUT_DIR%\!YEAR_NAME!"
    
    REM Process all trip directories for this year
    pixtrail -b "%%Y\*" -r -d "%OUTPUT_DIR%\!YEAR_NAME!" -v
)

echo Batch processing complete!
```

### Python Script Integration

You can also integrate PixTrail directly into Python scripts:

```python
#!/usr/bin/env python3
import os
import sys
import subprocess
from datetime import datetime

def process_by_date(photo_directory, output_directory):
    """Process photos and organize GPX files by date taken."""
    # Ensure output directory exists
    os.makedirs(output_directory, exist_ok=True)
    
    # Get all subdirectories
    subdirs = [d for d in os.listdir(photo_directory) 
               if os.path.isdir(os.path.join(photo_directory, d))]
    
    # Process each directory
    for subdir in subdirs:
        input_path = os.path.join(photo_directory, subdir)
        
        # Get date from directory name if possible
        try:
            # Try to parse directory name as date (e.g., "2023-07-15")
            date_obj = datetime.strptime(subdir, "%Y-%m-%d")
            date_str = date_obj.strftime("%Y-%m")
            year_month_dir = os.path.join(output_directory, date_str)
            os.makedirs(year_month_dir, exist_ok=True)
            
            output_path = os.path.join(year_month_dir, f"{subdir}.gpx")
        except ValueError:
            # If directory name isn't a date, just use it as is
            output_path = os.path.join(output_directory, f"{subdir}.gpx")
        
        # Run pixtrail command
        cmd = ["pixtrail", "-i", input_path, "-o", output_path, "-v"]
        print(f"Running: {' '.join(cmd)}")
        subprocess.run(cmd)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python3 process_by_date.py <photos_directory> <output_directory>")
        sys.exit(1)
    
    process_by_date(sys.argv[1], sys.argv[2])
```

## Scheduled Tasks

### Cron Job (Linux/macOS)

To run PixTrail automatically on a schedule using cron:

```bash
# Open crontab for editing
crontab -e

# Add a line to run at 2:00 AM every day
0 2 * * * /usr/local/bin/pixtrail -i /path/to/photos -o /path/to/gpx_files/$(date +\%Y\%m\%d).gpx
```

### Task Scheduler (Windows)

To create a scheduled task on Windows:

1. Open Task Scheduler
2. Create a Basic Task
3. Set the trigger (e.g., daily at 2:00 AM)
4. Action: Start a program
5. Program/script: `pixtrail`
6. Arguments: `-i "C:\path\to\photos" -o "C:\path\to\gpx_files\%date:~-4,4%%date:~-7,2%%date:~-10,2%.gpx"`

## Advanced Integration Scenarios

### Camera Import Automation

This example script detects when a camera is connected and automatically processes new photos:

```bash
#!/bin/bash
# camera_import.sh

CAMERA_MOUNT="/media/$USER/CAMERA"
PHOTO_DIR="$HOME/Photos"
GPX_DIR="$HOME/GPX_Files"

# Wait for camera to be mounted
inotifywait -m -e create -e moved_to --format "%w%f" /media/$USER/ | while read path
do
    if [[ "$path" == "$CAMERA_MOUNT" ]]; then
        echo "Camera detected at $path"
        
        # Create a directory for today's import
        TODAY=$(date +%Y-%m-%d)
        IMPORT_DIR="$PHOTO_DIR/$TODAY"
        mkdir -p "$IMPORT_DIR"
        
        # Copy photos from camera
        echo "Copying photos to $IMPORT_DIR"
        cp -r "$CAMERA_MOUNT/DCIM/"*".JPG" "$IMPORT_DIR/"
        
        # Process the photos
        echo "Processing photos..."
        pixtrail -i "$IMPORT_DIR" -o "$GPX_DIR/$TODAY.gpx" -v
        
        echo "Done!"
    fi
done
```

### Integration with Photo Management Tools

This example shows how to integrate PixTrail with a photo management workflow:

```bash
#!/bin/bash
# photo_workflow.sh

# Step 1: Import photos from camera
echo "Importing photos from camera..."
IMPORT_DIR="$HOME/Photos/Import"
gphoto2 --get-all-files --filename "$IMPORT_DIR/%Y%m%d-%H%M%S.%C"

# Step 2: Process and create GPX
echo "Generating GPX file..."
pixtrail -i "$IMPORT_DIR" -o "$HOME/GPX_Files/latest_import.gpx" -v

# Step 3: Rename and sort photos by date
echo "Organizing photos..."
exiftool '-FileName<CreateDate' -d "%Y-%m-%d/%H%M%S.%%e" "$IMPORT_DIR"

# Step 4: Clean up
echo "Cleaning up..."
rm -f "$IMPORT_DIR"/*
```

## Return Codes

The PixTrail CLI returns the following exit codes, which can be used in scripts to handle different outcomes:

| Code | Description |
|------|-------------|
| 0    | Success - Processing completed successfully |
| 1    | Error - Invalid options or arguments |
| 2    | Error - Input directory not found or not accessible |
| 3    | Error - No photos found in the specified directory |
| 4    | Error - No GPS data found in photos |
| 5    | Error - Insufficient photos with GPS data (below min-photos threshold) |
| 6    | Error - Failed to create output directory |
| 7    | Error - Failed to write GPX file |

Example of using return codes in a script:

```bash
#!/bin/bash
# process_with_error_handling.sh

pixtrail -i "$1" -o "$2"
RESULT=$?

case $RESULT in
  0) echo "Success: GPX file created at $2" ;;
  1) echo "Error: Invalid command options" ;;
  2) echo "Error: Input directory not found" ;;
  3) echo "Error: No photos found in directory" ;;
  4) echo "Error: No GPS data found in photos" ;;
  5) echo "Error: Insufficient photos with GPS data" ;;
  6) echo "Error: Failed to create output directory" ;;
  7) echo "Error: Failed to write GPX file" ;;
  *) echo "Unknown error: $RESULT" ;;
esac

exit $RESULT
```

## Piping and Redirection

The CLI supports standard Unix piping and redirection:

```bash
# Save output to a log file
pixtrail -i /path/to/photos -v > processing.log 2>&1

# Process a list of directories from a file
cat directories.txt | xargs -n1 pixtrail -i

# Chain commands
pixtrail -i /path/to/photos && notify-send "GPX processing complete"
```

## Environment Variables

PixTrail checks for the following environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `PIXTRAIL_DEFAULT_OUTPUT_DIR` | Default output directory for GPX files | None |
| `PIXTRAIL_VERBOSE` | Enable verbose output if set to "1" | Off |
| `PIXTRAIL_WEB_HOST` | Default host for web interface | `127.0.0.1` |
| `PIXTRAIL_WEB_PORT` | Default port for web interface | `5000` |

Example usage:

```bash
# Set default output directory
export PIXTRAIL_DEFAULT_OUTPUT_DIR="/home/user/GPX_Files"

# Always use verbose mode
export PIXTRAIL_VERBOSE="1"

# Now you can run pixtrail without specifying these options
pixtrail -i /path/to/photos
```

## Limitations

The CLI has the following limitations to be aware of:

- Cannot process directly from a camera without first copying files
- No built-in photo filtering by date or other metadata (must use file system or other tools)
- Single-threaded processing (large batches may take time)
- No built-in merging of multiple GPX files (separate tool needed)
- No direct creation of other formats (KML, etc.) - convert GPX afterward

## Troubleshooting

If you encounter issues with the CLI, try these steps:

1. Run with verbose mode (`-v`) to see detailed output
2. Check file permissions for both input and output directories
3. Verify that the photos actually contain GPS data
4. For RAW formats, ensure you have the required libraries installed
5. For batch processing issues, try processing a single directory first

## Further Reading

- [PixTrail Usage Guide](usage.md)
- [GPX Generator Reference](api/gpx.md)
- [EXIF Reader Reference](api/exif.md)
- [Python API Documentation](api/index.md)
