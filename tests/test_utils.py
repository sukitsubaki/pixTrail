"""
Tests for the utils module.
"""

import os
import unittest
from unittest.mock import patch, mock_open, MagicMock

import glob

from pixtrail.utils import (
    get_image_files,
    ensure_directory,
    get_default_output_path,
    validate_coordinates
)


class TestUtils(unittest.TestCase):
    """Test cases for utility functions."""

    def setUp(self):
        """Set up test fixtures."""
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

    @patch("glob.glob")
    def test_get_image_files(self, mock_glob):
        """Test getting image files from a directory."""
        # Mock glob.glob return values
        mock_returns = {
            os.path.join(self.test_dir, "*.jpg"): [
                os.path.join(self.test_dir, "test1.jpg"),
                os.path.join(self.test_dir, "test2.jpg")
            ],
            os.path.join(self.test_dir, "*.jpeg"): [
                os.path.join(self.test_dir, "test3.jpeg")
            ],
            os.path.join(self.test_dir, "*.png"): [
                os.path.join(self.test_dir, "test4.png")
            ],
            os.path.join(self.test_dir, "*.tiff"): [],
            os.path.join(self.test_dir, "*.bmp"): []
        }
        mock_glob.side_effect = lambda path, **kwargs: mock_returns.get(path, [])
        
        # Get image files
        result = get_image_files(self.test_dir)
        
        # Assertions
        self.assertEqual(len(result), 4)
        self.assertIn(os.path.join(self.test_dir, "test1.jpg"), result)
        self.assertIn(os.path.join(self.test_dir, "test3.jpeg"), result)
        self.assertIn(os.path.join(self.test_dir, "test4.png"), result)
        self.assertEqual(mock_glob.call_count, 5)  # 5 extensions

    @patch("glob.glob")
    def test_get_image_files_recursive(self, mock_glob):
        """Test getting image files recursively."""
        # Mock glob.glob return values for recursive search
        mock_returns = {
            os.path.join(self.test_dir, "**", "*.jpg"): [
                os.path.join(self.test_dir, "test1.jpg"),
                os.path.join(self.test_dir, "subdir", "test2.jpg")
            ],
            os.path.join(self.test_dir, "**", "*.jpeg"): [
                os.path.join(self.test_dir, "subdir", "test3.jpeg")
            ],
            os.path.join(self.test_dir, "**", "*.png"): [
                os.path.join(self.test_dir, "test4.png")
            ],
            os.path.join(self.test_dir, "**", "*.tiff"): [],
            os.path.join(self.test_dir, "**", "*.bmp"): []
        }
        mock_glob.side_effect = lambda path, **kwargs: mock_returns.get(path, [])
        
        # Get image files recursively
        result = get_image_files(self.test_dir, recursive=True)
        
        # Assertions
        self.assertEqual(len(result), 4)
        self.assertIn(os.path.join(self.test_dir, "test1.jpg"), result)
        self.assertIn(os.path.join(self.test_dir, "subdir", "test2.jpg"), result)
        self.assertIn(os.path.join(self.test_dir, "subdir", "test3.jpeg"), result)
        self.assertEqual(mock_glob.call_count, 5)  # 5 extensions

    def test_get_image_files_directory_not_found(self):
        """Test error handling when directory is not found."""
        # Try to get image files from a non-existent directory
        with self.assertRaises(FileNotFoundError):
            get_image_files(os.path.join(self.test_dir, "non_existent"))

    @patch("os.makedirs")
    def test_ensure_directory(self, mock_makedirs):
        """Test ensuring a directory exists."""
        # Ensure directory exists
        result = ensure_directory(self.test_dir)
        
        # Assertions
        self.assertTrue(result)
        mock_makedirs.assert_called_once_with(self.test_dir, exist_ok=True)

    @patch("os.makedirs", side_effect=Exception("Error"))
    def test_ensure_directory_error(self, mock_makedirs):
        """Test error handling when ensuring a directory exists."""
        # Try to ensure directory exists
        result = ensure_directory(self.test_dir)
        
        # Assertions
        self.assertFalse(result)
        mock_makedirs.assert_called_once_with(self.test_dir, exist_ok=True)

    def test_get_default_output_path(self):
        """Test getting default output path."""
        # Get default output path
        result = get_default_output_path(self.test_dir)
        
        # Assertions
        self.assertEqual(result, os.path.join(self.test_dir, "track.gpx"))
        
        # Get default output path with custom filename
        result = get_default_output_path(self.test_dir, "custom.gpx")
        
        # Assertions
        self.assertEqual(result, os.path.join(self.test_dir, "custom.gpx"))

    def test_validate_coordinates(self):
        """Test validating GPS coordinates."""
        # Valid coordinates
        valid, _ = validate_coordinates(52.5200, 13.4050)
        self.assertTrue(valid)
        
        # Latitude out of range
        valid, error = validate_coordinates(91.0, 13.4050)
        self.assertFalse(valid)
        self.assertIn("latitude", error.lower())
        
        # Longitude out of range
        valid, error = validate_coordinates(52.5200, 181.0)
        self.assertFalse(valid)
        self.assertIn("longitude", error.lower())
        
        # Non-numeric coordinates
        valid, error = validate_coordinates("52.5200", 13.4050)
        self.assertFalse(valid)
        self.assertIn("numeric", error.lower())


if __name__ == "__main__":
    unittest.main()