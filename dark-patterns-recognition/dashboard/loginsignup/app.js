document.addEventListener('DOMContentLoaded', function() {
    // Handle Sign In Form Submission
    const signinForm = document.getElementById('signin-form');
    signinForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        // Fetch and process form data
        const username = document.getElementById('signin-username').value.trim();
        const password = document.getElementById('signin-password').value.trim();
        
        // Validate form fields
        if (username === '' || password === '') {
            alert('Please fill in all fields.'); // Alert for empty fields
            return; // Exit function if fields are empty
        }

        // Redirect to index.html
        window.location.href = 'file:///D:/Documents/Projects/Dark%20Pattern/dashboard/index.html';
    });

    // Handle Sign Up Form Submission
    const signupForm = document.getElementById('signup-form');
    signupForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        // Fetch and process form data
        const username = document.getElementById('signup-username').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value.trim();
        
        // Validate form fields
        if (username === '' || email === '' || password === '') {
            alert('Please fill in all fields.'); // Alert for empty fields
            return; // Exit function if fields are empty
        }

        // Redirect to index.html
        window.location.href = 'file:///D:/Documents/Projects/Dark%20Pattern/dashboard/index.html';
    });
});
