/**
 * DOM Helper Utilities
 * Helper functions for working with the DOM
 */

const DOMHelpers = {
    /**
     * Get an element by its ID
     * @param {string} id - The ID of the element to find
     * @returns {HTMLElement|null} The found element or null
     */
    getById: (id) => document.getElementById(id),
    
    /**
     * Get elements by selector
     * @param {string} selector - CSS selector
     * @param {HTMLElement|Document} parent - Parent element to search within (default: document)
     * @returns {NodeList} List of matching elements
     */
    getAll: (selector, parent = document) => parent.querySelectorAll(selector),
    
    /**
     * Get first element matching a selector
     * @param {string} selector - CSS selector
     * @param {HTMLElement|Document} parent - Parent element to search within (default: document)
     * @returns {HTMLElement|null} The first matching element or null
     */
    get: (selector, parent = document) => parent.querySelector(selector),
    
    /**
     * Create a new element with optional attributes, classes, and content
     * @param {string} tag - The HTML tag name
     * @param {Object} options - Options for the element
     * @param {Object} [options.attributes] - Attributes to set on the element
     * @param {string|string[]} [options.classes] - Class or classes to add
     * @param {string} [options.text] - Text content for the element
     * @param {string} [options.html] - HTML content for the element
     * @param {HTMLElement[]} [options.children] - Child elements to append
     * @returns {HTMLElement} The created element
     */
    create: (tag, options = {}) => {
        const element = document.createElement(tag);
        
        // Set attributes
        if (options.attributes) {
            Object.entries(options.attributes).forEach(([key, value]) => {
                element.setAttribute(key, value);
            });
        }
        
        // Add classes
        if (options.classes) {
            const classes = Array.isArray(options.classes) ? options.classes : [options.classes];
            element.classList.add(...classes);
        }
        
        // Set text content
        if (options.text !== undefined) {
            element.textContent = options.text;
        }
        
        // Set HTML content
        if (options.html !== undefined) {
            element.innerHTML = options.html;
        }
        
        // Append children
        if (options.children) {
            options.children.forEach(child => {
                element.appendChild(child);
            });
        }
        
        return element;
    },
    
    /**
     * Add event listener to an element or collection of elements
     * @param {HTMLElement|NodeList|Array} elements - Element(s) to add the listener to
     * @param {string} event - Event name
     * @param {Function} callback - Event handler function
     * @param {Object} [options] - Event listener options
     */
    on: (elements, event, callback, options = {}) => {
        if (elements instanceof NodeList || Array.isArray(elements)) {
            elements.forEach(el => el.addEventListener(event, callback, options));
        } else if (elements) {
            elements.addEventListener(event, callback, options);
        }
    },
    
    /**
     * Remove event listener from an element or collection of elements
     * @param {HTMLElement|NodeList|Array} elements - Element(s) to remove the listener from
     * @param {string} event - Event name
     * @param {Function} callback - Event handler function
     * @param {Object} [options] - Event listener options
     */
    off: (elements, event, callback, options = {}) => {
        if (elements instanceof NodeList || Array.isArray(elements)) {
            elements.forEach(el => el.removeEventListener(event, callback, options));
        } else if (elements) {
            elements.removeEventListener(event, callback, options);
        }
    },
    
    /**
     * Add or remove a class based on a condition
     * @param {HTMLElement} element - Element to modify
     * @param {string} className - Class name to toggle
     * @param {boolean} condition - If true, add the class; if false, remove it
     */
    toggleClass: (element, className, condition) => {
        if (condition) {
            element.classList.add(className);
        } else {
            element.classList.remove(className);
        }
    },
    
    /**
     * Show an element by removing the 'hidden' class
     * @param {HTMLElement} element - Element to show
     */
    show: (element) => {
        if (element) {
            element.classList.remove('hidden');
        }
    },
    
    /**
     * Hide an element by adding the 'hidden' class
     * @param {HTMLElement} element - Element to hide
     */
    hide: (element) => {
        if (element) {
            element.classList.add('hidden');
        }
    },
    
    /**
     * Check if an element is currently visible (doesn't have the 'hidden' class)
     * @param {HTMLElement} element - Element to check
     * @returns {boolean} True if visible, false if hidden
     */
    isVisible: (element) => {
        return !element.classList.contains('hidden');
    },
    
    /**
     * Scroll to an element smoothly
     * @param {HTMLElement} element - Element to scroll to
     * @param {Object} [options] - Scroll options
     */
    scrollTo: (element, options = { behavior: 'smooth' }) => {
        if (element) {
            element.scrollIntoView(options);
        }
    }
};

export default DOMHelpers;