"""
Core functionality for the PixTrail package.
"""

import os
from typing import Dict, List, Optional, Any

from .exif_reader import ExifReader
from .gpx_generator import GPXGenerator
from .utils import get_image_files, ensure_directory, get_default_output_path


class PixTrail:
    """Main class for extracting GPS data from images and generating GPX files."""
    
    def __init__(self):
        """Initialize the PixTrail object."""
        self.gps_data_list = []
    
    def process_directory(
        self, 
        input_dir: str, 
        recursive: bool = False
    ) -> List[Dict[str, Any]]:
        """
        Process all image files in a directory and extract GPS data.
        
        Args:
            input_dir: Directory containing image files
            recursive: Whether to search recursively in subdirectories
        
        Returns:
            List of dictionaries containing GPS data extracted from images
        """
        # Get image files
        try:
            image_files = get_image_files(input_dir, recursive)
        except FileNotFoundError as e:
            print(f"Error: {e}")
            return []
        
        if not image_files:
            print(f"No image files found in directory: {input_dir}")
            return []
        
        print(f"Found {len(image_files)} image files.")
        
        # Process each image file
        self.gps_data_list = []
        processed_count = 0
        
        for image_file in image_files:
            gps_data = ExifReader.extract_gps_data(image_file)
            
            if gps_data:
                self.gps_data_list.append(gps_data)
                processed_count += 1
                
        print(f"Processed {processed_count} images with GPS data.")
        return self.gps_data_list
    
    def generate_gpx(
        self, 
        output_path: Optional[str] = None, 
        gps_data_list: Optional[List[Dict[str, Any]]] = None
    ) -> bool:
        """
        Generate a GPX file from the extracted GPS data.
        
        Args:
            output_path: Path where the GPX file will be saved
            gps_data_list: List of dictionaries containing GPS data
                          (if None, use the data extracted by process_directory)
        
        Returns:
            bool: True if the GPX file was generated successfully, False otherwise
        """
        # Use provided GPS data or previously extracted data
        data_to_use = gps_data_list if gps_data_list is not None else self.gps_data_list
        
        if not data_to_use:
            print("No GPS data available. Process images first or provide GPS data.")
            return False
        
        # Generate GPX file
        return GPXGenerator.create_gpx(data_to_use, output_path)
    
    def process_and_generate(
        self, 
        input_dir: str, 
        output_path: Optional[str] = None, 
        recursive: bool = False
    ) -> bool:
        """
        Process all images in a directory and generate a GPX file.
        
        Args:
            input_dir: Directory containing image files
            output_path: Path where the GPX file will be saved
            recursive: Whether to search recursively in subdirectories
        
        Returns:
            bool: True if the GPX file was generated successfully, False otherwise
        """
        # Process directory
        self.process_directory(input_dir, recursive)
        
        if not self.gps_data_list:
            return False
        
        # Use provided output path or generate a default one
        final_output_path = output_path
        if not final_output_path:
            final_output_path = get_default_output_path(input_dir)
        
        # Ensure output directory exists
        output_dir = os.path.dirname(os.path.abspath(final_output_path))
        ensure_directory(output_dir)
        
        # Generate GPX file
        return self.generate_gpx(final_output_path)