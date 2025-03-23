/**
 * PixTrail - Main JavaScript
 * Entry point for the PixTrail web interface
 */

import DOMHelpers from './utils/domHelpers.js';
import UIUtils from './utils/uiUtils.js';
import APIClient from './api/apiClient.js';
import DragAndDrop from './modules/dragAndDrop.js';
import FileUpload from './modules/fileUpload.js';
import MapVisualization from './modules/mapVisualization.js';
import Heatmap from './modules/heatmap.js';
import MarkerClustering from './modules/clustering.js';
import Statistics from './modules/statistics.js';

document.addEventListener('DOMContentLoaded', function () {
    // Initialize the application
    const PixTrail = {
        // State
        activeInput: 'file',
        waypoints: [],
        sessionId: null,
        gpxFilename: null,
        
        // Elements
        photoInput: DOMHelpers.getById('photo-input'),
        directoryInput: DOMHelpers.getById('directory-input'),
        selectedFilesCount: DOMHelpers.getById('selected-files-count'),
        selectedDirectory: DOMHelpers.getById('selected-directory'),
        processForm: DOMHelpers.getById('process-form'),
        processButton: DOMHelpers.getById('process-button'),
        processProgress: DOMHelpers.getById('process-progress'),
        progressBar: DOMHelpers.get('.progress-bar', DOMHelpers.getById('process-progress')),
        progressText: DOMHelpers.get('.progress-text', DOMHelpers.getById('process-progress')),
        mapContainer: DOMHelpers.getById('map-container'),
        mapElement: DOMHelpers.getById('map'),
        statisticsContainer: DOMHelpers.getById('statistics-container'),
        downloadButton: DOMHelpers.getById('download-gpx'),
        clearButton: DOMHelpers.getById('clear-data'),
        statusMessages: DOMHelpers.getById('status-messages'),
        selectorTabs: DOMHelpers.getAll('.selector-tab'),
        recursiveCheckbox: DOMHelpers.getById('recursive-checkbox'),
        depthSelector: DOMHelpers.getById('depth-selector'),
        fileDropArea: DOMHelpers.getById('file-drop-area'),
        directoryDropArea: DOMHelpers.getById('directory-drop-area'),
        clusterOptions: DOMHelpers.getById('cluster-options'),
        clusterRadiusSlider: DOMHelpers.getById('cluster-radius'),
        radiusValueDisplay: DOMHelpers.getById('radius-value'),
        toggleHeatmapButton: DOMHelpers.getById('toggle-heatmap'),
        toggleClusteringButton: DOMHelpers.getById('toggle-clustering'),
        toggleStatisticsButton: DOMHelpers.getById('toggle-statistics'),
        elevationChart: DOMHelpers.getById('elevation-chart'),
        speedChart: DOMHelpers.getById('speed-chart'),
        
        /**
         * Initialize the application
         */
        init: function() {
            // Initialize modules
            this.initModules();
            
            // Initialize event listeners
            this.initEventListeners();
        },
        
        /**
         * Initialize modules
         */
        initModules: function() {
            // Initialize input tabs
            UIUtils.initTabs('.selector-tab', '.selector-content', (tab, target) => {
                this.activeInput = target === 'file-selector' ? 'file' : 'directory';
                this.updateProcessButtonState();
            });
            
            // Initialize drag and drop
            this.dragAndDrop = new DragAndDrop({
                fileDropArea: this.fileDropArea,
                directoryDropArea: this.directoryDropArea,
                fileInput: this.photoInput,
                directoryInput: this.directoryInput,
                onFileDrop: this.handleFileDrop.bind(this),
                onDirectoryDrop: this.handleDirectoryDrop.bind(this),
                onFilesSelected: this.handleFileSelection.bind(this),
                onDirectorySelected: this.handleDirectorySelection.bind(this),
                onError: this.showStatusMessage.bind(this, 'error'),
                onInfo: this.showStatusMessage.bind(this, 'info')
            });
            
            // Initialize file upload
            this.fileUpload = new FileUpload({
                formElement: this.processForm,
                progressContainer: this.processProgress,
                progressBar: this.progressBar,
                progressText: this.progressText,
                statusContainer: this.statusMessages,
                submitButton: this.processButton,
                activeInput: this.activeInput,
                fileInput: this.photoInput,
                directoryInput: this.directoryInput,
                recursiveCheckbox: this.recursiveCheckbox,
                depthSelect: this.recursiveCheckbox && DOMHelpers.get('select', this.depthSelector),
                onSuccess: this.handleProcessSuccess.bind(this),
                onError: this.handleProcessError.bind(this)
            });
            
            // Initialize map visualization (will be initialized when needed)
            this.mapVisualization = new MapVisualization({
                mapContainer: this.mapContainer,
                mapElement: this.mapElement
            });
            
            // Initialize heatmap (will be initialized when map is available)
            this.heatmap = new Heatmap({
                map: this.mapVisualization.getMap(),
                toggleButton: this.toggleHeatmapButton,
                onError: this.showStatusMessage.bind(this, 'error')
            });
            
            // Initialize clustering (will be initialized when map is available)
            this.clustering = new MarkerClustering({
                map: this.mapVisualization.getMap(),
                toggleButton: this.toggleClusteringButton,
                radiusSlider: this.clusterRadiusSlider,
                radiusValue: this.radiusValueDisplay,
                clusterOptions: this.clusterOptions,
                initialRadius: 80,
                onError: this.showStatusMessage.bind(this, 'error')
            });
            
            // Initialize statistics (will be initialized when needed)
            this.statistics = new Statistics({
                container: this.statisticsContainer,
                toggleButton: this.toggleStatisticsButton,
                elements: {
                    'total-distance': DOMHelpers.getById('total-distance'),
                    'total-duration': DOMHelpers.getById('total-duration'),
                    'start-time': DOMHelpers.getById('start-time'),
                    'end-time': DOMHelpers.getById('end-time'),
                    'avg-speed': DOMHelpers.getById('avg-speed'),
                    'max-speed': DOMHelpers.getById('max-speed'),
                    'min-elevation': DOMHelpers.getById('min-elevation'),
                    'max-elevation': DOMHelpers.getById('max-elevation'),
                    'elevation-gain': DOMHelpers.getById('elevation-gain'),
                    'photo-count': DOMHelpers.getById('photo-count')
                },
                elevationChartContainer: this.elevationChart,
                speedChartContainer: this.speedChart
            });
        },
        
        /**
         * Initialize event listeners
         */
        initEventListeners: function() {
            // Recursive checkbox
            if (this.recursiveCheckbox && this.depthSelector) {
                DOMHelpers.on(this.recursiveCheckbox, 'change', function() {
                    if (this.checked) {
                        DOMHelpers.show(this.depthSelector);
                    } else {
                        DOMHelpers.hide(this.depthSelector);
                    }
                }.bind(this));
            }
            
            // Download button
            if (this.downloadButton) {
                DOMHelpers.on(this.downloadButton, 'click', this.handleDownload.bind(this));
            }
            
            // Clear button
            if (this.clearButton) {
                DOMHelpers.on(this.clearButton, 'click', this.handleClear.bind(this));
            }
        },
        
        /**
         * Handle file selection
         * @param {FileList} files - Selected files
         */
        handleFileSelection: function(files) {
            if (files.length > 0) {
                // Count only image files
                const imageFiles = Array.from(files).filter(file => 
                    FileUtils.isImageFile(file)
                );
        
                const totalFiles = files.length;
                const imageCount = imageFiles.length;
                const nonImageCount = totalFiles - imageCount;
        
                if (imageCount > 0) {
                    if (nonImageCount > 0) {
                        this.selectedFilesCount.textContent = `${imageCount} image file(s) selected (${nonImageCount} non-image files will be skipped)`;
                    } else {
                        this.selectedFilesCount.textContent = `${imageCount} image file(s) selected`;
                    }
            
                    if (this.activeInput === 'file') {
                        this.processButton.disabled = false;
                    }
                } else {
                    this.selectedFilesCount.textContent = 'No valid image files selected';
                    if (this.activeInput === 'file') {
                        this.processButton.disabled = true;
                    }
                }
            } else {
                this.selectedFilesCount.textContent = 'No files selected';
                if (this.activeInput === 'file') {
                    this.processButton.disabled = true;
                }
            }
        },

        /**
         * Handle directory selection
         * @param {FileList} files - Files in selected directory
         */
        handleDirectorySelection: function(files) {
            if (files.length > 0) {
                // Count only image files
                const imageFiles = Array.from(files).filter(file => 
                    FileUtils.isImageFile(file)
                );
        
                const totalFiles = files.length;
                const imageCount = imageFiles.length;
                const nonImageCount = totalFiles - imageCount;
        
                if (imageCount > 0) {
                    if (nonImageCount > 0) {
                        this.selectedDirectory.textContent = `Directory with ${imageCount} image file(s) selected (${nonImageCount} non-image files will be skipped)`;
                    } else {
                        this.selectedDirectory.textContent = `Directory with ${imageCount} image file(s) selected`;
                    }
            
                    if (this.activeInput === 'directory') {
                        this.processButton.disabled = false;
                    }
                } else {
                    this.selectedDirectory.textContent = 'No valid image files in selected directory';
                    if (this.activeInput === 'directory') {
                        this.processButton.disabled = true;
                    }
                }
            } else {
                this.selectedDirectory.textContent = 'No directory selected';
                if (this.activeInput === 'directory') {
                    this.processButton.disabled = true;
                }
            }
        },
        
        /**
         * Handle file drop
         * @param {File[]} files - Dropped files
         */
        handleFileDrop: function(files) {
            if (files && files.length > 0) {
                try {
                    // Set the files to the photo input
                    this.photoInput.files = this.createFileList(files);
                    this.handleFileSelection(this.photoInput.files);
                    this.showStatusMessage(`${files.length} files dropped and ready to process`, 'info');
            
                    // Enable the process button
                    if (this.activeInput === 'file') {
                        this.processButton.disabled = false;
                    }
                } catch (error) {
                    console.error('Error handling dropped files:', error);
                    this.showStatusMessage('Error handling dropped files. Please use the Select Photos button instead.', 'error');
                }
            } else {
                this.showStatusMessage('No files found in the drop', 'error');
            }
        },

        /**
         * Handle directory drop
         * @param {File[]} files - Files from dropped directory
         */
        handleDirectoryDrop: function(files) {
            if (files && files.length > 0) {
                try {
                    // Set the files to the directory input
                    this.directoryInput.files = this.createFileList(files);
                    this.handleDirectorySelection(this.directoryInput.files);
                    this.showStatusMessage(`${files.length} files from directory ready to process`, 'info');
            
                    // Enable the process button if in directory mode
                    if (this.activeInput === 'directory') {
                        this.processButton.disabled = false;
                    }
                } catch (error) {
                    console.error('Error handling dropped directory:', error);
                    this.showStatusMessage('Error handling dropped directory. Please use the Select Directory button instead.', 'error');
                }
            } else {
                this.showStatusMessage('No files found in the dropped directory', 'error');
            }
        },
        
        /**
         * Update process button state based on active input
         */
        updateProcessButtonState: function() {
            if (this.activeInput === 'file') {
                this.processButton.disabled = !this.photoInput.files.length;
            } else {
                this.processButton.disabled = !this.directoryInput.files.length;
            }
        },
        
        /**
         * Create a FileList from an array of File objects
         * @param {File[]} files - Array of File objects
         * @returns {FileList} FileList-like object
         */
        createFileList: function(files) {
            const dataTransfer = new DataTransfer();
            files.forEach(file => dataTransfer.items.add(file));
            return dataTransfer.files;
        },
        
        /**
         * Handle successful processing
         * @param {Object} result - Processing result
         * @param {string} result.sessionId - Session ID
         * @param {string} result.gpxFilename - GPX filename
         * @param {Array} result.waypoints - Waypoints array
         */
        handleProcessSuccess: function(result) {
            // Store results
            this.sessionId = result.sessionId;
            this.gpxFilename = result.gpxFilename;
            this.waypoints = result.waypoints;
    
            // Update map
            this.mapVisualization.setWaypoints(this.waypoints);
    
            // Update heatmap module with new waypoints
            this.heatmap.setWaypoints(this.waypoints);
    
            // Update clustering module with waypoints and map markers
            this.clustering.setWaypoints(this.waypoints);
            this.clustering.setMarkers(this.mapVisualization.markers);
    
            // Update statistics
            this.statistics.setWaypoints(this.waypoints);
        },
        
        /**
         * Handle processing error
         * @param {string} message - Error message
         */
        handleProcessError: function(message) {
            this.showStatusMessage(message, 'error');
        },
        
        /**
         * Handle GPX download
         */
        handleDownload: function() {
            if (!this.sessionId || !this.gpxFilename) {
                this.showStatusMessage('No GPX file available', 'error');
                return;
            }
            
            // Trigger download
            APIClient.downloadGPX(this.sessionId, this.gpxFilename);
        },
        
        /**
         * Handle clear data button
         */
        handleClear: function() {
            // Clean up server-side data
            if (this.sessionId) {
                APIClient.cleanupSession(this.sessionId)
                    .catch(error => {
                        console.error('Cleanup error:', error);
                    });
            }
            
            // Reset UI
            this.mapVisualization.clearMapLayers();
            DOMHelpers.hide(this.mapContainer);
            DOMHelpers.hide(this.statisticsContainer);
            DOMHelpers.hide(this.processProgress);
            this.processButton.disabled = true;
            
            // Clear file inputs
            if (this.photoInput) this.photoInput.value = '';
            if (this.directoryInput) this.directoryInput.value = '';
            if (this.selectedFilesCount) this.selectedFilesCount.textContent = 'No files selected';
            if (this.selectedDirectory) this.selectedDirectory.textContent = 'No directory selected';
            
            // Reset recursive options
            if (this.recursiveCheckbox) this.recursiveCheckbox.checked = false;
            if (this.depthSelector) DOMHelpers.hide(this.depthSelector);
            
            // Reset heatmap
            if (this.heatmap && this.heatmap.isVisible()) {
                this.heatmap.hide();
            }
            
            // Reset clustering
            if (this.clustering && this.clustering.isEnabled()) {
                this.clustering.disable();
            }
            
            // Reset statistics
            if (this.statistics && this.statistics.isVisible()) {
                this.statistics.hide();
            }
            
            // Clear state
            this.sessionId = null;
            this.gpxFilename = null;
            this.waypoints = [];
            
            // Clear status messages
            this.clearStatusMessages();
        },
        
        /**
         * Show a status message
         * @param {string} message - Message to display
         * @param {string} [type='info'] - Message type (info, success, warning, error)
         */
        showStatusMessage: function(message, type = 'info') {
            if (!this.statusMessages) return;
            
            const messageElement = document.createElement('div');
            messageElement.className = `status-message status-${type}`;
            messageElement.textContent = message;
            
            // Add to status messages
            this.statusMessages.prepend(messageElement);
            
            // Remove after 10 seconds
            setTimeout(() => {
                if (messageElement.parentNode === this.statusMessages) {
                    this.statusMessages.removeChild(messageElement);
                }
            }, 10000);
        },
        
        /**
         * Clear all status messages
         */
        clearStatusMessages: function() {
            if (this.statusMessages) {
                this.statusMessages.innerHTML = '';
            }
        }
    };
    
    // Initialize the application
    PixTrail.init();
});
