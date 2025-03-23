/**
 * Drag and Drop Module
 * Handles file and directory drag and drop functionality
 */

import DOMHelpers from '../utils/domHelpers.js';
import FileUtils from '../utils/fileUtils.js';

class DragAndDrop {
    /**
     * Initialize drag and drop functionality
     * @param {Object} config - Configuration options
     * @param {HTMLElement} config.fileDropArea - Drop area for files
     * @param {HTMLElement} config.directoryDropArea - Drop area for directories
     * @param {HTMLInputElement} config.fileInput - File input element
     * @param {HTMLInputElement} config.directoryInput - Directory input element
     * @param {Function} config.onFileDrop - Callback when files are dropped
     * @param {Function} config.onDirectoryDrop - Callback when directories are dropped
     * @param {Function} config.onFilesSelected - Callback when files are selected by input
     * @param {Function} config.onDirectorySelected - Callback when directory is selected by input
     */
    constructor(config) {
        this.config = config;
        this.fileDropArea = config.fileDropArea;
        this.directoryDropArea = config.directoryDropArea;
        this.fileInput = config.fileInput;
        this.directoryInput = config.directoryInput;
        
        this.init();
    }
    
    /**
     * Initialize drag and drop event listeners and behaviors
     */
    init() {
        this.initDropAreas();
        this.initInputListeners();
    }
    
