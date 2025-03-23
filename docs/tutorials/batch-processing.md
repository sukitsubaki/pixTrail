# Batch Processing Large Photo Collections

**Skill Level: Intermediate**

This tutorial will guide you through processing large collections of photos spread across multiple directories using PixTrail's batch processing capabilities.

## Introduction

When dealing with large photo collections from multiple journeys or trips, processing them one by one can be time-consuming. PixTrail offers batch processing capabilities that allow you to process multiple directories at once, saving you time and effort.

By the end of this tutorial, you will know how to:
- Process multiple photo directories in a single operation
- Organize GPX outputs effectively
- Automate batch processing with scripts
- Manage large collections efficiently

## Prerequisites

Before starting, make sure you have:

1. **PixTrail installed**:
   ```bash
   pip install pixtrail
   ```

2. **Multiple directories of geotagged photos** organized on your computer
   - For example, different trips or days of a vacation
   - Each directory should contain photos with GPS data

3. **Basic command-line knowledge** for running commands and scripts

## Step 1: Understanding Batch Processing Options

PixTrail offers several options for batch processing:

1. **Command-Line Batch Mode** (`-b` / `--batch` flag):
   - Process multiple directories in a single command
   - Automatically name the GPX files based on the directory names
   - Optionally specify a common output directory

2. **Python API Batch Processing**:
   - Process directories programmatically
   - Customize processing with filters and transformations
   - Integrate with other Python tools and workflows

## Step 2: Command-Line Batch Processing

Let's start with the simplest approach using the command line:

1. Open a terminal or command prompt

2. Run the following command to process multiple directories:
   ```bash
   pixtrail -b /path/to/trip1 /path/to/trip2 /path/to/trip3
   ```

3. This will:
   - Process each directory separately
   - Create a GPX file in each directory, named after the directory
   - Print progress information for each directory

4. To save all GPX files to a specific output directory:
   ```bash
   pixtrail -b /path/to/trip1 /path/to/trip2 -d /path/to/gpx_output
   ```

5. For recursive processing of subdirectories:
   ```bash
   pixtrail -b /path/to/trip1 /path/to/trip2 -r
   ```

6. For verbose output showing detailed progress:
   ```bash
   pixtrail -b /path/to/trip1 /path/to/trip2 -v
   ```

## Step 3: Processing an Entire Photo Library

To process all subdirectories in your photo library:

1. Navigate to your main photos directory

2. Use the batch mode with the recursive flag:
   ```bash
   pixtrail -b ./2023/* -r -d ./gpx_files
   ```

   This example:
   - Processes all directories in the "2023" folder
   - Searches recursively in each directory
   - Saves all GPX files to the "gpx_files" directory

3. Check the results:
   - Each subdirectory with GPS-tagged photos will generate a GPX file
   - The GPX files will be named after the respective directories
   - Directories without GPS data will be skipped with a message

## Step 4: Creating a Batch Processing Script

For repeated batch processing tasks, creating a script can be helpful:

### Bash Script (Linux/macOS)

Create a file named `process_photos.sh`:

```bash
#!/bin/bash

# Directory containing photo folders
PHOTO_BASE="/home/username/Photos"

# Output directory for GPX files
OUTPUT_DIR="/home/username/GPX_Files"

# Ensure output directory exists
mkdir -p "$OUTPUT_DIR"

# Process all year directories
for YEAR in "$PHOTO_BASE"/*/; do
    YEAR_NAME=$(basename "$YEAR")
    echo "Processing year: $YEAR_NAME"
    
    # Create year subdirectory in output
    mkdir -p "$OUTPUT_DIR/$YEAR_NAME"
    
    # Process all trip directories for this year
    pixtrail -b "$YEAR"/* -r -d "$OUTPUT_DIR/$YEAR_NAME" -v
done

echo "Batch processing complete!"
```

Make the script executable:
```bash
chmod +x process_photos.sh
```

Run the script:
```bash
./process_photos.sh
```

### Windows Batch Script

Create a file named `process_photos.bat`:

```batch
@echo off
setlocal enabledelayedexpansion

:: Directory containing photo folders
set PHOTO_BASE=C:\Users\username\Photos

:: Output directory for GPX files
set OUTPUT_DIR=C:\Users\username\GPX_Files

:: Ensure output directory exists
if not exist "%OUTPUT_DIR%" mkdir "%OUTPUT_DIR%"

:: Process all year directories
for /D %%Y in ("%PHOTO_BASE%\*") do (
    set YEAR_NAME=%%~nxY
    echo Processing year: !YEAR_NAME!
    
    :: Create year subdirectory in output
    if not exist "%OUTPUT_DIR%\!YEAR_NAME!" mkdir "%OUTPUT_DIR%\!YEAR_NAME!"
    
    :: Process all trip directories for this year
    pixtrail -b "%%Y\*" -r -d "%OUTPUT_DIR%\!YEAR_NAME!" -v
)

echo Batch processing complete!
```

Run the script:
```bash
process_photos.bat
```

## Step 5: Using the Python API for Advanced Batch Processing

For more complex batch processing needs, you can use the PixTrail Python API:

Create a file named `batch_process.py`:

