/**
 * Chart Manager Module
 * Handles chart creation and management using Chart.js
 */

class ChartManager {
    /**
     * Initialize a chart manager
     * @param {Object} config - Configuration options
     * @param {HTMLElement|string} config.container - Chart container element or selector
     * @param {string} [config.type='line'] - Chart type (line, bar, pie, etc.)
     * @param {Object} [config.data] - Initial chart data
     * @param {Object} [config.options] - Chart.js options
     */
    constructor(config) {
        this.config = config;
        this.container = typeof config.container === 'string' 
            ? document.querySelector(config.container) 
            : config.container;
        this.type = config.type || 'line';
        this.data = config.data || { labels: [], datasets: [] };
        this.options = config.options || {};
        this.chart = null;
        
        // Initialize chart if container is available
        if (this.container) {
            this.initChart();
        }
    }
    
    /**
     * Initialize chart
     */
    initChart() {
        // Check if Chart.js is available
        if (!window.Chart) {
            console.error('Chart.js library not loaded');
            return;
        }
        
        // Get the canvas context
        let canvas = this.container;
        
        // If the container is not a canvas, look for one or create one
        if (!(this.container instanceof HTMLCanvasElement)) {
            canvas = this.container.querySelector('canvas');
            
            if (!canvas) {
                canvas = document.createElement('canvas');
                this.container.appendChild(canvas);
            }
        }
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Could not get canvas context');
            return;
        }
        
        // Create the chart
        this.chart = new Chart(ctx, {
            type: this.type,
            data: this.data,
            options: this.options
        });
        
        return this.chart;
    }
    
    /**
     * Update chart data
     * @param {Object} data - New chart data
     */
    updateChart(data) {
        if (!this.chart) {
            this.data = data;
            this.initChart();
            return;
        }
        
        // Update chart data
        this.chart.data = data;
        this.chart.update();
    }
    
    /**
     * Update chart options
     * @param {Object} options - New chart options
     */
    updateOptions(options) {
        if (!this.chart) {
            this.options = { ...this.options, ...options };
            this.initChart();
            return;
        }
        
        // Update chart options
        Object.assign(this.chart.options, options);
        this.chart.update();
    }
    
    /**
     * Update chart type
     * @param {string} type - New chart type
     */
    updateType(type) {
        if (!this.chart) {
            this.type = type;
            this.initChart();
            return;
        }
        
        // Chart.js doesn't support changing the chart type directly
        // We need to destroy and recreate the chart
        const data = this.chart.data;
        const options = this.chart.options;
        
        this.destroy();
        
        this.type = type;
        this.data = data;
        this.options = options;
        
        this.initChart();
    }
    
    /**
     * Get the chart instance
     * @returns {Object} Chart.js instance
     */
    getChart() {
        return this.chart;
    }
    
    /**
     * Check if chart is initialized
     * @returns {boolean} True if initialized
     */
    isInitialized() {
        return !!this.chart;
    }
    
    /**
     * Destroy chart
     */
    destroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }
    
    /**
     * Resize chart (useful after container size changes)
     */
    resize() {
        if (this.chart) {
            this.chart.resize();
        }
    }
    
    /**
     * Export chart as an image data URL
     * @param {string} [type='image/png'] - Image MIME type
     * @param {number} [quality=0.95] - Image quality (0-1) for JPEG
     * @returns {string} Data URL
     */
    toDataURL(type = 'image/png', quality = 0.95) {
        if (!this.chart) return null;
        
        return this.chart.toBase64Image(type, quality);
    }
    
    /**
     * Add dataset to chart
     * @param {Object} dataset - Dataset object
     */
    addDataset(dataset) {
        if (!this.chart) {
            if (!this.data.datasets) {
                this.data.datasets = [];
            }
            this.data.datasets.push(dataset);
            this.initChart();
            return;
        }
        
        this.chart.data.datasets.push(dataset);
        this.chart.update();
    }
    
    /**
     * Remove dataset from chart
     * @param {number} index - Dataset index
     */
    removeDataset(index) {
        if (!this.chart || !this.chart.data.datasets || index >= this.chart.data.datasets.length) {
            return;
        }
        
        this.chart.data.datasets.splice(index, 1);
        this.chart.update();
    }
    
    /**
     * Update specific dataset
     * @param {number} index - Dataset index
     * @param {Object} dataset - New dataset properties
     */
    updateDataset(index, dataset) {
        if (!this.chart || !this.chart.data.datasets || index >= this.chart.data.datasets.length) {
            return;
        }
        
        Object.assign(this.chart.data.datasets[index], dataset);
        this.chart.update();
    }
    
    /**
     * Create a predefined line chart
     * @param {HTMLElement|string} container - Chart container
     * @param {string} title - Chart title
     * @param {Array} labels - X-axis labels
     * @param {Array} data - Y-axis data
     * @param {string} [yAxisLabel=''] - Y-axis label
     * @param {string} [color='rgba(75, 192, 192, 1)'] - Line color
     * @returns {ChartManager} New chart manager instance
     */
    static createLineChart(container, title, labels, data, yAxisLabel = '', color = 'rgba(75, 192, 192, 1)') {
        return new ChartManager({
            container: container,
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: title,
                    data: data,
                    borderColor: color,
                    backgroundColor: color.replace('1)', '0.2)'),
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: !!title,
                        text: title
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: !!yAxisLabel,
                            text: yAxisLabel
                        }
                    }
                }
            }
        });
    }
    
    /**
     * Create a predefined bar chart
     * @param {HTMLElement|string} container - Chart container
     * @param {string} title - Chart title
     * @param {Array} labels - X-axis labels
     * @param {Array} data - Y-axis data
     * @param {string} [yAxisLabel=''] - Y-axis label
     * @param {string} [color='rgba(54, 162, 235, 1)'] - Bar color
     * @returns {ChartManager} New chart manager instance
     */
    static createBarChart(container, title, labels, data, yAxisLabel = '', color = 'rgba(54, 162, 235, 1)') {
        return new ChartManager({
            container: container,
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: title,
                    data: data,
                    backgroundColor: color.replace('1)', '0.6)'),
                    borderColor: color,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: !!title,
                        text: title
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: !!yAxisLabel,
                            text: yAxisLabel
                        }
                    }
                }
            }
        });
    }
}

export default ChartManager;