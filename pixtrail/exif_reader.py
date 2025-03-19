"""
Module for extracting EXIF GPS data from image files.
"""

import os
from datetime import datetime
from typing import Dict, Optional, Tuple, Any

import exifread
from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS


class ExifReader:
    """Class for reading EXIF data from image files, focusing on GPS information."""

    @staticmethod
    def extract_gps_data(image_path: str) -> Optional[Dict[str, Any]]:
        """
        Extract GPS data from an image file.

        Args:
            image_path: Path to the image file

        Returns:
            Dictionary containing GPS information (latitude, longitude, altitude, timestamp)
            or None if no GPS data is found
        """
        if not os.path.isfile(image_path):
            raise FileNotFoundError(f"Image file not found: {image_path}")

        # Try using exifread first (more reliable for GPS data)
        try:
            with open(image_path, 'rb') as f:
                tags = exifread.process_file(f, details=False)
            
            if not tags:
                return None

            gps_data = {}

            # Check if image has GPS data
            if 'GPS GPSLatitude' in tags and 'GPS GPSLongitude' in tags:
                lat = ExifReader._convert_to_degrees(tags['GPS GPSLatitude'].values)
                lon = ExifReader._convert_to_degrees(tags['GPS GPSLongitude'].values)
                
                # Check latitude and longitude references (N/S, E/W)
                if 'GPS GPSLatitudeRef' in tags:
                    lat_ref = tags['GPS GPSLatitudeRef'].values
                    if lat_ref == 'S':
                        lat = -lat
                
                if 'GPS GPSLongitudeRef' in tags:
                    lon_ref = tags['GPS GPSLongitudeRef'].values
                    if lon_ref == 'W':
                        lon = -lon
                
                gps_data['latitude'] = lat
                gps_data['longitude'] = lon
                
                # Get altitude if available
                if 'GPS GPSAltitude' in tags:
                    alt = float(tags['GPS GPSAltitude'].values[0].num) / float(tags['GPS GPSAltitude'].values[0].den)
                    
                    # Check altitude reference (above/below sea level)
                    if 'GPS GPSAltitudeRef' in tags and tags['GPS GPSAltitudeRef'].values[0] == 1:
                        alt = -alt
                    
                    gps_data['altitude'] = alt
                else:
                    gps_data['altitude'] = 0.0
            else:
                # No GPS data found
                return None
            
            # Get timestamp
            if 'Image DateTime' in tags:
                date_str = str(tags['Image DateTime'])
                try:
                    # EXIF DateTime format: 'YYYY:MM:DD HH:MM:SS'
                    timestamp = datetime.strptime(date_str, '%Y:%m:%d %H:%M:%S')
                    gps_data['timestamp'] = timestamp
                except ValueError:
                    # If DateTime format is incorrect, try to use current time
                    gps_data['timestamp'] = datetime.now()
            else:
                # No timestamp found
                gps_data['timestamp'] = datetime.now()
                
            # Add filename as name
            gps_data['name'] = os.path.basename(image_path)
                
            return gps_data
            
        except Exception as e:
            # Fallback to Pillow if exifread fails
            try:
                return ExifReader._extract_gps_with_pillow(image_path)
            except Exception as pillow_e:
                print(f"Error extracting EXIF data from {image_path}: {e}, Pillow error: {pillow_e}")
                return None
    
    @staticmethod
    def _extract_gps_with_pillow(image_path: str) -> Optional[Dict[str, Any]]:
        """
        Extract GPS data using Pillow as a fallback method.
        
        Args:
            image_path: Path to the image file
            
        Returns:
            Dictionary containing GPS information or None if no GPS data is found
        """
        try:
            image = Image.open(image_path)
            exif_data = image._getexif()
            
            if not exif_data:
                return None
                
            # Get all EXIF tags
            labeled_exif = {
                TAGS.get(key, key): value
                for key, value in exif_data.items()
            }
            
            # Check if image has GPS info
            if 'GPSInfo' not in labeled_exif:
                return None
                
            gps_info = labeled_exif['GPSInfo']
            
            # Get GPS data
            gps_data = {
                GPSTAGS.get(key, key): value
                for key, value in gps_info.items()
            }
            
            # Extract coordinates
            if 'GPSLatitude' in gps_data and 'GPSLongitude' in gps_data:
                lat = ExifReader._convert_to_degrees(gps_data['GPSLatitude'])
                lon = ExifReader._convert_to_degrees(gps_data['GPSLongitude'])
                
                # Check reference (N/S, E/W)
                if 'GPSLatitudeRef' in gps_data and gps_data['GPSLatitudeRef'] == 'S':
                    lat = -lat
                if 'GPSLongitudeRef' in gps_data and gps_data['GPSLongitudeRef'] == 'W':
                    lon = -lon
                    
                result = {
                    'latitude': lat,
                    'longitude': lon,
                    'name': os.path.basename(image_path)
                }
                
                # Get altitude if available
                if 'GPSAltitude' in gps_data:
                    altitude = float(gps_data['GPSAltitude'][0]) / float(gps_data['GPSAltitude'][1])
                    if 'GPSAltitudeRef' in gps_data and gps_data['GPSAltitudeRef'] == 1:
                        altitude = -altitude
                    result['altitude'] = altitude
                else:
                    result['altitude'] = 0.0
                
                # Get timestamp
                if 'DateTime' in labeled_exif:
                    date_str = labeled_exif['DateTime']
                    try:
                        timestamp = datetime.strptime(date_str, '%Y:%m:%d %H:%M:%S')
                        result['timestamp'] = timestamp
                    except ValueError:
                        result['timestamp'] = datetime.now()
                else:
                    result['timestamp'] = datetime.now()
                
                return result
            
            return None
                
        except Exception as e:
            print(f"Pillow extraction error for {image_path}: {e}")
            return None
            
    @staticmethod
    def _convert_to_degrees(value: Tuple) -> float:
        """
        Convert GPS coordinates from degrees, minutes, seconds format to decimal degrees.
        
        Args:
            value: Tuple of (degrees, minutes, seconds)
            
        Returns:
            Decimal degrees as a float
        """
        # For rational values from EXIF
        if hasattr(value[0], 'num'):
            degrees = float(value[0].num) / float(value[0].den)
            minutes = float(value[1].num) / float(value[1].den)
            seconds = float(value[2].num) / float(value[2].den)
        # For integer/float tuples from Pillow
        else:
            degrees = float(value[0])
            minutes = float(value[1])
            seconds = float(value[2])
            
        return degrees + (minutes / 60.0) + (seconds / 3600.0)