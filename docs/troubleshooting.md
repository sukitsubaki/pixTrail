# Troubleshooting

This guide addresses common issues you might encounter when using PixTrail.

## Installation Issues

### "No matches found: pixtrail[web]" error in zsh

**Problem:** When trying to install PixTrail with web interface in zsh (default shell on macOS), you get an error like:
```
zsh: no matches found: pixtrail[web]
```

**Solution:** In zsh, square brackets are used for pattern matching. Use quotes around the package name:
```zsh
pip install "pixtrail[web]"
```

### Package Not Found

**Problem:** You receive `No matching distribution found for pixtrail`.

**Solutions:**
- Check your internet connection
- Verify you have a compatible Python version (3.6+)
- Try updating pip: `pip install --upgrade pip`
- If behind a proxy, configure pip to use it: `pip install --proxy=http://user:password@proxyserver:port pixtrail`

### Dependency Installation Failures

**Problem:** Dependencies fail to install.

**Solutions:**
- Install build dependencies: `pip install wheel setuptools`
- For Windows users with C extension issues: `pip install pipwin && pipwin install pillow`
- Try installing in a virtual environment to avoid system conflicts
- If using Linux, install development packages: `sudo apt-get install python3-dev libjpeg-dev zlib1g-dev`

### Permission Errors

**Problem:** You get "Permission denied" errors during installation.

**Solutions:**
- Use `pip install --user pixtrail` to install in user space
- Run the command prompt/terminal as administrator/root
- Check folder permissions where Python packages are installed

### Package installed but command not found

**Problem:** You've installed PixTrail, but when you run the `pixtrail` command, you get a "command not found" error.

**Solutions:**

1. Find where Python scripts are installed and add to PATH:
   ```bash
   # Find your Python scripts directory
   python -c "import site; print(site.USER_BASE + '/bin')"  # Linux/macOS
   python -c "import site; print(site.USER_BASE + '\\Scripts')"  # Windows
   
   # Add to PATH (temporary)
   export PATH="$PATH:/path/to/scripts/directory"  # Linux/macOS
   set PATH=%PATH%;C:\path\to\scripts\directory  # Windows
   ```

2. Try running PixTrail with the Python module syntax:
   ```bash
   python -m pixtrail --help
   ```

3. Create an alias in your shell configuration file (.bashrc, .zshrc):
   ```bash
   alias pixtrail="python -m pixtrail"
   ```

4. Reinstall the package with:
   ```bash
   pip install --force-reinstall pixtrail
   ```

### Package shows as installed but doesn't work

**Problem:** Pip says the package is installed, but it doesn't work properly.

**Solutions:**
1. Try using a virtual environment for a clean installation:
   ```bash
   # With venv
   python -m venv pixtrail_env
   source pixtrail_env/bin/activate  # Linux/macOS
   pixtrail_env\Scripts\activate  # Windows
   
   # With conda
   conda create -n pixtrail python=3.9
   conda activate pixtrail
   
   # Then install
   pip install "pixtrail[web]"
   ```

2. Install directly from GitHub:
   ```bash
   pip install git+https://github.com/sukitsubaki/pixtrail.git
   ```

3. Verify the package is correctly installed:
   ```bash
   python -c "import pixtrail; print(pixtrail.__file__)"
   pip show pixtrail
   ```

## Command Line Issues

### Invalid Syntax Errors

**Problem:** You get Python syntax errors when running PixTrail.

**Solutions:**
- Check that you're using Python 3.6 or newer
- Verify that the command line arguments are correctly formatted
- Avoid using quotes in paths with spaces; use single quotes if needed: `pixtrail -i '/path with spaces/'`

### No GPS Data Found

**Problem:** PixTrail reports "No GPS data found in photos".

**Solutions:**
- Verify your photos actually contain GPS data using other software (like ExifTool)
- Ensure you have permission to read the input directory
- Check that the file formats are supported (.jpg, .jpeg, .tiff, .raw formats)
- Try processing a single photo known to have GPS data: `pixtrail -i /path/to/single_photo.jpg -v`

### Errors with RAW Files

**Problem:** RAW files aren't processed correctly.

**Solutions:**
- Install additional dependencies: `pip install rawpy`
- Check if your RAW format is supported (CR2, NEF, ARW, DNG, etc.)
- Try converting RAW to JPEG first, then processing the JPEGs
- Use verbose mode to see which files have issues: `pixtrail -i /path/to/photos -v`

## Web Interface Issues

### Web Server Won't Start

**Problem:** The web server fails to start.

**Solutions:**
- Check if another application is using port 5000
- Try a different port: `pixtrail -w --port 8080`
- Look for error messages in the terminal
- Check if you have access rights to bind to the specified host
- Install web dependencies if missing: `pip install "pixtrail[web]"`

### Browser Doesn't Open Automatically

**Problem:** The browser doesn't launch when starting the web interface.

**Solutions:**
- Open your browser manually and navigate to `http://127.0.0.1:5000`
- Try using the `--no-browser` flag and then open the URL manually
- Check if you have a default browser set in your system

