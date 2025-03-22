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
    const statisticsContainer = document.getElementById('statistics-container');
    const downloadButton = document.getElementById('download-gpx');
    const clearButton = document.getElementById('clear-data');
    const statusMessages = document.getElementById('status-messages');
    const selectorTabs = document.querySelectorAll('.selector-tab');
    const recursiveCheckbox = document.getElementById('recursive-checkbox');
    const depthSelector = document.getElementById('depth-selector');
    const fileDropArea = document.getElementById('file-drop-area');
    const directoryDropArea = document.getElementById('directory-drop-area');
    const clusterOptions = document.getElementById('cluster-options');
    const clusterRadiusSlider = document.getElementById('cluster-radius');
    const radiusValueDisplay = document.getElementById('radius-value');

    // State
    let map = null;
    let markers = [];
    let routeLine = null;
    let heatLayer = null;  // Für die Heatmap
    let heatmapVisible = false;  // Status der Heatmap-Sichtbarkeit
    let markerClusterGroup = null; // For clustering markers
    let clusteringEnabled = false; // Status of clustering
    let statisticsVisible = false; // Status of statistics panel
    let elevationChart = null; // Chart.js instance for elevation
    let speedChart = null; // Chart.js instance for speed
    let sessionId = null;
    let gpxFilename = null;
    let activeInput = 'file'; // 'file' or 'directory'
    let waypoints = []; // Store waypoints data
    let clusterRadius = 80; // Default cluster radius
    let routeStatistics = null; // Store calculated statistics

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
        
        // Heatmap Toggle Button
        document.getElementById('toggle-heatmap').addEventListener('click', toggleHeatmap);
        
        // Clustering Toggle Button
        document.getElementById('toggle-clustering').addEventListener('click', toggleClustering);
        
        // Statistics Toggle Button
        document.getElementById('toggle-statistics').addEventListener('click', toggleStatistics);
        
        // Cluster Radius Slider
        clusterRadiusSlider.addEventListener('input', function() {
            clusterRadius = parseInt(this.value);
            radiusValueDisplay.textContent = `${clusterRadius}px`;
            
            if (clusteringEnabled && markerClusterGroup) {
                updateClusterRadius();
            }
        });
    }

    /**
     * Initialize drag and drop functionality
     */
    function initDragAndDrop() {
        // Setup both drop areas with common preventDefaults
        [fileDropArea, directoryDropArea].forEach(dropArea => {
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                dropArea.addEventListener(eventName, preventDefaults, false);
            });

            ['dragenter', 'dragover'].forEach(eventName => {
                dropArea.addEventListener(eventName, () => {
                    dropArea.classList.add('drag-over');
                }, false);
            });

            ['dragleave'].forEach(eventName => {
                dropArea.addEventListener(eventName, () => {
                    dropArea.classList.remove('drag-over');
                }, false);
            });
        });

        // Universal drop handler that detects content type
        fileDropArea.addEventListener('drop', handleUniversalDrop, false);
        directoryDropArea.addEventListener('drop', handleUniversalDrop, false);

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
     * Universal drop handler that automatically detects if dropped content is files or directory
     * and switches to the appropriate tab
     */
    function handleUniversalDrop(e) {
        preventDefaults(e);
        
        // Remove drag-over class from both drop areas
        fileDropArea.classList.remove('drag-over');
        directoryDropArea.classList.remove('drag-over');

        const items = e.dataTransfer.items;
        const files = e.dataTransfer.files;
        
        if (!items || items.length === 0) {
            showStatusMessage('No items detected in the drop', 'warning');
            return;
        }

        // Check if we have any directories
        let hasDirectory = false;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const entry = item.webkitGetAsEntry && item.webkitGetAsEntry();
            if (entry && entry.isDirectory) {
                hasDirectory = true;
                break;
            }
        }

        if (hasDirectory) {
            // Handle as directory
            handleAsDirectory(e);
        } else {
            // Handle as files
            handleAsFiles(e);
        }
    }

    /**
     * Handle dropped content as files
     */
    function handleAsFiles(e) {
        const files = e.dataTransfer.files;
        
        // Filter for image files
        const imageFiles = Array.from(files).filter(file => {
            return file.type.startsWith('image/');
        });

        if (imageFiles.length === 0) {
            showStatusMessage('No valid image files found in the dropped items', 'warning');
            return;
        }

        // Switch to files tab if not already active
        if (activeInput !== 'file') {
            document.querySelector('.selector-tab[data-target="file-selector"]').click();
        }

        // Create a new FileList-like object with only image files
        const dataTransfer = new DataTransfer();
        imageFiles.forEach(file => dataTransfer.items.add(file));

        // Set the files to the input element
        photoInput.files = dataTransfer.files;

        // Trigger the change event
        const event = new Event('change');
        photoInput.dispatchEvent(event);
        
        showStatusMessage(`${imageFiles.length} image files ready to process`, 'info');
    }

    /**
     * Handle dropped content as directory
     */
    function handleAsDirectory(e) {
        // Switch to directory tab if not already active
        if (activeInput !== 'directory') {
            document.querySelector('.selector-tab[data-target="directory-selector"]').click();
        }

        // Due to browser security restrictions, we can't directly access the directory contents via JS
        // We need the user to use the directory input, but we can make it easier by:
        // 1. Auto-switching to the directory tab (done above)
        // 2. Auto-opening the directory selector

        // Trigger the directory input click
        directoryInput.click();
        
        showStatusMessage('Directory detected. Please select it in the file browser that opened.', 'info');
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

                        // Store waypoints for later use
                        waypoints = response.waypoints;
                        
                        // Calculate statistics
                        calculateRouteStatistics(waypoints);

                        // Show the map and plot the route
                        showMap(waypoints);

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
        
        // Initialize marker cluster group even if not immediately visible
        markerClusterGroup = L.markerClusterGroup({
            maxClusterRadius: clusterRadius,
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: true,
            zoomToBoundsOnClick: true,
            chunkedLoading: true
        });

        // Add markers for each waypoint
        const latLngs = [];
        waypoints.forEach(point => {
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
                Time: ${timestampStr}
            `);
            
            // Add to appropriate container
            if (clusteringEnabled) {
                markerClusterGroup.addLayer(marker);
            } else {
                marker.addTo(map);
                markers.push(marker);
            }
        });
        
        // If clustering is enabled, add the cluster group to the map
        if (clusteringEnabled) {
            map.addLayer(markerClusterGroup);
            clusterOptions.classList.remove('hidden');
        }

        // Add route line
        routeLine = L.polyline(latLngs, {
            color: 'blue',
            weight: 3
        }).addTo(map);

        // Fit map to the route
        if (routeLine.getBounds().isValid()) {
            map.fitBounds(routeLine.getBounds(), {
                padding: [30, 30]
            });
        }

        // Scroll to map
        mapContainer.scrollIntoView({
            behavior: 'smooth'
        });
    }

    /**
     * Clear map layers (markers and route)
     */
    function clearMapLayers() {
        // Remove individual markers
        markers.forEach(marker => map.removeLayer(marker));
        markers = [];

        // Remove marker cluster group if it exists
        if (markerClusterGroup) {
            map.removeLayer(markerClusterGroup);
            markerClusterGroup = null;
        }

        // Remove route line
        if (routeLine) {
            map.removeLayer(routeLine);
            routeLine = null;
        }
        
        // Remove heatmap if exists
        if (heatLayer) {
            map.removeLayer(heatLayer);
            heatLayer = null;
        }
        heatmapVisible = false;
        
        // Reset heatmap button
        const toggleHeatmapButton = document.getElementById('toggle-heatmap');
        if (toggleHeatmapButton) {
            toggleHeatmapButton.textContent = 'Show Heatmap';
            toggleHeatmapButton.classList.remove('active');
        }
        
        // Reset clustering button
        const toggleClusteringButton = document.getElementById('toggle-clustering');
        if (toggleClusteringButton) {
            toggleClusteringButton.textContent = 'Enable Clustering';
            toggleClusteringButton.classList.remove('active');
        }
        
        // Reset statistics button
        const toggleStatisticsButton = document.getElementById('toggle-statistics');
        if (toggleStatisticsButton) {
            toggleStatisticsButton.textContent = 'Show Statistics';
            toggleStatisticsButton.classList.remove('active');
        }
        
        // Hide cluster options
        clusterOptions.classList.add('hidden');
        
        // Hide statistics panel
        statisticsContainer.classList.add('hidden');
        
        // Reset status variables
        clusteringEnabled = false;
        statisticsVisible = false;
    }
    
    /**
     * Toggle the heatmap visibility
     */
    function toggleHeatmap() {
        const toggleButton = document.getElementById('toggle-heatmap');
        
        if (heatmapVisible) {
            // Hide heatmap
            if (heatLayer) {
                map.removeLayer(heatLayer);
                heatLayer = null;
            }
            toggleButton.textContent = 'Show Heatmap';
            toggleButton.classList.remove('active');
            heatmapVisible = false;
        } else {
            // Show heatmap
            createHeatmap();
            toggleButton.textContent = 'Hide Heatmap';
            toggleButton.classList.add('active');
            heatmapVisible = true;
        }
    }

    /**
     * Create a heatmap based on the GPS data points
     */
    function createHeatmap() {
        // Remove existing heatmap if it exists
        if (heatLayer) {
            map.removeLayer(heatLayer);
        }
        
        // We need waypoints to create a heatmap
        if (!waypoints || waypoints.length === 0) {
            showStatusMessage('No GPS data available for heatmap', 'warning');
            return;
        }
        
        // Prepare data points for the heatmap
        // We'll use the same locations as the markers, but calculate intensity based on:
        // 1. Photos taken at the same location (higher intensity)
        // 2. Time spent at a location (calculated from timestamps)
        
        const heatData = [];
        const locationGroups = {};
        
        // Group photos by location (using a grid approach to group nearby points)
        waypoints.forEach(point => {
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
        
        // Create the heatmap layer
        heatLayer = L.heatLayer(heatData, {
            radius: 25,
            blur: 15,
            maxZoom: 17,
            gradient: {
                0.4: 'blue',
                0.6: 'lime',
                0.8: 'yellow',
                1.0: 'red'
            }
        }).addTo(map);
    }
    
    /**
     * Toggle marker clustering
     */
    function toggleClustering() {
        const toggleButton = document.getElementById('toggle-clustering');
        
        if (clusteringEnabled) {
            // Disable clustering
            disableClustering();
            toggleButton.textContent = 'Enable Clustering';
            toggleButton.classList.remove('active');
            clusterOptions.classList.add('hidden');
            clusteringEnabled = false;
        } else {
            // Enable clustering
            enableClustering();
            toggleButton.textContent = 'Disable Clustering';
            toggleButton.classList.add('active');
            clusterOptions.classList.remove('hidden');
            clusteringEnabled = true;
        }
    }
    
    /**
     * Enable marker clustering
     */
    function enableClustering() {
        // If no waypoints, nothing to do
        if (!waypoints || waypoints.length === 0) {
            showStatusMessage('No GPS data available for clustering', 'warning');
            return;
        }
        
        // Remove individual markers from map
        markers.forEach(marker => map.removeLayer(marker));
        markers = [];
        
        // Create marker cluster group if it doesn't exist
        if (!markerClusterGroup) {
            markerClusterGroup = L.markerClusterGroup({
                maxClusterRadius: clusterRadius,
                spiderfyOnMaxZoom: true,
                showCoverageOnHover: true,
                zoomToBoundsOnClick: true,
                chunkedLoading: true
            });
        }
        
        // Add markers to cluster group
        waypoints.forEach(point => {
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
                Time: ${timestampStr}
            `);
            
            // Add to cluster group
            markerClusterGroup.addLayer(marker);
        });
        
        // Add cluster group to map
        map.addLayer(markerClusterGroup);
    }
    
    /**
     * Disable marker clustering
     */
    function disableClustering() {
        // If no waypoints, nothing to do
        if (!waypoints || waypoints.length === 0) {
            return;
        }
        
        // Remove cluster group from map
        if (markerClusterGroup) {
            map.removeLayer(markerClusterGroup);
        }
        
        // Add individual markers to map
        waypoints.forEach(point => {
            const latLng = L.latLng(point.latitude, point.longitude);
            
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
    }
    
    /**
     * Update cluster radius when slider changes
     */
    function updateClusterRadius() {
        // If clustering not enabled or no cluster group, nothing to do
        if (!clusteringEnabled || !markerClusterGroup) {
            return;
        }
        
        // Remove existing cluster group
        map.removeLayer(markerClusterGroup);
        
        // Create new cluster group with updated radius
        markerClusterGroup = L.markerClusterGroup({
            maxClusterRadius: clusterRadius,
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: true,
            zoomToBoundsOnClick: true,
            chunkedLoading: true
        });
        
        // Add markers to new cluster group
        waypoints.forEach(point => {
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
                Time: ${timestampStr}
            `);
            
            // Add to cluster group
            markerClusterGroup.addLayer(marker);
        });
        
        // Add new cluster group to map
        map.addLayer(markerClusterGroup);
    }
    
    /**
     * Toggle statistics panel
     */
    function toggleStatistics() {
        const toggleButton = document.getElementById('toggle-statistics');
        
        if (statisticsVisible) {
            // Hide statistics
            statisticsContainer.classList.add('hidden');
            toggleButton.textContent = 'Show Statistics';
            toggleButton.classList.remove('active');
            statisticsVisible = false;
        } else {
            // Show statistics
            if (!routeStatistics) {
                calculateRouteStatistics(waypoints);
            }
            updateStatisticsPanel();
            statisticsContainer.classList.remove('hidden');
            toggleButton.textContent = 'Hide Statistics';
            toggleButton.classList.add('active');
            statisticsVisible = true;
            
            // Scroll to statistics
            statisticsContainer.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }
    
    /**
     * Calculate route statistics from waypoints
     */
    function calculateRouteStatistics(waypoints) {
        if (!waypoints || waypoints.length < 2) {
            console.log("Not enough waypoints for statistics");
            return;
        }
        
        // Sort waypoints by timestamp
        const sortedWaypoints = [...waypoints].sort((a, b) => {
            const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
            const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
            return timeA - timeB;
        });
        
        // Initialize statistics object
        const stats = {
            totalDistance: 0,
            totalDuration: 0,
            startTime: null,
            endTime: null,
            avgSpeed: 0,
            maxSpeed: 0,
            speeds: [],
            minElevation: Infinity,
            maxElevation: -Infinity,
            elevationGain: 0,
            photoCount: sortedWaypoints.length,
            elevationProfile: [],
            speedProfile: []
        };
        
        // Collect timestamps and start/end times
        stats.startTime = new Date(sortedWaypoints[0].timestamp);
        stats.endTime = new Date(sortedWaypoints[sortedWaypoints.length - 1].timestamp);
        stats.totalDuration = (stats.endTime - stats.startTime) / 1000; // in seconds
        
        // Process waypoints for distance, elevation, and speed
        let prevPoint = null;
        let prevElevation = null;
        
        for (let i = 0; i < sortedWaypoints.length; i++) {
            const point = sortedWaypoints[i];
            const timestamp = new Date(point.timestamp);
            
            // Track min/max elevation
            const elevation = point.altitude || 0;
            stats.minElevation = Math.min(stats.minElevation, elevation);
            stats.maxElevation = Math.max(stats.maxElevation, elevation);
            
            // Calculate elevation gain
            if (prevElevation !== null && elevation > prevElevation) {
                stats.elevationGain += (elevation - prevElevation);
            }
            prevElevation = elevation;
            
            // Add to elevation profile (distance, elevation)
            stats.elevationProfile.push({
                index: i,
                elevation: elevation
            });
            
            // Calculate distance and speed if we have a previous point
            if (prevPoint) {
                const distance = calculateDistance(
                    prevPoint.latitude, prevPoint.longitude,
                    point.latitude, point.longitude
                );
                
                const timeDiff = (timestamp - new Date(prevPoint.timestamp)) / 1000; // in seconds
                
                // Only add distance if it's reasonable (avoid GPS jumps)
                if (distance < 10) { // Don't count jumps over 10km
                    stats.totalDistance += distance;
                
                    // Calculate speed if time difference is valid
                    if (timeDiff > 0) {
                        const speed = distance / timeDiff * 3600; // km/h
                        
                        // Only count reasonable speeds (avoid GPS errors)
                        if (speed < 300) { // Max 300 km/h
                            stats.speeds.push(speed);
                            stats.maxSpeed = Math.max(stats.maxSpeed, speed);
                            
                            // Add to speed profile (distance, speed)
                            stats.speedProfile.push({
                                index: i,
                                speed: speed
                            });
                        }
                    }
                }
            }
            
            prevPoint = point;
        }
        
        // Calculate average speed (if we have valid speeds)
        if (stats.speeds.length > 0) {
            stats.avgSpeed = stats.speeds.reduce((sum, speed) => sum + speed, 0) / stats.speeds.length;
        } else if (stats.totalDistance > 0 && stats.totalDuration > 0) {
            // Fallback: calculate average speed from total distance and duration
            stats.avgSpeed = stats.totalDistance / (stats.totalDuration / 3600); // km/h
        }
        
        // If no elevation changes were found, reset min/max
        if (stats.minElevation === Infinity) stats.minElevation = 0;
        if (stats.maxElevation === -Infinity) stats.maxElevation = 0;
        
        // Store statistics
        routeStatistics = stats;
        
        return stats;
    }
    
    /**
     * Calculate distance between two GPS points using Haversine formula (in km)
     */
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }
    
    /**
     * Format duration in seconds to human-readable format (HH:MM:SS)
     */
    function formatDuration(durationInSeconds) {
        if (!durationInSeconds) return '-';
        
        const hours = Math.floor(durationInSeconds / 3600);
        const minutes = Math.floor((durationInSeconds % 3600) / 60);
        const seconds = Math.floor(durationInSeconds % 60);
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    /**
     * Update statistics panel with calculated data
     */
    function updateStatisticsPanel() {
        if (!routeStatistics) {
            showStatusMessage('No statistics available', 'warning');
            return;
        }
        
        // Update summary statistics
        document.getElementById('total-distance').textContent = `${routeStatistics.totalDistance.toFixed(2)} km`;
        document.getElementById('total-duration').textContent = formatDuration(routeStatistics.totalDuration);
        document.getElementById('start-time').textContent = routeStatistics.startTime.toLocaleString();
        document.getElementById('end-time').textContent = routeStatistics.endTime.toLocaleString();
        document.getElementById('avg-speed').textContent = `${routeStatistics.avgSpeed.toFixed(2)} km/h`;
        document.getElementById('max-speed').textContent = `${routeStatistics.maxSpeed.toFixed(2)} km/h`;
        document.getElementById('min-elevation').textContent = `${routeStatistics.minElevation.toFixed(1)} m`;
        document.getElementById('max-elevation').textContent = `${routeStatistics.maxElevation.toFixed(1)} m`;
        document.getElementById('elevation-gain').textContent = `${routeStatistics.elevationGain.toFixed(1)} m`;
        document.getElementById('photo-count').textContent = routeStatistics.photoCount.toString();
        
        // Create charts
        createElevationChart();
        createSpeedChart();
    }
    
    /**
     * Create elevation profile chart
     */
    function createElevationChart() {
        const ctx = document.getElementById('elevation-chart').getContext('2d');
        
        // Destroy existing chart if it exists
        if (elevationChart) {
            elevationChart.destroy();
        }
        
        // Create labels for x-axis (photo indices or timestamps)
        const labels = routeStatistics.elevationProfile.map((point, index) => index + 1);
        
        // Create chart data
        const data = {
            labels: labels,
            datasets: [{
                label: 'Elevation (m)',
                data: routeStatistics.elevationProfile.map(point => point.elevation),
                fill: true,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                tension: 0.4
            }]
        };
        
        // Chart options
        const options = {
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
                        label: function(context) {
                            return `Elevation: ${context.raw.toFixed(1)} m`;
                        }
                    }
                }
            }
        };
        
        // Create chart
        elevationChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: options
        });
    }
    
    /**
     * Create speed profile chart
     */
    function createSpeedChart() {
        const ctx = document.getElementById('speed-chart').getContext('2d');
        
        // Destroy existing chart if it exists
        if (speedChart) {
            speedChart.destroy();
        }
        
        // Create labels for x-axis (photo indices)
        const labels = routeStatistics.speedProfile.map((point, index) => index + 1);
        
        // Create chart data
        const data = {
            labels: labels,
            datasets: [{
                label: 'Speed (km/h)',
                data: routeStatistics.speedProfile.map(point => point.speed),
                fill: false,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                tension: 0.1
            }]
        };
        
        // Chart options
        const options = {
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
                        label: function(context) {
                            return `Speed: ${context.raw.toFixed(1)} km/h`;
                        }
                    }
                }
            }
        };
        
        // Create chart
        speedChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: options
        });
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
        statisticsContainer.classList.add('hidden');
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
        waypoints = [];
        routeStatistics = null;
        
        // Reset heatmap
        if (heatLayer) {
            map.removeLayer(heatLayer);
            heatLayer = null;
        }
        heatmapVisible = false;
        document.getElementById('toggle-heatmap').textContent = 'Show Heatmap';
        document.getElementById('toggle-heatmap').classList.remove('active');
        
        // Reset clustering
        clusteringEnabled = false;
        document.getElementById('toggle-clustering').textContent = 'Enable Clustering';
        document.getElementById('toggle-clustering').classList.remove('active');
        clusterOptions.classList.add('hidden');
        
        // Reset statistics
        statisticsVisible = false;
        document.getElementById('toggle-statistics').textContent = 'Show Statistics';
        document.getElementById('toggle-statistics').classList.remove('active');
        
        // Destroy charts
        if (elevationChart) {
            elevationChart.destroy();
            elevationChart = null;
        }
        if (speedChart) {
            speedChart.destroy();
            speedChart = null;
        }

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