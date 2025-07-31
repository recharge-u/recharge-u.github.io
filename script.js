// Get all "Get Early Access" buttons
const ctaButtons = document.querySelectorAll('button');
const modalOverlay = document.getElementById('waitlistModal');
const closeButton = document.getElementById('closeModal');
const waitlistForm = document.getElementById('waitlistForm');

// Filter buttons that contain "Get Early Access" text
const earlyAccessButtons = Array.from(ctaButtons).filter(button => 
    button.textContent.includes('Get Early Access')
);

// Add click event listeners to all "Get Early Access" buttons
earlyAccessButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        modalOverlay.classList.add('is-open');
    });
});

// Close modal when close button is clicked
closeButton.addEventListener('click', () => {
    modalOverlay.classList.remove('is-open');
});

// Close modal when overlay background is clicked
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        modalOverlay.classList.remove('is-open');
    }
});

// Handle form submission
waitlistForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = waitlistForm.querySelector('.email-input');
    const email = emailInput.value;
    
    // Here you would typically send the email to your backend
    console.log('Email submitted:', email);
    
    // Show success message (you can customize this)
    alert('Thank you! You\'ve been added to the waitlist.');
    
    // Reset form and close modal
    emailInput.value = '';
    modalOverlay.classList.remove('is-open');
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('is-open')) {
        modalOverlay.classList.remove('is-open');
    }
});
