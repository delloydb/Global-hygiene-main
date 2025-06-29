document.addEventListener('DOMContentLoaded', function() {
    // Countdown Timer for Global Hygiene Day
    function updateCountdown() {
        const countdownDate = new Date('October 15, 2023 00:00:00').getTime();
        const now = new Date().getTime();
        const distance = countdownDate - now;
        
        // Time calculations
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Display results
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        
        // If countdown is finished
        if (distance < 0) {
            clearInterval(countdownTimer);
            document.getElementById('countdown').innerHTML = '<div class="countdown-ended">The campaign has started!</div>';
        }
    }
    
    // Update countdown every second
    updateCountdown();
    const countdownTimer = setInterval(updateCountdown, 1000);
    
    // Form submission handling
    const entryForm = document.querySelector('.entry-form');
    entryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const formData = {
            name: document.getElementById('entry-name').value,
            email: document.getElementById('entry-email').value,
            challenge: document.getElementById('entry-challenge').value,
            location: document.getElementById('entry-location').value,
            description: document.getElementById('entry-description').value,
            shareSocial: document.getElementById('share-social').checked
        };
        
        // Here you would normally send this data to your server
        console.log('Form submitted:', formData);
        
        // Show success message
        alert('Thank you for your submission! Your entry will be reviewed and may be featured on our platform.');
        
        // Reset form
        entryForm.reset();
    });
    
    // File upload preview (optional enhancement)
    const fileInput = document.getElementById('entry-media');
    fileInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                // You could display a preview here if desired
                console.log('File selected:', file.name);
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Social share buttons
    document.querySelectorAll('.share-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.classList.contains('facebook') ? 'Facebook' :
                            this.classList.contains('twitter') ? 'Twitter' :
                            this.classList.contains('instagram') ? 'Instagram' : 'LinkedIn';
            alert(`This would normally share to ${platform}. In a real implementation, this would use the ${platform} API.`);
        });
    });
    
    // Animate challenge cards on scroll
    const animateOnScroll = function() {
        const cards = document.querySelectorAll('.challenge-card, .gallery-item');
        
        cards.forEach((card, index) => {
            const cardPosition = card.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (cardPosition < screenPosition) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial state for animation
    const cards = document.querySelectorAll('.challenge-card, .gallery-item');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Trigger once on load
});