    /**
     * Initialize drop areas for files and directories
     */
    initDropAreas() {
        // Setup both drop areas with common preventDefaults
        const dropAreas = [this.fileDropArea, this.directoryDropArea].filter(area => area);
        
        dropAreas.forEach(dropArea => {
            // Prevent default browser behavior for drag events
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                DOMHelpers.on(dropArea, eventName, this.preventDefaults.bind(this));
            });
            
            // Add visual feedback for drag events
            ['dragenter', 'dragover'].forEach(eventName => {
                DOMHelpers.on(dropArea, eventName, () => {
                    dropArea.classList.add('drag-over');
                });
            });
            
            ['dragleave', 'drop'].forEach(eventName => {
                DOMHelpers.on(dropArea, eventName, () => {
                    dropArea.classList.remove('drag-over');
                });
            });
            
            // Handle drops
            DOMHelpers.on(dropArea, 'drop', (e) => this.handleUniversalDrop(e, dropArea));
        });
        
        // Clicking on drop areas should trigger file input
        if (this.fileDropArea && this.fileInput) {
            DOMHelpers.on(this.fileDropArea, 'click', () => this.fileInput.click());
        }
        
        if (this.directoryDropArea && this.directoryInput) {
            DOMHelpers.on(this.directoryDropArea, 'click', () => this.directoryInput.click());
        }
    }
    
    /**
     * Initialize input change listeners
     */
    initInputListeners() {
        if (this.fileInput && this.config.onFilesSelected) {
            DOMHelpers.on(this.fileInput, 'change', () => {
                this.config.onFilesSelected(this.fileInput.files);
            });
        }
        
        if (this.directoryInput && this.config.onDirectorySelected) {
            DOMHelpers.on(this.directoryInput, 'change', () => {
                this.config.onDirectorySelected(this.directoryInput.files);
            });
        }
    }
    
    /**
     * Prevent default browser behavior for drag and drop events
     * @param {Event} e - The event object
     */
    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    /**
     * Handle universal drops - detects if dropped content is files or directory
     * @param {DragEvent} e - The drop event
     * @param {HTMLElement} dropArea - The drop area element
     */
    handleUniversalDrop(e, dropArea) {
        this.preventDefaults(e);
        
        // Remove drag-over class from all drop areas
        if (this.fileDropArea) this.fileDropArea.classList.remove('drag-over');
        if (this.directoryDropArea) this.directoryDropArea.classList.remove('drag-over');
        
        const items = e.dataTransfer.items;
        const files = e.dataTransfer.files;
        
        if (!items || items.length === 0 || !files || files.length === 0) {
            if (this.config.onError) {
                this.config.onError('No items detected in the drop');
            }
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
            this.handleAsDirectory(e, dropArea);
        } else {
            this.handleAsFiles(e, dropArea);
        }
    }
    
    /**
     * Handle dropped content as files
     * @param {DragEvent} e - The drop event
     * @param {HTMLElement} dropArea - The drop area element
     */
    handleAsFiles(e, dropArea) {
        const files = e.dataTransfer.files;
        
        // Filter for image files
        const imageFiles = Array.from(files).filter(file => FileUtils.isImageFile(file));
        
        if (imageFiles.length === 0) {
            if (this.config.onError) {
                this.config.onError('No valid image files found in the dropped items');
            }
            return;
        }
        
        try {
            // Create a new FileList-like object with only image files
            const fileList = FileUtils.createFileList(imageFiles);
            
            // Are we dropping on the file drop area or should we use the file input?
            if (dropArea === this.fileDropArea || !this.directoryDropArea) {
                if (this.fileInput) {
                    // Set the files to the input element
                    if ('files' in this.fileInput) {
                        this.fileInput.files = fileList;
                        
                        // Trigger the change event
                        const event = new Event('change');
                        this.fileInput.dispatchEvent(event);
                    }
                }
                
                // Call the onFileDrop callback if provided
                if (this.config.onFileDrop) {
                    this.config.onFileDrop(imageFiles);
                }
                
                if (this.config.onInfo) {
                    this.config.onInfo(`${imageFiles.length} image files ready to process`);
                }
            } else {
                // Handle as directory even though it's files
                // (this is for when files are dropped on the directory area)
                if (this.config.onDirectoryDrop) {
                    this.config.onDirectoryDrop(imageFiles);
                }
            }
        } catch (error) {
            console.error('Error handling dropped files:', error);
            if (this.config.onError) {
                this.config.onError(`Error handling dropped files: ${error.message}. Please use the Select Files button instead.`);
            }
        }
    }
    
    /**
     * Handle dropped content as directory
     * @param {DragEvent} e - The drop event
     * @param {HTMLElement} dropArea - The drop area element
     */
    handleAsDirectory(e, dropArea) {
        // First, try to extract files directly from the drop event
        const files = e.dataTransfer.files;
        
        if (files && files.length > 0) {
            // Filter for image files
            const imageFiles = Array.from(files).filter(file => FileUtils.isImageFile(file));
            
            if (imageFiles.length === 0) {
                if (this.config.onError) {
                    this.config.onError('No valid image files found in the dropped directory');
                }
                return;
            }
            
            try {
                // Create a new FileList-like object with only image files
                const fileList = FileUtils.createFileList(imageFiles);
                
                // Set the files to the directory input if we're on the directory tab
                if (this.directoryInput && 'files' in this.directoryInput) {
                    this.directoryInput.files = fileList;
                    
                    // Trigger the change event
                    const event = new Event('change');
                    this.directoryInput.dispatchEvent(event);
                }
                
                // Call the onDirectoryDrop callback
                if (this.config.onDirectoryDrop) {
                    this.config.onDirectoryDrop(imageFiles);
                }
                
                if (this.config.onInfo) {
                    this.config.onInfo(`${imageFiles.length} image files from directory ready to process`);
                }
                
                return;
            } catch (error) {
                console.error('Error handling dropped directory files:', error);
                // Fall through to the directory input fallback method
            }
        }
        
        // Fallback: Due to browser security restrictions, we can't always access directory contents directly
        // So we need the user to select the directory manually
        if (this.directoryInput) {
            // Switch to directory tab if necessary (not implemented here, handled externally)
            
            // Trigger the directory input click
            this.directoryInput.click();
            
            if (this.config.onInfo) {
                this.config.onInfo('Directory detected. Please select it in the file browser that opened.');
            }
        } else if (this.config.onError) {
            this.config.onError('Directory uploads are not supported in this browser');
        }
    }
}

export default DragAndDrop;
