/**
 * API Client
 * Handles all API requests to the server
 */

const APIClient = {
    /**
     * Submit photos for processing
     * @param {FormData} formData - Form data with photos
     * @param {Function} progressCallback - Callback for upload progress
     * @returns {Promise<Object>} Promise resolving to the response data
     */
    submitPhotos: (formData, progressCallback) => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            
            // Progress tracking
            if (progressCallback && typeof progressCallback === 'function') {
                xhr.upload.addEventListener('progress', progressCallback);
            }
            
            xhr.addEventListener('load', () => {
                if (xhr.status === 200) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        resolve(response);
                    } catch (error) {
                        reject(new Error('Invalid server response'));
                    }
                } else {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        reject(new Error(response.error || `Server returned status ${xhr.status}`));
                    } catch (e) {
                        reject(new Error(`Server returned status ${xhr.status}`));
                    }
                }
            });
            
            xhr.addEventListener('error', () => {
                reject(new Error('Network error during upload'));
            });
            
            xhr.open('POST', '/api/submit');
            xhr.send(formData);
        });
    },
    
    /**
     * Process uploaded photos to extract GPS data
     * @param {string} sessionId - Session ID from the submission
     * @returns {Promise<Object>} Promise resolving to the extracted GPS data
     */
    processPhotos: (sessionId) => {
        return fetch(`/api/process/${sessionId}`, {
            method: 'POST'
        })
        .then(response => {
            if (!response.ok) {
                return response.json()
                    .then(data => {
                        throw new Error(data.error || 'Unknown server error');
                    })
                    .catch(jsonError => {
                        throw new Error(`Server error: ${response.statusText || 'Unknown'}`);
                    });
            }
            return response.json();
        });
    },
    
    /**
     * Create a GPX file from GPS data
     * @param {Array} gpsData - Array of GPS data points
     * @returns {Promise<Object>} Promise resolving to the creation result
     */
    createGPX: (gpsData) => {
        return fetch('/api/create-gpx', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                gps_data: gpsData
            })
        })
        .then(response => {
            if (!response.ok) {
                return response.json()
                    .then(data => {
                        throw new Error(data.error || `Server returned status ${response.status}`);
                    })
                    .catch(jsonError => {
                        throw new Error(`Processing failed: Server error (${response.status})`);
                    });
            }
            return response.json();
        });
    },
    
    /**
     * Get download URL for a GPX file
     * @param {string} sessionId - Session ID
     * @param {string} filename - GPX filename
     * @returns {string} Download URL
     */
    getDownloadUrl: (sessionId, filename) => {
        return `/api/download/${sessionId}/${filename}`;
    },
    
    /**
     * Download a GPX file
     * @param {string} sessionId - Session ID
     * @param {string} filename - GPX filename
     */
    downloadGPX: (sessionId, filename) => {
        const downloadUrl = APIClient.getDownloadUrl(sessionId, filename);
        
        // Create a hidden link and click it
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },
    
    /**
     * Clean up session data on the server
     * @param {string} sessionId - Session ID to clean up
     * @returns {Promise<Object>} Promise resolving to the cleanup result
     */
    cleanupSession: (sessionId) => {
        if (!sessionId) return Promise.resolve({ success: true, message: 'Nothing to clean up' });
        
        return fetch(`/api/cleanup/${sessionId}`, {
            method: 'POST'
        })
        .then(response => response.json())
        .catch(error => {
            console.error('Cleanup error:', error);
            return { success: false, error: error.message };
        });
    }
};

export default APIClient;