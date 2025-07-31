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

// Handle email validation 
function isValidEmail(email) {
    // Simple RFC 5322 compliant regex for most emails
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Handle email spam
function isSpamSubmission(form) {
    // Honeypot: hidden field should be empty if human
    const honeypot = form.querySelector('.honeypot');
    if (honeypot && honeypot.value) return true;

    // Simple rate limiting: allow only 1 submit per 30 seconds per session
    const lastSubmit = sessionStorage.getItem('waitlist_last_submit');
    const now = Date.now();
    if (lastSubmit && now - lastSubmit < 30000) return true;
    sessionStorage.setItem('waitlist_last_submit', now);

    return false;
}

// Handle form submission
waitlistForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = waitlistForm.querySelector('.email-input');
    const email = emailInput.value;

    // Validation
    if (!isValidEmail(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    // Spam Protection
    if (isSpamSubmission(waitlistForm)) {
        alert('Submission blocked as spam or too frequent. Please try again later.');
        return;
    }

    // Your actual Google Apps Script Web App URL
    const scriptURL = 'https://script.google.com/macros/s/AKfycbwm7memdCHrbOd4NpvXGWbIJz9aW0_Milg0qn_i27teEG1DFPfqgW5BFIF9AR2DXN-G-w/exec';

    fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({ email })
    })
    .then(() => {
        alert('Thank you! You\'ve been added to the waitlist.');
        emailInput.value = '';
        modalOverlay.classList.remove('is-open');
    })
    .catch((error) => {
        alert('There was an error. Please try again later.');
        console.error('Error!', error.message);
    });
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('is-open')) {
        modalOverlay.classList.remove('is-open');
    }
});
