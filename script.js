/**
 * Global Hygiene Initiative – Main JavaScript
 * Modernised, performant, and accessible.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ----------------------------------------------------------------------
    // 1. ELEMENT SELECTORS (with null checks)
    // ----------------------------------------------------------------------
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    const navbar = document.querySelector('.navbar');
    const counters = document.querySelectorAll('.counter');
    const counterSection = document.querySelector('.impact-counter');
    const testimonials = document.querySelectorAll('.testimonial');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const carousel = document.querySelector('.testimonials-carousel');
    const newsletterForm = document.querySelector('.newsletter-form');

    // ----------------------------------------------------------------------
    // 2. HELPER FUNCTIONS
    // ----------------------------------------------------------------------
    /**
     * Safe event listener attachment
     */
    function on(el, event, handler) {
        if (el) el.addEventListener(event, handler);
    }

    /**
     * Toggle mobile menu and hamburger state
     */
    function toggleMobileMenu(force) {
        if (!hamburger || !mobileMenu) return;
        const isActive = force !== undefined ? force : !hamburger.classList.contains('active');
        hamburger.classList.toggle('active', isActive);
        mobileMenu.classList.toggle('active', isActive);
        hamburger.setAttribute('aria-expanded', isActive);
    }

    // ----------------------------------------------------------------------
    // 3. MOBILE MENU
    // ----------------------------------------------------------------------
    on(hamburger, 'click', (e) => {
        e.stopPropagation();
        toggleMobileMenu();
    });

    // Close mobile menu when clicking a link inside it
    if (mobileMenu) {
        mobileMenu.querySelectorAll('a').forEach(link => {
            on(link, 'click', () => toggleMobileMenu(false));
        });
    }

    // ----------------------------------------------------------------------
    // 4. THEME TOGGLE (with localStorage)
    // ----------------------------------------------------------------------
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun" aria-hidden="true"></i>';
    }

    on(themeToggle, 'click', () => {
        const isDark = body.getAttribute('data-theme') === 'dark';
        if (isDark) {
            body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-moon" aria-hidden="true"></i>';
        } else {
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun" aria-hidden="true"></i>';
        }
    });

    // ----------------------------------------------------------------------
    // 5. NAVBAR SCROLL EFFECT (debounced)
    // ----------------------------------------------------------------------
    let scrollTimer;
    on(window, 'scroll', () => {
        if (scrollTimer) clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            if (!navbar) return;
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }, 10);
    });

    // ----------------------------------------------------------------------
    // 6. ANIMATED COUNTER (using requestAnimationFrame)
    // ----------------------------------------------------------------------
    if (counters.length && counterSection) {
        let counting = false;
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !counting) {
                    counting = true;
                    startCounters();
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counterObserver.observe(counterSection);

        function startCounters() {
            const duration = 2000; // 2 seconds
            const startTime = performance.now();
            const targets = [];
            const startValues = [];
            const elements = [];

            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'), 10);
                const start = parseInt(counter.innerText.replace(/,/g, '')) || 0;
                targets.push(target);
                startValues.push(start);
                elements.push(counter);
            });

            function animate(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1); // between 0 and 1

                elements.forEach((el, i) => {
                    const target = targets[i];
                    const start = startValues[i];
                    const current = Math.floor(start + (target - start) * progress);
                    el.innerText = current.toLocaleString();
                });

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    // ensure final values
                    elements.forEach((el, i) => {
                        el.innerText = targets[i].toLocaleString();
                    });
                }
            }

            requestAnimationFrame(animate);
        }
    }

    // ----------------------------------------------------------------------
    // 7. TESTIMONIAL CAROUSEL
    // ----------------------------------------------------------------------
    if (testimonials.length && indicators.length && prevBtn && nextBtn) {
        let currentIndex = 0;
        let carouselInterval;

        function showTestimonial(index) {
            testimonials.forEach(t => t.classList.remove('active'));
            indicators.forEach(ind => {
                ind.classList.remove('active');
                ind.setAttribute('aria-selected', 'false');
            });

            testimonials[index].classList.add('active');
            indicators[index].classList.add('active');
            indicators[index].setAttribute('aria-selected', 'true');
            currentIndex = index;
        }

        // Indicator clicks
        indicators.forEach((indicator, idx) => {
            on(indicator, 'click', () => showTestimonial(idx));
        });

        on(prevBtn, 'click', () => {
            currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
            showTestimonial(currentIndex);
        });

        on(nextBtn, 'click', () => {
            currentIndex = (currentIndex + 1) % testimonials.length;
            showTestimonial(currentIndex);
        });

        // Auto-rotate
        function startCarousel() {
            carouselInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % testimonials.length;
                showTestimonial(currentIndex);
            }, 5000);
        }
        function stopCarousel() {
            clearInterval(carouselInterval);
        }

        startCarousel();
        on(carousel, 'mouseenter', stopCarousel);
        on(carousel, 'mouseleave', startCarousel);
    }

    // ----------------------------------------------------------------------
    // 8. SMOOTH SCROLLING FOR ANCHOR LINKS
    // ----------------------------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        on(anchor, 'click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // update URL without jumping (optional)
                history.pushState(null, null, href);
            }
        });
    });

    // ----------------------------------------------------------------------
    // 9. NEWSLETTER FORM SUBMISSION (preserve original behaviour)
    // ----------------------------------------------------------------------
    on(newsletterForm, 'submit', (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        if (emailInput && emailInput.value && emailInput.value.includes('@')) {
            alert('Thank you for subscribing to our newsletter!');
            emailInput.value = '';
        } else {
            alert('Please enter a valid email address.');
        }
    });

    // ----------------------------------------------------------------------
    // 10. ADD ARIA-CURRENT TO ACTIVE NAV LINK (already done in HTML)
    // ----------------------------------------------------------------------
    // No extra action needed – active class is present on home link.

    // ----------------------------------------------------------------------
    // 11. CLOSE MOBILE MENU ON RESIZE (if window becomes large)
    // ----------------------------------------------------------------------
    let resizeTimer;
    on(window, 'resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768) {
                toggleMobileMenu(false);
            }
        }, 150);
    });
});