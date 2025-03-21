/**
 * Mobile Navigation Functionality
 * Controls the hamburger menu toggle and dropdown behavior
 */
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const hamburger = document.getElementById('hamburger-menu');
    const dropdown = document.getElementById('dropdown-menu');
    
    // Toggle menu when hamburger is clicked
    hamburger.addEventListener('click', function(event) {
        // Prevent event from bubbling up to document
        event.stopPropagation();
        
        // Toggle active class on hamburger (for animation)
        hamburger.classList.toggle('active');
        
        // Toggle show-menu class on dropdown
        dropdown.classList.toggle('show-menu');
    });
    
    // Close the menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!hamburger.contains(event.target) && !dropdown.contains(event.target)) {
            hamburger.classList.remove('active');
            dropdown.classList.remove('show-menu');
        }
    });
    
    // Prevent dropdown clicks from closing the menu
    dropdown.addEventListener('click', function(event) {
        // Only stop propagation if clicking on the dropdown itself, not its links
        if (event.target === dropdown) {
            event.stopPropagation();
        }
    });
});