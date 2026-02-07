// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Animate elements on page load
    animateOnLoad();
    
    // Add interactivity to home icon
    setupHomeIcon();
    
    // Add success alert animation
    setupSuccessAlert();
});

// Animate elements when page loads
function animateOnLoad() {
    // Add loaded class to body for CSS animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
    
    // Animate checkmark with a slight delay
    const checkmark = document.querySelector('.checkmark');
    if (checkmark) {
        setTimeout(() => {
            checkmark.style.opacity = '1';
        }, 200);
    }
}

// Setup home icon interactivity
function setupHomeIcon() {
    const homeIcon = document.querySelector('.home-icon');
    
    if (homeIcon) {
        // Add click event
        homeIcon.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add pulse animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Navigate to home or show confirmation
            setTimeout(() => {
                // You can change this to actual navigation
                // window.location.href = '/home';
                console.log('Navigating to home...');
            }, 300);
        });
        
        // Add hover sound effect (optional - requires audio file)
        homeIcon.addEventListener('mouseenter', function() {
            // Optionally play a subtle hover sound
            // const hoverSound = new Audio('hover.mp3');
            // hoverSound.volume = 0.3;
            // hoverSound.play();
        });
    }
}

// Setup success alert animations and interactions
function setupSuccessAlert() {
    const successAlert = document.querySelector('.success-alert');
    
    if (successAlert) {
        // Auto-hide alert after 10 seconds (optional)
        setTimeout(() => {
            fadeOutAlert(successAlert);
        }, 10000);
        
        // Make alert dismissible on click (optional)
        successAlert.addEventListener('click', function() {
            fadeOutAlert(this);
        });
    }
}

// Fade out alert function
function fadeOutAlert(element) {
    element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    element.style.opacity = '0';
    element.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
        element.style.display = 'none';
    }, 500);
}

// Add confetti effect (optional enhancement)
function createConfetti() {
    const colors = ['#ce1126', '#000000', '#007a3d', '#ffffff'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background-color: ${colors[Math.floor(Math.random() * colors.length)]};
            top: -10px;
            left: ${Math.random() * 100}%;
            opacity: ${Math.random()};
            transform: rotate(${Math.random() * 360}deg);
            animation: fall ${3 + Math.random() * 2}s linear forwards;
            pointer-events: none;
            z-index: 1000;
        `;
        
        document.body.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// Add confetti animation CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Optional: Trigger confetti on page load
setTimeout(() => {
    // Uncomment to enable confetti effect
    // createConfetti();
}, 1000);

// Add smooth scroll behavior for any internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Optional: Add keyboard navigation
document.addEventListener('keydown', function(e) {
    // Press 'H' to go home
    if (e.key === 'h' || e.key === 'H') {
        const homeIcon = document.querySelector('.home-icon');
        if (homeIcon) {
            homeIcon.click();
        }
    }
    
    // Press 'Escape' to dismiss alert
    if (e.key === 'Escape') {
        const successAlert = document.querySelector('.success-alert');
        if (successAlert && successAlert.style.display !== 'none') {
            fadeOutAlert(successAlert);
        }
    }
});

// Console message for developers
console.log('%c🇵🇸 Thank you for supporting the Rebuilding Gaza Project 🇵🇸', 
    'color: #007a3d; font-size: 16px; font-weight: bold;');