```python
#!/usr/bin/env python3
import os
import sys
from datetime import datetime
from pixtrail.core import PixTrail

def process_directories(base_dir, output_dir, min_photos=3):
    """Process all subdirectories with minimum number of photos."""
    # Create PixTrail object
    pt = PixTrail()
    
    # Ensure output directory exists
    os.makedirs(output_dir, exist_ok=True)
    
    # Get all subdirectories
    subdirs = [d for d in os.listdir(base_dir) if os.path.isdir(os.path.join(base_dir, d))]
    
    results = {
        'success': [],
        'failed': [],
        'skipped': []
    }
    
    # Process each directory
    for subdir in subdirs:
        input_path = os.path.join(base_dir, subdir)
        output_path = os.path.join(output_dir, f"{subdir}.gpx")
        
        print(f"Processing {subdir}...")
        
        # Check number of image files (simple check for *.jpg)
        image_count = len([f for f in os.listdir(input_path) 
                          if f.lower().endswith(('.jpg', '.jpeg'))])
        
        if image_count < min_photos:
            print(f"  Skipping: Only {image_count} images found (minimum: {min_photos})")
            results['skipped'].append(subdir)
            continue
        
        # Process and generate GPX
        try:
            result = pt.process_and_generate(input_path, output_path, recursive=True)
            
            if result and 'success' in result and result['success']:
                print(f"  Success: Created {output_path}")
                print(f"  Photos processed: {result['stats']['processed']}")
                results['success'].append(subdir)
            else:
                print(f"  Failed: No GPS data found")
                results['failed'].append(subdir)
        except Exception as e:
            print(f"  Error: {str(e)}")
            results['failed'].append(subdir)
    
    # Print summary
    print("\nBatch Processing Summary:")
    print(f"  Successfully processed: {len(results['success'])}")
    print(f"  Failed: {len(results['failed'])}")
    print(f"  Skipped (too few photos): {len(results['skipped'])}")
    
    return results

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: batch_process.py <photos_directory> <output_directory> [min_photos]")
        sys.exit(1)
    
    photos_dir = sys.argv[1]
    output_dir = sys.argv[2]
    min_photos = int(sys.argv[3]) if len(sys.argv) > 3 else 3
    
    process_directories(photos_dir, output_dir, min_photos)
```

Run the script:
```bash
python batch_process.py /path/to/photos /path/to/output 5
```

This script:
- Processes all subdirectories in the specified base directory
- Skips directories with fewer than the specified minimum number of photos
- Creates GPX files in the output directory
- Provides a summary of successfully processed, failed, and skipped directories

## Step 6: Organizing and Managing GPX Outputs

As you process large collections, organizing your GPX files becomes important:

1. **Create a hierarchical output structure**:
   ```bash
   pixtrail -b /Photos/2023/Italy/* -d /GPX_Files/2023/Italy
   ```

2. **Use descriptive naming**:
   ```bash
   pixtrail -i /Photos/2023/Italy/Rome -o /GPX_Files/2023/Italy/Rome_City_Tour.gpx
   ```

3. **Create a master index file** to keep track of your GPX files:
   ```python
   # Create a simple index.html file listing all GPX files
   import os
   
   def create_index(gpx_dir, output_file):
       with open(output_file, 'w') as f:
           f.write("<html><head><title>GPX Files Index</title></head><body>\n")
           f.write("<h1>GPX Files Index</h1>\n<ul>\n")
           
           for root, dirs, files in os.walk(gpx_dir):
               for file in files:
                   if file.endswith('.gpx'):
                       rel_path = os.path.relpath(os.path.join(root, file), os.path.dirname(output_file))
                       f.write(f'<li><a href="{rel_path}">{os.path.basename(rel_path)}</a></li>\n')
           
           f.write("</ul></body></html>")
   
   # Usage
   create_index("/path/to/gpx_files", "/path/to/gpx_files/index.html")
   ```

## Tips for Efficient Batch Processing

1. **Organize photos by trip/event before processing**:
   - Keep each journey or event in its own directory
   - Use descriptive directory names that will become GPX filenames

2. **Use selective processing for large collections**:
   - Process the most important directories first
   - Skip directories with too few photos or those without GPS data

3. **Preserve disk space**:
   - GPX files are small, but processing RAW files temporarily uses space
   - Clean up any temporary files after processing

4. **Monitor system resources**:
   - Processing many large RAW files can be memory-intensive
   - Process in smaller batches if you encounter resource limitations

## Troubleshooting

### Script or Command Errors

If your batch process fails with errors:

1. Try processing a single directory first to isolate the issue
2. Use the `-v` (verbose) flag to get more detailed error information
3. Check file permissions on both input and output directories
4. Ensure you have enough disk space for temporary files

### Some Directories Are Skipped

If some directories are processed but others are skipped:

1. Check if the skipped directories contain photos with GPS data
2. Verify that you have read access to all directories
3. Check for special characters or spaces in directory names
4. Try processing the skipped directories individually with verbose output

### Performance Issues

If batch processing is slow:

1. Process fewer directories at once
2. Close other memory-intensive applications
3. Use an SSD for temporary storage if available
4. Process the most important directories first

## Next Steps

After mastering batch processing, you might want to explore:

- [Customizing Visualizations](custom-visualizations.md) to create custom views of your processed data
- [Python API](../api/index.md) for even more advanced processing options
- Setting up scheduled batch processing tasks for automatic updates

## Example: Processing a Vacation Photo Collection

Here's an example workflow for processing photos from a two-week vacation:

1. **Organize photos** by day:
   ```
   /Vacation2023/
     Day1-Arrival/
     Day2-CityTour/
     Day3-Museum/
     ...
     Day14-Departure/
   ```

2. **Process all days at once**:
   ```bash
   pixtrail -b /Vacation2023/* -d /Vacation2023/GPX_Tracks
   ```

3. **Check results**:
   - 14 GPX files are created in the `/Vacation2023/GPX_Tracks` directory
   - Each file is named after its corresponding day directory
   - Days without GPS data are skipped with a message

4. **Import all GPX files** into Google Earth or other mapping software
   - Each day's journey appears as a separate track
   - Different colors can be assigned to each day
   - The entire vacation route can be visualized at once

This example demonstrates how batch processing can quickly transform a large collection of vacation photos into a comprehensive set of GPX tracks documenting the entire trip.
