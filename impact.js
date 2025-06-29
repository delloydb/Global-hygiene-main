// impact.js - Interactive elements for Impact Dashboard

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Mapbox map
// Initialize Leaflet map
function initMap() {
    // Create the map centered on the world
    const map = L.map('impact-map').setView([20, 0], 2);
    
    // Add base tile layer (using OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 8,
        minZoom: 2
    }).addTo(map);
    
    // Custom impact icon
    const impactIcon = L.divIcon({
        className: 'impact-marker',
        iconSize: [20, 20],
        html: '<div class="marker-pin"></div>'
    });
    
    // Sample data - REPLACE WITH YOUR ACTUAL PROGRAM LOCATIONS
    const programLocations = [
        {
            name: "Nairobi, Kenya",
            lat: -1.286389,
            lng: 36.817223,
            impact: "high",
            programs: 12,
            kits: 8500,
            startYear: 2018,
            description: "Our flagship program with 12 active school and community initiatives"
        },
        {
            name: "Dhaka, Bangladesh",
            lat: 23.8103,
            lng: 90.4125,
            impact: "medium",
            programs: 8,
            kits: 6200,
            startYear: 2020,
            description: "Urban hygiene program focusing on slum communities"
        },
        {
            name: "Lima, Peru",
            lat: -12.0464,
            lng: -77.0428,
            impact: "high",
            programs: 6,
            kits: 4200,
            startYear: 2019,
            description: "Water sanitation program in partnership with local NGOs"
        },
        {
            name: "Lagos, Nigeria",
            lat: 6.5244,
            lng: 3.3792,
            impact: "medium",
            programs: 5,
            kits: 3800,
            startYear: 2021,
            description: "Community hygiene education initiative"
        },
        {
            name: "Port-au-Prince, Haiti",
            lat: 18.5944,
            lng: -72.3074,
            impact: "low",
            programs: 3,
            kits: 1500,
            startYear: 2022,
            description: "New program focusing on disaster relief hygiene"
        }
    ];
    
    // Create a feature group to store our markers
    const programLayer = L.featureGroup().addTo(map);
    
    // Add markers for each program location
    programLocations.forEach(location => {
        // Determine marker color based on impact
        let markerColor;
        switch(location.impact) {
            case 'high': markerColor = '#2B7A78'; break;
            case 'medium': markerColor = '#3AAFA9'; break;
            case 'low': markerColor = '#DEF2F1'; break;
            default: markerColor = '#FEFFFF';
        }
        
        // Create custom marker style
        const markerStyle = `
            background-color: ${markerColor};
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 2px solid white;
            transform: translate(-50%, -50%);
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;
        
        // Create marker with custom HTML
        const marker = L.marker([location.lat, location.lng], {
            icon: L.divIcon({
                className: 'custom-marker',
                iconSize: [20, 20],
                html: `<div style="${markerStyle}"></div>`
            })
        });
        
        // Add popup content
        marker.bindPopup(`
            <h3>${location.name}</h3>
            <p><strong>Impact Level:</strong> ${location.impact.toUpperCase()}</p>
            <p><strong>Active Programs:</strong> ${location.programs}</p>
            <p><strong>Kits Distributed:</strong> ${location.kits.toLocaleString()}</p>
            <p><strong>Since:</strong> ${location.startYear}</p>
            <p>${location.description}</p>
        `);
        
        // Add marker to our feature group
        marker.addTo(programLayer);
    });
    
    // Fit map to show all markers
    map.fitBounds(programLayer.getBounds().pad(0.2));
    
    // Add country borders layer (optional)
    fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data, {
                style: {
                    color: '#5a6f7b',
                    weight: 1,
                    opacity: 0.5,
                    fillOpacity: 0.1
                }
            }).addTo(map);
        });
}

// Call the map initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initMap();
    
    // Rest of your existing JavaScript code...
    // (Keep all your chart initialization and other functionality)
});

    // Initialize Charts
    const illnessCtx = document.getElementById('illnessChart').getContext('2d');
    const illnessChart = new Chart(illnessCtx, {
        type: 'line',
        data: {
            labels: ['Before', '3 Months', '6 Months', '12 Months'],
            datasets: [{
                label: 'Waterborne Illness Rate',
                data: [100, 65, 42, 38],
                borderColor: '#2B7A78',
                backgroundColor: 'rgba(43, 122, 120, 0.1)',
                borderWidth: 3,
                tension: 0.3,
                fill: true
            }]
        },
        options: getChartOptions('Percentage of Population Affected')
    });

    const attendanceCtx = document.getElementById('attendanceChart').getContext('2d');
    const attendanceChart = new Chart(attendanceCtx, {
        type: 'bar',
        data: {
            labels: ['Before', 'After 6 Months', 'After 12 Months'],
            datasets: [{
                label: 'School Attendance Rate',
                data: [58, 72, 82],
                backgroundColor: '#3AAFA9',
                borderColor: '#2B7A78',
                borderWidth: 1
            }]
        },
        options: getChartOptions('Attendance Rate (%)')
    });

    const kitsCtx = document.getElementById('kitsChart').getContext('2d');
    const kitsChart = new Chart(kitsCtx, {
        type: 'bar',
        data: {
            labels: ['2018', '2019', '2020', '2021', '2022', '2023'],
            datasets: [{
                label: 'Hygiene Kits Distributed',
                data: [5200, 8900, 12500, 18700, 23500, 18700],
                backgroundColor: [
                    'rgba(43, 122, 120, 0.7)',
                    'rgba(58, 175, 169, 0.7)',
                    'rgba(43, 122, 120, 0.7)',
                    'rgba(58, 175, 169, 0.7)',
                    'rgba(43, 122, 120, 0.7)',
                    'rgba(58, 175, 169, 0.7)'
                ],
                borderColor: '#2B7A78',
                borderWidth: 1
            }]
        },
        options: getChartOptions('Number of Kits')
    });

    const workshopsCtx = document.getElementById('workshopsChart').getContext('2d');
    const workshopsChart = new Chart(workshopsCtx, {
        type: 'doughnut',
        data: {
            labels: ['Schools', 'Communities', 'Health Centers', 'Online'],
            datasets: [{
                data: [320, 480, 210, 240],
                backgroundColor: [
                    '#2B7A78',
                    '#3AAFA9',
                    '#DEF2F1',
                    '#FEFFFF'
                ],
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw} workshops`;
                        }
                    }
                }
            }
        }
    });

    // Helper function for chart options
    function getChartOptions(title) {
        return {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw}`;
                        }
                    }
                },
                title: {
                    display: false,
                    text: title
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        };
    }

    // Story tabs functionality
    const storyTabs = document.querySelectorAll('.story-tab');
    storyTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            storyTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all story contents
            document.querySelectorAll('.story-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Show corresponding story content
            const storyId = this.getAttribute('data-story') + '-story';
            document.getElementById(storyId).classList.add('active');
        });
    });

    // Time period filter functionality
    const timeBtns = document.querySelectorAll('.time-btn');
    timeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            timeBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Here you would update the charts based on the selected time period
            const period = this.getAttribute('data-period');
            updateCharts(period);
        });
    });

    // Region filter functionality
    const regionSelect = document.getElementById('region-select');
    regionSelect.addEventListener('change', function() {
        // Here you would update the charts based on the selected region
        updateCharts(null, this.value);
    });

    // Function to update charts based on filters
    function updateCharts(timePeriod, region) {
        // In a real implementation, this would fetch new data from an API
        // and update the charts accordingly
        
        console.log('Updating charts with:', { timePeriod, region });
        
        // Example of how you might update a chart:
        if (timePeriod === '5yrs') {
            illnessChart.data.labels = ['2019', '2020', '2021', '2022', '2023'];
            illnessChart.data.datasets[0].data = [100, 85, 72, 60, 45];
            illnessChart.update();
        }
        // Similar updates for other charts
    }

    // Animated counter for hero stats
    function animateValue(id, start, end, duration) {
        const obj = document.getElementById(id);
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            obj.innerHTML = value.toLocaleString() + (id === 'countries-served' ? '' : '+');
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Start counters when hero section is in view
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            animateValue('people-reached', 0, 250000, 2000);
            animateValue('countries-served', 0, 35, 1500);
            animateValue('hygiene-kits', 0, 87500, 2000);
            observer.unobserve(entries[0].target);
        }
    }, { threshold: 0.5 });

    observer.observe(document.querySelector('.impact-hero'));
});