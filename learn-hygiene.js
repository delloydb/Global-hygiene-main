/**
 * Learn Hygiene page – modernised, accessible, performant.
 */

(function() {
    'use strict';

    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', () => {

        // ------------------------------------------------------------------
        // Helper: safe query selector
        // ------------------------------------------------------------------
        const $ = (selector, context = document) => context.querySelector(selector);
        const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

        // ------------------------------------------------------------------
        // 1. Literacy level toggle
        // ------------------------------------------------------------------
        const literacyBtns = $$('.toggle-btn');
        literacyBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const current = e.currentTarget;
                literacyBtns.forEach(b => b.classList.remove('active'));
                current.classList.add('active');
                const level = current.dataset.level;
                console.log(`Switched to ${level} literacy mode`); // future integration
            });
        });

        // ------------------------------------------------------------------
        // 2. Learning track cards – redirect on card click (except button)
        // ------------------------------------------------------------------
        const trackGrid = $('.track-grid');
        if (trackGrid) {
            trackGrid.addEventListener('click', (e) => {
                const card = e.target.closest('.track-card');
                if (!card) return;
                if (e.target.closest('.btn-track')) return; // button handled separately
                const category = card.dataset.category;
                if (category) {
                    window.location.href = `learn-hygiene.html?category=${category}`;
                }
            });

            // Buttons inside cards – we keep their own behaviour (if any)
            $$('.btn-track').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation(); // prevent card redirect
                    // actual "start learning" could be implemented later
                });
            });
        }

        // ------------------------------------------------------------------
        // 3. Resource filtering (with sample data)
        // ------------------------------------------------------------------
        const categoryFilter = $('#category-filter');
        const formatFilter = $('#format-filter');
        const levelFilter = $('#level-filter');
        const resourceGrid = $('.resource-grid');
        const loadMoreBtn = $('.btn-load');

        // Sample resource data (extendable)
        const resources = [
            { id: 1, title: "Proper Handwashing Technique", desc: "Step-by-step guide to effective handwashing", category: "physical", format: "video", level: "beginner", duration: "3:45", thumbnail: "images/resources/handwash.jpg" },
            { id: 2, title: "Environmental cleaning Procedures", desc: "Step-by-step guide to effective cleaning", category: "physical", format: "video", level: "intermediate", duration: "3:45", thumbnail: "images/resources/handwash.jpg" },
            { id: 3, title: "Litter Management Technique", desc: "Step-by-step guide for waste management", category: "sanitation", format: "video", level: "advanced", duration: "3:45", thumbnail: "images/resources/handwash.jpg" },
            // more entries can be added
        ];

        const formatIconMap = { video: 'video', article: 'file-alt', infographic: 'chart-pie', slides: 'images', interactive: 'mouse-pointer' };
        const formatDisplayMap = { video: 'Video', article: 'Article', infographic: 'Infographic', slides: 'Slide Deck', interactive: 'Interactive' };

        function capitalize(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }

        function renderResources(filtered) {
            if (!resourceGrid) return;
            resourceGrid.innerHTML = '';
            if (filtered.length === 0) {
                resourceGrid.innerHTML = '<p class="no-results">No resources match your filters. Try adjusting your selection.</p>';
                return;
            }
            filtered.forEach(res => {
                const card = document.createElement('div');
                card.className = 'resource-card';
                const icon = formatIconMap[res.format] || 'file';
                const formatDisplay = formatDisplayMap[res.format] || res.format;
                const thumbnailStyle = `background-image: url('${res.thumbnail}')`;
                const playHtml = res.format === 'video' ? `<div class="play-icon" aria-hidden="true"><i class="fas fa-play"></i></div><span class="duration">${res.duration}</span>` : '';
                card.innerHTML = `
                    <div class="resource-thumbnail" style="${thumbnailStyle}">
                        ${playHtml}
                    </div>
                    <div class="resource-info">
                        <h3>${res.title}</h3>
                        <p class="resource-desc">${res.desc}</p>
                        <div class="resource-meta">
                            <span class="resource-type"><i class="fas fa-${icon}" aria-hidden="true"></i> ${formatDisplay}</span>
                            <span class="resource-level"><i class="fas fa-star" aria-hidden="true"></i> ${capitalize(res.level)}</span>
                        </div>
                    </div>
                `;
                resourceGrid.appendChild(card);
            });
        }

        function filterResources() {
            const cat = categoryFilter?.value || 'all';
            const fmt = formatFilter?.value || 'all';
            const lvl = levelFilter?.value || 'all';
            const filtered = resources.filter(r =>
                (cat === 'all' || r.category === cat) &&
                (fmt === 'all' || r.format === fmt) &&
                (lvl === 'all' || r.level === lvl)
            );
            renderResources(filtered);
        }

        if (categoryFilter && formatFilter && levelFilter) {
            categoryFilter.addEventListener('change', filterResources);
            formatFilter.addEventListener('change', filterResources);
            levelFilter.addEventListener('change', filterResources);
            filterResources(); // initial render
        }

        // Load more (simulated)
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', function() {
                console.log('Loading more resources...');
                this.textContent = 'Loading...';
                setTimeout(() => {
                    this.textContent = 'No more resources to load';
                    this.disabled = true;
                }, 1000);
            });
        }

        // ------------------------------------------------------------------
        // 4. Interactive Tools – tabs
        // ------------------------------------------------------------------
        const toolTabs = $$('.tool-tab');
        const toolPanels = $$('.tool-panel');

        function activateTool(toolId) {
            toolTabs.forEach(tab => {
                const isActive = tab.dataset.tool === toolId;
                tab.classList.toggle('active', isActive);
                tab.setAttribute('aria-selected', isActive);
            });
            toolPanels.forEach(panel => {
                const isActive = panel.id === `${toolId}-tool`;
                panel.classList.toggle('active', isActive);
            });
            // initialise tool if needed
            if (toolId === 'handwash') initHandWashTool();
            if (toolId === 'dressing') initDressingTool();
            if (toolId === 'meal') initMealTool();
        }

        toolTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tool = e.currentTarget.dataset.tool;
                activateTool(tool);
            });
        });

        // ------------------------------------------------------------------
        // 5. Handwash Tool
        // ------------------------------------------------------------------
        function initHandWashTool() {
            const canvas = $('#handwash-3d');
            if (!canvas) return;
            const loading = $('.loading-3d', canvas);
            if (loading) {
                // Simulate loading (or just hide after short delay)
                setTimeout(() => {
                    loading.style.display = 'none';
                    canvas.innerHTML = '<div class="handwash-placeholder" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background-color:#e0f2f1;color:#2B7A78;font-weight:bold;">3D Hand Washing Interactive Would Appear Here</div>';
                }, 500);
            }

            // Step clicks
            const steps = $$('.step');
            steps.forEach(step => {
                step.addEventListener('click', function() {
                    steps.forEach(s => s.classList.remove('active'));
                    this.classList.add('active');
                });
            });

            // Start tutorial button
            const startBtn = $('.btn-start');
            if (startBtn) {
                startBtn.addEventListener('click', function() {
                    this.textContent = 'Tutorial in Progress...';
                    setTimeout(() => {
                        $('.completion-badge')?.classList.remove('hidden');
                        $('.feedback-message').textContent = 'Excellent work! You\'ve completed all handwashing steps correctly.';
                        this.textContent = 'Restart Tutorial';
                    }, 3000);
                });
            }
        }

        // ------------------------------------------------------------------
        // 6. Dressing Tool
        // ------------------------------------------------------------------
        function initDressingTool() {
            const clothingItems = $$('.clothing-item');
            const topLayer = $('#top-clothing');
            const bottomLayer = $('#bottom-clothing');
            const footwearLayer = $('#footwear');
            const accessoryLayer = $('#accessory');
            const resetBtn = $('.btn-reset');
            const occasionSelect = $('#occasion-select');

            clothingItems.forEach(item => {
                item.addEventListener('click', (e) => {
                    const target = e.currentTarget;
                    const type = target.dataset.type;
                    const id = target.dataset.id;
                    const layerMap = {
                        top: topLayer,
                        bottom: bottomLayer,
                        footwear: footwearLayer,
                        accessory: accessoryLayer
                    };
                    const layer = layerMap[type];
                    if (layer) {
                        layer.style.backgroundImage = `url('images/clothing/${id}.png')`;
                    }
                    console.log(`Added ${type}: ${id}`);
                });
                // keyboard support
                item.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        item.click();
                    }
                });
            });

            if (resetBtn) {
                resetBtn.addEventListener('click', () => {
                    [topLayer, bottomLayer, footwearLayer, accessoryLayer].forEach(layer => {
                        if (layer) layer.style.backgroundImage = '';
                    });
                });
            }

            if (occasionSelect) {
                occasionSelect.addEventListener('change', (e) => {
                    console.log(`Selected occasion: ${e.target.value}`);
                });
            }
        }

        // ------------------------------------------------------------------
        // 7. Meal Tool
        // ------------------------------------------------------------------
        function initMealTool() {
            const mealPlate = $('#meal-plate');
            const mealSelect = $('#meal-select');
            const nutritionFacts = $('.nutrition-facts');
            const preparationSteps = $('.preparation-steps');
            const stepsList = $('.steps-list');
            const ingredientCategories = $$('.ingredient-category');
            const ingredientItemsContainer = $('.ingredient-items');

            // Sample ingredient database
            const ingredients = {
                proteins: [
                    { id: 'chicken', name: 'Chicken' },
                    { id: 'fish', name: 'Fish' },
                    { id: 'tofu', name: 'Tofu' }
                ],
                vegetables: [
                    { id: 'carrot', name: 'Carrot' },
                    { id: 'broccoli', name: 'Broccoli' },
                    { id: 'spinach', name: 'Spinach' }
                ],
                grains: [
                    { id: 'rice', name: 'Rice' },
                    { id: 'quinoa', name: 'Quinoa' },
                    { id: 'bread', name: 'Bread' }
                ]
            };

            // Load ingredients by category
            function loadCategory(cat) {
                if (!ingredientItemsContainer) return;
                ingredientItemsContainer.innerHTML = '';
                (ingredients[cat] || []).forEach(ing => {
                    const item = document.createElement('div');
                    item.className = 'ingredient-item';
                    item.dataset.id = ing.id;
                    item.dataset.name = ing.name;
                    item.setAttribute('draggable', 'true');
                    item.style.backgroundImage = `url('images/ingredients/${ing.id}.png')`;
                    item.setAttribute('aria-label', ing.name);
                    item.addEventListener('dragstart', (e) => {
                        e.dataTransfer.setData('text/plain', JSON.stringify({
                            id: ing.id,
                            name: ing.name,
                            type: 'ingredient'
                        }));
                    });
                    ingredientItemsContainer.appendChild(item);
                });
            }

            ingredientCategories.forEach(catEl => {
                catEl.addEventListener('click', () => {
                    ingredientCategories.forEach(c => c.classList.remove('active'));
                    catEl.classList.add('active');
                    loadCategory(catEl.dataset.category);
                });
            });

            // Initial load
            const activeCat = $('.ingredient-category.active');
            if (activeCat) loadCategory(activeCat.dataset.category);

            // Drag & drop on plate
            if (mealPlate) {
                mealPlate.addEventListener('dragover', (e) => e.preventDefault());
                mealPlate.addEventListener('dragleave', () => {
                    mealPlate.style.border = '';
                });
                mealPlate.addEventListener('drop', (e) => {
                    e.preventDefault();
                    mealPlate.style.border = '';
                    const rawData = e.dataTransfer.getData('text/plain');
                    if (!rawData) return;
                    try {
                        const data = JSON.parse(rawData);
                        if (data.type === 'ingredient') {
                            // Add visual element to plate
                            const ingredientDiv = document.createElement('div');
                            ingredientDiv.className = 'plate-ingredient';
                            ingredientDiv.style.backgroundImage = `url('images/ingredients/${data.id}.png')`;
                            ingredientDiv.style.width = '50px';
                            ingredientDiv.style.height = '50px';
                            ingredientDiv.style.backgroundSize = 'contain';
                            ingredientDiv.style.backgroundRepeat = 'no-repeat';
                            ingredientDiv.style.position = 'absolute';
                            ingredientDiv.style.bottom = '10px';
                            ingredientDiv.style.right = '10px';
                            mealPlate.appendChild(ingredientDiv);

                            // Show nutrition & steps
                            if (nutritionFacts) nutritionFacts.classList.remove('hidden');
                            if (preparationSteps) preparationSteps.classList.remove('hidden');

                            // Generate steps
                            if (stepsList) {
                                stepsList.innerHTML = '';
                                const steps = [
                                    `Wash ${data.name} thoroughly under clean water`,
                                    `Cut ${data.name} into appropriate pieces`,
                                    `Cook ${data.name} to recommended temperature`,
                                    `Serve ${data.name} on clean plate`
                                ];
                                steps.forEach(step => {
                                    const li = document.createElement('li');
                                    li.textContent = step;
                                    stepsList.appendChild(li);
                                });
                            }

                            // Update score (random for demo)
                            const meterFill = $('.meter-fill');
                            const scoreDetails = $('.score-details');
                            if (meterFill && scoreDetails) {
                                const score = Math.floor(Math.random() * 30) + 70; // 70-100
                                meterFill.style.width = `${score}%`;
                                scoreDetails.innerHTML = `
                                    <p>Hygiene Score: ${score}/100</p>
                                    <p>This meal has good hygiene potential. Remember to:</p>
                                    <ul>
                                        <li>Wash hands before preparation</li>
                                        <li>Use clean utensils</li>
                                        <li>Store leftovers properly</li>
                                    </ul>
                                `;
                            }
                        }
                    } catch (err) {
                        console.warn('Invalid drag data', err);
                    }
                });
            }

            if (mealSelect) {
                mealSelect.addEventListener('change', (e) => {
                    console.log(`Selected meal type: ${e.target.value}`);
                });
            }
        }

        // ------------------------------------------------------------------
        // 8. Age‑specific tabs
        // ------------------------------------------------------------------
        const ageTabs = $$('.age-tab');
        const agePanels = $$('.age-panel');

        ageTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const age = e.currentTarget.dataset.age;
                ageTabs.forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-selected', 'false');
                });
                e.currentTarget.classList.add('active');
                e.currentTarget.setAttribute('aria-selected', 'true');

                agePanels.forEach(panel => {
                    panel.classList.remove('active');
                    if (panel.id === `${age}-panel`) {
                        panel.classList.add('active');
                    }
                });
            });
        });

        // ------------------------------------------------------------------
        // 9. Initialise first tool by default (handwash)
        // ------------------------------------------------------------------
        initHandWashTool();  // handwash is active by default
        // (dressing and meal will init when their tab is clicked)

    }); // DOMContentLoaded
})();