// Basic JavaScript file for EventFlow
// Add interactions, mobile menu toggles, form validations, etc. here.

document.addEventListener('DOMContentLoaded', function() {
    console.log('EventFlow JS Loaded');

    // Example: Confirm delete actions
    const deleteForms = document.querySelectorAll('form[method="POST"][action*="/delete"]');
    deleteForms.forEach(form => {
        form.addEventListener('submit', function(event) {
            const confirmation = confirm('Are you sure you want to delete this item? This action cannot be undone.');
            if (!confirmation) {
                event.preventDefault(); // Stop form submission if user cancels
            }
        });
    });

    // Example: Mobile menu toggle (requires HTML structure for hamburger icon and nav)
    // const menuToggle = document.getElementById('menu-toggle');
    // const navLinks = document.querySelector('.nav-links');
    // if (menuToggle && navLinks) {
    //     menuToggle.addEventListener('click', function() {
    //         navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    //     });
    // }

});
