document.addEventListener('DOMContentLoaded', function() {
    // Workshop Vision Tabs
    const visionTabs = document.querySelectorAll('.vision-tab');
    const visionPanels = document.querySelectorAll('.vision-panel');
    
    visionTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            // Update tabs
            visionTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Update panels
            visionPanels.forEach(p => p.classList.remove('active'));
            document.getElementById(`${tabId}-panel`).classList.add('active');
            
            // Animate chart bars when impact panel is shown
            if (tabId === 'who') {
                animateChartBars();
            }
        });
    });
    
    // Animate chart bars
    function animateChartBars() {
        const bars = document.querySelectorAll('.chart-bar');
        bars.forEach(bar => {
            const percentage = bar.dataset.percentage;
            const fill = bar.querySelector('.bar-fill');
            fill.style.width = `${percentage}%`;
        });
    }
    
    // Initialize chart animation if who panel is active by default
    if (document.querySelector('#who-panel.active')) {
        animateChartBars();
    }
    
    // Workshop Calendar
    const calendarToggle = document.querySelectorAll('.toggle-btn');
    const calendarViews = document.querySelectorAll('.calendar-view');
    
    calendarToggle.forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.dataset.view;
            
            // Update toggle buttons
            calendarToggle.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update views
            calendarViews.forEach(v => v.classList.remove('active'));
            document.getElementById(`${view}-view`).classList.add('active');
            
            // Initialize map if map view is selected
            if (view === 'map') {
                initWorkshopMap();
            }
        });
    });
    
    // Sample workshop data
    const workshops = [
        {
            id: 1,
            title: "School Hygiene Program",
            type: "school",
            description: "Interactive hygiene education for students ages 6-12, including handwashing demonstrations and hygiene kit distribution.",
            date: "2023-06-15",
            day: "15",
            month: "JUN",
            location: "Nairobi, Kenya",
            spots: 1,
            lat: -1.286389,
            lng: 36.817223
        },
                {
            id: 1,
            title: "School Hygiene Program",
            type: "trainer",
            description: "Interactive hygiene education for students ages 6-12, including handwashing demonstrations and hygiene kit distribution.",
            date: "2026-06-15",
            day: "05",
            month: "MAY",
            location: "Kakamega, Kenya",
            spots: 12,
            lat: -0.28215,
            lng: 36.817223
        },
                {
            id: 1,
            title: "Environment cleaning day",
            type: "community",
            description: "Interactive hygiene education for students ages 6-12, including handwashing demonstrations and hygiene kit distribution.",
            date: "2023-06-15",
            day: "15",
            month: "JUN",
            location: "Kirinyaga, Kenya",
            spots: 10,
            lat: -0.5465,
            lng: 36.817223
        },
        // More workshops would be added here...
    ];
    
    // Filter workshops
    const countryFilter = document.getElementById('country-filter');
    const monthFilter = document.getElementById('month-filter');
    const typeFilter = document.getElementById('type-filter');
    const workshopList = document.querySelector('.workshop-list');
    
    function filterWorkshops() {
        const country = countryFilter.value;
        const month = monthFilter.value;
        const type = typeFilter.value;
        
        // Clear current workshops
        workshopList.innerHTML = '';
        
        // Filter workshops
        const filtered = workshops.filter(workshop => {
            return (country === 'all' || workshop.location.toLowerCase().includes(country)) &&
                   (month === 'all' || workshop.month.toLowerCase() === month) &&
                   (type === 'all' || workshop.type === type);
        });
        
        if (filtered.length === 0) {
            workshopList.innerHTML = '<p class="no-workshops">No workshops match your filters. Try adjusting your selection.</p>';
            return;
        }
        
        // Display filtered workshops
        filtered.forEach(workshop => {
            const card = document.createElement('div');
            card.className = `workshop-card ${workshop.type}`;
            card.innerHTML = `
                <div class="workshop-header">
                    <div class="workshop-date">
                        <div class="workshop-day">${workshop.day}</div>
                        <div class="workshop-month">${workshop.month}</div>
                    </div>
                    <div class="workshop-title">
                        <h3>${workshop.title}</h3>
                        <span class="workshop-type ${workshop.type}">${formatWorkshopType(workshop.type)}</span>
                    </div>
                </div>
                <div class="workshop-body">
                    <div class="workshop-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${workshop.location}</span>
                    </div>
                    <p class="workshop-description">${workshop.description}</p>
                </div>
                <div class="workshop-footer">
                    <div class="workshop-spots">
                        <i class="fas fa-users"></i>
                        <span>${workshop.spots} spots remaining</span>
                    </div>
                    <button class="btn-workshop">Register</button>
                </div>
            `;
            workshopList.appendChild(card);
        });
    }
    
    function formatWorkshopType(type) {
        const types = {
            'school': 'School Program',
            'community': 'Community Workshop',
            'trainer': 'Trainer Certification'
        };
        return types[type] || type;
    }
    
    // Initialize filters
    countryFilter.addEventListener('change', filterWorkshops);
    monthFilter.addEventListener('change', filterWorkshops);
    typeFilter.addEventListener('change', filterWorkshops);
    filterWorkshops();
    
    // Workshop Map
    let workshopMap;
    let mapMarkers = [];
    
    function initWorkshopMap() {
        if (document.getElementById('workshop-map')) {
            // Initialize map
            workshopMap = L.map('workshop-map').setView([20, 0], 2);
            
            // Add tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(workshopMap);
            
            // Add workshop markers
            updateMapMarkers(workshops);
            
            // Initialize sidebar list
            const sidebarList = document.querySelector('.map-workshops-list');
            workshops.forEach(workshop => {
                const item = document.createElement('div');
                item.className = 'map-workshop-item';
                item.dataset.id = workshop.id;
                item.innerHTML = `
                    <div class="map-workshop-title">${workshop.title}</div>
                    <div class="map-workshop-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${workshop.location}</span>
                    </div>
                    <div class="map-workshop-date">${workshop.month} ${workshop.day}</div>
                `;
                sidebarList.appendChild(item);
                
                // Add click event to fly to marker
                item.addEventListener('click', function() {
                    const workshopId = parseInt(this.dataset.id);
                    const workshop = workshops.find(w => w.id === workshopId);
                    if (workshop) {
                        workshopMap.flyTo([workshop.lat, workshop.lng], 8);
                        
                        // Highlight marker
                        mapMarkers.forEach(marker => {
                            if (marker.workshopId === workshopId) {
                                marker.openPopup();
                            }
                        });
                    }
                });
            });
        }
    }
    
    function updateMapMarkers(workshopsToShow) {
        // Clear existing markers
        mapMarkers.forEach(marker => {
            workshopMap.removeLayer(marker);
        });
        mapMarkers = [];
        
        // Add new markers
        workshopsToShow.forEach(workshop => {
            const marker = L.marker([workshop.lat, workshop.lng]).addTo(workshopMap);
            marker.workshopId = workshop.id;
            
            // Add popup
            marker.bindPopup(`
                <div class="map-popup">
                    <h4>${workshop.title}</h4>
                    <p><i class="fas fa-calendar-alt"></i> ${workshop.month} ${workshop.day}</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${workshop.location}</p>
                    <p><i class="fas fa-users"></i> ${workshop.spots} spots remaining</p>
                    <button class="map-popup-btn">Register</button>
                </div>
            `);
            
            mapMarkers.push(marker);
        });
    }
    
    // Gallery Tabs
    const galleryTabs = document.querySelectorAll('.gallery-tab');
    const galleryPanels = document.querySelectorAll('.gallery-panel');
    
    galleryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            // Update tabs
            galleryTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Update panels
            galleryPanels.forEach(p => p.classList.remove('active'));
            document.getElementById(`${tabId}-panel`).classList.add('active');
        });
    });
    
    // Story Carousel
    const storyCards = document.querySelectorAll('.story-card');
    const storyIndicators = document.querySelectorAll('.story-carousel .indicator');
    const storyPrev = document.querySelector('.story-carousel .carousel-prev');
    const storyNext = document.querySelector('.story-carousel .carousel-next');
    let currentStoryIndex = 0;
    
    function showStory(index) {
        storyCards.forEach(card => card.classList.remove('active'));
        storyIndicators.forEach(indicator => indicator.classList.remove('active'));
        
        storyCards[index].classList.add('active');
        storyIndicators[index].classList.add('active');
        currentStoryIndex = index;
    }
    
    storyIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => showStory(index));
    });
    
    storyPrev.addEventListener('click', () => {
        currentStoryIndex = (currentStoryIndex - 1 + storyCards.length) % storyCards.length;
        showStory(currentStoryIndex);
    });
    
    storyNext.addEventListener('click', () => {
        currentStoryIndex = (currentStoryIndex + 1) % storyCards.length;
        showStory(currentStoryIndex);
    });
    
    // Auto-rotate stories
    let storyInterval = setInterval(() => {
        currentStoryIndex = (currentStoryIndex + 1) % storyCards.length;
        showStory(currentStoryIndex);
    }, 8000);
    
    // Pause on hover
    const storyCarousel = document.querySelector('.story-carousel');
    storyCarousel.addEventListener('mouseenter', () => {
        clearInterval(storyInterval);
    });
    
    storyCarousel.addEventListener('mouseleave', () => {
        storyInterval = setInterval(() => {
            currentStoryIndex = (currentStoryIndex + 1) % storyCards.length;
            showStory(currentStoryIndex);
        }, 8000);
    });
    
    // Volunteer Form
    const ambassadorForm = document.getElementById('ambassador-form');
    if (ambassadorForm) {
        ambassadorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form validation would go here
            // In a real implementation, this would send data to a server
            
            // Show success message
            alert('Thank you for your application! We will review your information and contact you within 5 business days.');
            this.reset();
        });
    }
    
    // Initialize map if map view is active by default
    if (document.querySelector('#map-view.active')) {
        initWorkshopMap();
    }
});