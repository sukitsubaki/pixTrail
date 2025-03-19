"""
Tests for the exif_reader module.
"""

import os
import unittest
from datetime import datetime
from unittest.mock import patch, MagicMock, mock_open

from pixtrail.exif_reader import ExifReader


class TestExifReader(unittest.TestCase):
    """Test cases for the ExifReader class."""

    def setUp(self):
        """Set up test fixtures."""
        self.test_dir = os.path.join(os.path.dirname(__file__), "test_data")
        os.makedirs(self.test_dir, exist_ok=True)
        self.test_image = os.path.join(self.test_dir, "test.jpg")
        
        # Create an empty test image file
        with open(self.test_image, "w") as f:
            f.write("")

    def tearDown(self):
        """Clean up test fixtures."""
        if os.path.exists(self.test_image):
            os.remove(self.test_image)
        if os.path.exists(self.test_dir):
            os.rmdir(self.test_dir)

    @patch("exifread.process_file")
    def test_extract_gps_data_with_exifread(self, mock_process_file):
        """Test extracting GPS data using exifread."""
        # Mock exifread.process_file return value
        mock_tags = {
            'GPS GPSLatitude': MagicMock(values=[
                MagicMock(num=52, den=1),
                MagicMock(num=30, den=1),
                MagicMock(num=0, den=1)
            ]),
            'GPS GPSLatitudeRef': MagicMock(values='N'),
            'GPS GPSLongitude': MagicMock(values=[
                MagicMock(num=13, den=1),
                MagicMock(num=24, den=1),
                MagicMock(num=0, den=1)
            ]),
            'GPS GPSLongitudeRef': MagicMock(values='E'),
            'GPS GPSAltitude': MagicMock(values=[MagicMock(num=100, den=1)]),
            'GPS GPSAltitudeRef': MagicMock(values=[0]),
            'Image DateTime': MagicMock(__str__=lambda self: '2023:01:01 12:00:00')
        }
        mock_process_file.return_value = mock_tags
        
        # Extract GPS data
        result = ExifReader.extract_gps_data(self.test_image)
        
        # Assertions
        self.assertIsNotNone(result)
        self.assertAlmostEqual(result['latitude'], 52.5, places=4)
        self.assertAlmostEqual(result['longitude'], 13.4, places=4)
        self.assertEqual(result['altitude'], 100.0)
        self.assertEqual(result['name'], os.path.basename(self.test_image))
        self.assertEqual(result['timestamp'], datetime(2023, 1, 1, 12, 0, 0))

    @patch("exifread.process_file")
    def test_extract_gps_data_with_south_west(self, mock_process_file):
        """Test extracting GPS data with south and west references."""
        # Mock exifread.process_file return value
        mock_tags = {
            'GPS GPSLatitude': MagicMock(values=[
                MagicMock(num=52, den=1),
                MagicMock(num=30, den=1),
                MagicMock(num=0, den=1)
            ]),
            'GPS GPSLatitudeRef': MagicMock(values='S'),
            'GPS GPSLongitude': MagicMock(values=[
                MagicMock(num=13, den=1),
                MagicMock(num=24, den=1),
                MagicMock(num=0, den=1)
            ]),
            'GPS GPSLongitudeRef': MagicMock(values='W'),
            'Image DateTime': MagicMock(__str__=lambda self: '2023:01:01 12:00:00')
        }
        mock_process_file.return_value = mock_tags
        
        # Extract GPS data
        result = ExifReader.extract_gps_data(self.test_image)
        
        # Assertions
        self.assertIsNotNone(result)
        self.assertAlmostEqual(result['latitude'], -52.5, places=4)  # South is negative
        self.assertAlmostEqual(result['longitude'], -13.4, places=4)  # West is negative

    @patch("exifread.process_file")
    def test_extract_gps_data_no_gps(self, mock_process_file):
        """Test extracting GPS data from an image with no GPS data."""
        # Mock exifread.process_file return value
        mock_process_file.return_value = {}
        
        # Extract GPS data
        result = ExifReader.extract_gps_data(self.test_image)
        
        # Assertions
        self.assertIsNone(result)

    @patch("exifread.process_file", side_effect=Exception("Error"))
    @patch("pixtrail.exif_reader.ExifReader._extract_gps_with_pillow")
    def test_extract_gps_fallback_to_pillow(self, mock_pillow, mock_process_file):
        """Test falling back to Pillow when exifread fails."""
        # Mock Pillow return value
        mock_pillow.return_value = {
            'latitude': 52.5,
            'longitude': 13.4,
            'altitude': 100.0,
            'timestamp': datetime(2023, 1, 1, 12, 0, 0),
            'name': os.path.basename(self.test_image)
        }
        
        # Extract GPS data
        result = ExifReader.extract_gps_data(self.test_image)
        
        # Assertions
        self.assertIsNotNone(result)
        self.assertEqual(result['latitude'], 52.5)
        self.assertEqual(result['longitude'], 13.4)
        mock_pillow.assert_called_once_with(self.test_image)

    @patch("PIL.Image.open")
    def test_extract_gps_with_pillow(self, mock_open):
        """Test extracting GPS data using Pillow."""
        # Mock Pillow Image
        mock_image = MagicMock()
        mock_open.return_value = mock_image
        
        # Mock _getexif method
        mock_exif = {
            34853: {  # GPSInfo tag
                1: 'N',  # GPSLatitudeRef
                2: ((52, 1), (30, 1), (0, 1)),  # GPSLatitude
                3: 'E',  # GPSLongitudeRef
                4: ((13, 1), (24, 1), (0, 1)),  # GPSLongitude
                6: (100, 1),  # GPSAltitude
            },
            306: '2023:01:01 12:00:00'  # DateTime
        }
        mock_image._getexif.return_value = mock_exif
        
        # Extract GPS data
        result = ExifReader._extract_gps_with_pillow(self.test_image)
        
        # Assertions
        self.assertIsNotNone(result)
        # Due to the complexity of mocking Pillow's TAGS and GPSTAGS, 
        # we can't fully test this method with unit tests.
        # A more thorough test would require integration testing with actual image files.

    def test_convert_to_degrees(self):
        """Test converting GPS coordinates to decimal degrees."""
        # Test with rational values
        test_values = (
            MagicMock(num=52, den=1),
            MagicMock(num=30, den=1),
            MagicMock(num=0, den=1)
        )
        result = ExifReader._convert_to_degrees(test_values)
        self.assertAlmostEqual(result, 52.5, places=4)
        
        # Test with integer/float tuples
        test_values = (52, 30, 0)
        result = ExifReader._convert_to_degrees(test_values)
        self.assertAlmostEqual(result, 52.5, places=4)


if __name__ == "__main__":
    unittest.main()