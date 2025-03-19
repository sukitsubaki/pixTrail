"""
Command-line interface for the PixTrail package.
"""

import argparse
import os
import sys
from typing import List

from .core import PixTrail
from .utils import ensure_directory


def parse_args(args: List[str] = None) -> argparse.Namespace:
    """
    Parse command-line arguments.
    
    Args:
        args: Command-line arguments (if None, use sys.argv)
        
    Returns:
        Parsed arguments
    """
    parser = argparse.ArgumentParser(
        description="Extract GPS data from photos and create GPX files"
    )
    
    parser.add_argument(
        "input_dir",
        help="Directory containing photos with GPS data"
    )
    
    parser.add_argument(
        "-o", "--output",
        help="Output GPX file path (default: INPUT_DIR/track.gpx)"
    )
    
    parser.add_argument(
        "-r", "--recursive",
        action="store_true",
        help="Search for images recursively in subdirectories"
    )
    
    parser.add_argument(
        "-v", "--verbose",
        action="store_true",
        help="Enable verbose output"
    )
    
    return parser.parse_args(args)


def main(args: List[str] = None) -> int:
    """
    Main entry point for the command-line interface.
    
    Args:
        args: Command-line arguments (if None, use sys.argv)
        
    Returns:
        Exit code (0 for success, non-zero for failure)
    """
    # Parse arguments
    parsed_args = parse_args(args)
    
    # Check if input directory exists
    if not os.path.isdir(parsed_args.input_dir):
        print(f"Error: Input directory does not exist: {parsed_args.input_dir}")
        return 1
    
    # Set output path
    output_path = parsed_args.output
    if not output_path:
        output_path = os.path.join(parsed_args.input_dir, "track.gpx")
    
    # Ensure output directory exists
    output_dir = os.path.dirname(os.path.abspath(output_path))
    if not ensure_directory(output_dir):
        print(f"Error: Could not create output directory: {output_dir}")
        return 1
    
    try:
        # Create PixTrail object
        pixtrail = PixTrail()
        
        # Process and generate GPX file
        if parsed_args.verbose:
            print(f"Processing images in {parsed_args.input_dir}")
            if parsed_args.recursive:
                print("Searching recursively in subdirectories")
        
        success = pixtrail.process_and_generate(
            parsed_args.input_dir,
            output_path,
            parsed_args.recursive
        )
        
        if success:
            print(f"GPX file created successfully: {output_path}")
            return 0
        else:
            print("Failed to create GPX file")
            return 1
    
    except Exception as e:
        print(f"Error: {e}")
        return 1


if __name__ == "__main__":
    sys.exit(main())