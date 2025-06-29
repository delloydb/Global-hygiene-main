document.addEventListener('DOMContentLoaded', function() {
    // Resource Map
    let resourceMap;
    let markersCluster;
    let userLocationMarker;
    const userLocation = {
        lat: null,
        lng: null,
        accuracy: null
    };
    
    // Sample resource data - in a real app, this would come from an API
    const resources = [
        {
            id: 1,
            name: "Community Hygiene Center",
            type: "center",
            address: "123 Health St, Nairobi",
            distance: 1.2,
            lat: -1.286389,
            lng: 36.817223,
            hours: "Mon-Fri: 9am-5pm",
            services: ["Kit distribution", "Hygiene education", "Shower facilities"],
            contact: "+254 700 123456"
        },
        // More resources would be added here...
    ];
    
    // Initialize map
    function initResourceMap() {
        if (document.getElementById('resource-map')) {
            // Create map centered on Africa by default
            resourceMap = L.map('resource-map').setView([1.9577, 37.2972], 3);
            
            // Add tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(resourceMap);
            
            // Initialize marker cluster group
            markersCluster = L.markerClusterGroup();
            resourceMap.addLayer(markersCluster);
            
            // Add resource markers
            updateMapMarkers(resources);
            
            // Initialize resource list
            updateResourceList(resources);
        }
    }
    
    // Update map markers based on filtered resources
    function updateMapMarkers(resourcesToShow) {
        // Clear existing markers
        markersCluster.clearLayers();
        
        // Add new markers
        resourcesToShow.forEach(resource => {
            const marker = L.marker([resource.lat, resource.lng], {
                icon: getMarkerIcon(resource.type)
            });
            
            // Add popup
            marker.bindPopup(`
                <div class="map-popup">
                    <h4>${resource.name}</h4>
                    <p><i class="fas fa-map-marker-alt"></i> ${resource.address}</p>
                    <p><i class="fas fa-clock"></i> ${resource.hours}</p>
                    <p><i class="fas fa-phone"></i> ${resource.contact}</p>
                    <div class="popup-services">
                        <h5>Services:</h5>
                        <ul>
                            ${resource.services.map(service => `<li>${service}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `);
            
            // Add to cluster group
            markersCluster.addLayer(marker);
        });
        
        // Add user location marker if available
        if (userLocation.lat && userLocation.lng) {
            if (userLocationMarker) {
                resourceMap.removeLayer(userLocationMarker);
            }
            
            userLocationMarker = L.circleMarker([userLocation.lat, userLocation.lng], {
                radius: 8,
                fillColor: "#2B7A78",
                color: "#fff",
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
            }).addTo(resourceMap);
            
            // Add accuracy circle if available
            if (userLocation.accuracy) {
                L.circle([userLocation.lat, userLocation.lng], {
                    radius: userLocation.accuracy,
                    fillColor: "#2B7A78",
                    color: "#2B7A78",
                    weight: 1,
                    opacity: 0.5,
                    fillOpacity: 0.2
                }).addTo(resourceMap);
            }
            
            // Fit map to show user location and resources
            if (resourcesToShow.length > 0) {
                const bounds = L.latLngBounds([
                    [userLocation.lat, userLocation.lng]
                ]);
                resourcesToShow.forEach(resource => {
                    bounds.extend([resource.lat, resource.lng]);
                });
                resourceMap.fitBounds(bounds, { padding: [50, 50] });
            } else {
                resourceMap.setView([userLocation.lat, userLocation.lng], 13);
            }
        } else if (resourcesToShow.length > 0) {
            // Fit map to show all resources if no user location
            const bounds = L.latLngBounds(resourcesToShow.map(resource => [resource.lat, resource.lng]));
            resourceMap.fitBounds(bounds, { padding: [50, 50] });
        }
    }
    
    // Get appropriate marker icon based on resource type
    function getMarkerIcon(type) {
        const iconColors = {
            'center': 'green',
            'distribution': 'blue',
            'mobile': 'orange',
            'emergency': 'red'
        };
        
        return L.divIcon({
            html: `<i class="fas ${getTypeIcon(type)}"></i>`,
            iconSize: [30, 30],
            className: `marker-icon ${iconColors[type] || 'blue'}`
        });
    }
    
    // Get icon class based on resource type
    function getTypeIcon(type) {
        const typeIcons = {
            'center': 'fa-clinic-medical',
            'distribution': 'fa-archive',
            'mobile': 'fa-bus-alt',
            'emergency': 'fa-first-aid'
        };
        return typeIcons[type] || 'fa-map-marker-alt';
    }
    
    // Update resource list based on filtered resources
    function updateResourceList(resourcesToShow) {
        const resourceList = document.getElementById('resource-list');
        const resultCount = document.getElementById('result-count');
        
        // Update result count
        resultCount.textContent = `${resourcesToShow.length} ${resourcesToShow.length === 1 ? 'result' : 'results'}`;
        
        // Clear current list
        resourceList.innerHTML = '';
        
        if (resourcesToShow.length === 0) {
            resourceList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>No resources match your current filters</p>
                </div>
            `;
            return;
        }
        
        // Add resources to list
        resourcesToShow.forEach(resource => {
            const item = document.createElement('div');
            item.className = 'resource-item';
            item.dataset.id = resource.id;
            item.innerHTML = `
                <h4>${resource.name}</h4>
                <div class="resource-meta">
                    <span class="resource-type ${resource.type}">${formatResourceType(resource.type)}</span>
                    ${userLocation.lat ? `<span class="resource-distance"><i class="fas fa-walking"></i> ${resource.distance} mi</span>` : ''}
                </div>
                <p><i class="fas fa-map-marker-alt"></i> ${resource.address}</p>
                <p><i class="fas fa-clock"></i> ${resource.hours}</p>
            `;
            resourceList.appendChild(item);
            
            // Add click event to fly to marker
            item.addEventListener('click', function() {
                resourceMap.flyTo([resource.lat, resource.lng], 15);
                
                // Open popup
                markersCluster.getLayers().forEach(layer => {
                    if (layer._latlng.lat === resource.lat && layer._latlng.lng === resource.lng) {
                        layer.openPopup();
                    }
                });
            });
        });
    }
    
    // Format resource type for display
    function formatResourceType(type) {
        const typeNames = {
            'center': 'Hygiene Center',
            'distribution': 'Distribution Point',
            'mobile': 'Mobile Van',
            'emergency': 'Emergency Service'
        };
        return typeNames[type] || type;
    }
    
    // Filter resources based on selected filters
    function filterResources() {
        const type = document.getElementById('resource-type').value;
        const distance = parseInt(document.getElementById('distance').value);
        
        let filtered = resources;
        
        // Filter by type
        if (type !== 'all') {
            filtered = filtered.filter(resource => resource.type === type);
        }
        
        // Filter by distance if user location is available
        if (userLocation.lat && distance !== 'all') {
            filtered = filtered.filter(resource => {
                // Calculate distance from user to resource (simplified for this example)
                // In a real app, you would use proper distance calculation
                return resource.distance <= distance;
            });
        }
        
        updateMapMarkers(filtered);
        updateResourceList(filtered);
    }
    
    // Get user location
    document.getElementById('locate-me').addEventListener('click', function() {
        const statusElement = document.getElementById('location-status');
        
        if (navigator.geolocation) {
            statusElement.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> <span>Locating...</span>';
            
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    userLocation.lat = position.coords.latitude;
                    userLocation.lng = position.coords.longitude;
                    userLocation.accuracy = position.coords.accuracy;
                    
                    // In a real app, you would calculate distances to resources here
                    // For this example, we'll use the sample distances from the data
                    
                    statusElement.innerHTML = '<i class="fas fa-check-circle"></i> <span>Location found! Showing nearby resources</span>';
                    statusElement.style.color = 'var(--success)';
                    
                    // Update filters and map
                    filterResources();
                },
                function(error) {
                    let message;
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            message = "Location access was denied. Please enable location services in your browser settings.";
                            break;
                        case error.POSITION_UNAVAILABLE:
                            message = "Location information is unavailable.";
                            break;
                        case error.TIMEOUT:
                            message = "The request to get user location timed out.";
                            break;
                        case error.UNKNOWN_ERROR:
                            message = "An unknown error occurred.";
                            break;
                    }
                    
                    statusElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> <span>${message}</span>`;
                    statusElement.style.color = 'var(--danger)';
                }
            );
        } else {
            statusElement.innerHTML = '<i class="fas fa-exclamation-circle"></i> <span>Geolocation is not supported by your browser</span>';
            statusElement.style.color = 'var(--danger)';
        }
    });
    
    // Kit Tabs
    const kitTabs = document.querySelectorAll('.kit-tab');
    const kitPanels = document.querySelectorAll('.kit-panel');
    
    kitTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const kitId = this.dataset.kit;
            
            // Update tabs
            kitTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Update panels
            kitPanels.forEach(p => p.classList.remove('active'));
            document.getElementById(`${kitId}-panel`).classList.add('active');
        });
    });
    
    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            this.classList.toggle('active');
            const answer = this.nextElementSibling;
            
            if (this.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
            }
        });
    });
    
    // Kit Request Form
    const kitRequestForm = document.getElementById('kit-request-form');
    if (kitRequestForm) {
        kitRequestForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form validation would go here
            // In a real implementation, this would send data to a server
            
            // Show success message
            alert('Thank you for your request! We have received your information and will contact you within 48 hours to verify and coordinate delivery.');
            this.reset();
        });
    }
    
    // Initialize map
    initResourceMap();
    
    // Initialize filters
    document.getElementById('resource-type').addEventListener('change', filterResources);
    document.getElementById('distance').addEventListener('change', filterResources);
});