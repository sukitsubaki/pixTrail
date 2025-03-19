"""
Module for generating GPX files from GPS data extracted from images.
"""

import os
from datetime import datetime
from typing import Dict, List, Optional, Any

import gpxpy
import gpxpy.gpx


class GPXGenerator:
    """Class for generating GPX files from GPS data."""
    
    @staticmethod
    def create_gpx(gps_data_list: List[Dict[str, Any]], output_path: str) -> bool:
        """
        Create a GPX file from a list of GPS data points.
        
        Args:
            gps_data_list: List of dictionaries containing GPS data
                           (latitude, longitude, altitude, timestamp, name)
            output_path: Path where the GPX file will be saved
            
        Returns:
            bool: True if the GPX file was created successfully, False otherwise
        """
        if not gps_data_list:
            print("No GPS data available to create GPX file.")
            return False
            
        # Create the GPX structure
        gpx = gpxpy.gpx.GPX()
        gpx.creator = "PixTrail - GPS Photo Tracker"
        
        # Sort data points by timestamp if available
        sorted_data = sorted(
            gps_data_list, 
            key=lambda x: x.get('timestamp', datetime.now())
        )
        
        # Create waypoints
        for point in sorted_data:
            # Check if we have the minimum required data
            if 'latitude' not in point or 'longitude' not in point:
                continue
                
            # Create a waypoint
            waypoint = gpxpy.gpx.GPXWaypoint(
                latitude=point['latitude'],
                longitude=point['longitude'],
                elevation=point.get('altitude', 0),
                time=point.get('timestamp'),
                name=point.get('name', 'Unknown')
            )
            
            # Add waypoint to the GPX file
            gpx.waypoints.append(waypoint)
        
        # Create a track with a single segment for the path
        track = gpxpy.gpx.GPXTrack()
        gpx.tracks.append(track)
        
        segment = gpxpy.gpx.GPXTrackSegment()
        track.segments.append(segment)
        
        # Add track points to the segment
        for point in sorted_data:
            # Check if we have the minimum required data
            if 'latitude' not in point or 'longitude' not in point:
                continue
                
            # Create a track point
            track_point = gpxpy.gpx.GPXTrackPoint(
                latitude=point['latitude'],
                longitude=point['longitude'],
                elevation=point.get('altitude', 0),
                time=point.get('timestamp')
            )
            
            # Add track point to the segment
            segment.points.append(track_point)
        
        try:
            # Create output directory if it doesn't exist
            os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
            
            # Write the GPX file
            with open(output_path, 'w') as gpx_file:
                gpx_file.write(gpx.to_xml())
                
            print(f"GPX file created successfully: {output_path}")
            return True
        except Exception as e:
            print(f"Error creating GPX file: {e}")
            return False
            
    @staticmethod
    def add_waypoint_to_gpx(
        gpx_file: str, 
        latitude: float, 
        longitude: float, 
        name: Optional[str] = None,
        altitude: Optional[float] = None,
        timestamp: Optional[datetime] = None
    ) -> bool:
        """
        Add a waypoint to an existing GPX file. If the file doesn't exist, create it.
        
        Args:
            gpx_file: Path to the GPX file
            latitude: Waypoint latitude
            longitude: Waypoint longitude
            name: Waypoint name
            altitude: Waypoint altitude
            timestamp: Waypoint timestamp
            
        Returns:
            bool: True if the waypoint was added successfully, False otherwise
        """
        # Check if the GPX file exists
        if os.path.isfile(gpx_file):
            try:
                # Open and parse existing GPX file
                with open(gpx_file, 'r') as f:
                    gpx = gpxpy.parse(f)
            except Exception as e:
                print(f"Error opening GPX file: {e}")
                return False
        else:
            # Create a new GPX file
            gpx = gpxpy.gpx.GPX()
            gpx.creator = "PixTrail - GPS Photo Tracker"
        
        # Create a waypoint
        waypoint = gpxpy.gpx.GPXWaypoint(
            latitude=latitude,
            longitude=longitude,
            elevation=altitude,
            time=timestamp,
            name=name
        )
        
        # Add waypoint to the GPX file
        gpx.waypoints.append(waypoint)
        
        # Add track point if there's a track
        if gpx.tracks:
            track = gpx.tracks[0]
        else:
            # Create a new track if none exists
            track = gpxpy.gpx.GPXTrack()
            gpx.tracks.append(track)
        
        # Get or create a segment
        if track.segments:
            segment = track.segments[0]
        else:
            segment = gpxpy.gpx.GPXTrackSegment()
            track.segments.append(segment)
        
        # Add a track point
        track_point = gpxpy.gpx.GPXTrackPoint(
            latitude=latitude,
            longitude=longitude,
            elevation=altitude,
            time=timestamp
        )
        segment.points.append(track_point)
        
        try:
            # Create output directory if it doesn't exist
            os.makedirs(os.path.dirname(os.path.abspath(gpx_file)), exist_ok=True)
            
            # Write the GPX file
            with open(gpx_file, 'w') as f:
                f.write(gpx.to_xml())
                
            return True
        except Exception as e:
            print(f"Error writing GPX file: {e}")
            return False