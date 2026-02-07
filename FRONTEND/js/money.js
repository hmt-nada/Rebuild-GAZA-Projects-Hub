// Form submission handling
document.getElementById('donationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const fullname = document.getElementById('fullname').value;
    const paypal = document.getElementById('paypal').value;
    const amount = document.getElementById('amount').value;
    
    // Validate inputs
    if (!fullname || !paypal || !amount) {
        alert('Please fill in all fields');
        return;
    }
    
    if (amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    
    // Process donation (you would typically send this to a server)
    console.log('Donation Details:');
    console.log('Name:', fullname);
    console.log('PayPal/CCP:', paypal);
    console.log('Amount:', amount);
    
    // Show success message
    alert(`Thank you ${fullname}! Your donation of $${amount} has been received.`);
    
    // Reset form
    this.reset();
});

// Home icon click handler
document.querySelector('.home-icon').addEventListener('click', function() {
    // Redirect to home page or perform action
    window.location.href = 'index.html'; // Change this to your home page URL
});

// Add input validation for amount field
document.getElementById('amount').addEventListener('input', function(e) {
    // Remove any non-numeric characters except decimal point
    this.value = this.value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = this.value.split('.');
    if (parts.length > 2) {
        this.value = parts[0] + '.' + parts.slice(1).join('');
    }
});

// Optional: Add floating label effect
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

// Optional: Add smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';

