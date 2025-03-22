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
        const lat = Math.abs(latitude).toFixed(decimals);
        const lng = Math.abs(longitude).toFixed(decimals);
        
        const latDir = latitude >= 0 ? 'N' : 'S';
        const lngDir = longitude >= 0 ? 'E' : 'W';
        
        return `${lat}° ${latDir}, ${lng}° ${lngDir}`;
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

        // Sort waypoints by timestamp
        const sortedWaypoints = [...waypoints].sort((a, b) => {
            const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
            const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
            return timeA - timeB;
        });

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

        // Collect timestamps and start/end times
        stats.startTime = new Date(sortedWaypoints[0].timestamp);
        stats.endTime = new Date(sortedWaypoints[sortedWaypoints.length - 1].timestamp);
        stats.totalDuration = (stats.endTime - stats.startTime) / 1000; // in seconds

        // Process waypoints for distance, elevation, and speed
        let prevPoint = null;
        let prevElevation = null;

        for (let i = 0; i < sortedWaypoints.length; i++) {
            const point = sortedWaypoints[i];
            const timestamp = new Date(point.timestamp);

            // Track min/max elevation
            const elevation = point.altitude || 0;
            stats.minElevation = Math.min(stats.minElevation, elevation);
            stats.maxElevation = Math.max(stats.maxElevation, elevation);

            // Calculate elevation gain
            if (prevElevation !== null && elevation > prevElevation) {
                stats.elevationGain += (elevation - prevElevation);
            }
            prevElevation = elevation;

            // Add to elevation profile (distance, elevation)
            stats.elevationProfile.push({
                index: i,
                elevation: elevation
            });

            // Calculate distance and speed if we have a previous point
            if (prevPoint) {
                const distance = GPSUtils.calculateDistance(
                    prevPoint.latitude, prevPoint.longitude,
                    point.latitude, point.longitude
                );

                const timeDiff = (timestamp - new Date(prevPoint.timestamp)) / 1000; // in seconds

                // Only add distance if it's reasonable (avoid GPS jumps)
                if (distance < 10) { // Don't count jumps over 10km
                    stats.totalDistance += distance;

                    // Calculate speed if time difference is valid
                    if (timeDiff > 0) {
                        const speed = distance / timeDiff * 3600; // km/h

                        // Only count reasonable speeds (avoid GPS errors)
                        if (speed < 300) { // Max 300 km/h
                            stats.speeds.push(speed);
                            stats.maxSpeed = Math.max(stats.maxSpeed, speed);

                            // Add to speed profile (distance, speed)
                            stats.speedProfile.push({
                                index: i,
                                speed: speed
                            });
                        }
                    }
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

        return stats;
    }
};

export default GPSUtils;