/**
 * EXIF Reader Module
 * Extracts GPS and other metadata from image files
 */

import GPSUtils from '../utils/gpsUtils.js';
import FileUtils from '../utils/fileUtils.js';

const ExifReader = {
    /**
     * Extract GPS data from images directly in the browser
     * @param {File[]} files - Array of image files
     * @param {Function} progressCallback - Callback for processing progress updates
     * @returns {Promise<Array>} Promise resolving to extracted GPS data
     */
    extractGpsDataFromImages: (files, progressCallback) => {
        return new Promise((resolve, reject) => {
            const gpsDataList = [];
            let processedCount = 0;
            let totalFiles = files.length;

            if (totalFiles === 0) {
                resolve([]);
                return;
            }

            // Process each file sequentially to avoid memory issues
            const processFile = (index) => {
                if (index >= totalFiles) {
                    resolve(gpsDataList);
                    return;
                }

                const file = files[index];

                // Skip non-image files
                if (!FileUtils.isImageFile(file)) {
                    processedCount++;
                    if (progressCallback) progressCallback(processedCount, totalFiles);
                    processFile(index + 1);
                    return;
                }

                const reader = new FileReader();

                reader.onload = function () {
                    try {
                        // Use EXIF.js to extract EXIF data
                        const exifReader = new FileReader();

                        exifReader.onload = function () {
                            try {
                                // Extract EXIF data using the EXIF.js library
                                // EXIF.js is loaded from a CDN in the HTML
                                const tags = EXIF.readFromBinaryFile(this.result);

                                // Extract GPS data if available
                                if (tags) {
                                    const gpsData = ExifReader.extractGpsFromExif(tags, file);

                                    if (gpsData) {
                                        gpsDataList.push(gpsData);
                                    }
                                }
                            } catch (exifErr) {
                                console.error(`Error reading EXIF from ${file.name}:`, exifErr);
                            }

                            // Process next file
                            processedCount++;
                            if (progressCallback) progressCallback(processedCount, totalFiles);
                            processFile(index + 1);
                        };

                        exifReader.onerror = function () {
                            console.error(`Error reading EXIF binary data from ${file.name}`);
                            processedCount++;
                            if (progressCallback) progressCallback(processedCount, totalFiles);
                            processFile(index + 1);
                        };

                        // Read file as binary for EXIF.js
                        exifReader.readAsArrayBuffer(file);
                    } catch (err) {
                        console.error(`Error setting up EXIF reader for ${file.name}:`, err);
                        processedCount++;
                        if (progressCallback) progressCallback(processedCount, totalFiles);
                        processFile(index + 1);
                    }
                };

                reader.onerror = function () {
                    console.error(`Error reading file ${file.name}`);
                    processedCount++;
                    if (progressCallback) progressCallback(processedCount, totalFiles);
                    processFile(index + 1);
                };

                reader.readAsDataURL(file);
            };

            // Start processing with the first file
            processFile(0);
        });
    },

    /**
     * Extract GPS data from EXIF metadata tags
     * @param {Object} tags - EXIF tags extracted by EXIF.js
     * @param {File} file - Original file
     * @returns {Object|null} Extracted GPS data or null if not available
     */
    extractGpsFromExif: (tags, file) => {
        // Check if GPS data exists
        if (!tags || !tags.GPSLatitude || !tags.GPSLongitude) {
            return null;
        }

        // Get reference (N/S, E/W)
        const latRef = tags.GPSLatitudeRef || "N";
        const lonRef = tags.GPSLongitudeRef || "E";

        // Convert to decimal degrees
        let latitude = GPSUtils.convertDMSToDD(
            tags.GPSLatitude[0],
            tags.GPSLatitude[1],
            tags.GPSLatitude[2],
            latRef
        );

        let longitude = GPSUtils.convertDMSToDD(
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
                timestamp = file.lastModified ?
                    new Date(file.lastModified).toISOString() :
                    new Date().toISOString();
            }
        } else {
            // Use file modified date as fallback
            timestamp = file.lastModified ?
                new Date(file.lastModified).toISOString() :
                new Date().toISOString();
        }

        // Return GPS data object
        return {
            name: file.name,
            latitude: latitude,
            longitude: longitude,
            altitude: altitude,
            timestamp: timestamp
        };
    }
};

export default ExifReader;