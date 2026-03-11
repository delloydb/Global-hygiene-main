/**
 * Workshops & Outreach page – modernised, accessible, performant.
 */

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        // ------------------------------------------------------------------
        // Helper: safe selectors
        // ------------------------------------------------------------------
        const $ = (selector, context = document) => context.querySelector(selector);
        const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

        // ------------------------------------------------------------------
        // 1. Workshop Vision Tabs
        // ------------------------------------------------------------------
        const visionTabs = $$('.vision-tab');
        const visionPanels = $$('.vision-panel');

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
            // Animate chart if "who" panel is shown
            if (tabId === 'who') animateChartBars();
        }

        visionTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                activateVisionTab(e.currentTarget.dataset.tab);
            });
        });

        // Animate chart bars (only when visible)
        function animateChartBars() {
            const bars = $$('.chart-bar');
            bars.forEach(bar => {
                const percentage = bar.dataset.percentage;
                const fill = bar.querySelector('.bar-fill');
                if (fill) fill.style.width = `${percentage}%`;
            });
        }

        // Initial animation if 'who' panel is active by default
        if ($('#who-panel.active')) animateChartBars();

        // ------------------------------------------------------------------
        // 2. Calendar: list / map toggle
        // ------------------------------------------------------------------
        const toggleBtns = $$('.toggle-btn');
        const calendarViews = $$('.calendar-view');

        toggleBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                toggleBtns.forEach(b => {
                    b.classList.toggle('active', b.dataset.view === view);
                });
                calendarViews.forEach(v => {
                    v.classList.toggle('active', v.id === `${view}-view`);
                });
                if (view === 'map') initWorkshopMap();
            });
        });

        // ------------------------------------------------------------------
        // 3. Workshop filtering (sample data)
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

        function filterWorkshops() {
            const country = countryFilter?.value || 'all';
            const month = monthFilter?.value || 'all';
            const type = typeFilter?.value || 'all';
            const filtered = workshops.filter(w => {
                const locationMatch = country === 'all' || w.location.toLowerCase().includes(country);
                const monthMatch = month === 'all' || w.month.toLowerCase() === month;
                const typeMatch = type === 'all' || w.type === type;
                return locationMatch && monthMatch && typeMatch;
            });
            renderWorkshops(filtered);
            // Also update map markers if map is visible
            if (workshopMap) updateMapMarkers(filtered);
        }

        if (countryFilter && monthFilter && typeFilter) {
            [countryFilter, monthFilter, typeFilter].forEach(el => {
                el.addEventListener('change', filterWorkshops);
            });
            filterWorkshops(); // initial render
        }

        // ------------------------------------------------------------------
        // 4. Leaflet Map (initialised only once)
        // ------------------------------------------------------------------
        let workshopMap = null;
        let mapMarkers = [];

        function initWorkshopMap() {
            if (!document.getElementById('workshop-map')) return;
            if (workshopMap) return; // already initialised

            workshopMap = L.map('workshop-map').setView([20, 0], 2);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(workshopMap);

            // Sidebar list
            const sidebarList = $('.map-workshops-list');
            if (sidebarList) {
                workshops.forEach(w => {
                    const item = document.createElement('div');
                    item.className = 'map-workshop-item';
                    item.dataset.id = w.id;
                    item.innerHTML = `
                        <div class="map-workshop-title">${w.title}</div>
                        <div class="map-workshop-location"><i class="fas fa-map-marker-alt" aria-hidden="true"></i> ${w.location}</div>
                        <div class="map-workshop-date">${w.month} ${w.day}</div>
                    `;
                    sidebarList.appendChild(item);
                    item.addEventListener('click', () => {
                        const workshop = workshops.find(x => x.id === w.id);
                        if (workshop && workshopMap) {
                            workshopMap.flyTo([workshop.lat, workshop.lng], 8);
                            mapMarkers.forEach(m => {
                                if (m.workshopId === w.id) m.openPopup();
                            });
                        }
                    });
                });
            }
            updateMapMarkers(workshops);
        }

        function updateMapMarkers(workshopsToShow) {
            if (!workshopMap) return;
            mapMarkers.forEach(m => workshopMap.removeLayer(m));
            mapMarkers = [];
            workshopsToShow.forEach(w => {
                const marker = L.marker([w.lat, w.lng]).addTo(workshopMap);
                marker.workshopId = w.id;
                marker.bindPopup(`
                    <div class="map-popup">
                        <h4>${w.title}</h4>
                        <p><i class="fas fa-calendar-alt"></i> ${w.month} ${w.day}</p>
                        <p><i class="fas fa-map-marker-alt"></i> ${w.location}</p>
                        <p><i class="fas fa-users"></i> ${w.spots} spots</p>
                    </div>
                `);
                mapMarkers.push(marker);
            });
        }

        // If map view is active by default, init map
        if ($('#map-view.active')) initWorkshopMap();

        // ------------------------------------------------------------------
        // 5. Gallery Tabs
        // ------------------------------------------------------------------
        const galleryTabs = $$('.gallery-tab');
        const galleryPanels = $$('.gallery-panel');

        galleryTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabId = e.currentTarget.dataset.tab;
                galleryTabs.forEach(t => {
                    t.classList.toggle('active', t.dataset.tab === tabId);
                    t.setAttribute('aria-selected', t.dataset.tab === tabId);
                });
                galleryPanels.forEach(p => {
                    p.classList.toggle('active', p.id === `${tabId}-panel`);
                });
            });
        });

        // ------------------------------------------------------------------
        // 6. Story Carousel
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
            ind.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showStory(idx); } });
        });
        if (storyPrev) storyPrev.addEventListener('click', () => {
            showStory((currentStory - 1 + storyCards.length) % storyCards.length);
        });
        if (storyNext) storyNext.addEventListener('click', () => {
            showStory((currentStory + 1) % storyCards.length);
        });

        // Auto‑rotate
        function startCarousel() {
            storyInterval = setInterval(() => {
                showStory((currentStory + 1) % storyCards.length);
            }, 8000);
        }
        function stopCarousel() { clearInterval(storyInterval); }

        const storyCarousel = $('.story-carousel');
        if (storyCarousel) {
            startCarousel();
            storyCarousel.addEventListener('mouseenter', stopCarousel);
            storyCarousel.addEventListener('mouseleave', startCarousel);
        }

        // ------------------------------------------------------------------
        // 7. Volunteer Form
        // ------------------------------------------------------------------
        const ambassadorForm = $('#ambassador-form');
        if (ambassadorForm) {
            ambassadorForm.addEventListener('submit', (e) => {
                e.preventDefault();
                // Simple validation could be added, but keep original behaviour
                alert('Thank you for your application! We will review your information and contact you within 5 business days.');
                ambassadorForm.reset();
            });
        }
    });
})();