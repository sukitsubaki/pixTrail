"""
Web interface module for PixTrail.

This module provides a browser-based interface for extracting GPS data
from photos and creating GPX files, running entirely on the local device.
"""

from .server import create_app, start_server

__all__ = ['create_app', 'start_server']
