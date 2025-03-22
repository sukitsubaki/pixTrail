/**
 * PixTrail Web Interface
 * 
 * Client-side JavaScript for the PixTrail web application.
 * Handles file selection, API interactions, and map display.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const photoInput = document.getElementById('photo-input');
    const selectedFilesCount = document.getElementById('selected-files-count');
    const processForm = document.getElementById('process-form');
    const processButton = document.getElementById('process-button');
    const processProgress = document.getElementById('process-progress');
    const progressBar = processProgress.querySelector('.progress-bar');
    const progressText = processProgress.querySelector('.progress-text');
    const mapContainer = document.getElementById('map-container');
    const downloadButton = document.getElementById('download-gpx');
    const clearButton = document.getElementById('clear-data');
    const statusMessages = document.getElementById('status-messages');
    
    // State
    let map = null;
    let markers = [];
    let routeLine = null;
    let sessionId = null;
    let gpxFilename = null;
    
    // Initialize
    initEventListeners();
    
    /**
     * Set up event listeners
     */
    function initEventListeners() {
        // File selection
        photoInput.addEventListener('change', handleFileSelection);
        
        // Form submission
        processForm.addEventListener('submit', handleFormSubmit);
        
        // Map controls
        downloadButton.addEventListener('click', handleDownload);
        clearButton.addEventListener('click', handleClear);
    }
    
    /**
     * Handle file selection
     */
    function handleFileSelection() {
        const files = photoInput.files;
        if (files.length > 0) {
            selectedFilesCount.textContent = `${files.length} file(s) selected`;
            processButton.disabled = false;
        } else {
            selectedFilesCount.textContent = 'No files selected';
            processButton.disabled = true;
        }
    }
    
    /**
     * Handle form submission
     */
    function handleFormSubmit(event) {
        event.preventDefault();
        
        if (photoInput.files.length === 0) {
            showStatusMessage('Please select photos to process', 'error');
            return;
        }
        
        // Prepare form data
        const formData = new FormData();
        for (const file of photoInput.files) {
            formData.append('photos', file);
        }
        
        // Show progress
        processProgress.classList.remove('hidden');
        progressBar.style.width = '0%';
        progressText.textContent = 'Processing...';
        processButton.disabled = true;
        
        // Send files for processing
        processPhotos(formData);
    }
    
    /**
     * Send photos to the server for processing
     */
    function processPhotos(formData) {
        const xhr = new XMLHttpRequest();
        
        // Progress tracking
        // Local file transfer progress (browser API uses the term "upload")
        xhr.upload.addEventListener('progress', function(event) {
            if (event.lengthComputable) {
                const percentComplete = Math.round((event.loaded / event.total) * 100);
                progressBar.style.width = percentComplete + '%';
                progressText.textContent = `Processing... ${percentComplete}%`;
            }
        });
        
        // Handle completion
        xhr.addEventListener('load', function() {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                sessionId = response.session_id;
                
                progressText.textContent = 'Extracting GPS data...';
                progressBar.style.width = '75%';
                
                // Process the submitted photos
                extractGpsData(sessionId);
            } else {
                handleError('Processing failed');
            }
        });
        
        // Handle errors
        xhr.addEventListener('error', function() {
            handleError('Processing failed. Network error.');
        });
        
        // Send the request
        xhr.open('POST', '/api/submit');
        xhr.send(formData);
    }
    
    /**
     * Extract GPS data from the processed photos
     */
    function extractGpsData(sessionId) {
        fetch(`/api/process/${sessionId}`, {
            method: 'POST'
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.error || 'Processing failed');
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Processing succeeded
                gpxFilename = data.gpx_file;
                
                // Update UI
                progressBar.style.width = '100%';
                progressText.textContent = 'Processing complete!';
                
                // Show the map and plot the route
                showMap(data.waypoints);
                
                // Show success message with statistics
                let statsMessage = 'Photos processed successfully! ';
                if (data.stats) {
                    statsMessage += `${data.stats.processed} photos with GPS data processed`;
                    if (data.stats.skipped > 0) {
                        statsMessage += `, ${data.stats.skipped} photos without GPS data skipped`;
                    }
                    statsMessage += '. GPX file created.';
                }
                showStatusMessage(statsMessage, 'success');
                
                // Reset form
                setTimeout(() => {
                    processProgress.classList.add('hidden');
                    processButton.disabled = false;
                    photoInput.value = '';
                    selectedFilesCount.textContent = 'No files selected';
                }, 1500);
            } else {
                // Show error message with statistics if available
                let errorMessage = data.error || 'Processing failed';
                if (data.stats) {
                    errorMessage += ` (${data.stats.total} total files, ${data.stats.processed} with GPS data, ${data.stats.skipped} without GPS data)`;
                }
                handleError(errorMessage);
            }
        })
        .catch(error => {
            handleError(error.message);
        });
    }
    
    /**
     * Show the map and plot the route
     */
    function showMap(waypoints) {
        if (waypoints.length === 0) {
            showStatusMessage('No GPS data found in photos', 'warning');
            return;
        }
        
        // Show map container
        mapContainer.classList.remove('hidden');
        
        // Initialize map if it doesn't exist
        if (!map) {
            map = L.map('map');
            
            // Add OpenStreetMap tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
        } else {
            // Clear existing markers and route
            clearMapLayers();
        }
        
        // Add markers for each waypoint
        const latLngs = [];
        waypoints.forEach(point => {
            const latLng = L.latLng(point.latitude, point.longitude);
            latLngs.push(latLng);
            
            // Create marker with popup
            const marker = L.marker(latLng).addTo(map);
            markers.push(marker);
            
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
                Time: ${timestampStr}
            `);
        });
        
        // Add route line
        routeLine = L.polyline(latLngs, {color: 'blue', weight: 3}).addTo(map);
        
        // Fit map to the route
        map.fitBounds(routeLine.getBounds(), {padding: [30, 30]});
        
        // Scroll to map
        mapContainer.scrollIntoView({behavior: 'smooth'});
    }
    
    /**
     * Clear map layers (markers and route)
     */
    function clearMapLayers() {
        // Remove markers
        markers.forEach(marker => map.removeLayer(marker));
        markers = [];
        
        // Remove route line
        if (routeLine) {
            map.removeLayer(routeLine);
            routeLine = null;
        }
    }
    
    /**
     * Handle GPX download
     */
    function handleDownload() {
        if (!sessionId || !gpxFilename) {
            showStatusMessage('No GPX file available', 'error');
            return;
        }
        
        // Create download link
        const downloadUrl = `/api/download/${sessionId}/${gpxFilename}`;
        
        // Create a hidden link and click it
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = gpxFilename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    /**
     * Handle clear button
     */
    function handleClear() {
        if (sessionId) {
            // Clean up server-side
            fetch(`/api/cleanup/${sessionId}`, {
                method: 'POST'
            }).catch(error => {
                console.error('Cleanup error:', error);
            });
        }
        
        // Reset UI
        if (map) {
            clearMapLayers();
        }
        
        mapContainer.classList.add('hidden');
        processProgress.classList.add('hidden');
        processButton.disabled = true;
        photoInput.value = '';
        selectedFilesCount.textContent = 'No files selected';
        
        // Clear state
        sessionId = null;
        gpxFilename = null;
        
        // Clear status messages
        statusMessages.innerHTML = '';
    }
    
    /**
     * Handle error
     */
    function handleError(message) {
        progressBar.style.width = '0%';
        progressText.textContent = 'Error';
        
        setTimeout(() => {
            processProgress.classList.add('hidden');
            processButton.disabled = false;
        }, 1000);
        
        showStatusMessage(message, 'error');
    }
    
    /**
     * Show status message
     */
    function showStatusMessage(message, type = 'info') {
        const messageElement = document.createElement('div');
        messageElement.className = `status-message status-${type}`;
        messageElement.textContent = message;
        
        // Add to status messages
        statusMessages.prepend(messageElement);
        
        // Remove after 10 seconds
        setTimeout(() => {
            if (messageElement.parentNode === statusMessages) {
                statusMessages.removeChild(messageElement);
            }
        }, 10000);
    }
});