### Directory Selection Not Working

**Problem:** The directory selector doesn't work in the web interface.

**Solutions:**
- Try using the file upload option instead
- Some browsers have limited directory access (especially on mobile)
- Check if you're using a supported browser (Chrome/Firefox/Edge recommended)
- Try dragging and dropping the directory onto the drop area

### Files Not Appearing in Upload

**Problem:** Files don't appear after selection in the web interface.

**Solutions:**
- Check if you're selecting files with supported formats
- Ensure files aren't too large for browser processing
- Try dragging and dropping files directly
- Clear your browser cache and try again
- Use the Chrome or Firefox browser for best compatibility

### Map Does Not Display

**Problem:** The map doesn't appear after processing.

**Solutions:**
- Check your internet connection (needed for map tiles)
- Look for JavaScript errors in the browser console (F12)
- Verify that your files contain valid GPS coordinates
- Try disabling browser extensions that might block content

## GPS Data Issues

### Incorrect Coordinates

**Problem:** Your route appears in the wrong location.

**Solutions:**
- Check that your camera's date/time was correctly set when taking photos
- Some cameras store coordinates in non-standard formats
- Try using ExifTool to verify the coordinates are correct in the original files
- Check if any software might have modified the EXIF data before processing

### Missing Timestamps

**Problem:** Your route has no chronological order.

**Solutions:**
- Ensure your camera records timestamps in EXIF data
- Check if file modification dates can be used as a fallback
- Verify that the time zone settings on your camera were correct

### Inconsistent GPS Data

**Problem:** Your route has strange jumps or inconsistencies.

**Solutions:**
- Photos taken indoors or in "urban canyons" may have poor GPS accuracy
- Some cameras only update GPS periodically to save battery
- Try removing outliers manually before processing
- Use clustering or heatmap visualization to identify problematic points

## GPX File Issues

### Empty GPX File

**Problem:** The generated GPX file is empty.

**Solutions:**
- Ensure your photos contain GPS data
- Check if you have write permissions for the output location
- Try specifying a different output path: `pixtrail -i /path/to/photos -o /path/to/output.gpx`
- Run with verbose mode to see what's happening: `pixtrail -i /path/to/photos -v`

### GPX Import Problems

**Problem:** Mapping software can't import the generated GPX file.

**Solutions:**
- Verify the file was created successfully (should be non-zero size)
- Check if the GPX format is compatible with your software
- Try opening the file in a text editor to check for obvious errors
- Different applications support different GPX features; try a simple viewer first

### Missing Elevation Data

**Problem:** Elevation data is missing in the GPX file.

**Solutions:**
- Not all cameras record elevation data
- Elevation data might be absent or inaccurate depending on the device
- Some mapping software can add elevation data after import
- Consider using a GPX editor to add elevation data from a DEM (Digital Elevation Model)

## Performance Issues

### Slow Processing

**Problem:** Processing is very slow.

**Solutions:**
- RAW files take much longer to process than JPEG
- Processing many files at once requires more memory
- Processing recursively through many subdirectories takes longer
- For large collections, process in smaller batches
- Use the command line interface for better performance with many files

### High Memory Usage

**Problem:** PixTrail uses too much memory.

**Solutions:**
- Process fewer photos at once
- Avoid recursive processing of large directory trees
- Close other memory-intensive applications
- For very large collections, use batch processing with smaller groups

### Browser Performance Issues

**Problem:** The web interface is slow or unresponsive.

**Solutions:**
- Enable clustering when displaying many photo markers
- Process fewer photos at a time
- Try a different browser (Chrome often has the best performance)
- Avoid having too many browser tabs or applications open simultaneously

## Advanced Troubleshooting

### Debugging with Verbose Mode

For detailed information about what's happening:

```bash
pixtrail -i /path/to/photos -v
```

The verbose output will show:
- Which files are being processed
- Whether EXIF data was found
- GPS coordinates extracted
- Any errors encountered

### Logging to a File

To save troubleshooting information to a file:

```bash
pixtrail -i /path/to/photos -v > pixtrail_log.txt 2>&1
```

This captures both standard output and error messages for later analysis.

### Checking EXIF Data Manually

To verify GPS data in your photos:

```bash
# Using exiftool (may need to be installed separately)
exiftool -gps:all -time:all photo.jpg
```

### Running from Source

For debugging or development:

```bash
git clone https://github.com/sukitsubaki/pixtrail.git
cd pixtrail
pip install -e .
python -m pixtrail.cli -i /path/to/photos -v
```

## Getting Additional Help

If you're still experiencing issues:

1. Check the [FAQ](faq.md) for common questions
2. Search for similar issues in the GitHub repository
3. Ensure you're using the latest version of PixTrail
4. Provide detailed information when reporting issues:
   - PixTrail version: `pixtrail --version`
   - Python version: `python --version`
   - Operating system details
   - Complete error messages
   - Steps to reproduce the problem
   - Sample files (if possible)
