# Installation Guide

There are several ways to install PixTrail depending on your needs and environment.

## Prerequisites

- Python 3.6 or newer
- pip (Python package installer)
- Git (only for installation from source)

## Installation Methods

### Method 1: Installation via pip (Recommended)

This is the simplest method for most users.

#### Basic Installation

```bash
# For bash, PowerShell, or Command Prompt:
pip install pixtrail
```

```zsh
# For zsh (default shell on macOS):
pip install pixtrail
```

#### Installation with Web Interface

```bash
# For bash, PowerShell, or Command Prompt:
pip install pixtrail[web]
```

```zsh
# For zsh (default shell on macOS):
# Note the quotation marks, which are required for zsh
pip install "pixtrail[web]"
```

### Method 2: Installation from Source

This method is recommended for developers or users who want the latest unreleased features.

```bash
# Clone the repository
git clone https://github.com/sukitsubaki/pixtrail.git

# Navigate to the repository directory
cd pixtrail

# Install in development mode
pip install -e .

# To include web interface dependencies
pip install -e ".[web]"

# To include development dependencies
pip install -e ".[dev]"

# To include both web and development dependencies
pip install -e ".[web,dev]"
```

### Method 3: Installation using pip with direct GitHub URL

This method allows you to install the latest version directly from GitHub without cloning the repository.

```bash
# Basic installation
pip install git+https://github.com/sukitsubaki/pixtrail.git

# With web interface dependencies (for bash/PowerShell)
pip install "git+https://github.com/sukitsubaki/pixtrail.git#egg=pixtrail[web]"

# With web interface dependencies (for zsh)
pip install "git+https://github.com/sukitsubaki/pixtrail.git#egg=pixtrail[web]"
```

## Verification

After installation, verify that PixTrail was installed correctly by running:

```bash
pixtrail --help
```

This should display the help information for PixTrail, showing all available commands and options.

## Troubleshooting

If you encounter issues with the installation, try these solutions:

### 1. Command Not Found

If you get a "command not found" error when running `pixtrail`, it may be because the Python scripts directory is not in your PATH. You can try running PixTrail with the full Python module path:

```bash
python -m pixtrail --help
```

### 2. Issues with Extra Dependencies

If you're having trouble installing with extras like `[web]`, especially on macOS with zsh, make sure to use quotes:

```zsh
pip install "pixtrail[web]"
```

### 3. Installation in a Virtual Environment

For a clean installation isolated from your system Python, use a virtual environment:

```bash
# Create a virtual environment
python -m venv venv_pixtrail

# Activate the virtual environment
# On Windows:
# venv_pixtrail\Scripts\activate
# On macOS/Linux:
source venv_pixtrail/bin/activate

# Install PixTrail in the virtual environment
pip install "pixtrail[web]"
```

### 4. Upgrade pip

An outdated pip can sometimes cause installation issues:

```bash
pip install --upgrade pip
```

### 5. Permission Issues

If you're experiencing permission errors, you might need to use `sudo` (on Linux/macOS) or run your command prompt as Administrator (on Windows). Alternatively, use the `--user` flag:

```bash
pip install --user "pixtrail[web]"
```

## Uninstallation

To uninstall PixTrail:

```bash
pip uninstall pixtrail
```
