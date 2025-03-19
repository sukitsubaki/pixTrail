"""
Tests for the core module.
"""

import os
import unittest
from unittest.mock import patch, MagicMock

from pixtrail.core import PixTrail


class TestPixTrail(unittest.TestCase):
    """Test cases for the PixTrail class."""

    def setUp(self):
        """Set up test fixtures."""
        self.pixtrail = PixTrail()
        self.test_dir = os.path.join(os.path.dirname(__file__), "test_data")
        os.makedirs(self.test_dir, exist_ok=True)

    def tearDown(self):
        """Clean up test fixtures."""
        if os.path.exists(self.test_dir):
            # Remove test files
            for file in os.listdir(self.test_dir):
                os.remove(os.path.join(self.test_dir, file))
            # Remove test directory
            os.rmdir(self.test_dir)

    @patch("pixtrail.core.get_image_files")
    @patch("pixtrail.core.ExifReader.extract_gps_data")
    def test_process_directory(self, mock_extract_gps, mock_get_image_files):
        """Test processing a directory of images."""
        # Mock image files
        mock_get_image_files.return_value = [
            os.path.join(self.test_dir, "test1.jpg"),
            os.path.join(self.test_dir, "test2.jpg"),
            os.path.join(self.test_dir, "test3.jpg"),
        ]

        # Mock GPS data for the first two images
        mock_extract_gps.side_effect = [
            {"latitude": 52.5200, "longitude": 13.4050, "timestamp": "2023-01-01T12:00:00Z"},
            {"latitude": 48.8566, "longitude": 2.3522, "timestamp": "2023-01-02T12:00:00Z"},
            None  # No GPS data for the third image
        ]

        # Process directory
        result = self.pixtrail.process_directory(self.test_dir)

        # Assertions
        self.assertEqual(len(result), 2)  # Only two images have GPS data
        self.assertEqual(result[0]["latitude"], 52.5200)
        self.assertEqual(result[1]["longitude"], 2.3522)
        mock_get_image_files.assert_called_once_with(self.test_dir, False)
        self.assertEqual(mock_extract_gps.call_count, 3)

    @patch("pixtrail.core.GPXGenerator.create_gpx")
    def test_generate_gpx(self, mock_create_gpx):
        """Test generating a GPX file."""
        # Mock GPS data
        gps_data = [
            {"latitude": 52.5200, "longitude": 13.4050, "timestamp": "2023-01-01T12:00:00Z"},
            {"latitude": 48.8566, "longitude": 2.3522, "timestamp": "2023-01-02T12:00:00Z"},
        ]
        
        # Set mock return value
        mock_create_gpx.return_value = True
        
        # Set GPS data list
        self.pixtrail.gps_data_list = gps_data
        
        # Generate GPX file
        output_path = os.path.join(self.test_dir, "test.gpx")
        result = self.pixtrail.generate_gpx(output_path)
        
        # Assertions
        self.assertTrue(result)
        mock_create_gpx.assert_called_once_with(gps_data, output_path)

    @patch("pixtrail.core.PixTrail.process_directory")
    @patch("pixtrail.core.PixTrail.generate_gpx")
    def test_process_and_generate(self, mock_generate_gpx, mock_process_directory):
        """Test processing and generating in one step."""
        # Mock GPS data
        gps_data = [
            {"latitude": 52.5200, "longitude": 13.4050, "timestamp": "2023-01-01T12:00:00Z"},
            {"latitude": 48.8566, "longitude": 2.3522, "timestamp": "2023-01-02T12:00:00Z"},
        ]
        
        # Set mock return values
        mock_process_directory.return_value = gps_data
        mock_generate_gpx.return_value = True
        
        # Set GPS data list
        self.pixtrail.gps_data_list = gps_data
        
        # Process and generate
        output_path = os.path.join(self.test_dir, "test.gpx")
        result = self.pixtrail.process_and_generate(self.test_dir, output_path, recursive=True)
        
        # Assertions
        self.assertTrue(result)
        mock_process_directory.assert_called_once_with(self.test_dir, True)
        mock_generate_gpx.assert_called_once()

    def test_generate_gpx_no_data(self):
        """Test generating a GPX file with no GPS data."""
        # Set empty GPS data list
        self.pixtrail.gps_data_list = []
        
        # Generate GPX file
        output_path = os.path.join(self.test_dir, "test.gpx")
        result = self.pixtrail.generate_gpx(output_path)
        
        # Assertions
        self.assertFalse(result)


if __name__ == "__main__":
    unittest.main()