// script.js - Partner Page Specific Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Form Toggle Functionality
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const forms = document.querySelectorAll('.form');
    
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            toggleBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Hide all forms
            forms.forEach(form => form.classList.remove('active'));
            
            // Show the corresponding form
            const formId = btn.getAttribute('data-form');
            document.getElementById(`${formId}Form`).classList.add('active');
        });
    });
    
    // Role Button Interaction
    const roleBtns = document.querySelectorAll('.role-btn');
    roleBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const roleCard = this.closest('.role-card');
            const roleTitle = roleCard.querySelector('h3').textContent;
            
            // Switch to volunteer form and pre-select the role
            toggleBtns[0].click();
            const roleSelect = document.getElementById('vRole');
            const options = Array.from(roleSelect.options);
            const optionToSelect = options.find(option => 
                option.text.includes(roleTitle.split(' ')[0])
            );
            if (optionToSelect) {
                roleSelect.value = optionToSelect.value;
            }
            
            // Smooth scroll to form
            document.getElementById('onboarding').scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Form Submission Handling
    const volunteerForm = document.getElementById('volunteerForm');
    const orgForm = document.getElementById('organizationForm');
    
    volunteerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        showSuccessMessage('Thank you for your volunteer application! We will contact you shortly.');
        this.reset();
    });
    
    orgForm.addEventListener('submit', function(e) {
        e.preventDefault();
        showSuccessMessage('Thank you for your partnership request! Our team will review your application.');
        this.reset();
    });
    
    function showSuccessMessage(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'form-alert success';
        alertDiv.textContent = message;
        
        const container = document.querySelector('.onboarding-forms .container');
        container.insertBefore(alertDiv, container.firstChild);
        
        setTimeout(() => {
            alertDiv.style.opacity = '1';
        }, 100);
        
        setTimeout(() => {
            alertDiv.style.opacity = '0';
            setTimeout(() => {
                alertDiv.remove();
            }, 300);
        }, 5000);
    }
    
    // Add animation to cards on scroll
    const animateOnScroll = function() {
        const cards = document.querySelectorAll('.card, .role-card');
        
        cards.forEach(card => {
            const cardPosition = card.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (cardPosition < screenPosition) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial state for animation
    const cards = document.querySelectorAll('.card, .role-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    window.addEventListener('scroll', animateOnScroll);
    // Trigger once on load in case cards are already in view
    animateOnScroll();
});