document.addEventListener('DOMContentLoaded', function() {
    // Module tabs functionality
    const moduleTabs = document.querySelectorAll('.module-tab');
    moduleTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            moduleTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all module contents
            document.querySelectorAll('.module-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Show corresponding module content
            const moduleId = this.getAttribute('data-module') + '-module';
            document.getElementById(moduleId).classList.add('active');
        });
    });
    
    // Filter functionality for downloads
    const formatFilter = document.getElementById('format-filter');
    const languageFilter = document.getElementById('language-filter');
    const ageFilter = document.getElementById('age-filter');
    const downloadCards = document.querySelectorAll('.download-card');
    
    function filterDownloads() {
        const formatValue = formatFilter.value;
        const languageValue = languageFilter.value;
        const ageValue = ageFilter.value;
        
        downloadCards.forEach(card => {
            // In a real implementation, you would check actual data attributes
            // This is a simplified version for demonstration
            let shouldShow = true;
            
            // Apply filters (these would match your actual data attributes)
            if (formatValue !== 'all') {
                // Check if card has matching format
            }
            
            if (languageValue !== 'all') {
                // Check if card has matching language
            }
            
            if (ageValue !== 'all') {
                // Check if card has matching age group
            }
            
            card.style.display = shouldShow ? 'flex' : 'none';
        });
    }
    
    // Add event listeners to filters
    formatFilter.addEventListener('change', filterDownloads);
    languageFilter.addEventListener('change', filterDownloads);
    ageFilter.addEventListener('change', filterDownloads);
    
    // Simulate GitHub contribution feed
    // In a real implementation, you would fetch this from an API
    function loadContributions() {
        // This would be replaced with actual API calls
        console.log('Loading community contributions...');
    }
    
    // Initialize
    loadContributions();
    
    // Animate elements on scroll
    const animateOnScroll = function() {
        const cards = document.querySelectorAll('.lesson-card, .download-card, .contribute-card');
        
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
    const cards = document.querySelectorAll('.lesson-card, .download-card, .contribute-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Trigger once on load
});