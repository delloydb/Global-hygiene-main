document.addEventListener('DOMContentLoaded', function() {
    // Literacy level toggle
    const literacyBtns = document.querySelectorAll('.toggle-btn');
    literacyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            literacyBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const level = this.dataset.level;
            // In a real implementation, this would filter or adjust content
            console.log(`Switched to ${level} literacy mode`);
        });
    });

    // Learning track cards
    const trackCards = document.querySelectorAll('.track-card');
    trackCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('btn-track')) {
                const category = this.dataset.category;
                window.location.href = `learn-hygiene.html?category=${category}`;
            }
        });
    });

    // Resource filtering
    const categoryFilter = document.getElementById('category-filter');
    const formatFilter = document.getElementById('format-filter');
    const levelFilter = document.getElementById('level-filter');
    const resourceGrid = document.querySelector('.resource-grid');
    
    // Sample resource data - in a real app, this would come from an API
    const resources = [
        {
            id: 1,
            title: "Proper Handwashing Technique",
            desc: "Step-by-step guide to effective handwashing",
            category: "physical",
            format: "video",
            level: "beginner",
            duration: "3:45",
            thumbnail: "images/resources/handwash.jpg"
        },
                {
            id: 2,
            title: "Environmental cleaning Procedures",
            desc: "Step-by-step guide to effective cleaning",
            category: "physical",
            format: "video",
            level: "intermediate",
            duration: "3:45",
            thumbnail: "images/resources/handwash.jpg"
        },
                {
            id: 3,
            title: "Litter Management Technique",
            desc: "Step-by-step guide for waste management",
            category: "physical",
            format: "video",
            level: "advanced",
            duration: "3:45",
            thumbnail: "images/resources/handwash.jpg"
        },
        // More resources would be added here...
    ];
    
    function filterResources() {
        const category = categoryFilter.value;
        const format = formatFilter.value;
        const level = levelFilter.value;
        
        // Clear current resources
        resourceGrid.innerHTML = '';
        
        // Filter and display resources
        const filtered = resources.filter(resource => {
            return (category === 'all' || resource.category === category) &&
                   (format === 'all' || resource.format === format) &&
                   (level === 'all' || resource.level === level);
        });
        
        if (filtered.length === 0) {
            resourceGrid.innerHTML = '<p class="no-results">No resources match your filters. Try adjusting your selection.</p>';
            return;
        }
        
        filtered.forEach(resource => {
            const card = document.createElement('div');
            card.className = 'resource-card';
            card.innerHTML = `
                <div class="resource-thumbnail" style="background-image: url('${resource.thumbnail}')">
                    ${resource.format === 'video' ? '<div class="play-icon"><i class="fas fa-play"></i></div><span class="duration">' + resource.duration + '</span>' : ''}
                </div>
                <div class="resource-info">
                    <h3>${resource.title}</h3>
                    <p class="resource-desc">${resource.desc}</p>
                    <div class="resource-meta">
                        <span class="resource-type"><i class="fas fa-${getFormatIcon(resource.format)}"></i> ${formatDisplay(resource.format)}</span>
                        <span class="resource-level"><i class="fas fa-star"></i> ${capitalizeFirstLetter(resource.level)}</span>
                    </div>
                </div>
            `;
            resourceGrid.appendChild(card);
        });
    }
    
    function getFormatIcon(format) {
        const icons = {
            'video': 'video',
            'article': 'file-alt',
            'infographic': 'chart-pie',
            'slides': 'images',
            'interactive': 'mouse-pointer'
        };
        return icons[format] || 'file';
    }
    
    function formatDisplay(format) {
        const formats = {
            'video': 'Video',
            'article': 'Article',
            'infographic': 'Infographic',
            'slides': 'Slide Deck',
            'interactive': 'Interactive'
        };
        return formats[format] || format;
    }
    
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    // Initialize filters
    categoryFilter.addEventListener('change', filterResources);
    formatFilter.addEventListener('change', filterResources);
    levelFilter.addEventListener('change', filterResources);
    filterResources();
    
    // Load more resources button
    const loadMoreBtn = document.querySelector('.btn-load');
    loadMoreBtn.addEventListener('click', function() {
        // In a real implementation, this would load more resources from an API
        console.log('Loading more resources...');
        this.textContent = 'Loading...';
        setTimeout(() => {
            this.textContent = 'No more resources to load';
            this.disabled = true;
        }, 1000);
    });
    
    /* Interactive Tools */
    
    // Tool tabs
    const toolTabs = document.querySelectorAll('.tool-tab');
    const toolPanels = document.querySelectorAll('.tool-panel');
    
    toolTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tool = this.dataset.tool;
            
            // Update tabs
            toolTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Update panels
            toolPanels.forEach(p => p.classList.remove('active'));
            document.getElementById(`${tool}-tool`).classList.add('active');
            
            // Initialize specific tool if needed
            if (tool === 'handwash') initHandWashTool();
            if (tool === 'dressing') initDressingTool();
            if (tool === 'meal') initMealTool();
        });
    });
    
    // Hand Washing 3D Tool
    function initHandWashTool() {
        const handwashCanvas = document.getElementById('handwash-3d');
        const loadingElement = handwashCanvas.querySelector('.loading-3d');
        
        // Show loading state
        loadingElement.style.display = 'flex';
        
        // In a real implementation, this would initialize Three.js
        // For this example, we'll simulate loading
        setTimeout(() => {
            loadingElement.style.display = 'none';
            handwashCanvas.innerHTML = '<div class="handwash-placeholder" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background-color:#e0f2f1;color:#2B7A78;font-weight:bold;">3D Hand Washing Interactive Would Appear Here</div>';
            
            // Set up step interaction
            const steps = document.querySelectorAll('.step');
            steps.forEach(step => {
                step.addEventListener('click', function() {
                    steps.forEach(s => s.classList.remove('active'));
                    this.classList.add('active');
                    
                    // In a real app, this would update the 3D model
                    console.log(`Showing step ${this.dataset.step}`);
                });
            });
            
            // Start tutorial button
            const startBtn = document.querySelector('.btn-start');
            startBtn.addEventListener('click', function() {
                console.log('Starting hand washing tutorial');
                this.textContent = 'Tutorial in Progress...';
                
                // Simulate completion
                setTimeout(() => {
                    document.querySelector('.completion-badge').classList.remove('hidden');
                    document.querySelector('.feedback-message').textContent = 'Excellent work! You\'ve completed all handwashing steps correctly.';
                    startBtn.textContent = 'Restart Tutorial';
                }, 3000);
            });
        }, 1500);
    }
    
    // Dressing Tool
    function initDressingTool() {
        const clothingItems = document.querySelectorAll('.clothing-item');
        const topLayer = document.getElementById('top-clothing');
        const bottomLayer = document.getElementById('bottom-clothing');
        const footwearLayer = document.getElementById('footwear');
        const accessoryLayer = document.getElementById('accessory');
        
        clothingItems.forEach(item => {
            item.addEventListener('click', function() {
                const type = this.dataset.type;
                const id = this.dataset.id;
                
                // Update the appropriate layer
                switch(type) {
                    case 'top':
                        topLayer.style.backgroundImage = `url('images/clothing/${id}.png')`;
                        break;
                    case 'bottom':
                        bottomLayer.style.backgroundImage = `url('images/clothing/${id}.png')`;
                        break;
                    case 'footwear':
                        footwearLayer.style.backgroundImage = `url('images/clothing/${id}.png')`;
                        break;
                    case 'accessory':
                        accessoryLayer.style.backgroundImage = `url('images/clothing/${id}.png')`;
                        break;
                }
                
                // In a real app, this would evaluate the outfit
                console.log(`Added ${type}: ${id}`);
            });
        });
        
        // Reset outfit
        const resetBtn = document.querySelector('.btn-reset');
        resetBtn.addEventListener('click', function() {
            [topLayer, bottomLayer, footwearLayer, accessoryLayer].forEach(layer => {
                layer.style.backgroundImage = '';
            });
        });
        
        // Occasion selector
        const occasionSelect = document.getElementById('occasion-select');
        occasionSelect.addEventListener('change', function() {
            console.log(`Selected occasion: ${this.value}`);
            // In a real app, this would filter clothing options
        });
    }
    
    // Meal Tool
    function initMealTool() {
        const ingredientItems = document.querySelectorAll('.ingredient-item');
        const mealPlate = document.getElementById('meal-plate');
        const mealSelect = document.getElementById('meal-select');
        const nutritionFacts = document.querySelector('.nutrition-facts');
        const preparationSteps = document.querySelector('.preparation-steps');
        const stepsList = document.querySelector('.steps-list');
        
        // Sample ingredients by category
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
        const ingredientCategories = document.querySelectorAll('.ingredient-category');
        const ingredientItemsContainer = document.querySelector('.ingredient-items');
        
        ingredientCategories.forEach(category => {
            category.addEventListener('click', function() {
                const cat = this.dataset.category;
                
                // Update active category
                ingredientCategories.forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                
                // Load ingredients
                ingredientItemsContainer.innerHTML = '';
                ingredients[cat].forEach(ing => {
                    const item = document.createElement('div');
                    item.className = 'ingredient-item';
                    item.dataset.id = ing.id;
                    item.dataset.name = ing.name;
                    item.style.backgroundImage = `url('images/ingredients/${ing.id}.png')`;
                    item.draggable = true;
                    
                    // Add drag events
                    item.addEventListener('dragstart', function(e) {
                        e.dataTransfer.setData('text/plain', JSON.stringify({
                            id: this.dataset.id,
                            name: this.dataset.name,
                            type: 'ingredient'
                        }));
                    });
                    
                    ingredientItemsContainer.appendChild(item);
                });
            });
        });
        
        // Initialize first category
        document.querySelector('.ingredient-category.active').click();
        
        // Set up plate as drop target
        mealPlate.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.border = '2px dashed var(--primary)';
        });
        
        mealPlate.addEventListener('dragleave', function() {
            this.style.border = '';
        });
        
        mealPlate.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.border = '';
            
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));
            if (data.type === 'ingredient') {
                // Add ingredient to plate
                const ingredient = document.createElement('div');
                ingredient.className = 'plate-ingredient';
                ingredient.dataset.id = data.id;
                ingredient.style.backgroundImage = `url('images/ingredients/${data.id}.png')`;
                this.appendChild(ingredient);
                
                // Show nutrition and steps
                nutritionFacts.classList.remove('hidden');
                preparationSteps.classList.remove('hidden');
                
                // Generate steps
                stepsList.innerHTML = '';
                const steps = [
                    `Wash ${data.name} thoroughly under clean water`,
                    `Cut ${data.name} into appropriate pieces`,
                    `Cook ${data.name} to recommended temperature`,
                    `Serve ${data.name} on clean plate`
                ];
                
                steps.forEach((step, index) => {
                    const li = document.createElement('li');
                    li.textContent = step;
                    stepsList.appendChild(li);
                });
                
                // Update nutrition score
                const score = Math.floor(Math.random() * 30) + 70; // Random score 70-100
                document.querySelector('.meter-fill').style.width = `${score}%`;
                document.querySelector('.score-details').innerHTML = `
                    <p>Hygiene Score: ${score}/100</p>
                    <p>This meal has good hygiene potential. Remember to:</p>
                    <ul>
                        <li>Wash hands before preparation</li>
                        <li>Use clean utensils</li>
                        <li>Store leftovers properly</li>
                    </ul>
                `;
            }
        });
        
        // Meal type selector
        mealSelect.addEventListener('change', function() {
            console.log(`Selected meal type: ${this.value}`);
            // In a real app, this might suggest different ingredients
        });
    }
    
    // Age-specific learning tabs
    const ageTabs = document.querySelectorAll('.age-tab');
    const agePanels = document.querySelectorAll('.age-panel');
    
    ageTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const age = this.dataset.age;
            
            // Update tabs
            ageTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Update panels
            agePanels.forEach(p => p.classList.remove('active'));
            document.getElementById(`${age}-panel`).classList.add('active');
        });
    });
    
    // Initialize first tool
    initHandWashTool();
});