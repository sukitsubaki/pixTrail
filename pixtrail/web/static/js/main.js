/**
 * PixTrail Web Interface
 * 
 * Client-side JavaScript for the PixTrail web application.
 * Handles file uploads, API interactions, and map display.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const photoInput = document.getElementById('photo-input');
    const selectedFilesCount = document.getElementById('selected-files-count');
    const uploadForm = document.getElementById('upload-form');
    const uploadButton = document.getElementById('upload-button');
    const uploadProgress = document.getElementById('upload-progress');
    const progressBar = uploadProgress.querySelector('.progress-bar');
    const progressText = uploadProgress.querySelector('.progress-text');
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
        uploadForm.addEventListener('submit', handleFormSubmit);
        
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
            uploadButton.disabled = false;
        } else {
            selectedFilesCount.textContent = 'No files selected';
            uploadButton.disabled = true;
        }
    }
    
    /**
     * Handle form submission
     */
    function handleFormSubmit(event) {
        event.preventDefault();
        
        if (photoInput.files.length === 0) {
            showStatusMessage('Please select photos to upload', 'error');
            return;
        }
        
        // Prepare form data
        const formData = new FormData();
        for (const file of photoInput.files) {
            formData.append('photos', file);
        }
        
        // Show progress
        uploadProgress.classList.remove('hidden');
        progressBar.style.width = '0%';
        progressText.textContent = 'Uploading...';
        uploadButton.disabled = true;
        
        // Upload files
        uploadPhotos(formData);
    }
    
    /**
     * Upload photos to the server
     */
    function uploadPhotos(formData) {
        const xhr = new XMLHttpRequest();
        
        // Progress tracking
        xhr.upload.addEventListener('progress', function(event) {
            if (event.lengthComputable) {
                const percentComplete = Math.round((event.loaded / event.total) * 100);
                progressBar.style.width = percentComplete + '%';
                progressText.textContent = `Uploading... ${percentComplete}%`;
            }
        });
        
        // Handle completion
        xhr.addEventListener('load', function() {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                sessionId = response.session_id;
                
                progressText.textContent = 'Processing photos...';
                progressBar.style.width = '75%';
                
                // Process the uploaded photos
                processPhotos(sessionId);
            } else {
                handleError('Upload failed');
            }
        });
        
        // Handle errors
        xhr.addEventListener('error', function() {
            handleError('Upload failed. Network error.');
        });
        
        // Send the request
        xhr.open('POST', '/api/upload');
        xhr.send(formData);
    }
    
    /**
     * Process the uploaded photos
     */
    function processPhotos(sessionId) {
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
                
                // Show success message
                showStatusMessage('Photos processed successfully! GPS data extracted and GPX file created.', 'success');
                
                // Reset upload form
                setTimeout(() => {
                    uploadProgress.classList.add('hidden');
                    uploadButton.disabled = false;
                    photoInput.value = '';
                    selectedFilesCount.textContent = 'No files selected';
                }, 1500);
            } else {
                handleError(data.error || 'Processing failed');
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
        uploadProgress.classList.add('hidden');
        uploadButton.disabled = true;
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
            uploadProgress.classList.add('hidden');
            uploadButton.disabled = false;
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
