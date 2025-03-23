# Command Line Interface

This document provides detailed information about the PixTrail command-line interface (CLI), including all available options and examples.

## Overview

The PixTrail CLI allows you to extract GPS data from photos and generate GPX files from the terminal. It's particularly useful for scripting and batch processing.

## Basic Syntax

The basic syntax for using the PixTrail CLI is:

```bash
pixtrail [OPTIONS] [COMMAND]
```

## Main Options

### Input Options

These options determine where PixTrail will look for photos:

| Option | Short | Description |
|--------|-------|-------------|
| `--input-dir` | `-i` | Directory containing photos with GPS data |
| `--batch` | `-b` | Process multiple directories (batch mode) |
| `--web` | `-w` | Start the web interface |

Note: You must specify exactly one of these three input options.

### Output Options

These options control where and how the GPX files are generated:

| Option | Short | Description |
|--------|-------|-------------|
| `--output` | `-o` | Output GPX file path (default: auto-named in the input directory) |
| `--output-dir` | `-d` | Output directory for batch mode (default: each input directory) |

### Processing Options

These options modify how PixTrail processes photos:

| Option | Short | Description |
|--------|-------|-------------|
| `--recursive` | `-r` | Search for images recursively in subdirectories |
| `--verbose` | `-v` | Enable verbose output |

### Web Interface Options

These options only apply when using the `-w` / `--web` option:

| Option | Description |
|--------|-------------|
| `--host` | Host for the web interface (default: 127.0.0.1) |
| `--port` | Port for the web interface (default: 5000) |
| `--no-browser` | Don't automatically open a browser when starting the web interface |

### Other Options

| Option | Short | Description |
|--------|-------|-------------|
| `--help` | `-h` | Show the help message and exit |
| `--version` | | Show program's version number and exit |

## Command Modes

PixTrail operates in one of three modes:

### 1. Single Directory Mode

Process a single directory and generate one GPX file:

```bash
pixtrail -i /path/to/photos
```

### 2. Batch Mode

Process multiple directories, generating one GPX file per directory:

```bash
pixtrail -b /path/to/photos1 /path/to/photos2 /path/to/photos3
```

### 3. Web Interface Mode

Start the web interface for browser-based operation:

```bash
pixtrail -w
```

## Examples

### Basic Processing

Process all images in a directory and create a GPX file with the default name:

```bash
pixtrail -i /path/to/photos
```

### Custom Output Path

Process all images in a directory and create a GPX file at a specific location:

```bash
pixtrail -i /path/to/photos -o /path/to/output.gpx
```

### Recursive Processing

Process all images in a directory and its subdirectories:

```bash
pixtrail -i /path/to/photos -r
```

### Verbose Output

Process all images with detailed progress information:

```bash
pixtrail -i /path/to/photos -v
```

### Batch Processing

Process multiple directories at once:

```bash
pixtrail -b /path/to/photos1 /path/to/photos2 /path/to/photos3
```

### Batch Processing with Output Directory

Process multiple directories and save all GPX files to a specific directory:

```bash
pixtrail -b /path/to/photos1 /path/to/photos2 -d /path/to/gpx_files
```

### Web Interface with Custom Host and Port

Start the web interface on a specific host and port:

```bash
pixtrail -w --host 0.0.0.0 --port 8080
```

## Return Codes

The PixTrail CLI returns the following exit codes:

| Code | Description |
|------|-------------|
| 0    | Success     |
| 1    | General error (invalid options, no photos found, etc.) |

## Environment Variables

PixTrail does not currently use any environment variables.

## Piping and Redirection

You can redirect the output of PixTrail to a file:

```bash
pixtrail -i /path/to/photos -v > processing_log.txt
```

## Script Integration

You can easily integrate PixTrail into shell scripts:

```bash
#!/bin/bash
# Process all photo directories in a parent directory
for dir in /path/to/photos/*/; do
    pixtrail -i "$dir" -v
done
```

## Limitations

- The CLI cannot currently filter photos by date, time, or altitude (use the Python API for this functionality)
- No direct support for multiple output formats beyond GPX
- No direct way to specify custom waypoint names or descriptions

These limitations can be overcome by using the Python API directly in your own scripts.
