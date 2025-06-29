document.addEventListener('DOMContentLoaded', function() {
    // Tab Switching Logic
    const tabs = document.querySelectorAll('.tab');
    const tabHighlight = document.querySelector('.tab-highlight');
    const forms = document.querySelectorAll('.register-form');
    
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', function() {
            // Update Active Tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Move Highlight
            tabHighlight.style.transform = `translateX(${index * 100}%)`;
            
            // Show Corresponding Form
            const tabName = this.dataset.tab;
            forms.forEach(form => {
                form.classList.remove('active-form');
                if (form.id === `${tabName}Form`) {
                    form.classList.add('active-form');
                }
            });
        });
    });
    
    // Form Submissions
    const communityForm = document.getElementById('communityForm');
    const schoolForm = document.getElementById('schoolForm');
    const digitalForm = document.getElementById('digitalForm');
    
    if (communityForm) {
        communityForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for registering for the Community Workshop!');
            this.reset();
        });
    }
    
    if (schoolForm) {
        schoolForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for joining the School Program!');
            this.reset();
        });
    }
    
    if (digitalForm) {
        digitalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Digital Training registration complete! Check your email.');
            this.reset();
        });
    }
});