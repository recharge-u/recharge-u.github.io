// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing waitlist modal...');
    
    // Get all "Get Early Access" buttons
    const ctaButtons = document.querySelectorAll('button');
    const modalOverlay = document.getElementById('waitlistModal');
    const closeButton = document.getElementById('closeModal');
    const waitlistForm = document.getElementById('waitlistForm');
    
    // Debug logging
    console.log('Found elements:', {
        ctaButtons: ctaButtons.length,
        modalOverlay: !!modalOverlay,
        closeButton: !!closeButton,
        waitlistForm: !!waitlistForm
    });
    
    // Check if all required elements exist
    if (!modalOverlay || !closeButton || !waitlistForm) {
        console.error('Required modal elements not found!');
        return;
    }

    // Filter buttons that contain "Get Early Access" text
    const earlyAccessButtons = Array.from(ctaButtons).filter(button => 
        button.textContent.includes('Get Early Access')
    );
    
    console.log('Found Early Access buttons:', earlyAccessButtons.length);

    // Add click event listeners to all "Get Early Access" buttons
    earlyAccessButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Opening modal...');
            modalOverlay.classList.add('is-open');
        });
    });

    // Close modal when close button is clicked
    closeButton.addEventListener('click', () => {
        console.log('Closing modal via close button...');
        modalOverlay.classList.remove('is-open');
    });

    // Close modal when overlay background is clicked
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            console.log('Closing modal via overlay click...');
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
        console.log('Form submitted!');
        const emailInput = waitlistForm.querySelector('.email-input');
        const email = emailInput.value;
        console.log('Email:', email);

        // Validation
        if (!isValidEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        console.log('Email validation passed');

        // Spam Protection
        if (isSpamSubmission(waitlistForm)) {
            alert('Submission blocked as spam or too frequent. Please try again later.');
            return;
        }
        console.log('Spam protection passed');

        // Your actual Google Apps Script Web App URL
        const scriptURL = 'https://script.google.com/macros/s/AKfycbxwUDLYNKFBevWxPcgUMRq2OpwNpCKjFiZ5klk2jYAwt2Azp1ANpKNbgv8Bk_SgiC7h/exec';
        console.log('Sending to:', scriptURL);
        
        fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({ email })
        })
        .then(() => {
            console.log('Email sent successfully');
            alert('Thank you! You\'ve been added to the waitlist.');
            emailInput.value = '';
            modalOverlay.classList.remove('is-open');
        })
        .catch((error) => {
            console.error('Error sending email:', error);
            alert('There was an error. Please try again later.');
            console.error('Error!', error.message);
        });
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('is-open')) {
            console.log('Closing modal via Escape key...');
            modalOverlay.classList.remove('is-open');
        }
    });
    
}); // Close DOMContentLoaded
