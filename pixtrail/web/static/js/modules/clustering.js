/**
 * Clustering Module
 * Handles marker clustering on the map
 */

import DOMHelpers from '../utils/domHelpers.js';
import UIUtils from '../utils/uiUtils.js';
import GPSUtils from '../utils/gpsUtils.js';

class MarkerClustering {
    /**
     * Initialize marker clustering functionality
     * @param {Object} config - Configuration options
     * @param {Object} config.map - Leaflet map instance
     * @param {HTMLElement} [config.toggleButton] - Button to toggle clustering
     * @param {HTMLElement} [config.radiusSlider] - Slider to control cluster radius
     * @param {HTMLElement} [config.radiusValue] - Element to display radius value
     * @param {HTMLElement} [config.clusterOptions] - Container for cluster options
     * @param {Object} [config.clusteringOptions] - Leaflet.markercluster options
     */
    constructor(config) {
        this.config = config;
        this.map = config.map;
        this.toggleButton = config.toggleButton;
        this.radiusSlider = config.radiusSlider;
        this.radiusValue = config.radiusValue;
        this.clusterOptions = config.clusterOptions;
        
        this.markerClusterGroup = null;
        this.clusteringEnabled = false;
        this.markers = [];
        this.waypoints = [];
        this.clusterRadius = config.initialRadius || 80;
        
        // Default clustering options
        this.clusteringOptions = config.clusteringOptions || {
            maxClusterRadius: this.clusterRadius,
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: true,
            zoomToBoundsOnClick: true,
            chunkedLoading: true
        };
        
        // Initialize
        this.init();
    }
    
    /**
     * Initialize event listeners
     */
    init() {
        // Set up toggle button
        if (this.toggleButton) {
            DOMHelpers.on(this.toggleButton, 'click', this.toggle.bind(this));
        }
        
        // Set up radius slider
        if (this.radiusSlider) {
            DOMHelpers.on(this.radiusSlider, 'input', this.handleRadiusChange.bind(this));
            
            // Initialize radius value display
            if (this.radiusValue) {
                this.radiusValue.textContent = `${this.clusterRadius}px`;
            }
        }
    }
    
    /**
     * Set waypoints data
     * @param {Array} waypoints - Array of waypoint objects
     */
    setWaypoints(waypoints) {
        this.waypoints = waypoints || [];
        
        // Create markers from waypoints if we don't have markers yet
        if (this.markers.length === 0 && this.waypoints.length > 0) {
            this.createMarkersFromWaypoints();
        }
        
        // Recreate clustering if it's currently enabled
        if (this.clusteringEnabled) {
            this.enable();
        }
    }
    
    /**
     * Set individual markers that will be clustered
     * @param {Array} markers - Array of Leaflet marker objects
     */
    setMarkers(markers) {
        this.markers = markers || [];
        
        // Recreate clustering if it's currently enabled
        if (this.clusteringEnabled) {
            this.enable();
        }
    }
    
    /**
     * Toggle clustering on/off
     */
    toggle() {
        if (this.clusteringEnabled) {
            this.disable();
        } else {
            this.enable();
        }
    }
    
