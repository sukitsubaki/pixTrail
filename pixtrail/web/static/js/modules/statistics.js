/**
 * Statistics Module
 * Handles route statistics calculation and display
 */

import DOMHelpers from '../utils/domHelpers.js';
import UIUtils from '../utils/uiUtils.js';
import GPSUtils from '../utils/gpsUtils.js';
import ChartManager from './charts.js';

class Statistics {
    /**
     * Initialize statistics functionality
     * @param {Object} config - Configuration options
     * @param {HTMLElement} config.container - Statistics container element
     * @param {HTMLElement} [config.toggleButton] - Button to toggle statistics panel
     * @param {Object} [config.elements] - Object mapping statistic IDs to their display elements
     * @param {HTMLElement} [config.elevationChartContainer] - Elevation chart container
     * @param {HTMLElement} [config.speedChartContainer] - Speed chart container
     */
    constructor(config) {
        this.config = config;
        this.container = config.container;
        this.toggleButton = config.toggleButton;
        this.elements = config.elements || {};
        this.statisticsVisible = false;
        this.routeStatistics = null;
        this.waypoints = [];
        
        // Chart managers
        this.elevationChart = null;
        this.speedChart = null;
        
        if (config.elevationChartContainer) {
            this.elevationChart = new ChartManager({
                container: config.elevationChartContainer,
                type: 'line',
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: false,
                            title: {
                                display: true,
                                text: 'Elevation (m)'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Photo Index'
                            }
                        }
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    return `Elevation: ${context.raw.toFixed(1)} m`;
                                }
                            }
                        }
                    }
                }
            });
        }
        
        if (config.speedChartContainer) {
            this.speedChart = new ChartManager({
                container: config.speedChartContainer,
                type: 'line',
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Speed (km/h)'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Segment Index'
                            }
                        }
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    return `Speed: ${context.raw.toFixed(1)} km/h`;
                                }
                            }
                        }
                    }
                }
            });
        }
        
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
    }
    
    /**
     * Set waypoints data and calculate statistics
     * @param {Array} waypoints - Array of waypoint objects
     */
    setWaypoints(waypoints) {
        this.waypoints = waypoints;
        this.calculateStatistics();
        
        // Update display if statistics panel is visible
        if (this.statisticsVisible) {
            this.updateDisplay();
        }
    }
    
    /**
     * Calculate statistics from waypoints
     */
    calculateStatistics() {
        if (!this.waypoints || this.waypoints.length < 2) {
            console.log("Not enough waypoints for statistics");
            this.routeStatistics = null;
            return;
        }
        
        // Use the GPSUtils calculateRouteStatistics function
        this.routeStatistics = GPSUtils.calculateRouteStatistics(this.waypoints);
    }
    
    /**
     * Toggle statistics panel visibility
     */
    toggle() {
        if (this.statisticsVisible) {
            this.hide();
        } else {
            this.show();
        }
    }
    
    /**
     * Show statistics panel
     */
    show() {
        if (!this.container) return;
        
        // Calculate statistics if needed
        if (!this.routeStatistics) {
            this.calculateStatistics();
        }
        
        // Update the display
        this.updateDisplay();
        
        // Show the container
        DOMHelpers.show(this.container);
        
        // Update state
        this.statisticsVisible = true;
        
        // Update toggle button if present
        if (this.toggleButton) {
            this.toggleButton.textContent = 'Hide Statistics';
            this.toggleButton.classList.add('active');
        }
        
        // Scroll to statistics
        this.container.scrollIntoView({
            behavior: 'smooth'
        });
    }
    
    /**
     * Hide statistics panel
     */
    hide() {
        if (!this.container) return;
        
        // Hide the container
        DOMHelpers.hide(this.container);
        
        // Update state
        this.statisticsVisible = false;
        
        // Update toggle button if present
        if (this.toggleButton) {
            this.toggleButton.textContent = 'Show Statistics';
            this.toggleButton.classList.remove('active');
        }
    }
    
    /**
     * Update statistics display
     */
    updateDisplay() {
        // Check if we have statistics
        if (!this.routeStatistics) {
            console.warn('No statistics available to display');
            return;
        }
        
        // Update summary statistics elements
        this.updateElement('total-distance', `${this.routeStatistics.totalDistance.toFixed(2)} km`);
        this.updateElement('total-duration', UIUtils.formatDuration(this.routeStatistics.totalDuration));
        this.updateElement('start-time', UIUtils.formatDate(this.routeStatistics.startTime));
        this.updateElement('end-time', UIUtils.formatDate(this.routeStatistics.endTime));
        this.updateElement('avg-speed', `${this.routeStatistics.avgSpeed.toFixed(2)} km/h`);
        this.updateElement('max-speed', `${this.routeStatistics.maxSpeed.toFixed(2)} km/h`);
        this.updateElement('min-elevation', `${this.routeStatistics.minElevation.toFixed(1)} m`);
        this.updateElement('max-elevation', `${this.routeStatistics.maxElevation.toFixed(1)} m`);
        this.updateElement('elevation-gain', `${this.routeStatistics.elevationGain.toFixed(1)} m`);
        this.updateElement('photo-count', this.routeStatistics.photoCount.toString());
        
        // Create or update charts
        this.updateCharts();
    }
    
    /**
     * Update an individual statistic element
     * @param {string} id - Element ID or key in elements object
     * @param {string} value - Value to set
     */
    updateElement(id, value) {
        const element = this.elements[id] || DOMHelpers.getById(id);
        if (element) {
            element.textContent = value;
        }
    }
    
    /**
     * Update charts with current statistics data
     */
    updateCharts() {
        if (!this.routeStatistics) return;
        
        // Update elevation chart
        if (this.elevationChart && this.routeStatistics.elevationProfile) {
            const labels = this.routeStatistics.elevationProfile.map((_, index) => index + 1);
            const data = this.routeStatistics.elevationProfile.map(point => point.elevation);
            
            this.elevationChart.updateChart({
                labels: labels,
                datasets: [{
                    label: 'Elevation (m)',
                    data: data,
                    fill: true,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    tension: 0.4
                }]
            });
        }
        
        // Update speed chart
        if (this.speedChart && this.routeStatistics.speedProfile) {
            const labels = this.routeStatistics.speedProfile.map((_, index) => index + 1);
            const data = this.routeStatistics.speedProfile.map(point => point.speed);
            
            this.speedChart.updateChart({
                labels: labels,
                datasets: [{
                    label: 'Speed (km/h)',
                    data: data,
                    fill: false,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    tension: 0.1
                }]
            });
        }
    }
    
    /**
     * Check if statistics panel is currently visible
     * @returns {boolean} True if visible
     */
    isVisible() {
        return this.statisticsVisible;
    }
    
    /**
     * Get the current route statistics object
     * @returns {Object} Statistics object
     */
    getStatistics() {
        return this.routeStatistics;
    }
    
    /**
     * Export statistics as a formatted text report
     * @returns {string} Report text
     */
    exportReport() {
        if (!this.routeStatistics) return '';
        
        const stats = this.routeStatistics;
        const lines = [
            'PixTrail Route Statistics Report',
            '===============================',
            '',
            `Photos: ${stats.photoCount}`,
            `Distance: ${stats.totalDistance.toFixed(2)} km`,
            `Duration: ${UIUtils.formatDuration(stats.totalDuration)}`,
            '',
            `Start: ${UIUtils.formatDate(stats.startTime)}`,
            `End: ${UIUtils.formatDate(stats.endTime)}`,
            '',
            'Speed:',
            `- Average: ${stats.avgSpeed.toFixed(2)} km/h`,
            `- Maximum: ${stats.maxSpeed.toFixed(2)} km/h`,
            '',
            'Elevation:',
            `- Minimum: ${stats.minElevation.toFixed(1)} m`,
            `- Maximum: ${stats.maxElevation.toFixed(1)} m`,
            `- Gain: ${stats.elevationGain.toFixed(1)} m`,
            '',
            'Generated by PixTrail - GPS Photo Tracker'
        ];
        
        return lines.join('\n');
    }
}

export default Statistics;