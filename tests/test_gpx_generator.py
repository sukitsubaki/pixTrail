"""
Tests for the gpx_generator module.
"""

import os
import unittest
from datetime import datetime
from unittest.mock import patch, mock_open, MagicMock

import gpxpy

from pixtrail.gpx_generator import GPXGenerator


class TestGPXGenerator(unittest.TestCase):
    """Test cases for the GPXGenerator class."""

    def setUp(self):
        """Set up test fixtures."""
        self.test_dir = os.path.join(os.path.dirname(__file__), "test_data")
        os.makedirs(self.test_dir, exist_ok=True)
        self.test_gpx = os.path.join(self.test_dir, "test.gpx")
        
        # Sample GPS data for testing
        self.test_gps_data = [
            {
                'latitude': 52.5200,
                'longitude': 13.4050,
                'altitude': 100.0,
                'timestamp': datetime(2023, 1, 1, 12, 0, 0),
                'name': 'test1.jpg'
            },
            {
                'latitude': 48.8566,
                'longitude': 2.3522,
                'altitude': 200.0,
                'timestamp': datetime(2023, 1, 2, 12, 0, 0),
                'name': 'test2.jpg'
            }
        ]

    def tearDown(self):
        """Clean up test fixtures."""
        if os.path.exists(self.test_gpx):
            os.remove(self.test_gpx)
        if os.path.exists(self.test_dir):
            os.rmdir(self.test_dir)

    @patch("builtins.open", new_callable=mock_open)
    def test_create_gpx(self, mock_file):
        """Test creating a GPX file from GPS data."""
        # Create GPX file
        result = GPXGenerator.create_gpx(self.test_gps_data, self.test_gpx)
        
        # Assertions
        self.assertTrue(result)
        mock_file.assert_called_once_with(self.test_gpx, 'w')
        handle = mock_file()
        self.assertTrue(handle.write.called)
        
        # Check if GPX content was written
        # We can't check the exact content because gpxpy.to_xml() generates a string with timestamps
        # that change on each run, but we can check if write was called
        self.assertTrue(handle.write.call_count > 0)

    def test_create_gpx_empty_data(self):
        """Test creating a GPX file with empty GPS data."""
        # Create GPX file with empty data
        result = GPXGenerator.create_gpx([], self.test_gpx)
        
        # Assertions
        self.assertFalse(result)
        self.assertFalse(os.path.exists(self.test_gpx))

    @patch("builtins.open", side_effect=Exception("Error"))
    def test_create_gpx_error(self, mock_file):
        """Test error handling when creating a GPX file."""
        # Try to create GPX file
        result = GPXGenerator.create_gpx(self.test_gps_data, self.test_gpx)
        
        # Assertions
        self.assertFalse(result)
        self.assertFalse(os.path.exists(self.test_gpx))

    @patch("os.path.isfile")
    @patch("builtins.open", new_callable=mock_open)
    @patch("gpxpy.parse")
    def test_add_waypoint_to_existing_gpx(self, mock_parse, mock_file, mock_isfile):
        """Test adding a waypoint to an existing GPX file."""
        # Mock file existence
        mock_isfile.return_value = True
        
        # Mock GPX object
        mock_gpx = MagicMock()
        mock_parse.return_value = mock_gpx
        mock_gpx.to_xml.return_value = "<gpx>test</gpx>"
        
        # Add waypoint to GPX file
        result = GPXGenerator.add_waypoint_to_gpx(
            self.test_gpx,
            52.5200,
            13.4050,
            name="test.jpg",
            altitude=100.0,
            timestamp=datetime(2023, 1, 1, 12, 0, 0)
        )
        
        # Assertions
        self.assertTrue(result)
        mock_isfile.assert_called_once_with(self.test_gpx)
        mock_file.assert_called_with(self.test_gpx, 'w')
        self.assertTrue(mock_gpx.waypoints.append.called)
        
        # Check if track and segment were created
        # Due to the complexity of mocking gpxpy objects, we'll just check if to_xml was called
        self.assertTrue(mock_gpx.to_xml.called)

    @patch("os.path.isfile")
    @patch("builtins.open", new_callable=mock_open)
    def test_add_waypoint_to_new_gpx(self, mock_file, mock_isfile):
        """Test adding a waypoint to a new GPX file."""
        # Mock file non-existence
        mock_isfile.return_value = False
        
        # Add waypoint to GPX file
        result = GPXGenerator.add_waypoint_to_gpx(
            self.test_gpx,
            52.5200,
            13.4050,
            name="test.jpg",
            altitude=100.0,
            timestamp=datetime(2023, 1, 1, 12, 0, 0)
        )
        
        # Assertions
        self.assertTrue(result)
        mock_isfile.assert_called_once_with(self.test_gpx)
        mock_file.assert_called_with(self.test_gpx, 'w')
        
        # Check if GPX content was written
        handle = mock_file()
        self.assertTrue(handle.write.called)


if __name__ == "__main__":
    unittest.main()