    /**
     * Enable clustering
     */
    enable() {
        if (!this.map) {
            console.warn('Map not available for clustering');
            if (this.config.onError) {
                this.config.onError('Clustering error: Map not available');
            }
            return;
        }
        
        // Check if Leaflet is available
        if (typeof L === 'undefined') {
            console.error("Leaflet library not loaded correctly");
            if (this.config.onError) {
                this.config.onError('Clustering feature unavailable. Leaflet library not loaded correctly.');
            }
            return;
        }
        
        // Check if plugin is available
        if (typeof L.MarkerClusterGroup !== 'function') {
            console.error("Leaflet.markercluster plugin not loaded correctly");
            if (this.config.onError) {
                this.config.onError('Clustering feature unavailable. Make sure Leaflet.markercluster plugin is properly loaded.');
            }
            return;
        }
        
        // If no markers and no waypoints, nothing to do
        if (this.markers.length === 0 && this.waypoints.length === 0) {
            if (this.config.onError) {
                this.config.onError('No GPS data available for clustering');
            }
            return;
        }
        
        // Create markers from waypoints if we don't have markers yet
        if (this.markers.length === 0 && this.waypoints.length > 0) {
            this.createMarkersFromWaypoints();
        }
        
        // If still no markers, nothing to do
        if (this.markers.length === 0) {
            if (this.config.onError) {
                this.config.onError('No markers available for clustering');
            }
            return;
        }
        
        // Remove individual markers from map
        this.markers.forEach(marker => {
            if (marker._map) {
                this.map.removeLayer(marker);
            }
        });
        
        // Remove existing cluster group if it exists
        if (this.markerClusterGroup && this.markerClusterGroup._map) {
            this.map.removeLayer(this.markerClusterGroup);
        }
        
        try {
            // Update options with current radius
            const options = {
                ...this.clusteringOptions,
                maxClusterRadius: this.clusterRadius
            };
            
            // Create marker cluster group
            this.markerClusterGroup = L.markerClusterGroup(options);
            
            // Add existing markers to cluster group
            this.markers.forEach(marker => {
                this.markerClusterGroup.addLayer(marker);
            });
            
            // Add cluster group to map
            this.map.addLayer(this.markerClusterGroup);
            
            // Update state
            this.clusteringEnabled = true;
            
            // Update UI
            if (this.toggleButton) {
                this.toggleButton.textContent = 'Disable Clustering';
                this.toggleButton.classList.add('active');
            }
            
            if (this.clusterOptions) {
                DOMHelpers.show(this.clusterOptions);
            }
        } catch (error) {
            console.error("Error enabling clustering:", error);
            if (this.config.onError) {
                this.config.onError(`Clustering error: ${error.message}`);
            }
            
            // Restore individual markers
            this.markers.forEach(marker => {
                if (!marker._map) {
                    marker.addTo(this.map);
                }
            });
        }
    }
    
    /**
     * Disable clustering
     */
    disable() {
        try {
            // Remove cluster group from map
            if (this.markerClusterGroup && this.map) {
                this.map.removeLayer(this.markerClusterGroup);
                this.markerClusterGroup = null;
            }
            
            // Add individual markers back to map
            this.markers.forEach(marker => {
                if (!marker._map) {
                    marker.addTo(this.map);
                }
            });
            
            // Update state
            this.clusteringEnabled = false;
            
            // Update UI
            if (this.toggleButton) {
                this.toggleButton.textContent = 'Enable Clustering';
                this.toggleButton.classList.remove('active');
            }
            
            if (this.clusterOptions) {
                DOMHelpers.hide(this.clusterOptions);
            }
        } catch (error) {
            console.error("Error disabling clustering:", error);
            if (this.config.onError) {
                this.config.onError(`Error disabling clustering: ${error.message}`);
            }
        }
    }
    
    /**
     * Handle radius slider change
     * @param {Event} event - Input event
     */
    handleRadiusChange(event) {
        this.clusterRadius = parseInt(event.target.value, 10);
        
        // Update display
        if (this.radiusValue) {
            this.radiusValue.textContent = `${this.clusterRadius}px`;
        }
        
        // Update cluster radius if clustering is enabled
        if (this.clusteringEnabled) {
            this.updateClusterRadius();
        }
    }
    
    /**
     * Update cluster radius
     */
    updateClusterRadius() {
        // If clustering not enabled or no cluster group, nothing to do
        if (!this.clusteringEnabled || !this.markerClusterGroup) {
            return;
        }
        
        // Recreate cluster group with new radius
        this.enable();
    }
    
    /**
     * Create markers from waypoints
     */
    createMarkersFromWaypoints() {
        if (!this.waypoints || this.waypoints.length === 0) {
            return;
        }
        
        this.markers = [];
        
        this.waypoints.forEach(point => {
            if (!GPSUtils.validateCoordinates(point.latitude, point.longitude)) {
                return;
            }
            
            const latLng = L.latLng(point.latitude, point.longitude);
            
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
            
            this.markers.push(marker);
        });
    }
    
    /**
     * Check if clustering is currently enabled
     * @returns {boolean} True if enabled
     */
    isEnabled() {
        return this.clusteringEnabled;
    }
    
    /**
     * Get the current cluster radius
     * @returns {number} Cluster radius in pixels
     */
    getRadius() {
        return this.clusterRadius;
    }
    
    /**
     * Set cluster radius
     * @param {number} radius - New radius in pixels
     */
    setRadius(radius) {
        this.clusterRadius = radius;
        
        // Update slider if it exists
        if (this.radiusSlider) {
            this.radiusSlider.value = radius;
        }
        
        // Update display
        if (this.radiusValue) {
            this.radiusValue.textContent = `${radius}px`;
        }
        
        // Update clustering if enabled
        if (this.clusteringEnabled) {
            this.updateClusterRadius();
        }
    }
}

export default MarkerClustering;
