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
     * Determine if a file can be processed client-side
     */
    function canProcessClientSide(file) {
        // JPEG/JFIF and TIFF files can be processed client-side
        const jpegTypes = ['image/jpeg', 'image/jpg'];
        const tiffTypes = ['image/tiff', 'image/tif'];
        
        // JPEG and TIFF files with EXIF in browser
        return jpegTypes.includes(file.type) || tiffTypes.includes(file.type);
    }

    /**
     * Extract GPS data from images directly in the browser
     * This avoids uploading the entire image files to the local server
     */
    function extractGpsDataFromImages(files) {
        return new Promise((resolve, reject) => {
            const gpsDataList = [];
            let processedCount = 0;
            let totalFiles = files.length;
            
            if (totalFiles === 0) {
                resolve([]);
                return;
            }
            
            // Update the UI to show extraction progress
            progressText.textContent = 'Extracting GPS data...';
            
            // Process each file sequentially to avoid memory issues
            const processFile = (index) => {
                if (index >= totalFiles) {
                    resolve(gpsDataList);
                    return;
                }
                
                const file = files[index];
                
                // Skip non-image files
                if (!file.type.startsWith('image/')) {
                    processedCount++;
                    updateProgressBar(processedCount, totalFiles);
                    processFile(index + 1);
                    return;
                }
                
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    try {
                        // Use EXIF.js to extract EXIF data
                        const exifReader = new FileReader();
                        
                        exifReader.onload = function() {
                            try {
                                const tags = EXIF.readFromBinaryFile(this.result);
                                
                                // Extract GPS data if available
                                if (tags) {
                                    const gpsData = extractGpsFromExif(tags, file);
                                    
                                    if (gpsData) {
                                        gpsDataList.push(gpsData);
                                    }
                                }
                            } catch (exifErr) {
                                console.error(`Error reading EXIF from ${file.name}:`, exifErr);
                            }
                            
                            // Process next file
                            processedCount++;
                            updateProgressBar(processedCount, totalFiles);
                            processFile(index + 1);
                        };
                        
                        exifReader.onerror = function() {
                            console.error(`Error reading EXIF binary data from ${file.name}`);
                            processedCount++;
                            updateProgressBar(processedCount, totalFiles);
                            processFile(index + 1);
                        };
                        
                        // Read file as binary for EXIF.js
                        exifReader.readAsArrayBuffer(file);
                    } catch (err) {
                        console.error(`Error setting up EXIF reader for ${file.name}:`, err);
                        processedCount++;
                        updateProgressBar(processedCount, totalFiles);
                        processFile(index + 1);
                    }
                };
                
                reader.onerror = function() {
                    console.error(`Error reading file ${file.name}`);
                    processedCount++;
                    updateProgressBar(processedCount, totalFiles);
                    processFile(index + 1);
                };
                
                reader.readAsDataURL(file);
            };
            
            // Start processing with the first file
            processFile(0);
        });
    }
    
    /**
     * Extract GPS data from EXIF metadata
     */
    function extractGpsFromExif(tags, file) {
        // EXIF GPS data
        if (!tags || !tags.GPSLatitude || !tags.GPSLongitude) {
            return null;
        }
        
        // Get reference (N/S, E/W)
        const latRef = tags.GPSLatitudeRef || "N";
        const lonRef = tags.GPSLongitudeRef || "E";
        
        // Convert to decimal degrees
        let latitude = convertDMSToDD(
            tags.GPSLatitude[0],
            tags.GPSLatitude[1],
            tags.GPSLatitude[2],
            latRef
        );
        
        let longitude = convertDMSToDD(
            tags.GPSLongitude[0],
            tags.GPSLongitude[1],
            tags.GPSLongitude[2],
            lonRef
        );
        
        // Get altitude if available
        let altitude = 0;
        if (tags.GPSAltitude) {
            altitude = tags.GPSAltitude;
            if (tags.GPSAltitudeRef && tags.GPSAltitudeRef === 1) {
                altitude = -altitude;
            }
        }
        
        // Get timestamp
        let timestamp;
        if (tags.DateTime) {
            try {
                // EXIF DateTime format: 'YYYY:MM:DD HH:MM:SS'
                const parts = tags.DateTime.split(' ');
                const dateParts = parts[0].split(':');
                const timeParts = parts[1].split(':');
                timestamp = new Date(
                    parseInt(dateParts[0]),
                    parseInt(dateParts[1]) - 1,
                    parseInt(dateParts[2]),
                    parseInt(timeParts[0]),
                    parseInt(timeParts[1]),
                    parseInt(timeParts[2])
                ).toISOString();
            } catch (e) {
                console.error("Error parsing timestamp:", e);
                timestamp = file.lastModified 
                    ? new Date(file.lastModified).toISOString() 
                    : new Date().toISOString();
            }
        } else {
            // Use file modified date as fallback
            timestamp = file.lastModified 
                ? new Date(file.lastModified).toISOString() 
                : new Date().toISOString();
        }
        
        return {
            name: file.name,
            latitude: latitude,
            longitude: longitude,
            altitude: altitude,
            timestamp: timestamp
        };
    }
    
    /**
     * Convert degrees, minutes, seconds to decimal degrees
     */
    function convertDMSToDD(degrees, minutes, seconds, direction) {
        let dd = degrees + (minutes / 60.0) + (seconds / 3600.0);
        
        if (direction === "S" || direction === "W") {
            dd = -dd;
        }
        
        return dd;
    }
    
    /**
     * Update progress bar based on processing progress
     */
    function updateProgressBar(current, total) {
        const percentComplete = Math.round((current / total) * 100);
        progressBar.style.width = percentComplete + '%';
        progressText.textContent = `Processing... ${percentComplete}%`;
    }
    
    /**
     * Send just the GPS data to the local server instead of full image files
     */
    function sendGpsDataToServer(gpsDataList) {
        return fetch('/api/create-gpx', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ gps_data: gpsDataList })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.error || `Server returned status ${response.status}`);
                })
                .catch(jsonError => {
                    throw new Error(`Processing failed: Server error (${response.status})`);
                });
            }
            return response.json();
        });
    }

    /**
     * Extract GPS data from server-processed files
     */
    function extractGpsData(sessionId) {
        return fetch(`/api/process/${sessionId}`, {
            method: 'POST'
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.error || 'Unknown server error');
                })
                .catch(jsonError => {
                    throw new Error(`Server error: ${response.statusText || 'Unknown'}`);
                });
            }
            return response.json();
        });
    }

    /**
     * Handle form submission with hybrid processing approach
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

        // Show progress
        processProgress.classList.remove('hidden');
        progressBar.style.width = '0%';
        progressText.textContent = 'Processing...';
        processButton.disabled = true;

        // Sort files into client-side and server-side processable
        const clientSideFiles = [];
        const serverSideFiles = [];
        
        Array.from(selectedFiles).forEach(file => {
            if (canProcessClientSide(file)) {
                clientSideFiles.push(file);
            } else {
                serverSideFiles.push(file);
            }
        });
        
        console.log(`Files to process - Client-side: ${clientSideFiles.length}, Server-side: ${serverSideFiles.length}`);
        
        // Initialize arrays for GPS data
        let clientSideGpsData = [];
        let serverSideGpsData = [];
        
        // Start with client-side processing
        const processClientSide = () => {
            if (clientSideFiles.length === 0) {
                progressBar.style.width = '50%';
                progressText.textContent = 'Processing server-side images...';
                processServerSide();
                return;
            }
            
            progressText.textContent = 'Extracting GPS data from JPEG/TIFF files...';
            
            extractGpsDataFromImages(clientSideFiles)
                .then(gpsData => {
                    clientSideGpsData = gpsData;
                    progressBar.style.width = '50%';
                    
                    if (serverSideFiles.length > 0) {
                        progressText.textContent = 'Processing RAW/PNG files...';
                        processServerSide();
                    } else {
                        // Only client-side files, create GPX directly
                        finalizeProcessing();
                    }
                })
                .catch(error => {
                    console.error('Error processing client-side files:', error);
                    
                    if (serverSideFiles.length > 0) {
                        // Process server-side files even if client-side fails
                        progressText.textContent = 'Processing RAW/PNG files...';
                        processServerSide();
                    } else {
                        handleError(error.message);
                    }
                });
        };
        
        // Server-side processing
        const processServerSide = () => {
            if (serverSideFiles.length === 0) {
                finalizeProcessing();
                return;
            }
            
            // Prepare form data
            const formData = new FormData();
            for (const file of serverSideFiles) {
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
            
            // Send files to local server
            const xhr = new XMLHttpRequest();
            
            // Progress tracking
            xhr.upload.addEventListener('progress', function (event) {
                if (event.lengthComputable) {
                    const percentComplete = Math.round((event.loaded / event.total) * 25); // 25% for upload
                    progressBar.style.width = (50 + percentComplete) + '%';
                    progressText.textContent = `Uploading RAW/PNG files... ${percentComplete}%`;
                }
            });
            
            xhr.addEventListener('load', function () {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    sessionId = response.session_id;
                    
                    progressText.textContent = 'Processing RAW/PNG files on server...';
                    progressBar.style.width = '75%';
                    
                    extractGpsData(sessionId)
                        .then(serverData => {
                            if (serverData.success) {
                                serverSideGpsData = serverData.waypoints;
                                finalizeProcessing();
                            } else {
                                throw new Error(serverData.error || 'Error processing server-side files');
                            }
                        })
                        .catch(error => {
                            console.error('Error processing server-side files:', error);
                            
                            if (clientSideGpsData.length > 0) {
                                // Continue with client-side data if server-side fails
                                finalizeProcessing();
                            } else {
                                handleError(error.message);
                            }
                        });
                } else {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        console.error('Server error:', response);
                        
                        if (clientSideGpsData.length > 0) {
                            // Continue with client-side data if server-side fails
                            finalizeProcessing();
                        } else {
                            handleError(response.error || `Processing failed: Server returned status ${xhr.status}`);
                        }
                    } catch (e) {
                        console.error('Error parsing server response:', e);
                        
                        if (clientSideGpsData.length > 0) {
                            // Continue with client-side data if server-side fails
                            finalizeProcessing();
                        } else {
                            handleError(`Processing failed: Server returned status ${xhr.status}`);
                        }
                    }
                }
            });
            
            xhr.addEventListener('error', function () {
                console.error('Network error during upload');
                
                if (clientSideGpsData.length > 0) {
                    // Continue with client-side data if server-side fails
                    finalizeProcessing();
                } else {
                    handleError('Processing failed: Network error. Please check your connection.');
                }
            });
            
            xhr.open('POST', '/api/submit');
            xhr.send(formData);
        };
        
        // Finalize processing with all collected GPS data
        const finalizeProcessing = () => {
            // Combine client- and server-side GPS data
            const allGpsData = [...clientSideGpsData, ...serverSideGpsData];
            
            if (allGpsData.length === 0) {
                handleError('No GPS data found in any of the submitted photos');
                return;
            }
            
            // Send all GPS data to create GPX
            progressText.textContent = 'Creating GPX file...';
            progressBar.style.width = '90%';
            
            sendGpsDataToServer(allGpsData)
                .then(response => {
                    if (response.success) {
                        // Processing succeeded
                        sessionId = response.session_id;
                        gpxFilename = response.gpx_file;

                        // Update UI
                        progressBar.style.width = '100%';
                        progressText.textContent = 'Processing complete!';

                        // Show the map and plot the route
                        showMap(response.waypoints);

                        // Show success message with statistics
                        const statsMessage = `Photos processed successfully! ${response.waypoints.length} photos with GPS data processed. GPX file created.`;
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
                        handleError(response.error || 'Processing failed: Unknown error');
                    }
                })
                .catch(error => {
                    console.error('Error creating GPX:', error);
                    handleError(error.message);
                });
        };
        
        // Start the process
        processClientSide();
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
