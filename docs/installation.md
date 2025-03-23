# Installation Guide

This guide provides detailed instructions for installing PixTrail on different platforms and configurations.

## System Requirements

- **Python:** 3.6 or newer
- **Operating System:** Windows, macOS, or Linux
- **Disk Space:** Approximately 50MB for installation
- **Internet Connection:** Required for downloading dependencies and map tiles

## Basic Installation

The simplest way to install PixTrail is using pip, the Python package manager:

```bash
pip install pixtrail
```

This installs the core functionality, which includes:
- GPS data extraction from images
- GPX file generation
- Command-line interface

## Installation with Web Interface

For most users, we recommend installing PixTrail with the web interface:

```bash
pip install pixtrail[web]
```

This installs additional dependencies required for the browser-based interface:
- Flask web framework
- Required JavaScript libraries
- Web server components

## Development Installation

If you plan to contribute to PixTrail or modify it, install the development dependencies:

```bash
pip install pixtrail[dev]
```

For all dependencies (web interface and development tools):

```bash
pip install pixtrail[web,dev]
```

## Installation from Source

To install the latest development version directly from the repository:

```bash
git clone https://github.com/sukitsubaki/pixtrail.git
cd pixtrail
pip install -e .
```

The `-e` flag installs the package in "editable" mode, which is useful for development.

## Platform-Specific Instructions

### Windows

1. Ensure Python is installed and added to your PATH
2. Open Command Prompt or PowerShell as administrator
3. Run:
   ```
   pip install pixtrail[web]
   ```
4. Test the installation:
   ```
   pixtrail --help
   ```

### macOS

1. Install Python from python.org or using Homebrew:
   ```
   brew install python
   ```
2. Install PixTrail:
   ```
   pip3 install pixtrail[web]
   ```
3. Test the installation:
   ```
   pixtrail --help
   ```

### Linux

1. Install Python if not already installed:
   ```
   # Debian/Ubuntu
   sudo apt update
   sudo apt install python3 python3-pip
   
   # Fedora
   sudo dnf install python3 python3-pip
   ```
2. Install PixTrail:
   ```
   pip3 install pixtrail[web]
   ```
3. Test the installation:
   ```
   pixtrail --help
   ```

## Virtual Environment Installation (Recommended)

For a clean installation that won't interfere with other Python packages, use a virtual environment:

```bash
# Create a virtual environment
python -m venv pixtrail-env

# Activate the environment
# On Windows:
pixtrail-env\Scripts\activate
# On macOS/Linux:
source pixtrail-env/bin/activate

# Install PixTrail in the virtual environment
pip install pixtrail[web]
```

## Troubleshooting Installation

### Common Issues

- **Permission errors:** If you see permission errors, try using `pip install --user pixtrail[web]` or run the installation with administrator privileges.
- **Missing dependencies:** If you encounter missing dependency errors, ensure you have the latest version of pip: `pip install --upgrade pip` before installing PixTrail.
- **Installation fails on Windows:** Try installing the wheel package first: `pip install wheel` then retry the PixTrail installation.
- **ModuleNotFoundError after installation:** Make sure your Python environment path is correctly set and try restarting your terminal or command prompt.

### Verifying Installation

To verify that PixTrail is installed correctly:

```bash
pixtrail --version
```

You should see the current version number displayed.

## Upgrading

To upgrade to the latest version of PixTrail:

```bash
pip install --upgrade pixtrail
```

Or with the web interface:

```bash
pip install --upgrade pixtrail[web]
```

## Uninstalling

If you need to uninstall PixTrail:

```bash
pip uninstall pixtrail
```

This will remove the package but preserve your configuration files. To completely remove all traces, manually delete any remaining configuration directories after uninstallation.
