document.addEventListener('DOMContentLoaded', function() {
    // Path Selector Functionality
    const pathOptions = document.querySelectorAll('.path-option');
    const selectorHighlight = document.querySelector('.selector-highlight');
    const sections = {
        contact: document.getElementById('contact-section'),
        support: document.getElementById('support-section'),
        volunteer: document.getElementById('volunteer-section')
    };
    
    pathOptions.forEach(option => {
        option.addEventListener('click', function() {
            const path = this.getAttribute('data-path');
            
            // Update active state
            pathOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // Move highlight
            const index = Array.from(pathOptions).indexOf(this);
            selectorHighlight.style.transform = `translateX(${index * 100}%)`;
            
            // Show corresponding section
            Object.values(sections).forEach(section => section.classList.remove('active-section'));
            sections[path].classList.add('active-section');
            
            // Animate the section
            sections[path].style.animation = 'none';
            setTimeout(() => {
                sections[path].style.animation = 'fadeIn 0.5s ease';
            }, 10);
        });
    });
    
    // Form Validation and Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const reason = document.getElementById('reason').value;
            const message = document.getElementById('message').value;
            
            // Simple validation
            if (!name || !reason || !message) {
                alert('Please fill in all fields');
                return;
            }
            
            // Here you would typically send the form data to a server
            console.log('Form submitted:', { name, reason, message });
            
            // Show success message
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }
    
    // Donation Card Interaction
    const donationCards = document.querySelectorAll('.donation-card');
    donationCards.forEach(card => {
        const input = card.querySelector('input');
        
        // Update amount when card is clicked
        card.addEventListener('click', function(e) {
            if (e.target !== input) {
                input.focus();
            }
        });
        
        // Update card data-amount when input changes
        input.addEventListener('change', function() {
            const value = Math.max(parseInt(this.value) || 0, parseInt(this.min) || 0);
            this.value = value;
            card.setAttribute('data-amount', value);
        });
    });
    
    // Animate impact meter on scroll
    const impactMeter = document.querySelector('.meter-fill');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                impactMeter.style.width = '65%';
            }
        });
    }, { threshold: 0.5 });
    
    if (impactMeter) {
        observer.observe(impactMeter);
    }
    
    // Add floating animation to donation bubbles
    const donationBubbles = document.querySelectorAll('.donation-bubble');
    donationBubbles.forEach((bubble, index) => {
        bubble.style.animation = `float ${4 + index}s ease-in-out infinite`;
    });
    
    // Dynamic year for copyright
    const yearElement = document.querySelector('.current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});