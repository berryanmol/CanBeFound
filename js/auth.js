// CanBeFound.com - Authentication System

// Authentication state
let authState = {
    isLoggedIn: false,
    currentUser: null,
    users: [
        {
            id: 'STU001',
            name: 'John Doe',
            email: 'john.doe@college.edu',
            password: 'password123',
            role: 'student',
            collegeId: 'STU001'
        },
        {
            id: 'STU002',
            name: 'Jane Smith',
            email: 'jane.smith@college.edu',
            password: 'password123',
            role: 'student',
            collegeId: 'STU002'
        },
        {
            id: 'FAC001',
            name: 'Dr. Wilson',
            email: 'wilson@college.edu',
            password: 'faculty123',
            role: 'faculty',
            collegeId: 'FAC001'
        },
        {
            id: 'ADMIN',
            name: 'Admin User',
            email: 'admin@college.edu',
            password: 'admin123',
            role: 'admin',
            collegeId: 'ADMIN'
        }
    ]
};

// Initialize authentication
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
    checkAuthStatus();
    updateAuthUI();
});

// Initialize authentication system
function initializeAuth() {
    // Load saved auth state
    loadAuthState();
    
    // Initialize login modal
    initializeLoginModal();
    
    // Initialize signup modal
    initializeSignupModal();
    
    // Initialize logout functionality
    initializeLogout();
    
    console.log('Authentication system initialized');
}

// Load authentication state from localStorage
function loadAuthState() {
    const savedAuth = localStorage.getItem('authState');
    if (savedAuth) {
        try {
            const parsed = JSON.parse(savedAuth);
            authState.isLoggedIn = parsed.isLoggedIn;
            authState.currentUser = parsed.currentUser;
        } catch (e) {
            console.warn('Failed to load auth state:', e);
        }
    }
}

// Save authentication state to localStorage
function saveAuthState() {
    localStorage.setItem('authState', JSON.stringify({
        isLoggedIn: authState.isLoggedIn,
        currentUser: authState.currentUser
    }));
}

// Check authentication status
function checkAuthStatus() {
    // Check if session is still valid (in real app, this would check with server)
    const sessionExpiry = localStorage.getItem('sessionExpiry');
    if (sessionExpiry && new Date() > new Date(sessionExpiry)) {
        logout();
    }
}

// Initialize login modal
function initializeLoginModal() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

// Initialize signup modal
function initializeSignupModal() {
    // Create signup modal if it doesn't exist
    if (!document.getElementById('signupModal')) {
        createSignupModal();
    }
    
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
}

