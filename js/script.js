// js/script.js

// Wait for the HTML document to be fully loaded and parsed
document.addEventListener('DOMContentLoaded', () => {
    // Select all elements that act as tab triggers
    const tabs = document.querySelectorAll('.tab-icon');
    // Select all elements that represent the content of the tabs
    const contents = document.querySelectorAll('.tab-content');

    // Add a click event listener to each tab icon
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Get the ID of the target content pane from the 'data-tab' attribute
            const targetId = tab.getAttribute('data-tab');
            // Find the actual content element using the retrieved ID
            const targetContent = document.getElementById(targetId);

            // --- Deactivation Phase ---
            // Remove the 'active-tab' class from ALL tab icons
            tabs.forEach(t => t.classList.remove('active-tab'));
            // Remove the 'active-content' class from ALL content panes
            // This will trigger the default state (e.g., display: none, opacity: 0)
            contents.forEach(c => c.classList.remove('active-content'));

            // --- Activation Phase ---
            // Add the 'active-tab' class to the specific icon that was clicked
            tab.classList.add('active-tab');

            // If the target content element was found...
            if (targetContent) {
                // Add the 'active-content' class to the target content pane
                // This makes it visible and triggers the CSS transition (e.g., opacity: 1, transform: translateX(0))
                targetContent.classList.add('active-content');
            }
        });
    });
});