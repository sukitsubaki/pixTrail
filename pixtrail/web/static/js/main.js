/**
 * PixTrail Web Interface
 * 
 * Client-side JavaScript for the PixTrail web application.
 * Handles file selection, API interactions, and map display.
 */

document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const photoInput = document.getElementById('photo-input');
    const directoryInput = document.getElementById('directory-input');
    const selectedFilesCount = document.getElementById('selected-files-count');
    const selectedDirectory = document.getElementById('selected-directory');
    const processForm = document.getElementById('process-form');
    const processButton = document.getElementById('process-button');
    const processProgress = document.getElementById('process-progress');
    const progressBar = processProgress.querySelector('.progress-bar');
    const progressText = processProgress.querySelector('.progress-text');
    const mapContainer = document.getElementById('map-container');
    const downloadButton = document.getElementById('download-gpx');
    const clearButton = document.getElementById('clear-data');
    const statusMessages = document.getElementById('status-messages');
    const selectorTabs = document.querySelectorAll('.selector-tab');
    const recursiveCheckbox = document.getElementById('recursive-checkbox');
    const depthSelector = document.getElementById('depth-selector');
    const fileDropArea = document.getElementById('file-drop-area');
    const directoryDropArea = document.getElementById('directory-drop-area');

    // State
    let map = null;
    let markers = [];
    let routeLine = null;
    let sessionId = null;
    let gpxFilename = null;
    let activeInput = 'file'; // 'file' or 'directory'

    // Initialize
    initEventListeners();
    initDragAndDrop();

    /**
     * Set up event listeners
     */
    function initEventListeners() {
        // Tab navigation
        selectorTabs.forEach(tab => {
            tab.addEventListener('click', function () {
                // Remove active class from all tabs
                selectorTabs.forEach(t => t.classList.remove('active'));

                // Add active class to clicked tab
                this.classList.add('active');

                // Get target content
                const target = this.getAttribute('data-target');

                // Hide all content
                document.querySelectorAll('.selector-content').forEach(content => {
                    content.classList.remove('active');
                });

                // Show target content
                document.getElementById(target).classList.add('active');

                // Update active input
                activeInput = target === 'file-selector' ? 'file' : 'directory';

                // Update button state
                updateProcessButtonState();
            });
        });

        // File selection
        photoInput.addEventListener('change', handleFileSelection);
        directoryInput.addEventListener('change', handleDirectorySelection);

        // Recursive checkbox
        recursiveCheckbox.addEventListener('change', function () {
            if (this.checked) {
                depthSelector.classList.add('visible');
            } else {
                depthSelector.classList.remove('visible');
            }
        });

        // Form submission
        processForm.addEventListener('submit', handleFormSubmit);

        // Map controls
        downloadButton.addEventListener('click', handleDownload);
        clearButton.addEventListener('click', handleClear);
    }

    /**
     * Initialize drag and drop functionality
     */
    function initDragAndDrop() {
        // File drop area
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            fileDropArea.addEventListener(eventName, preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            fileDropArea.addEventListener(eventName, () => {
                fileDropArea.classList.add('drag-over');
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            fileDropArea.addEventListener(eventName, () => {
                fileDropArea.classList.remove('drag-over');
            }, false);
        });

        fileDropArea.addEventListener('drop', handleFilesDrop, false);

        // Directory drop area
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            directoryDropArea.addEventListener(eventName, preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            directoryDropArea.addEventListener(eventName, () => {
                directoryDropArea.classList.add('drag-over');
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            directoryDropArea.addEventListener(eventName, () => {
                directoryDropArea.classList.remove('drag-over');
            }, false);
        });

        directoryDropArea.addEventListener('drop', handleDirectoryDrop, false);

        // Clicking on drop areas should trigger file input
        fileDropArea.addEventListener('click', () => photoInput.click());
        directoryDropArea.addEventListener('click', () => directoryInput.click());
    }

    /**
     * Prevent default browser behavior for drag and drop events
     */
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    /**
     * Handle files dropped into the file drop area
     */
    function handleFilesDrop(e) {
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            // Filter for image files
            const imageFiles = Array.from(files).filter(file => {
                return file.type.startsWith('image/');
            });

            if (imageFiles.length === 0) {
                showStatusMessage('No valid image files found in the dropped items', 'warning');
                return;
            }

            // Create a new FileList-like object with only image files
            const dataTransfer = new DataTransfer();
            imageFiles.forEach(file => dataTransfer.items.add(file));

            // Set the files to the input element
            photoInput.files = dataTransfer.files;

            // Trigger the change event
            const event = new Event('change');
            photoInput.dispatchEvent(event);

            // Switch to files tab if not active
            if (activeInput !== 'file') {
                document.querySelector('.selector-tab[data-target="file-selector"]').click();
            }
        }
    }

    /**
     * Handle directory dropped into the directory drop area
     */
    function handleDirectoryDrop(e) {
        const items = e.dataTransfer.items;
        if (items.length > 0) {
            // Check if any item is a directory
            let hasDirectory = false;

            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (item.webkitGetAsEntry && item.webkitGetAsEntry().isDirectory) {
                    hasDirectory = true;
                    break;
                }
            }

            if (!hasDirectory) {
                showStatusMessage('No directories found in the dropped items. Please drop a folder.', 'warning');
                return;
            }

            // Unfortunately, setting directoryInput.files directly doesn't work with directories
            // We need to show a message to the user to use the directory selector instead
            showStatusMessage('Directory drop detected. Due to browser limitations, please use the "Select Directory" button.', 'info');

            // Switch to directory tab if not active
            if (activeInput !== 'directory') {
                document.querySelector('.selector-tab[data-target="directory-selector"]').click();
            }
        }
    }

    /**
     * Handle file selection
     */
    function handleFileSelection() {
        const files = photoInput.files;
        if (files.length > 0) {
            selectedFilesCount.textContent = `${files.length} file(s) selected`;
            if (activeInput === 'file') {
                processButton.disabled = false;
            }
        } else {
            selectedFilesCount.textContent = 'No files selected';
            if (activeInput === 'file') {
                processButton.disabled = true;
            }
        }
    }

    /**
     * Handle directory selection
     */
    function handleDirectorySelection() {
        const files = directoryInput.files;
        if (files.length > 0) {
            selectedDirectory.textContent = `Directory with ${files.length} file(s) selected`;
            if (activeInput === 'directory') {
                processButton.disabled = false;
            }
        } else {
            selectedDirectory.textContent = 'No directory selected';
            if (activeInput === 'directory') {
                processButton.disabled = true;
            }
        }
    }

    /**
     * Update process button state based on active input
     */
    function updateProcessButtonState() {
        if (activeInput === 'file') {
            processButton.disabled = photoInput.files.length === 0;
        } else {
            processButton.disabled = directoryInput.files.length === 0;
        }
    }

    /**
     * Handle form submission
     */
    function handleFormSubmit(event) {
        event.preventDefault();

        let selectedFiles;
        if (activeInput === 'file') {
            selectedFiles = photoInput.files;
            if (selectedFiles.length === 0) {
                showStatusMessage('Please select photos to process', 'error');
                return;
            }
        } else {
            selectedFiles = directoryInput.files;
            if (selectedFiles.length === 0) {
                showStatusMessage('Please select a directory to process', 'error');
                return;
            }
        }

        // Prepare form data
        const formData = new FormData();
        for (const file of selectedFiles) {
            formData.append('photos', file);
        }

        // Add source type (file or directory)
        formData.append('source_type', activeInput);

        // Add recursive options if directory mode is selected
        if (activeInput === 'directory') {
            formData.append('recursive', recursiveCheckbox.checked ? '1' : '0');
            if (recursiveCheckbox.checked) {
                const depthValue = document.getElementById('recursive-depth').value;
                formData.append('depth', depthValue);
            }
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
        xhr.upload.addEventListener('progress', function (event) {
            if (event.lengthComputable) {
                const percentComplete = Math.round((event.loaded / event.total) * 100);
                progressBar.style.width = percentComplete + '%';
                progressText.textContent = `Processing... ${percentComplete}%`;
            }
        });

        // Handle completion
        xhr.addEventListener('load', function () {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                sessionId = response.session_id;

                progressText.textContent = 'Extracting GPS data...';
                progressBar.style.width = '75%';

                // Process the submitted photos
                extractGpsData(sessionId);
            } else {
                try {
                    const response = JSON.parse(xhr.responseText);
                    handleError(response.error || `Processing failed: Server returned status ${xhr.status}`);
                } catch (e) {
                    handleError(`Processing failed: Server returned status ${xhr.status}`);
                }
            }
        });

        // Handle errors
        xhr.addEventListener('error', function () {
            handleError('Processing failed: Network error. Please check your connection.');
        });

        // Send the request
        xhr.open('POST', '/api/submit');
        xhr.send(formData);
    }

    /**
     * Send photos to the server for processing
     */
    function extractGpsData(sessionId) {
        fetch(`/api/process/${sessionId}`, {
                method: 'POST'
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                            throw new Error(data.error || 'Processing failed: Unknown server error');
                        })
                        .catch(jsonError => {
                            // If JSON parsing fails, throw the original response status text
                            throw new Error(`Processing failed: ${response.statusText || 'Server error'}`);
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
                        directoryInput.value = '';
                        selectedFilesCount.textContent = 'No files selected';
                        selectedDirectory.textContent = 'No directory selected';
                        recursiveCheckbox.checked = false;
                        depthSelector.classList.remove('visible');
                    }, 1500);
                } else {
                    // Show error message with statistics if available
                    let errorMessage = data.error || 'Processing failed: No error details provided';
                    if (data.stats) {
                        errorMessage += ` (${data.stats.total} total files, ${data.stats.processed} with GPS data, ${data.stats.skipped} without GPS data)`;
                    }
                    handleError(errorMessage);
                }
            })
            .catch(error => {
                console.error('Error processing photos:', error);
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
        routeLine = L.polyline(latLngs, {
            color: 'blue',
            weight: 3
        }).addTo(map);

        // Fit map to the route
        map.fitBounds(routeLine.getBounds(), {
            padding: [30, 30]
        });

        // Scroll to map
        mapContainer.scrollIntoView({
            behavior: 'smooth'
        });
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
        directoryInput.value = '';
        selectedFilesCount.textContent = 'No files selected';
        selectedDirectory.textContent = 'No directory selected';
        recursiveCheckbox.checked = false;
        depthSelector.classList.remove('visible');

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
