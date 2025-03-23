/**
 * File Utility Functions
 * Helper functions for working with files and file inputs
 */

const FileUtils = {
    /**
     * Check if a file is an image based on its MIME type
     * @param {File} file - The file to check
     * @returns {boolean} True if the file is an image
     */
    isImageFile: (file) => {
        return file && file.type && file.type.startsWith('image/');
    },
    
    /**
     * Determine if a file can be processed directly in the browser
     * @param {File} file - The file to check
     * @returns {boolean} True if the file can be processed client-side
     */
    canProcessClientSide: (file) => {
        // JPEG/JFIF and TIFF files can be processed client-side with EXIF.js
        const jpegTypes = ['image/jpeg', 'image/jpg'];
        const tiffTypes = ['image/tiff', 'image/tif'];
        
        return jpegTypes.includes(file.type) || tiffTypes.includes(file.type);
    },
    
    /**
     * Get file extension from file name
     * @param {string} filename - The file name
     * @returns {string} The file extension (lowercase, without dot)
     */
    getExtension: (filename) => {
        return filename.split('.').pop().toLowerCase();
    },
    
    /**
     * Format file size in human-readable format
     * @param {number} bytes - File size in bytes
     * @param {number} [decimals=2] - Number of decimal places
     * @returns {string} Formatted file size with units
     */
    formatFileSize: (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
    },
    
    /**
     * Create a mock/simulated file list from an array of files
     * Used for manipulating file inputs programmatically
     * @param {File[]} files - Array of File objects
     * @returns {Object} DataTransfer object that can be used as a FileList
     */
    createFileList: (files) => {
        const dataTransfer = new DataTransfer();
        files.forEach(file => dataTransfer.items.add(file));
        return dataTransfer.files;
    },
    
    /**
     * Filter files by type
     * @param {FileList|File[]} files - Files to filter
     * @param {string[]} acceptedTypes - Array of accepted MIME types
     * @returns {File[]} Filtered array of files
     */
    filterByType: (files, acceptedTypes) => {
        return Array.from(files).filter(file => 
            acceptedTypes.some(type => {
                // Handle wildcard types like 'image/*'
                if (type.endsWith('/*')) {
                    const mainType = type.split('/')[0];
                    return file.type.startsWith(`${mainType}/`);
                }
                return file.type === type;
            })
        );
    },
    
    /**
     * Read a file as a data URL
     * @param {File} file - File to read
     * @returns {Promise<string>} Promise resolving to the data URL
     */
    readAsDataURL: (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
        });
    },
    
    /**
     * Read a file as binary data
     * @param {File} file - File to read
     * @returns {Promise<ArrayBuffer>} Promise resolving to the array buffer
     */
    readAsArrayBuffer: (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsArrayBuffer(file);
        });
    },
    
    /**
     * Read a file as text
     * @param {File} file - File to read
     * @returns {Promise<string>} Promise resolving to the text content
     */
    readAsText: (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });
    }
};

export default FileUtils;