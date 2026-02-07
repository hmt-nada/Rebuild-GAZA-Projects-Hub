// Form submission handling
document.getElementById('financingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const fullname = document.getElementById('fullname').value;
    const contact = document.getElementById('contact').value;
    
    // Validate inputs
    if (!fullname || !contact) {
        alert('Please fill in all fields');
        return;
    }
    
    // Process full project financing request (you would typically send this to a server)
    console.log('Full Project Financing Request:');
    console.log('Name:', fullname);
    console.log('Contact:', contact);
    
    // Show success message
    alert(`Thank you ${fullname}! Your request to fully fund the project has been submitted. We will contact you at: ${contact}`);
    
    // Reset form
    this.reset();
});

// Home icon click handler
document.querySelector('.home-icon').addEventListener('click', function() {
    // Redirect to home page or perform action
    window.location.href = 'index.html'; // Change this to your home page URL
});

// Add input validation
const inputs = document.querySelectorAll('input');
inputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        if (!this.value) {
            this.parentElement.classList.remove('focused');
        }
    });
});

// Validate contact field (email or phone)
document.getElementById('contact').addEventListener('blur', function() {
    const contactValue = this.value.trim();
    
    // Check if it's an email or phone number
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[\d\s\-\+\(\)]+$/;
    
    if (contactValue && !emailPattern.test(contactValue) && !phonePattern.test(contactValue)) {
        alert('Please enter a valid email address or phone number');
        this.focus();
    }
});

// Optional: Add smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';

// Optional: Name validation (only letters and spaces)
document.getElementById('fullname').addEventListener('blur', function() {
    const nameValue = this.value.trim();
    const namePattern = /^[a-zA-Z\s]+$/;
    
    if (nameValue && !namePattern.test(nameValue)) {
        alert('Please enter a valid name (letters and spaces only)');
        this.focus();
    }
});

// Optional: Confirmation dialog before submission
document.getElementById('financingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const fullname = document.getElementById('fullname').value;
    const contact = document.getElementById('contact').value;
    
    // Validate inputs
    if (!fullname || !contact) {
        alert('Please fill in all fields');
        return;
    }
    
    // Show confirmation dialog
    const confirmation = confirm(`Are you sure you want to fully fund the project?\n\nName: ${fullname}\nContact: ${contact}`);
    
    if (confirmation) {
        // Process the request
        console.log('Full Project Financing Request:');
        console.log('Name:', fullname);
        console.log('Contact:', contact);
        
        // Show success message
        alert(`Thank you ${fullname}! Your request to fully fund the project has been submitted. We will contact you at: ${contact}`);
        
        // Reset form
        this.reset();
    }
});