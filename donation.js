document.addEventListener('DOMContentLoaded', function() {
    // Update Donation Cards when Amount Changes
    const donationCards = document.querySelectorAll('.donation-card');
    
    donationCards.forEach(card => {
        const input = card.querySelector('input');
        
        input.addEventListener('change', function() {
            const value = Math.max(parseInt(this.value) || 0, parseInt(this.min) || 0);
            this.value = value;
            card.setAttribute('data-amount', value);
        });
        
        // Highlight card on click
        card.addEventListener('click', function(e) {
            if (e.target !== input) {
                input.focus();
            }
        });
    });

    // Custom Donation Form Submission
    const customForm = document.getElementById('customDonationForm');
    
    if (customForm) {
        customForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const amount = document.getElementById('customAmount').value;
            const frequency = document.getElementById('donationFrequency').value;
            
            if (!amount || amount < 1) {
                alert('Please enter a valid amount');
                return;
            }
            
            alert(`Thank you for your ${frequency} donation of $${amount}!`);
            this.reset();
        });
    }

    // Animate Impact Meter on Scroll
    const impactMeter = document.querySelector('.meter-fill');
    
    if (impactMeter) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    impactMeter.style.width = '65%';
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(impactMeter);
    }
});