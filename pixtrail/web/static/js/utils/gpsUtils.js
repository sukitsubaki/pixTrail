/**
 * GPS Utility Functions
 * Helper functions for working with GPS data and coordinates
 */

const GPSUtils = {
    /**
     * Convert GPS coordinates in degrees, minutes, seconds format to decimal degrees
     * @param {number} degrees - Degrees component
     * @param {number} minutes - Minutes component
     * @param {number} seconds - Seconds component
     * @param {string} direction - Direction reference (N, S, E, W)
     * @returns {number} Decimal degrees
     */
    convertDMSToDD: (degrees, minutes, seconds, direction) => {
        let dd = degrees + (minutes / 60.0) + (seconds / 3600.0);
        
        if (direction === "S" || direction === "W") {
            dd = -dd;
        }
        
        return dd;
    },
    
    /**
     * Calculate distance between two GPS coordinates using the Haversine formula
     * @param {number} lat1 - Latitude of first point in decimal degrees
     * @param {number} lon1 - Longitude of first point in decimal degrees
     * @param {number} lat2 - Latitude of second point in decimal degrees
     * @param {number} lon2 - Longitude of second point in decimal degrees
     * @returns {number} Distance in kilometers
     */
    calculateDistance: (lat1, lon1, lat2, lon2) => {
        if (!GPSUtils.validateCoordinates(lat1, lon1) || !GPSUtils.validateCoordinates(lat2, lon2)) {
            console.warn('Invalid coordinates for distance calculation');
            return 0;
        }
        
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
                  
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    },
    
    /**
     * Calculate speed between two points with timestamps
     * @param {number} lat1 - Latitude of first point
     * @param {number} lon1 - Longitude of first point
     * @param {Date|string} time1 - Timestamp of first point
     * @param {number} lat2 - Latitude of second point
     * @param {number} lon2 - Longitude of second point
     * @param {Date|string} time2 - Timestamp of second point
     * @returns {number} Speed in km/h
     */
    calculateSpeed: (lat1, lon1, time1, lat2, lon2, time2) => {
        // Convert string dates to Date objects if needed
        const t1 = time1 instanceof Date ? time1 : new Date(time1);
        const t2 = time2 instanceof Date ? time2 : new Date(time2);
        
        // Check if dates are valid
        if (isNaN(t1.getTime()) || isNaN(t2.getTime())) {
            console.warn('Invalid timestamps for speed calculation');
            return 0;
        }
        
        // Calculate distance
        const distance = GPSUtils.calculateDistance(lat1, lon1, lat2, lon2);
        
        // Calculate time difference in hours
        const timeDiff = (t2 - t1) / (1000 * 60 * 60);
        
        // Calculate speed in km/h
        if (timeDiff > 0) {
            return distance / timeDiff;
        }
        
        return 0;
    },
    
    /**
     * Check if GPS coordinates are valid
     * @param {number} latitude - Latitude to validate (-90 to 90)
     * @param {number} longitude - Longitude to validate (-180 to 180)
     * @returns {boolean} True if coordinates are valid
     */
    validateCoordinates: (latitude, longitude) => {
        return typeof latitude === 'number' && 
               typeof longitude === 'number' &&
               !isNaN(latitude) && !isNaN(longitude) &&
               latitude >= -90 && latitude <= 90 &&
               longitude >= -180 && longitude <= 180;
    },
    
    /**
     * Get the center point of multiple coordinates
     * @param {Array<{latitude: number, longitude: number}>} points - Array of points with lat/lng
     * @returns {{latitude: number, longitude: number}} The center point
     */
    getCenter: (points) => {
        if (!points || points.length === 0) {
            return { latitude: 0, longitude: 0 };
        }
        
        // If only one point, return it
        if (points.length === 1) {
            return { 
                latitude: points[0].latitude, 
                longitude: points[0].longitude 
            };
        }
        
        // Calculate the center of multiple points
        let x = 0;
        let y = 0;
        let z = 0;
        
        for (const point of points) {
            // Convert to radians
            const lat = point.latitude * Math.PI / 180;
            const lon = point.longitude * Math.PI / 180;
            
            // Convert to Cartesian coordinates
            x += Math.cos(lat) * Math.cos(lon);
            y += Math.cos(lat) * Math.sin(lon);
            z += Math.sin(lat);
        }
        
        // Divide by number of points
        x /= points.length;
        y /= points.length;
        z /= points.length;
        
        // Convert back to latitude/longitude
        const lon = Math.atan2(y, x);
        const hyp = Math.sqrt(x * x + y * y);
        const lat = Math.atan2(z, hyp);
        
        // Convert to degrees
        return { 
            latitude: lat * 180 / Math.PI, 
            longitude: lon * 180 / Math.PI 
        };
    },
    
    /**
     * Format coordinates for display in a user-friendly way
     * @param {number} latitude - Latitude in decimal degrees
     * @param {number} longitude - Longitude in decimal degrees
     * @param {number} [decimals=6] - Number of decimal places
     * @returns {string} Formatted coordinates
     */
    formatCoordinates: (latitude, longitude, decimals = 6) => {
        if (!GPSUtils.validateCoordinates(latitude, longitude)) {
            return 'Invalid coordinates';
        }
        
        const lat = Math.abs(latitude).toFixed(decimals);
        const lng = Math.abs(longitude).toFixed(decimals);
        
        const latDir = latitude >= 0 ? 'N' : 'S';
        const lngDir = longitude >= 0 ? 'E' : 'W';
        
        return `${lat}° ${latDir}, ${lng}° ${lngDir}`;
    },
    
    /**
     * Parse a timestamp string or convert timestamp to Date object
     * @param {string|Date} timestamp - Timestamp to parse
     * @returns {Date|null} Date object or null if invalid
     */
    parseTimestamp: (timestamp) => {
        if (!timestamp) return null;
        
        // If already a Date object, return it
        if (timestamp instanceof Date) {
            return isNaN(timestamp.getTime()) ? null : timestamp;
        }
        
        // Try to parse as ISO string
        try {
            const date = new Date(timestamp);
            return isNaN(date.getTime()) ? null : date;
        } catch (e) {
            console.warn(`Failed to parse timestamp: ${timestamp}`, e);
            return null;
        }
    },
    
    /**
     * Calculate statistics for a set of GPS data points
     * @param {Array<{latitude: number, longitude: number, timestamp: Date|string, altitude: number}>} waypoints - GPS data points
     * @returns {Object} Statistics object with various metrics
     */
    calculateRouteStatistics: (waypoints) => {
        if (!waypoints || waypoints.length < 2) {
            console.log("Not enough waypoints for statistics");
            return null;
        }

        // Create a copy of waypoints to avoid modifying the original
        const waypointsCopy = waypoints.map(wp => ({ ...wp }));

        // Convert timestamp strings to Date objects and validate
        waypointsCopy.forEach(wp => {
            if (wp.timestamp) {
                wp.timestamp = GPSUtils.parseTimestamp(wp.timestamp);
            }
        });

        // Filter out waypoints with invalid coordinates
        const validWaypoints = waypointsCopy.filter(wp => 
            GPSUtils.validateCoordinates(wp.latitude, wp.longitude)
        );

        if (validWaypoints.length < 2) {
            console.log("Not enough valid waypoints for statistics");
            return null;
        }

        // Sort waypoints by timestamp (if available)
        const validTimestampWaypoints = validWaypoints.filter(wp => wp.timestamp !== null);
        
        // Sort only if we have waypoints with valid timestamps
        const sortedWaypoints = validTimestampWaypoints.length > 1 
            ? [...validTimestampWaypoints].sort((a, b) => a.timestamp - b.timestamp)
            : validWaypoints;

        // Initialize statistics object
        const stats = {
            totalDistance: 0,
            totalDuration: 0,
            startTime: null,
            endTime: null,
            avgSpeed: 0,
            maxSpeed: 0,
            speeds: [],
            minElevation: Infinity,
            maxElevation: -Infinity,
            elevationGain: 0,
            photoCount: sortedWaypoints.length,
            elevationProfile: [],
            speedProfile: []
        };

        // Set start/end times if we have valid timestamps
        if (validTimestampWaypoints.length > 1) {
            stats.startTime = sortedWaypoints[0].timestamp;
            stats.endTime = sortedWaypoints[sortedWaypoints.length - 1].timestamp;
            stats.totalDuration = (stats.endTime - stats.startTime) / 1000; // in seconds
        }

        // Process waypoints for distance, elevation, and speed
        let prevPoint = null;
        let prevElevation = null;

        for (let i = 0; i < sortedWaypoints.length; i++) {
            const point = sortedWaypoints[i];

            // Track min/max elevation
            if (typeof point.altitude === 'number' && !isNaN(point.altitude)) {
                const elevation = point.altitude;
                stats.minElevation = Math.min(stats.minElevation, elevation);
                stats.maxElevation = Math.max(stats.maxElevation, elevation);

                // Calculate elevation gain
                if (prevElevation !== null && elevation > prevElevation) {
                    stats.elevationGain += (elevation - prevElevation);
                }
                prevElevation = elevation;

                // Add to elevation profile
                stats.elevationProfile.push({
                    index: i,
                    elevation: elevation
                });
            }

            // Calculate distance and speed if we have a previous point
            if (prevPoint) {
                try {
                    const distance = GPSUtils.calculateDistance(
                        prevPoint.latitude, prevPoint.longitude,
                        point.latitude, point.longitude
                    );

                    // Only add distance if it's reasonable (avoid GPS jumps)
                    if (distance < 10) { // Don't count jumps over 10km
                        stats.totalDistance += distance;

                        // Calculate speed if both points have valid timestamps
                        if (point.timestamp && prevPoint.timestamp) {
                            const timeDiff = (point.timestamp - prevPoint.timestamp) / 1000; // in seconds

                            // Only calculate speed if time difference is valid
                            if (timeDiff > 0) {
                                const speed = distance / timeDiff * 3600; // km/h

                                // Only count reasonable speeds (avoid GPS errors)
                                if (speed < 300) { // Max 300 km/h
                                    stats.speeds.push(speed);
                                    stats.maxSpeed = Math.max(stats.maxSpeed, speed);

                                    // Add to speed profile
                                    stats.speedProfile.push({
                                        index: i,
                                        speed: speed
                                    });
                                }
                            }
                        }
                    }
                } catch (e) {
                    console.warn(`Error calculating distance between waypoints: ${e.message}`);
                }
            }

            prevPoint = point;
        }

        // Calculate average speed (if we have valid speeds)
        if (stats.speeds.length > 0) {
            stats.avgSpeed = stats.speeds.reduce((sum, speed) => sum + speed, 0) / stats.speeds.length;
        } else if (stats.totalDistance > 0 && stats.totalDuration > 0) {
            // Fallback: calculate average speed from total distance and duration
            stats.avgSpeed = stats.totalDistance / (stats.totalDuration / 3600); // km/h
        }

        // If no elevation changes were found, reset min/max
        if (stats.minElevation === Infinity) stats.minElevation = 0;
        if (stats.maxElevation === -Infinity) stats.maxElevation = 0;

        // Round values for better display
        stats.totalDistance = parseFloat(stats.totalDistance.toFixed(2));
        stats.avgSpeed = parseFloat(stats.avgSpeed.toFixed(2));
        stats.maxSpeed = parseFloat(stats.maxSpeed.toFixed(2));
        stats.minElevation = parseFloat(stats.minElevation.toFixed(1));
        stats.maxElevation = parseFloat(stats.maxElevation.toFixed(1));
        stats.elevationGain = parseFloat(stats.elevationGain.toFixed(1));

        return stats;
    }
};

export default GPSUtils;
