/**
 * File Upload Module
 * Handles file selection, validation, and upload functionality
 */

import APIClient from '../api/apiClient.js';
import FileUtils from '../utils/fileUtils.js';
import DOMHelpers from '../utils/domHelpers.js';
import UIUtils from '../utils/uiUtils.js';
import ExifReader from './exifReader.js';

class FileUpload {
    /**
     * Initialize file upload functionality
     * @param {Object} config - Configuration options
     * @param {HTMLElement} config.formElement - Form element
     * @param {HTMLElement} config.progressContainer - Progress container element
     * @param {HTMLElement} config.progressBar - Progress bar element
     * @param {HTMLElement} config.progressText - Progress text element
     * @param {HTMLElement} config.statusContainer - Status message container
     * @param {HTMLInputElement} config.submitButton - Submit button
     * @param {string} config.activeInput - Active input type ('file' or 'directory')
     * @param {HTMLInputElement} config.fileInput - File input element
     * @param {HTMLInputElement} config.directoryInput - Directory input element
     * @param {HTMLInputElement} config.recursiveCheckbox - Recursive processing checkbox
     * @param {HTMLSelectElement} config.depthSelect - Recursive depth select element
     * @param {Function} config.onSuccess - Callback on successful processing
     * @param {Function} config.onError - Callback on error
     */
    constructor(config) {
        this.config = config;
        this.formElement = config.formElement;
        this.progressContainer = config.progressContainer;
        this.progressBar = config.progressBar;
        this.progressText = config.progressText;
        this.statusContainer = config.statusContainer;
        this.submitButton = config.submitButton;
        this.activeInput = config.activeInput || 'file';
        this.fileInput = config.fileInput;
        this.directoryInput = config.directoryInput;
        this.recursiveCheckbox = config.recursiveCheckbox;
        this.depthSelect = config.depthSelect;
        
        this.init();
    }
    
    /**
     * Initialize form submission handling
     */
    init() {
        if (this.formElement) {
            this.formElement.addEventListener('submit', this.handleFormSubmit.bind(this));
        }
    }
    
    /**
     * Set active input type
     * @param {string} inputType - 'file' or 'directory'
     */
    setActiveInput(inputType) {
        this.activeInput = inputType;
        this.updateSubmitButtonState();
    }
    
    /**
     * Update submit button state based on form validity
     */
    updateSubmitButtonState() {
        if (!this.submitButton) return;
        
        let isValid = false;
        
        if (this.activeInput === 'file' && this.fileInput) {
            isValid = this.fileInput.files.length > 0;
        } else if (this.activeInput === 'directory' && this.directoryInput) {
            isValid = this.directoryInput.files.length > 0;
        }
        
        this.submitButton.disabled = !isValid;
    }
    
