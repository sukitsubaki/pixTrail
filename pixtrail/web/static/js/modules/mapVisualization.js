/**
 * Map Visualization Module
 * Handles map display, markers, and route visualization
 */

import DOMHelpers from '../utils/domHelpers.js';
import UIUtils from '../utils/uiUtils.js';
import GPSUtils from '../utils/gpsUtils.js';

class MapVisualization {
    /**
     * Initialize map visualization
     * @param {Object} config - Configuration options
     * @param {HTMLElement} config.mapContainer - Container element for the map
     * @param {HTMLElement} config.mapElement - The map element itself
     * @param {Object} [config.mapOptions] - Leaflet map options
     * @param {Object} [config.tileLayerOptions] - Tile layer options
     * @param {string} [config.tileLayerUrl] - Tile layer URL template
     * @param {string} [config.attribution] - Map attribution text
     */
    constructor(config) {
        this.config = config;
        this.mapContainer = config.mapContainer;
        this.mapElement = config.mapElement;
        this.map = null;
        this.markers = [];
        this.routeLine = null;
        
        // Internal state
        this.waypoints = [];
        
        // Initialize the map if the element is available
        if (this.mapElement) {
            this.initMap();
        }
    }
    
    /**
     * Initialize the map and base layer
     */
    initMap() {
        if (!window.L) {
            console.error('Leaflet library not loaded');
            return;
        }
        
        // Default options
        const mapOptions = this.config.mapOptions || {
            center: [0, 0],
            zoom: 2,
            scrollWheelZoom: true
        };
        
        const tileLayerUrl = this.config.tileLayerUrl || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        const attribution = this.config.attribution || '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
        
        const tileLayerOptions = {
            attribution,
            ...this.config.tileLayerOptions
        };
        
        // Create the map
        this.map = L.map(this.mapElement, mapOptions);
        
        // Add the base layer
        L.tileLayer(tileLayerUrl, tileLayerOptions).addTo(this.map);
        
        return this.map;
    }
    
    /**
     * Show the map container if it's hidden
     */
    showMapContainer() {
        if (this.mapContainer) {
            DOMHelpers.show(this.mapContainer);
            
            // Refresh map size when container becomes visible
            // (fixes issues with map not rendering correctly when container was previously hidden)
            if (this.map) {
                setTimeout(() => {
                    this.map.invalidateSize();
                }, 100);
            }
        }
    }
    
    /**
     * Set waypoints and display them on the map
     * @param {Array} waypoints - Array of waypoint objects
     */
    setWaypoints(waypoints) {
        this.waypoints = waypoints;
        this.showWaypoints();
    }
    