// Create signup modal
function createSignupModal() {
    const signupModalHTML = `
        <div class="modal" id="signupModal" role="dialog" aria-labelledby="signup-title" aria-hidden="true">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="signup-title" class="modal-title">Student Sign Up</h2>
                    <button class="modal-close" aria-label="Close signup modal">&times;</button>
                </div>
                <form class="modal-body" id="signupForm">
                    <div class="form-group">
                        <label for="signupName" class="form-label">Full Name</label>
                        <input type="text" id="signupName" name="name" class="form-input" required>
                        <div class="form-error" id="signupNameError"></div>
                    </div>
                    <div class="form-group">
                        <label for="signupEmail" class="form-label">College Email</label>
                        <input type="email" id="signupEmail" name="email" class="form-input" required 
                               pattern="[a-zA-Z0-9._%+-]+@college\\.edu$">
                        <small class="form-help">Must be a valid college email (@college.edu)</small>
                        <div class="form-error" id="signupEmailError"></div>
                    </div>
                    <div class="form-group">
                        <label for="signupCollegeId" class="form-label">College ID</label>
                        <input type="text" id="signupCollegeId" name="collegeId" class="form-input" required>
                        <div class="form-error" id="signupCollegeIdError"></div>
                    </div>
                    <div class="form-group">
                        <label for="signupPassword" class="form-label">Password</label>
                        <input type="password" id="signupPassword" name="password" class="form-input" required minlength="6">
                        <small class="form-help">Minimum 6 characters</small>
                        <div class="form-error" id="signupPasswordError"></div>
                    </div>
                    <div class="form-group">
                        <label for="confirmPassword" class="form-label">Confirm Password</label>
                        <input type="password" id="confirmPassword" name="confirmPassword" class="form-input" required>
                        <div class="form-error" id="confirmPasswordError"></div>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary btn-full">Sign Up</button>
                        <p class="form-footer">Already have an account? <a href="#" onclick="switchToLogin()">Login here</a></p>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', signupModalHTML);
    
    // Setup modal functionality
    const modal = document.getElementById('signupModal');
    if (window.ModalManager) {
        window.ModalManager.setupModal(modal);
    }
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    
    const form = e.target;
    const collegeId = form.collegeId.value.trim();
    const password = form.password.value;
    
    // Clear previous errors
    clearLoginErrors();
    
    // Validate inputs
    if (!collegeId || !password) {
        showLoginError('Please fill in all fields');
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Logging in...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Find user by college ID or email
        const user = authState.users.find(u => 
            u.collegeId === collegeId || 
            u.email === collegeId ||
            u.email === `${collegeId}@college.edu`
        );
        
        if (user && user.password === password) {
            // Successful login
            authState.isLoggedIn = true;
            authState.currentUser = user;
            
            // Set session expiry (24 hours)
            const expiry = new Date();
            expiry.setHours(expiry.getHours() + 24);
            localStorage.setItem('sessionExpiry', expiry.toISOString());
            
            // Save auth state
            saveAuthState();
            
            // Close modal
            if (window.ModalManager) {
                window.ModalManager.closeModal('loginModal');
            }
            
            // Update UI
            updateAuthUI();
            
            // Show success message
            if (window.CanBeFound) {
                window.CanBeFound.showNotification(`Welcome back, ${user.name}!`, 'success');
            }
            
            // Reset form
            form.reset();
            
        } else {
            showLoginError('Invalid college ID or password');
        }
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
    }, 1000);
}

// Handle signup
function handleSignup(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Clear previous errors
    clearSignupErrors();
    
    // Validate form
    if (!validateSignupForm(data)) {
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Creating Account...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Check if user already exists
        const existingUser = authState.users.find(u => 
            u.email === data.email || u.collegeId === data.collegeId
        );
        
        if (existingUser) {
            showSignupError('signupEmail', 'An account with this email or college ID already exists');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            return;
        }
        
        // Create new user
        const newUser = {
            id: data.collegeId,
            name: data.name,
            email: data.email,
            password: data.password,
            role: 'student',
            collegeId: data.collegeId
        };
        
        // Add to users array (in real app, this would be saved to database)
        authState.users.push(newUser);
        
        // Auto-login the new user
        authState.isLoggedIn = true;
        authState.currentUser = newUser;
        
        // Set session expiry
        const expiry = new Date();
        expiry.setHours(expiry.getHours() + 24);
        localStorage.setItem('sessionExpiry', expiry.toISOString());
        
        // Save auth state
        saveAuthState();
        
        // Close modal
        if (window.ModalManager) {
            window.ModalManager.closeModal('signupModal');
        }
        
        // Update UI
        updateAuthUI();
        
        // Show success message
        if (window.CanBeFound) {
            window.CanBeFound.showNotification(`Welcome to CanBeFound, ${newUser.name}!`, 'success');
        }
        
        // Reset form
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
    }, 1500);
}

// Validate signup form
function validateSignupForm(data) {
    let isValid = true;
    
    // Name validation
    if (!data.name || data.name.length < 2) {
        showSignupError('signupName', 'Name must be at least 2 characters long');
        isValid = false;
    }
    
    // Email validation
    if (!data.email) {
        showSignupError('signupEmail', 'Email is required');
        isValid = false;
    } else if (!data.email.endsWith('@college.edu')) {
        showSignupError('signupEmail', 'Must use a valid college email address (@college.edu)');
        isValid = false;
    }
    
    // College ID validation
    if (!data.collegeId || data.collegeId.length < 3) {
        showSignupError('signupCollegeId', 'College ID must be at least 3 characters long');
        isValid = false;
    }
    
    // Password validation
    if (!data.password || data.password.length < 6) {
        showSignupError('signupPassword', 'Password must be at least 6 characters long');
        isValid = false;
    }
    
    // Confirm password validation
    if (data.password !== data.confirmPassword) {
        showSignupError('confirmPassword', 'Passwords do not match');
        isValid = false;
    }
    
    return isValid;
}

// Show login error
function showLoginError(message) {
    const existingError = document.querySelector('.login-error');
    if (existingError) {
        existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'login-error';
    errorDiv.style.cssText = `
        color: var(--error-color);
        background: rgba(220, 53, 69, 0.1);
        border: 1px solid rgba(220, 53, 69, 0.3);
        padding: var(--spacing-sm) var(--spacing-md);
        border-radius: var(--radius-md);
        margin-bottom: var(--spacing-md);
        font-size: var(--font-size-sm);
        text-align: center;
    `;
    errorDiv.textContent = message;
    
    const loginForm = document.getElementById('loginForm');
    const firstFormGroup = loginForm.querySelector('.form-group');
    loginForm.insertBefore(errorDiv, firstFormGroup);
    
    setTimeout(() => {
        if (errorDiv.parentElement) {
            errorDiv.remove();
        }
    }, 5000);
}

// Clear login errors
function clearLoginErrors() {
    const existingError = document.querySelector('.login-error');
    if (existingError) {
        existingError.remove();
    }
}

// Show signup error
function showSignupError(fieldName, message) {
    const errorElement = document.getElementById(fieldName + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    const field = document.getElementById(fieldName);
    if (field) {
        field.classList.add('error');
    }
}

// Clear signup errors
function clearSignupErrors() {
    const errorElements = document.querySelectorAll('#signupForm .form-error');
    errorElements.forEach(error => {
        error.textContent = '';
        error.style.display = 'none';
    });
    
    const errorFields = document.querySelectorAll('#signupForm .error');
    errorFields.forEach(field => {
        field.classList.remove('error');
    });
}

// Update authentication UI
function updateAuthUI() {
    const loginBtns = document.querySelectorAll('#loginBtn');
    const signupBtns = document.querySelectorAll('#signupBtn');
    
    if (authState.isLoggedIn && authState.currentUser) {
        // Update login buttons to show college ID
        loginBtns.forEach(btn => {
            btn.textContent = authState.currentUser.collegeId;
            btn.onclick = showUserProfile;
            btn.title = `Logged in as ${authState.currentUser.name}`;
        });
        
        // Update signup buttons to logout
        signupBtns.forEach(btn => {
            btn.textContent = 'Logout';
            btn.onclick = logout;
            btn.className = 'btn btn-secondary';
        });
    } else {
        // Reset to default state
        loginBtns.forEach(btn => {
            btn.textContent = 'Login';
            btn.onclick = () => {
                if (window.ModalManager) {
                    window.ModalManager.openModal('loginModal');
                }
            };
            btn.title = '';
        });
        
        signupBtns.forEach(btn => {
            btn.textContent = 'Sign Up';
            btn.onclick = () => {
                if (window.ModalManager) {
                    window.ModalManager.openModal('signupModal');
                }
            };
            btn.className = 'btn btn-primary';
        });
    }
}

// Show user profile (placeholder)
function showUserProfile() {
    if (window.CanBeFound) {
        window.CanBeFound.showNotification(`Logged in as: ${authState.currentUser.name} (${authState.currentUser.collegeId})`, 'info');
    }
}

// Logout function
function logout() {
    authState.isLoggedIn = false;
    authState.currentUser = null;
    
    // Clear localStorage
    localStorage.removeItem('authState');
    localStorage.removeItem('sessionExpiry');
    
    // Update UI
    updateAuthUI();
    
    // Show message
    if (window.CanBeFound) {
        window.CanBeFound.showNotification('You have been logged out successfully', 'info');
    }
}

// Initialize logout functionality
function initializeLogout() {
    // This will be handled by updateAuthUI
}

// Switch between login and signup modals
function switchToLogin() {
    if (window.ModalManager) {
        window.ModalManager.closeModal('signupModal');
        window.ModalManager.openModal('loginModal');
    }
}

function switchToSignup() {
    if (window.ModalManager) {
        window.ModalManager.closeModal('loginModal');
        window.ModalManager.openModal('signupModal');
    }
}

// Check if user is logged in
function isLoggedIn() {
    return authState.isLoggedIn;
}

// Get current user
function getCurrentUser() {
    return authState.currentUser;
}

// Check if user has specific role
function hasRole(role) {
    return authState.currentUser && authState.currentUser.role === role;
}

// Export auth functions
window.Auth = {
    isLoggedIn,
    getCurrentUser,
    hasRole,
    logout,
    switchToLogin,
    switchToSignup,
    updateAuthUI
};