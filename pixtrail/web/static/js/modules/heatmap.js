/**
 * Heatmap Module
 * Handles heatmap visualization on the map
 */

import DOMHelpers from '../utils/domHelpers.js';
import UIUtils from '../utils/uiUtils.js';

class Heatmap {
    /**
     * Initialize heatmap functionality
     * @param {Object} config - Configuration options
     * @param {Object} config.map - Leaflet map instance
     * @param {HTMLElement} [config.toggleButton] - Button to toggle heatmap
     * @param {Object} [config.heatmapOptions] - Leaflet.heat options
     */
    constructor(config) {
        this.config = config;
        this.map = config.map;
        this.toggleButton = config.toggleButton;
        this.heatLayer = null;
        this.heatmapVisible = false;
        this.waypoints = [];
        
        // Default heatmap options
        this.heatmapOptions = config.heatmapOptions || {
            radius: 25,
            blur: 15,
            maxZoom: 17,
            gradient: {
                0.4: 'blue',
                0.6: 'lime',
                0.8: 'yellow',
                1.0: 'red'
            }
        };
        
        // Initialize
        this.init();
    }
    
    /**
     * Initialize event listeners
     */
    init() {
        // Check if Leaflet.heat plugin is available
        if (!window.L || !L.heatLayer) {
            console.warn('Leaflet.heat plugin not loaded correctly. Heatmap functionality is disabled.');
            return;
        }
        
        // Set up toggle button
        if (this.toggleButton) {
            DOMHelpers.on(this.toggleButton, 'click', this.toggle.bind(this));
        }
    }
    
    /**
     * Set waypoints data
     * @param {Array} waypoints - Array of waypoint objects
     */
    setWaypoints(waypoints) {
        this.waypoints = waypoints;
        
        // Recreate heatmap if it's currently visible
        if (this.heatmapVisible) {
            this.show();
        }
    }
    
    /**
     * Toggle heatmap visibility
     */
    toggle() {
        if (this.heatmapVisible) {
            this.hide();
        } else {
            this.show();
        }
    }
    
    /**
     * Show heatmap
     */
    show() {
        if (!this.map) {
            console.warn('Map not available for heatmap');
            return;
        }
        
        // Check if Leaflet.heat is available
        if (typeof L.heatLayer !== 'function') {
            console.error("Leaflet.heat plugin not loaded correctly");
            if (this.config.onError) {
                this.config.onError('Heatmap feature unavailable. Missing Leaflet.heat plugin.');
            }
            return;
        }
        
        // Remove existing heatmap if it exists
        if (this.heatLayer) {
            this.map.removeLayer(this.heatLayer);
            this.heatLayer = null;
        }
        
        // We need waypoints to create a heatmap
        if (!this.waypoints || this.waypoints.length === 0) {
            if (this.config.onError) {
                this.config.onError('No GPS data available for heatmap');
            }
            return;
        }
        
        // Prepare data points for the heatmap
        // We'll use the same locations as the markers, but calculate intensity based on:
        // 1. Photos taken at the same location (higher intensity)
        // 2. Time spent at a location (calculated from timestamps)
        const heatData = this.prepareHeatmapData();
        
        // Create the heatmap layer
        this.heatLayer = L.heatLayer(heatData, this.heatmapOptions).addTo(this.map);
        
        // Update state
        this.heatmapVisible = true;
        
        // Update toggle button if present
        if (this.toggleButton) {
            this.toggleButton.textContent = 'Hide Heatmap';
            this.toggleButton.classList.add('active');
        }
    }
    
    /**
     * Hide heatmap
     */
    hide() {
        // Hide heatmap
        if (this.heatLayer && this.map) {
            this.map.removeLayer(this.heatLayer);
            this.heatLayer = null;
        }
        
        // Update state
        this.heatmapVisible = false;
        
        // Update toggle button if present
        if (this.toggleButton) {
            this.toggleButton.textContent = 'Show Heatmap';
            this.toggleButton.classList.remove('active');
        }
    }
    
    /**
     * Prepare data for the heatmap layer
     * @returns {Array} Array of heatmap data points
     */
    prepareHeatmapData() {
        const heatData = [];
        const locationGroups = {};
        
        // Group photos by location (using a grid approach to group nearby points)
        this.waypoints.forEach(point => {
            // Skip points with invalid coordinates
            if (!point.latitude || !point.longitude) {
                return;
            }
            
            // Extract timestamp from waypoint data
            let timestamp = null;
            if (point.timestamp) {
                timestamp = new Date(point.timestamp);
            }
            
            // Create a grid key by rounding coordinates (groups nearby points)
            // Using 5 decimal places (~1m precision at the equator)
            const gridKey = `${Math.round(point.latitude * 100000) / 100000},${Math.round(point.longitude * 100000) / 100000}`;
            
            if (!locationGroups[gridKey]) {
                locationGroups[gridKey] = {
                    lat: point.latitude,
                    lng: point.longitude,
                    count: 0,
                    timestamps: []
                };
            }
            
            locationGroups[gridKey].count++;
            if (timestamp) {
                locationGroups[gridKey].timestamps.push(timestamp);
            }
        });
        
        // Calculate duration for each location group and prepare heatmap data
        Object.values(locationGroups).forEach(group => {
            let intensity = group.count; // Base intensity on number of photos
            
            // If we have timestamps, calculate duration
            if (group.timestamps.length > 1) {
                // Sort timestamps
                group.timestamps.sort((a, b) => a - b);
                
                // Calculate time span in minutes
                const duration = (group.timestamps[group.timestamps.length - 1] - group.timestamps[0]) / (1000 * 60);
                
                // Add duration to intensity (more time spent = higher intensity)
                // Cap duration contribution to avoid extreme values
                intensity += Math.min(duration / 10, 10);
            }
            
            // Add to heatmap data with calculated intensity
            heatData.push([group.lat, group.lng, intensity]);
        });
        
        return heatData;
    }
    
    /**
     * Update heatmap options
     * @param {Object} options - New options to apply
     */
    updateOptions(options) {
        this.heatmapOptions = {
            ...this.heatmapOptions,
            ...options
        };
        
        // Recreate heatmap if it's currently visible
        if (this.heatmapVisible) {
            this.show();
        }
    }
    
    /**
     * Check if heatmap is currently visible
     * @returns {boolean} True if visible
     */
    isVisible() {
        return this.heatmapVisible;
    }
}

export default Heatmap;