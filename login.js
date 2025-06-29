document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const resetForm = document.getElementById('resetForm');
    const switchToRegister = document.getElementById('switchToRegister');
    const switchToLogin = document.getElementById('switchToLogin');
    const forgotPassword = document.querySelector('.forgot-password');
    const resetBackToLogin = document.getElementById('resetBackToLogin');
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    const registerPassword = document.getElementById('registerPassword');
    const strengthBars = document.querySelectorAll('.strength-bar');
    const strengthText = document.querySelector('.strength-text');

    // Switch between login and register forms
    switchToRegister.addEventListener('click', function(e) {
        e.preventDefault();
        loginForm.classList.add('hidden');
        resetForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        registerForm.style.animation = 'fadeIn 0.5s ease';
    });

    switchToLogin.addEventListener('click', function(e) {
        e.preventDefault();
        registerForm.classList.add('hidden');
        resetForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        loginForm.style.animation = 'fadeIn 0.5s ease';
    });

    // Forgot password flow
    forgotPassword.addEventListener('click', function(e) {
        e.preventDefault();
        loginForm.classList.add('hidden');
        registerForm.classList.add('hidden');
        resetForm.classList.remove('hidden');
        resetForm.style.animation = 'fadeIn 0.5s ease';
    });

    resetBackToLogin.addEventListener('click', function(e) {
        e.preventDefault();
        resetForm.classList.add('hidden');
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        loginForm.style.animation = 'fadeIn 0.5s ease';
    });

    // Toggle password visibility
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Password strength meter
    if (registerPassword) {
        registerPassword.addEventListener('input', function() {
            const password = this.value;
            const strength = calculatePasswordStrength(password);
            updateStrengthMeter(strength);
        });
    }

    function calculatePasswordStrength(password) {
        let strength = 0;
        
        // Length check
        if (password.length > 0) strength += 1;
        if (password.length >= 8) strength += 1;
        
        // Complexity checks
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        
        return Math.min(strength, 4); // Max strength of 4
    }

    function updateStrengthMeter(strength) {
        strengthBars.forEach((bar, index) => {
            if (index < strength) {
                bar.style.backgroundColor = getStrengthColor(strength);
            } else {
                bar.style.backgroundColor = '#eee';
            }
        });
        
        strengthText.textContent = getStrengthText(strength);
        strengthText.style.color = getStrengthColor(strength);
    }

    function getStrengthColor(strength) {
        switch(strength) {
            case 1: return '#e76f51'; // Weak
            case 2: return '#f4a261'; // Fair
            case 3: return '#e9c46a'; // Good
            case 4: return '#2a9d8f'; // Strong
            default: return '#6c757d'; // Default
        }
    }

    function getStrengthText(strength) {
        switch(strength) {
            case 0: return 'Password Strength';
            case 1: return 'Weak';
            case 2: return 'Fair';
            case 3: return 'Good';
            case 4: return 'Strong';
            default: return '';
        }
    }

    // Form validation and submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Simple validation
            if (!email || !password) {
                alert('Please fill in all fields');
                return;
            }
            
            // Here you would typically validate credentials with a server
            console.log('Login submitted:', { email, password });
            
            // Simulate successful login
            simulateLogin();
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const agreeTerms = document.getElementById('agreeTerms').checked;
            
            // Validation
            if (!fullName || !email || !password || !confirmPassword) {
                alert('Please fill in all fields');
                return;
            }
            
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            
            if (!agreeTerms) {
                alert('You must agree to the terms and conditions');
                return;
            }
            
            // Here you would typically send registration data to a server
            console.log('Registration submitted:', { fullName, email, password });
            
            // Simulate successful registration
            alert('Account created successfully! Please sign in.');
            registerForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
            loginForm.style.animation = 'fadeIn 0.5s ease';
        });
    }

    if (resetForm) {
        resetForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('resetEmail').value;
            
            if (!email) {
                alert('Please enter your email address');
                return;
            }
            
            // Here you would typically send a reset link to the email
            console.log('Password reset requested for:', email);
            
            // Simulate successful reset request
            alert('Password reset link sent to your email');
            resetForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
            loginForm.style.animation = 'fadeIn 0.5s ease';
        });
    }

    // Simulate successful login (for demo purposes)
    function simulateLogin() {
        const authBtn = loginForm.querySelector('.auth-btn');
        authBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        authBtn.disabled = true;
        
        setTimeout(() => {
            alert('Login successful! Redirecting...');
            // In a real app, you would redirect to the dashboard
            // window.location.href = 'dashboard.html';
        }, 1500);
    }
});