#!/usr/bin/env python3
"""
Example script for using PixTrail to process photos and generate GPX files.
"""

import os
import sys
import argparse
from datetime import datetime

# Add the parent directory to the path to import pixtrail
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from pixtrail.core import PixTrail
from pixtrail.gpx_generator import GPXGenerator
from pixtrail.utils import ensure_directory


def parse_args():
    """Parse command-line arguments."""
    parser = argparse.ArgumentParser(
        description="Example script for using PixTrail"
    )
    
    parser.add_argument(
        "--photos", "-p",
        default="example_photos",
        help="Directory containing photos with GPS data (default: example_photos)"
    )
    
    parser.add_argument(
        "--output", "-o",
        default="example_output/track.gpx",
        help="Output GPX file path (default: example_output/track.gpx)"
    )
    
    parser.add_argument(
        "--recursive", "-r",
        action="store_true",
        help="Search for images recursively in subdirectories"
    )
    
    parser.add_argument(
        "--min-altitude", "-a",
        type=float,
        help="Minimum altitude filter (in meters)"
    )
    
    parser.add_argument(
        "--date-filter", "-d",
        help="Filter photos by date (YYYY-MM-DD)"
    )
    
    return parser.parse_args()


def main():
    """Main function."""
    args = parse_args()
    
    # Create a PixTrail object
    pt = PixTrail()
    
    # Process directory
    print(f"Processing photos in {args.photos}{'recursively' if args.recursive else ''}...")
    gps_data = pt.process_directory(args.photos, args.recursive)
    
    if not gps_data:
        print("No GPS data found in photos. Exiting.")
        return 1
    
    print(f"Found {len(gps_data)} photos with GPS data.")
    
    # Apply filters if specified
    filtered_data = gps_data
    
    # Filter by minimum altitude
    if args.min_altitude is not None:
        filtered_data = [
            point for point in filtered_data 
            if point.get('altitude', 0) >= args.min_altitude
        ]
        print(f"Applied altitude filter: {len(filtered_data)} photos remaining.")
    
    # Filter by date
    if args.date_filter:
        try:
            filter_date = datetime.strptime(args.date_filter, "%Y-%m-%d").date()
            filtered_data = [
                point for point in filtered_data 
                if 'timestamp' in point and point['timestamp'].date() == filter_date
            ]
            print(f"Applied date filter: {len(filtered_data)} photos remaining.")
        except ValueError:
            print(f"Invalid date format: {args.date_filter}. Expected format: YYYY-MM-DD")
            return 1
    
    # Ensure output directory exists
    output_dir = os.path.dirname(os.path.abspath(args.output))
    ensure_directory(output_dir)
    
    # Generate GPX file
    print(f"Generating GPX file: {args.output}")
    success = GPXGenerator.create_gpx(filtered_data, args.output)
    
    if success:
        print("GPX file generated successfully.")
        return 0
    else:
        print("Failed to generate GPX file.")
        return 1


if __name__ == "__main__":
    sys.exit(main())