    /**
     * Handle form submission
     * @param {Event} event - Form submit event
     */
    async handleFormSubmit(event) {
        event.preventDefault();
        
        let selectedFiles;
        if (this.activeInput === 'file') {
            selectedFiles = this.fileInput?.files;
            if (!selectedFiles || selectedFiles.length === 0) {
                this.showStatusMessage('Please select photos to process', 'error');
                return;
            }
        } else {
            selectedFiles = this.directoryInput?.files;
            if (!selectedFiles || selectedFiles.length === 0) {
                this.showStatusMessage('Please select a directory to process', 'error');
                return;
            }
        }
        
        // Show progress
        this.showProgress();
        this.submitButton.disabled = true;
        
        // Sort files into client-side and server-side processable
        const clientSideFiles = [];
        const serverSideFiles = [];
        let nonImageCount = 0;
        
        Array.from(selectedFiles).forEach(file => {
            if (FileUtils.canProcessClientSide(file)) {
                clientSideFiles.push(file);
            } else if (FileUtils.isImageFile(file)) {
                serverSideFiles.push(file);
            } else {
                nonImageCount++;
            }
        });
        
        // Check if we have any valid image files to process
        if (clientSideFiles.length === 0 && serverSideFiles.length === 0) {
            this.handleError('No valid image files found. Please select photos to process.');
            return;
        }
        
        // Notify user about non-image files that will be skipped
        if (nonImageCount > 0) {
            this.showStatusMessage(`Skipping ${nonImageCount} non-image files`, 'warning');
        }
        
        console.log(`Files to process - Client-side: ${clientSideFiles.length}, Server-side: ${serverSideFiles.length}, Skipped: ${nonImageCount}`);
        
        // Initialize arrays for GPS data
        let clientSideGpsData = [];
        let serverSideGpsData = [];
        let sessionId = null;
        
        try {
            // Start with client-side processing
            if (clientSideFiles.length > 0) {
                this.updateProgress(0, 100, 'Extracting GPS data from JPEG/TIFF files...');
                
                clientSideGpsData = await ExifReader.extractGpsDataFromImages(
                    clientSideFiles,
                    (current, total) => {
                        const percentComplete = Math.round((current / total) * 50); // 50% for client-side processing
                        this.updateProgress(percentComplete, 100, `Processing client-side files... ${percentComplete}%`);
                    }
                );
                
                this.updateProgress(50, 100, 'Client-side processing complete');
            }
            
            // Continue with server-side processing if needed
            if (serverSideFiles.length > 0) {
                this.updateProgress(50, 100, 'Processing RAW/PNG files...');
                
                // Prepare form data
                const formData = new FormData();
                for (const file of serverSideFiles) {
                    formData.append('photos', file);
                }
                
                // Add source type (file or directory)
                formData.append('source_type', this.activeInput);
                
                // Add recursive options if directory mode is selected
                if (this.activeInput === 'directory' && this.recursiveCheckbox?.checked) {
                    formData.append('recursive', '1');
                    if (this.depthSelect) {
                        formData.append('depth', this.depthSelect.value);
                    }
                }
                
                // Submit files to server
                const uploadResponse = await APIClient.submitPhotos(
                    formData,
                    (event) => {
                        if (event.lengthComputable) {
                            const percentComplete = Math.round((event.loaded / event.total) * 25); // 25% for upload
                            this.updateProgress(50 + percentComplete, 100, `Uploading RAW/PNG files... ${percentComplete}%`);
                        }
                    }
                );
                
                sessionId = uploadResponse.session_id;
                
                // Process the server-side files
                this.updateProgress(75, 100, 'Processing RAW/PNG files on server...');
                
                const serverData = await APIClient.processPhotos(sessionId);
                if (serverData.success) {
                    serverSideGpsData = serverData.waypoints;
                } else {
                    throw new Error(serverData.error || 'Error processing server-side files');
                }
            }
            
            // Combine client- and server-side GPS data
            const allGpsData = [...clientSideGpsData, ...serverSideGpsData];
            
            if (allGpsData.length === 0) {
                throw new Error('No GPS data found in any of the submitted photos');
            }
            
            // Send all GPS data to create GPX
            this.updateProgress(90, 100, 'Creating GPX file...');
            
            const response = await APIClient.createGPX(allGpsData);
            
            if (response.success) {
                // Processing succeeded
                sessionId = response.session_id;
                const gpxFilename = response.gpx_file;
                
                // Update UI
                this.updateProgress(100, 100, 'Processing complete!');
                
                // Show success message with statistics
                const statsMessage = `Photos processed successfully! ${response.waypoints.length} photos with GPS data processed. GPX file created.`;
                this.showStatusMessage(statsMessage, 'success');
                
                // Call success callback
                if (this.config.onSuccess) {
                    this.config.onSuccess({
                        sessionId,
                        gpxFilename,
                        waypoints: response.waypoints
                    });
                }
                
                // Reset form
                setTimeout(() => {
                    this.hideProgress();
                    this.submitButton.disabled = false;
                    if (this.fileInput) this.fileInput.value = '';
                    if (this.directoryInput) this.directoryInput.value = '';
                    if (this.recursiveCheckbox) this.recursiveCheckbox.checked = false;
                    if (this.depthSelect?.parentElement) {
                        this.depthSelect.parentElement.classList.remove('visible');
                    }
                }, 1500);
                
            } else {
                throw new Error(response.error || 'Processing failed: Unknown error');
            }
            
        } catch (error) {
            console.error('Processing error:', error);
            this.handleError(error.message);
        }
    }
    
    /**
     * Show progress container and reset progress bar
     */
    showProgress() {
        if (this.progressContainer) {
            DOMHelpers.show(this.progressContainer);
        }
        this.updateProgress(0, 100, 'Processing...');
    }
    
    /**
     * Hide progress container
     */
    hideProgress() {
        if (this.progressContainer) {
            DOMHelpers.hide(this.progressContainer);
        }
    }
    
    /**
     * Update progress bar and text
     * @param {number} current - Current progress value
     * @param {number} total - Total progress value
     * @param {string} [message] - Optional message to display
     */
    updateProgress(current, total, message) {
        UIUtils.updateProgressBar(this.progressBar, this.progressText, current, total, message);
    }
    
    /**
     * Show a status message
     * @param {string} message - Message to display
     * @param {string} [type='info'] - Message type: 'success', 'error', 'warning', 'info'
     * @param {number} [timeout=10000] - Auto-removal timeout in ms (0 to disable)
     */
    showStatusMessage(message, type = 'info', timeout = 10000) {
        if (this.statusContainer) {
            UIUtils.showStatusMessage(this.statusContainer, message, type, timeout);
        }
    }
    
    /**
     * Handle error during processing
     * @param {string} message - Error message
     */
    handleError(message) {
        this.updateProgress(0, 100, 'Error');
        
        setTimeout(() => {
            this.hideProgress();
            this.submitButton.disabled = false;
        }, 1000);
        
        this.showStatusMessage(message, 'error');
        
        if (this.config.onError) {
            this.config.onError(message);
        }
    }
}

export default FileUpload;