    /**
     * Display waypoints on the map
     */
    showWaypoints() {
        // Make sure the map is initialized
        if (!this.map) {
            this.initMap();
        }
        
        // Ensure we have waypoints
        if (!this.waypoints || this.waypoints.length === 0) {
            console.warn('No waypoints to display on map');
            return;
        }
        
        // Clear existing markers and route
        this.clearMapLayers();
        
        // Add markers for each waypoint
        const latLngs = [];
        this.waypoints.forEach(point => {
            if (!GPSUtils.validateCoordinates(point.latitude, point.longitude)) {
                console.warn(`Invalid coordinates in waypoint: ${point.name}`, point);
                return;
            }
                
            const latLng = L.latLng(point.latitude, point.longitude);
            latLngs.push(latLng);

            // Create marker with popup
            const marker = L.marker(latLng);

            // Format timestamp if available
            let timestampStr = 'Unknown time';
            if (point.timestamp) {
                const timestamp = new Date(point.timestamp);
                timestampStr = timestamp.toLocaleString();
            }

            // Create popup content
            marker.bindPopup(`
                <strong>${point.name}</strong><br>
                Lat: ${point.latitude.toFixed(6)}<br>
                Lng: ${point.longitude.toFixed(6)}<br>
                ${point.altitude ? `Altitude: ${point.altitude.toFixed(2)} m<br>` : ''}
                Time: ${timestampStr}
            `);

            // Add to map
            marker.addTo(this.map);
            this.markers.push(marker);
        });

        // Add route line
        this.routeLine = L.polyline(latLngs, {
            color: 'blue',
            weight: 3
        }).addTo(this.map);

        // Fit map to the route
        if (this.routeLine.getBounds().isValid()) {
            this.map.fitBounds(this.routeLine.getBounds(), {
                padding: [30, 30]
            });
        }
        
        // Show the map container
        this.showMapContainer();
        
        // Scroll to map
        if (this.mapContainer) {
            this.mapContainer.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }
    
    /**
     * Clear all map layers (markers and route)
     */
    clearMapLayers() {
        // Remove individual markers
        this.markers.forEach(marker => {
            if (this.map) this.map.removeLayer(marker);
        });
        this.markers = [];
        
        // Remove route line
        if (this.routeLine && this.map) {
            this.map.removeLayer(this.routeLine);
            this.routeLine = null;
        }
    }
    
    /**
     * Get the map instance
     * @returns {Object} Leaflet map instance
     */
    getMap() {
        return this.map;
    }
    
    /**
     * Get the current waypoints
     * @returns {Array} Waypoints array
     */
    getWaypoints() {
        return this.waypoints;
    }
    
    /**
     * Attach a control to the map
     * @param {Object} control - Leaflet control to add
     * @param {string} [position='topright'] - Control position
     * @returns {Object} The added control
     */
    addControl(control, position = 'topright') {
        if (this.map) {
            control.addTo(this.map);
            return control;
        }
        return null;
    }
    
    /**
     * Create and add a simple button control to the map
     * @param {string} html - Button HTML content
     * @param {Function} onClick - Click handler
     * @param {string} [position='topright'] - Control position
     * @param {string} [title=''] - Button title attribute
     * @returns {Object} The created control
     */
    addButtonControl(html, onClick, position = 'topright', title = '') {
        if (!this.map) return null;
        
        const CustomControl = L.Control.extend({
            options: {
                position: position
            },
            
            onAdd: function() {
                const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
                const button = L.DomUtil.create('a', '', container);
                button.innerHTML = html;
                button.href = '#';
                button.title = title;
                
                L.DomEvent
                    .on(button, 'click', L.DomEvent.stopPropagation)
                    .on(button, 'click', L.DomEvent.preventDefault)
                    .on(button, 'click', onClick);
                
                return container;
            }
        });
        
        const control = new CustomControl();
        return this.addControl(control, position);
    }
    
    /**
     * Center the map on a specific waypoint
     * @param {number} index - Waypoint index
     */
    centerOnWaypoint(index) {
        if (!this.map || !this.waypoints || !this.waypoints[index]) return;
        
        const waypoint = this.waypoints[index];
        this.map.setView([waypoint.latitude, waypoint.longitude], 16);
        
        // Open the popup if there's a marker
        if (this.markers[index]) {
            this.markers[index].openPopup();
        }
    }
    
    /**
     * Get the bounds of the current route/markers
     * @returns {Object|null} Leaflet bounds object or null
     */
    getBounds() {
        if (this.routeLine) {
            return this.routeLine.getBounds();
        } else if (this.markers.length > 0) {
            const bounds = L.latLngBounds();
            this.markers.forEach(marker => {
                bounds.extend(marker.getLatLng());
            });
            return bounds;
        }
        return null;
    }
    
    /**
     * Create a GeoJSON representation of the current route
     * @returns {Object} GeoJSON object
     */
    toGeoJSON() {
        const features = [];
        
        // Add waypoints as point features
        if (this.waypoints && this.waypoints.length > 0) {
            this.waypoints.forEach((point, index) => {
                if (GPSUtils.validateCoordinates(point.latitude, point.longitude)) {
                    features.push({
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [point.longitude, point.latitude]
                        },
                        properties: {
                            name: point.name,
                            timestamp: point.timestamp,
                            altitude: point.altitude,
                            index: index
                        }
                    });
                }
            });
        }
        
        // Add route as a LineString feature
        if (this.waypoints && this.waypoints.length > 1) {
            const coordinates = this.waypoints
                .filter(point => GPSUtils.validateCoordinates(point.latitude, point.longitude))
                .map(point => [point.longitude, point.latitude]);
                
            if (coordinates.length > 1) {
                features.push({
                    type: 'Feature',
                    geometry: {
                        type: 'LineString',
                        coordinates: coordinates
                    },
                    properties: {
                        name: 'Route'
                    }
                });
            }
        }
        
        // Return GeoJSON object
        return {
            type: 'FeatureCollection',
            features: features
        };
    }
}

export default MapVisualization;