"""
Utility functions for the PixTrail package.
"""

import os
import glob
from typing import List, Tuple


def get_image_files(directory: str, recursive: bool = False) -> List[str]:
    """
    Get a list of image files from a directory.
    
    Args:
        directory: Directory to search for image files
        recursive: Whether to search recursively in subdirectories
        
    Returns:
        List of paths to image files
    """
    # Supported image file extensions
    image_extensions = ('*.jpg', '*.jpeg', '*.png', '*.tiff', '*.bmp',
                   '*.cr2', '*.nef', '*.arw', '*.dng', '*.orf', '*.rw2', '*.pef', '*.srw')
    
    # Check if directory exists
    if not os.path.isdir(directory):
        raise FileNotFoundError(f"Directory not found: {directory}")
    
    # List to store found image files
    image_files = []
    
    # Search pattern
    pattern = os.path.join(directory, '**') if recursive else directory
    
    # Find image files
    for ext in image_extensions:
        if recursive:
            search_pattern = os.path.join(pattern, ext)
            image_files.extend(glob.glob(search_pattern, recursive=True))
        else:
            search_pattern = os.path.join(pattern, ext)
            image_files.extend(glob.glob(search_pattern))
    
    return sorted(image_files)


def ensure_directory(directory: str) -> bool:
    """
    Ensure that a directory exists, create it if it doesn't.
    
    Args:
        directory: Directory path to ensure exists
        
    Returns:
        True if directory exists or was created successfully, False otherwise
    """
    try:
        os.makedirs(directory, exist_ok=True)
        return True
    except Exception as e:
        print(f"Error creating directory {directory}: {e}")
        return False


def get_default_output_path(input_dir: str, filename: str = "track.gpx") -> str:
    """
    Generate a default output path for the GPX file based on the input directory.
    
    Args:
        input_dir: Input directory path
        filename: Name of the output file
        
    Returns:
        Default output path for the GPX file
    """
    return os.path.join(input_dir, filename)


def validate_coordinates(latitude: float, longitude: float) -> Tuple[bool, str]:
    """
    Validate GPS coordinates.
    
    Args:
        latitude: Latitude value to validate (-90 to 90)
        longitude: Longitude value to validate (-180 to 180)
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    if not isinstance(latitude, (int, float)) or not isinstance(longitude, (int, float)):
        return False, "Coordinates must be numeric values"
    
    if not (-90 <= latitude <= 90):
        return False, f"Invalid latitude value: {latitude}. Must be between -90 and 90."
        
    if not (-180 <= longitude <= 180):
        return False, f"Invalid longitude value: {longitude}. Must be between -180 and 180."
        
    return True, ""