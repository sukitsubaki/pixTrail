/**
 * UI Utility Functions
 * Helper functions for working with the user interface
 */

const UIUtils = {
    /**
     * Format duration in seconds to human-readable format (HH:MM:SS)
     * @param {number} durationInSeconds - Duration in seconds
     * @returns {string} Formatted duration string
     */
    formatDuration: (durationInSeconds) => {
        if (!durationInSeconds && durationInSeconds !== 0) return '-';
        
        const hours = Math.floor(durationInSeconds / 3600);
        const minutes = Math.floor((durationInSeconds % 3600) / 60);
        const seconds = Math.floor(durationInSeconds % 60);
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    },
    
    /**
     * Format a date to a localized string
     * @param {Date|string} date - Date to format
     * @param {Object} [options] - Formatting options
     * @returns {string} Formatted date string
     */
    formatDate: (date, options = {}) => {
        if (!date) return '-';
    
        let dateObj;
    
        // Convert string to Date if needed
        if (typeof date === 'string') {
            try {
                dateObj = new Date(date);
            } catch (e) {
                console.warn(`Invalid date string: ${date}`);
                return '-';
            }
        } else if (date instanceof Date) {
            dateObj = date;
        } else {
            return '-';
        }
    
        // Check if date is valid
        if (isNaN(dateObj.getTime())) {
            console.warn(`Invalid date: ${date}`);
            return '-';
        }
    
        // Default options for better timestamp formatting
        const defaultOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
    
        // Merge default options with provided options
        const formatOptions = { ...defaultOptions, ...options };
    
        try {
            return dateObj.toLocaleString(options.locale || undefined, formatOptions);
        } catch (e) {
            console.warn(`Error formatting date: ${e.message}`);
            // Fallback to simple format
            return dateObj.toISOString().replace('T', ' ').substring(0, 19);
        }
    },
    
    /**
     * Update a progress bar
     * @param {HTMLElement} progressBar - The progress bar element
     * @param {HTMLElement} progressText - The progress text element
     * @param {number} current - Current progress value
     * @param {number} total - Total progress value
     * @param {string} [message] - Optional message to display
     */
    updateProgressBar: (progressBar, progressText, current, total, message) => {
        const percentComplete = Math.round((current / total) * 100);
        
        if (progressBar) {
            progressBar.style.width = percentComplete + '%';
        }
        
        if (progressText) {
            const text = message ? message : `Processing... ${percentComplete}%`;
            progressText.textContent = text;
        }
    },
    
    /**
     * Show a status message with optional timeout
     * @param {HTMLElement} container - Container element to add the message to
     * @param {string} message - Message to display
     * @param {string} type - Message type: 'success', 'error', 'warning', 'info'
     * @param {number} [timeout=10000] - Auto-removal timeout in ms (0 to disable)
     * @returns {HTMLElement} The created message element
     */
    showStatusMessage: (container, message, type = 'info', timeout = 10000) => {
        if (!container) return null;
        
        const messageElement = document.createElement('div');
        messageElement.className = `status-message status-${type}`;
        messageElement.textContent = message;
        
        // Add to status messages
        container.prepend(messageElement);
        
        // Remove after timeout if specified
        if (timeout > 0) {
            setTimeout(() => {
                if (messageElement.parentNode === container) {
                    container.removeChild(messageElement);
                }
            }, timeout);
        }
        
        return messageElement;
    },
    
    /**
     * Format a number with specified decimal places and optional units
     * @param {number} value - The number to format
     * @param {number} [decimals=2] - Number of decimal places
     * @param {string} [unit=''] - Unit to append
     * @returns {string} Formatted number with unit
     */
    formatNumber: (value, decimals = 2, unit = '') => {
        if (value === null || value === undefined) return '-';
        
        const formattedValue = Number(value).toFixed(decimals);
        return unit ? `${formattedValue} ${unit}` : formattedValue;
    },
    
    /**
     * Toggle element visibility
     * @param {HTMLElement} element - Element to toggle
     * @param {boolean} [visible] - If provided, force visibility to this state
     * @returns {boolean} New visibility state
     */
    toggleVisibility: (element, visible) => {
        if (!element) return false;
        
        const isCurrentlyVisible = !element.classList.contains('hidden');
        const newVisibility = visible !== undefined ? visible : !isCurrentlyVisible;
        
        if (newVisibility) {
            element.classList.remove('hidden');
        } else {
            element.classList.add('hidden');
        }
        
        return newVisibility;
    },
    
    /**
     * Initialize tabs in a container
     * @param {string} tabsSelector - Selector for tab buttons
     * @param {string} contentSelector - Selector for content panels
     * @param {Function} [callback] - Optional callback when tab changes
     */
    initTabs: (tabsSelector, contentSelector, callback) => {
        const tabs = document.querySelectorAll(tabsSelector);
        const contents = document.querySelectorAll(contentSelector);
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                tabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Get target content ID
                const target = tab.getAttribute('data-target');
                
                // Hide all content
                contents.forEach(content => {
                    content.classList.remove('active');
                });
                
                // Show target content
                if (target) {
                    const targetContent = document.getElementById(target);
                    if (targetContent) {
                        targetContent.classList.add('active');
                    }
                }
                
                // Call callback if provided
                if (callback && typeof callback === 'function') {
                    callback(tab, target);
                }
            });
        });
    },
    
    /**
     * Debounce a function to limit how often it can be called
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @returns {Function} Debounced function
     */
    debounce: (func, wait) => {
        let timeout;
        
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    /**
     * Throttle a function to limit how often it can be called
     * @param {Function} func - Function to throttle
     * @param {number} limit - Limit in ms
     * @returns {Function} Throttled function
     */
    throttle: (func, limit) => {
        let lastFunc;
        let lastRan;
        
        return function executedFunction(...args) {
            if (!lastRan) {
                func(...args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                
                lastFunc = setTimeout(() => {
                    if ((Date.now() - lastRan) >= limit) {
                        func(...args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    }
};

export default UIUtils;
