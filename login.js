/**
 * Login page – clean, accessible, and functional.
 * Preserves original colour palette and behaviour.
 */
(function() {
    'use strict';

    // DOM elements
    const elements = {
        loginForm: document.getElementById('loginForm'),
        registerForm: document.getElementById('registerForm'),
        resetForm: document.getElementById('resetForm'),
        switchToRegister: document.getElementById('switchToRegister'),
        switchToLogin: document.getElementById('switchToLogin'),
        forgotPasswordLink: document.getElementById('forgotPasswordLink'),
        resetBackToLogin: document.getElementById('resetBackToLogin'),
        togglePasswordBtns: document.querySelectorAll('.toggle-password'),
        registerPassword: document.getElementById('registerPassword'),
        strengthBars: document.querySelectorAll('.strength-bar'),
        strengthText: document.querySelector('.strength-text'),
        messageBox: document.querySelector('.form-message'),
    };

    // Helper: show a form and hide others
    function showForm(form) {
        [elements.loginForm, elements.registerForm, elements.resetForm].forEach(f => {
            if (f) {
                f.classList.remove('active');
                f.hidden = true;
            }
        });
        if (form) {
            form.classList.add('active');
            form.hidden = false;
            // Move focus to first input in the active form
            const firstInput = form.querySelector('input');
            if (firstInput) firstInput.focus();
        }
        clearMessage();
    }

    // Clear inline message
    function clearMessage() {
        if (elements.messageBox) elements.messageBox.textContent = '';
    }

    // Show inline message (error by default)
    function showMessage(msg, isError = true) {
        if (elements.messageBox) {
            elements.messageBox.textContent = msg;
            elements.messageBox.style.color = isError ? 'var(--error)' : 'var(--success)';
        }
    }

    // Form switching
    if (elements.switchToRegister) {
        elements.switchToRegister.addEventListener('click', (e) => {
            e.preventDefault();
            showForm(elements.registerForm);
        });
    }

    if (elements.switchToLogin) {
        elements.switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            showForm(elements.loginForm);
        });
    }

    if (elements.forgotPasswordLink) {
        elements.forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            showForm(elements.resetForm);
        });
    }

    if (elements.resetBackToLogin) {
        elements.resetBackToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            showForm(elements.loginForm);
        });
    }

    // Password visibility toggle with ARIA
    elements.togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            const isPressed = this.getAttribute('aria-pressed') === 'true';

            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
                this.setAttribute('aria-pressed', 'true');
                this.setAttribute('aria-label', 'Hide password');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
                this.setAttribute('aria-pressed', 'false');
                this.setAttribute('aria-label', 'Show password');
            }
        });
    });

    // Password strength meter
    function getStrength(password) {
        let score = 0;
        if (password.length > 0) score++;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        return Math.min(score, 4);
    }

    function getStrengthColor(score) {
        switch(score) {
            case 1: return '#e76f51'; // weak
            case 2: return '#f4a261'; // fair
            case 3: return '#e9c46a'; // good
            case 4: return '#2a9d8f'; // strong
            default: return '#6c757d';
        }
    }

    function getStrengthText(score) {
        switch(score) {
            case 0: return 'Password Strength';
            case 1: return 'Weak';
            case 2: return 'Fair';
            case 3: return 'Good';
            case 4: return 'Strong';
            default: return '';
        }
    }

    function updateStrengthMeter(password) {
        if (!elements.strengthBars.length || !elements.strengthText) return;
        const score = getStrength(password);
        elements.strengthBars.forEach((bar, index) => {
            bar.style.backgroundColor = index < score ? getStrengthColor(score) : '#eee';
        });
        elements.strengthText.textContent = getStrengthText(score);
        elements.strengthText.style.color = getStrengthColor(score);
    }

    if (elements.registerPassword) {
        elements.registerPassword.addEventListener('input', (e) => {
            updateStrengthMeter(e.target.value);
        });
    }

    // Validation helpers
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Login form submission
    if (elements.loginForm) {
        elements.loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            if (!email || !password) {
                showMessage('Please fill in all fields');
                return;
            }
            if (!validateEmail(email)) {
                showMessage('Please enter a valid email address');
                return;
            }

            const submitBtn = elements.loginForm.querySelector('.btn-primary');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Signing in...';
            submitBtn.disabled = true;

            setTimeout(() => {
                showMessage('Login successful! Redirecting...', false);
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                // In a real app: window.location.href = '/dashboard';
            }, 1500);
        });
    }

    // Registration form submission
    if (elements.registerForm) {
        elements.registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fullName = document.getElementById('fullName').value.trim();
            const email = document.getElementById('registerEmail').value.trim();
            const password = document.getElementById('registerPassword').value;
            const confirm = document.getElementById('confirmPassword').value;
            const agree = document.getElementById('agreeTerms').checked;

            if (!fullName || !email || !password || !confirm) {
                showMessage('Please fill in all fields');
                return;
            }
            if (!validateEmail(email)) {
                showMessage('Please enter a valid email address');
                return;
            }
            if (password !== confirm) {
                showMessage('Passwords do not match');
                return;
            }
            if (password.length < 8) {
                showMessage('Password must be at least 8 characters');
                return;
            }
            if (!agree) {
                showMessage('You must agree to the terms');
                return;
            }

            const submitBtn = elements.registerForm.querySelector('.btn-primary');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Creating account...';
            submitBtn.disabled = true;

            setTimeout(() => {
                showMessage('Account created! Please sign in.', false);
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                showForm(elements.loginForm);
            }, 1500);
        });
    }

    // Password reset form submission
    if (elements.resetForm) {
        elements.resetForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('resetEmail').value.trim();

            if (!email) {
                showMessage('Please enter your email');
                return;
            }
            if (!validateEmail(email)) {
                showMessage('Please enter a valid email address');
                return;
            }

            const submitBtn = elements.resetForm.querySelector('.btn-primary');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                showMessage('Reset link sent! Check your email.', false);
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                showForm(elements.loginForm);
            }, 1500);
        });
    }

    // Real‑time field validation (add/remove error class on blur)
    document.querySelectorAll('.input-field input').forEach(input => {
        input.addEventListener('blur', () => {
            const field = input.closest('.input-field');
            if (!field) return;
            if (input.checkValidity && !input.checkValidity()) {
                field.classList.add('error');
                field.classList.remove('success');
            } else if (input.value.trim() !== '') {
                field.classList.remove('error');
                field.classList.add('success');
            } else {
                field.classList.remove('error', 'success');
            }
        });
    });

    // Initialise: show login form
    showForm(elements.loginForm);
})();