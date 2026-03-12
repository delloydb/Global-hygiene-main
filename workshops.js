/**
 * Workshops & Outreach page – modernised, accessible, performant.
 * Preserves original colour palette and core functionality.
 */
(function() {
    'use strict';

    // Wait for DOM and all deferred scripts (Leaflet) to be ready
    document.addEventListener('DOMContentLoaded', () => {
        // ------------------------------------------------------------------
        // DOM helpers (safe, local scope)
        // ------------------------------------------------------------------
        const $ = (selector, context = document) => context.querySelector(selector);
        const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

        // ------------------------------------------------------------------
        // 1. Workshop Vision Tabs (with chart animation)
        // ------------------------------------------------------------------
        const visionTabs = $$('.vision-tab');
        const visionPanels = $$('.vision-panel');
        let chartAnimated = false; // ensure animation runs only once per tab activation

        function activateVisionTab(tabId) {
            visionTabs.forEach(tab => {
                const isActive = tab.dataset.tab === tabId;
                tab.classList.toggle('active', isActive);
                tab.setAttribute('aria-selected', isActive);
            });
            visionPanels.forEach(panel => {
                const isActive = panel.id === `${tabId}-panel`;
                panel.classList.toggle('active', isActive);
            });

            // Animate chart bars when "who" panel becomes active
            if (tabId === 'who') animateChartBars();
        }

        visionTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                activateVisionTab(e.currentTarget.dataset.tab);
            });
        });

        function animateChartBars() {
            $$('.chart-bar').forEach(bar => {
                const percentage = bar.dataset.percentage;
                const fill = bar.querySelector('.bar-fill');
                if (fill) fill.style.width = `${percentage}%`;
            });
        }

        // If "who" panel is active on load (unlikely, but handle)
        if ($('#who-panel.active')) animateChartBars();

        // ------------------------------------------------------------------
        // 2. Calendar: list / map toggle
        // ------------------------------------------------------------------
        const toggleBtns = $$('.toggle-btn');
        const calendarViews = $$('.calendar-view');
        let mapInitialised = false;

        toggleBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                toggleBtns.forEach(b => {
                    b.classList.toggle('active', b.dataset.view === view);
                });
                calendarViews.forEach(v => {
                    v.classList.toggle('active', v.id === `${view}-view`);
                });
                if (view === 'map' && !mapInitialised) {
                    initWorkshopMap();
                    mapInitialised = true;
                } else if (view === 'map') {
                    // Ensure map resizes correctly if already initialised
                    if (workshopMap) setTimeout(() => workshopMap.invalidateSize(), 200);
                }
            });
        });

        // ------------------------------------------------------------------
        // 3. Workshop data & filtering
        // ------------------------------------------------------------------
        const workshops = [
            { id:1, title:"School Hygiene Program", type:"school", description:"Interactive hygiene education for students ages 6-12, including handwashing demonstrations and hygiene kit distribution.", date:"2023-06-15", day:"15", month:"JUN", location:"Nairobi, Kenya", spots:1, lat:-1.286389, lng:36.817223 },
            { id:2, title:"Trainer Certification", type:"trainer", description:"Become a certified hygiene trainer.", date:"2026-06-15", day:"05", month:"MAY", location:"Kakamega, Kenya", spots:12, lat:0.28215, lng:34.7519 },
            { id:3, title:"Environment cleaning day", type:"community", description:"Community clean‑up and hygiene education.", date:"2023-06-15", day:"15", month:"JUN", location:"Kirinyaga, Kenya", spots:10, lat:-0.5, lng:37.2833 },
        ];

        const countryFilter = $('#country-filter');
        const monthFilter = $('#month-filter');
        const typeFilter = $('#type-filter');
        const workshopList = $('.workshop-list');
        const mapSidebarList = $('.map-workshops-list');

        function formatWorkshopType(type) {
            return { school:'School Program', community:'Community Workshop', trainer:'Trainer Certification' }[type] || type;
        }

        function renderWorkshops(filtered) {
            if (!workshopList) return;
            workshopList.innerHTML = '';
            if (filtered.length === 0) {
                workshopList.innerHTML = '<p class="no-workshops">No workshops match your filters. Try adjusting your selection.</p>';
                return;
            }
            filtered.forEach(w => {
                const card = document.createElement('div');
                card.className = `workshop-card ${w.type}`;
                card.innerHTML = `
                    <div class="workshop-header">
                        <div class="workshop-date">
                            <div class="workshop-day">${w.day}</div>
                            <div class="workshop-month">${w.month}</div>
                        </div>
                        <div class="workshop-title">
                            <h3>${w.title}</h3>
                            <span class="workshop-type ${w.type}">${formatWorkshopType(w.type)}</span>
                        </div>
                    </div>
                    <div class="workshop-body">
                        <div class="workshop-location"><i class="fas fa-map-marker-alt" aria-hidden="true"></i> ${w.location}</div>
                        <p class="workshop-description">${w.description}</p>
                    </div>
                    <div class="workshop-footer">
                        <div class="workshop-spots"><i class="fas fa-users" aria-hidden="true"></i> ${w.spots} spots remaining</div>
                        <button class="btn-workshop">Register</button>
                    </div>
                `;
                workshopList.appendChild(card);
            });
        }

        function updateMapSidebar(filtered) {
            if (!mapSidebarList) return;
            mapSidebarList.innerHTML = '';
            filtered.forEach(w => {
                const item = document.createElement('div');
                item.className = 'map-workshop-item';
                item.dataset.id = w.id;
                item.setAttribute('tabindex', '0'); // make focusable
                item.innerHTML = `
                    <div class="map-workshop-title">${w.title}</div>
                    <div class="map-workshop-location"><i class="fas fa-map-marker-alt" aria-hidden="true"></i> ${w.location}</div>
                    <div class="map-workshop-date">${w.month} ${w.day}</div>
                `;
                mapSidebarList.appendChild(item);

                // Click or Enter on item flies to marker
                const handler = () => {
                    const marker = mapMarkers.find(m => m.workshopId === w.id);
                    if (marker && workshopMap) {
                        workshopMap.flyTo([w.lat, w.lng], 8);
                        marker.openPopup();
                    }
                };
                item.addEventListener('click', handler);
                item.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handler();
                    }
                });
            });
        }

        function filterWorkshops() {
            const country = countryFilter?.value || 'all';
            const month = monthFilter?.value || 'all';
            const type = typeFilter?.value || 'all';

            const filtered = workshops.filter(w => {
                const locationMatch = country === 'all' || w.location.toLowerCase().includes(country);
                // month select values: 'jun','jul','aug','may' – compare with w.month lowercase
                const monthMatch = month === 'all' || w.month.toLowerCase() === month;
                const typeMatch = type === 'all' || w.type === type;
                return locationMatch && monthMatch && typeMatch;
            });

            renderWorkshops(filtered);
            updateMapSidebar(filtered);
            if (workshopMap) updateMapMarkers(filtered);
        }

        if (countryFilter && monthFilter && typeFilter) {
            [countryFilter, monthFilter, typeFilter].forEach(el => {
                el.addEventListener('change', filterWorkshops);
            });
            filterWorkshops(); // initial render
        }

        // ------------------------------------------------------------------
        // 4. Leaflet Map (initialise once)
        // ------------------------------------------------------------------
        let workshopMap = null;
        let mapMarkers = [];

        function initWorkshopMap() {
            const mapEl = document.getElementById('workshop-map');
            if (!mapEl) return;

            workshopMap = L.map('workshop-map').setView([20, 0], 2);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(workshopMap);

            // Initial sidebar build (from current filtered list)
            updateMapSidebar(workshops); // will be replaced by filter on load anyway
            filterWorkshops(); // triggers marker update as well
        }

        function updateMapMarkers(workshopsToShow) {
            if (!workshopMap) return;
            // Remove old markers
            mapMarkers.forEach(m => workshopMap.removeLayer(m));
            mapMarkers = [];

            workshopsToShow.forEach(w => {
                const marker = L.marker([w.lat, w.lng]).addTo(workshopMap);
                marker.workshopId = w.id;
                marker.bindPopup(`
                    <div class="map-popup">
                        <h4>${w.title}</h4>
                        <p><i class="fas fa-calendar-alt" aria-hidden="true"></i> ${w.month} ${w.day}</p>
                        <p><i class="fas fa-map-marker-alt" aria-hidden="true"></i> ${w.location}</p>
                        <p><i class="fas fa-users" aria-hidden="true"></i> ${w.spots} spots</p>
                    </div>
                `);
                mapMarkers.push(marker);
            });

            // Adjust view if only one marker remains
            if (workshopsToShow.length === 1) {
                workshopMap.flyTo([workshopsToShow[0].lat, workshopsToShow[0].lng], 8);
            }
        }

        // If map view is active on page load, initialise map
        if ($('#map-view.active')) {
            initWorkshopMap();
            mapInitialised = true;
        }

        // ------------------------------------------------------------------
        // 5. Gallery Tabs
        // ------------------------------------------------------------------
        const galleryTabs = $$('.gallery-tab');
        const galleryPanels = $$('.gallery-panel');

        galleryTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabId = e.currentTarget.dataset.tab;
                galleryTabs.forEach(t => {
                    const isActive = t.dataset.tab === tabId;
                    t.classList.toggle('active', isActive);
                    t.setAttribute('aria-selected', isActive);
                });
                galleryPanels.forEach(p => {
                    p.classList.toggle('active', p.id === `${tabId}-panel`);
                });
            });
        });

        // ------------------------------------------------------------------
        // 6. Story Carousel (with improved accessibility)
        // ------------------------------------------------------------------
        const storyCards = $$('.story-card');
        const storyIndicators = $$('.story-carousel .indicator');
        const storyPrev = $('.story-carousel .carousel-prev');
        const storyNext = $('.story-carousel .carousel-next');
        let currentStory = 0;
        let storyInterval;

        function showStory(index) {
            storyCards.forEach((c, i) => {
                c.classList.toggle('active', i === index);
            });
            storyIndicators.forEach((ind, i) => {
                ind.classList.toggle('active', i === index);
                ind.setAttribute('aria-selected', i === index);
            });
            currentStory = index;
        }

        storyIndicators.forEach((ind, idx) => {
            ind.addEventListener('click', () => showStory(idx));
        });
        if (storyPrev) storyPrev.addEventListener('click', () => {
            showStory((currentStory - 1 + storyCards.length) % storyCards.length);
        });
        if (storyNext) storyNext.addEventListener('click', () => {
            showStory((currentStory + 1) % storyCards.length);
        });

        // Auto‑rotate with pause on hover/focus
        function startCarousel() {
            if (storyCards.length <= 1) return;
            storyInterval = setInterval(() => {
                showStory((currentStory + 1) % storyCards.length);
            }, 8000);
        }
        function stopCarousel() { clearInterval(storyInterval); }

        const storyCarousel = $('.story-carousel');
        if (storyCarousel && storyCards.length > 1) {
            startCarousel();
            storyCarousel.addEventListener('mouseenter', stopCarousel);
            storyCarousel.addEventListener('mouseleave', startCarousel);
            storyCarousel.addEventListener('focusin', stopCarousel);
            storyCarousel.addEventListener('focusout', startCarousel);
        }

        // ------------------------------------------------------------------
        // 7. Volunteer Form (with basic validation)
        // ------------------------------------------------------------------
        const ambassadorForm = $('#ambassador-form');
        if (ambassadorForm) {
            ambassadorForm.addEventListener('submit', (e) => {
                e.preventDefault();

                // Simple required field check (browser would do this, but we use novalidate)
                const requiredFields = $$('[required]', ambassadorForm);
                let missing = false;
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        field.style.borderColor = 'red';
                        missing = true;
                    } else {
                        field.style.borderColor = '';
                    }
                });

                if (missing) {
                    alert('Please fill in all required fields.');
                    return;
                }

                // Additional email validation
                const email = $('#email');
                if (email && !/^\S+@\S+\.\S+$/.test(email.value)) {
                    email.style.borderColor = 'red';
                    alert('Please enter a valid email address.');
                    return;
                }

                alert('Thank you for your application! We will review your information and contact you within 5 business days.');
                ambassadorForm.reset();
                // Reset border colors
                requiredFields.forEach(f => f.style.borderColor = '');
            });
        }
    });
})();