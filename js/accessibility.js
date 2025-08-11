// CanBeFound.com - Accessibility Features

// Accessibility state
let accessibilityState = {
    colorblindMode: false,
    largeText: false,
    highContrast: false,
    darkMode: 'auto' // 'auto', 'light', 'dark'
};

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', function() {
    initializeAccessibilityFeatures();
    loadAccessibilityPreferences();
});

// Initialize accessibility features
function initializeAccessibilityFeatures() {
    const colorblindToggle = document.getElementById('colorblindToggle');
    const fontSizeToggle = document.getElementById('fontSizeToggle');
    const highContrastToggle = document.getElementById('highContrastToggle');
    
    if (colorblindToggle) {
        colorblindToggle.addEventListener('click', toggleColorblindMode);
    }
    
    if (fontSizeToggle) {
        fontSizeToggle.addEventListener('click', toggleLargeText);
    }
    
    if (highContrastToggle) {
        highContrastToggle.addEventListener('click', toggleHighContrast);
    }
    
    // Add dark mode toggle
    addDarkModeToggle();
    
    // Keyboard navigation improvements
    initializeKeyboardNavigation();
    
    // Focus management
    initializeFocusManagement();
    
    // Screen reader announcements
    initializeScreenReaderSupport();
    
    console.log('Accessibility features initialized');
}

// Add dark mode toggle to toolbar
function addDarkModeToggle() {
    const toolbar = document.querySelector('.toolbar-content');
    if (toolbar) {
        const darkModeBtn = document.createElement('button');
        darkModeBtn.className = 'toolbar-btn';
        darkModeBtn.id = 'darkModeToggle';
        darkModeBtn.setAttribute('aria-label', 'Toggle dark mode');
        darkModeBtn.innerHTML = `
            <span class="btn-icon">🌙</span>
            <span class="btn-text">Dark Mode</span>
        `;
        darkModeBtn.addEventListener('click', toggleDarkMode);
        toolbar.appendChild(darkModeBtn);
    }
}

// Toggle dark mode
function toggleDarkMode() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    let newTheme;
    
    if (currentTheme === 'dark') {
        newTheme = 'light';
        accessibilityState.darkMode = 'light';
        updateToggleState('darkModeToggle', false);
        announceToScreenReader('Light mode enabled');
    } else {
        newTheme = 'dark';
        accessibilityState.darkMode = 'dark';
        updateToggleState('darkModeToggle', true);
        announceToScreenReader('Dark mode enabled');
    }
    
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Update dark mode button icon
    const darkModeBtn = document.getElementById('darkModeToggle');
    if (darkModeBtn) {
        const icon = darkModeBtn.querySelector('.btn-icon');
        if (icon) {
            icon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        }
    }
    
    saveAccessibilityPreferences();
}

// Toggle colorblind-friendly mode
function toggleColorblindMode() {
    accessibilityState.colorblindMode = !accessibilityState.colorblindMode;
    
    if (accessibilityState.colorblindMode) {
        document.body.classList.add('colorblind-mode');
        updateToggleState('colorblindToggle', true);
        announceToScreenReader('Colorblind-friendly mode enabled');
    } else {
        document.body.classList.remove('colorblind-mode');
        updateToggleState('colorblindToggle', false);
        announceToScreenReader('Colorblind-friendly mode disabled');
    }
    
    saveAccessibilityPreferences();
}

// Toggle large text mode
function toggleLargeText() {
    accessibilityState.largeText = !accessibilityState.largeText;
    
    if (accessibilityState.largeText) {
        document.body.classList.add('large-text-mode');
        updateToggleState('fontSizeToggle', true);
        announceToScreenReader('Large text mode enabled');
    } else {
        document.body.classList.remove('large-text-mode');
        updateToggleState('fontSizeToggle', false);
        announceToScreenReader('Large text mode disabled');
    }
    
    saveAccessibilityPreferences();
}

// Toggle high contrast mode
function toggleHighContrast() {
    accessibilityState.highContrast = !accessibilityState.highContrast;
    
    if (accessibilityState.highContrast) {
        document.body.classList.add('high-contrast-mode');
        updateToggleState('highContrastToggle', true);
        announceToScreenReader('High contrast mode enabled');
    } else {
        document.body.classList.remove('high-contrast-mode');
        updateToggleState('highContrastToggle', false);
        announceToScreenReader('High contrast mode disabled');
    }
    
    saveAccessibilityPreferences();
}

// Update toggle button state
function updateToggleState(buttonId, isActive) {
    const button = document.getElementById(buttonId);
    if (button) {
        if (isActive) {
            button.classList.add('active');
            button.setAttribute('aria-pressed', 'true');
        } else {
            button.classList.remove('active');
            button.setAttribute('aria-pressed', 'false');
        }
    }
}

// Initialize keyboard navigation
function initializeKeyboardNavigation() {
    // Skip links
    const skipLinks = document.querySelectorAll('.skip-link');
    skipLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                target.focus();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Escape key handling for modals and menus
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close any open modals
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                window.CanBeFound?.closeAllModals();
                return;
            }
            
            // Close mobile menu
            const activeMenu = document.querySelector('.nav-menu.active');
            if (activeMenu) {
                const navToggle = document.getElementById('navToggle');
                if (navToggle) {
                    navToggle.click();
                }
                return;
            }
        }
        
        // Tab trapping in modals
        if (e.key === 'Tab') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                trapFocus(e, activeModal);
            }
        }
    });
    
    // Arrow key navigation for menus
    initializeArrowKeyNavigation();
}

// Trap focus within modal
function trapFocus(e, container) {
    const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey) {
        if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        }
    } else {
        if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }
}

// Initialize arrow key navigation
function initializeArrowKeyNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach((link, index) => {
        link.addEventListener('keydown', function(e) {
            let targetIndex;
            
            switch (e.key) {
                case 'ArrowDown':
                case 'ArrowRight':
                    e.preventDefault();
                    targetIndex = (index + 1) % navLinks.length;
                    navLinks[targetIndex].focus();
                    break;
                    
                case 'ArrowUp':
                case 'ArrowLeft':
                    e.preventDefault();
                    targetIndex = (index - 1 + navLinks.length) % navLinks.length;
                    navLinks[targetIndex].focus();
                    break;
                    
                case 'Home':
                    e.preventDefault();
                    navLinks[0].focus();
                    break;
                    
                case 'End':
                    e.preventDefault();
                    navLinks[navLinks.length - 1].focus();
                    break;
            }
        });
    });
}

// Initialize focus management
function initializeFocusManagement() {
    // Focus visible elements
    const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.classList.add('focus-visible');
        });
        
        element.addEventListener('blur', function() {
            this.classList.remove('focus-visible');
        });
        
        // Only show focus outline for keyboard navigation
        element.addEventListener('mousedown', function() {
            this.classList.add('mouse-focus');
        });
        
        element.addEventListener('keydown', function() {
            this.classList.remove('mouse-focus');
        });
    });
    
    // Manage focus for dynamic content
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const focusableElements = node.querySelectorAll(
                            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                        );
                        
                        focusableElements.forEach(element => {
                            element.addEventListener('focus', function() {
                                this.classList.add('focus-visible');
                            });
                            
                            element.addEventListener('blur', function() {
                                this.classList.remove('focus-visible');
                            });
                        });
                    }
                });
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Initialize screen reader support
function initializeScreenReaderSupport() {
    // Create live region for announcements
    const liveRegion = document.createElement('div');
    liveRegion.id = 'live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);
    
    // Announce page changes
    const pageTitle = document.title;
    setTimeout(() => {
        announceToScreenReader(`Page loaded: ${pageTitle}`);
    }, 1000);
    
    // Announce form errors
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const errors = form.querySelectorAll('.form-error:not(:empty)');
            if (errors.length > 0) {
                announceToScreenReader(`Form has ${errors.length} error${errors.length > 1 ? 's' : ''}`);
            }
        });
    });
}

// Announce message to screen readers
function announceToScreenReader(message) {
    const liveRegion = document.getElementById('live-region');
    if (liveRegion) {
        liveRegion.textContent = message;
        
        // Clear after announcement
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 1000);
    }
}

// Save accessibility preferences
function saveAccessibilityPreferences() {
    localStorage.setItem('accessibilityPreferences', JSON.stringify(accessibilityState));
}

// Load accessibility preferences
function loadAccessibilityPreferences() {
    const saved = localStorage.getItem('accessibilityPreferences');
    if (saved) {
        try {
            const preferences = JSON.parse(saved);
            
            if (preferences.colorblindMode) {
                toggleColorblindMode();
            }
            
            if (preferences.largeText) {
                toggleLargeText();
            }
            
            if (preferences.highContrast) {
                toggleHighContrast();
            }
            
            if (preferences.darkMode && preferences.darkMode !== 'auto') {
                accessibilityState.darkMode = preferences.darkMode;
                document.documentElement.setAttribute('data-theme', preferences.darkMode);
                updateToggleState('darkModeToggle', preferences.darkMode === 'dark');
                
                // Update dark mode button icon
                const darkModeBtn = document.getElementById('darkModeToggle');
                if (darkModeBtn) {
                    const icon = darkModeBtn.querySelector('.btn-icon');
                    if (icon) {
                        icon.textContent = preferences.darkMode === 'dark' ? '☀️' : '🌙';
                    }
                }
            }
        } catch (e) {
            console.warn('Failed to load accessibility preferences:', e);
        }
    }
    
    // Also check for system preferences
    checkSystemPreferences();
}

// Check system accessibility preferences
function checkSystemPreferences() {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.body.classList.add('reduced-motion');
        announceToScreenReader('Reduced motion mode detected and enabled');
    }
    
    // Check for high contrast preference
    if (window.matchMedia('(prefers-contrast: high)').matches && !accessibilityState.highContrast) {
        toggleHighContrast();
    }
    
    // Check for dark mode preference (only if user hasn't set a preference)
    if (accessibilityState.darkMode === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            updateToggleState('darkModeToggle', true);
            const darkModeBtn = document.getElementById('darkModeToggle');
            if (darkModeBtn) {
                const icon = darkModeBtn.querySelector('.btn-icon');
                if (icon) {
                    icon.textContent = '☀️';
                }
            }
        }
    }
    
    // Listen for changes in system preferences
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', function(e) {
        if (e.matches) {
            document.body.classList.add('reduced-motion');
            announceToScreenReader('Reduced motion mode enabled');
        } else {
            document.body.classList.remove('reduced-motion');
            announceToScreenReader('Reduced motion mode disabled');
        }
    });
    
    window.matchMedia('(prefers-contrast: high)').addEventListener('change', function(e) {
        if (e.matches && !accessibilityState.highContrast) {
            toggleHighContrast();
        }
    });
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        // Only auto-switch if user hasn't set a preference
        if (accessibilityState.darkMode === 'auto') {
            const prefersDark = e.matches;
            updateToggleState('darkModeToggle', prefersDark);
            
            const darkModeBtn = document.getElementById('darkModeToggle');
            if (darkModeBtn) {
                const icon = darkModeBtn.querySelector('.btn-icon');
                if (icon) {
                    icon.textContent = prefersDark ? '☀️' : '🌙';
                }
            }
        }
    });
}

// Improve form accessibility
function improveFormAccessibility() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Associate labels with inputs
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            const label = form.querySelector(`label[for="${input.id}"]`);
            if (!label && input.id) {
                // Try to find label by proximity
                const possibleLabel = input.previousElementSibling;
                if (possibleLabel && possibleLabel.tagName === 'LABEL') {
                    possibleLabel.setAttribute('for', input.id);
                }
            }
        });
        
        // Add required field indicators
        const requiredInputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        requiredInputs.forEach(input => {
            input.setAttribute('aria-required', 'true');
            
            const label = form.querySelector(`label[for="${input.id}"]`);
            if (label && !label.querySelector('.required-indicator')) {
                const indicator = document.createElement('span');
                indicator.className = 'required-indicator';
                indicator.textContent = ' *';
                indicator.setAttribute('aria-label', 'required');
                label.appendChild(indicator);
            }
        });
        
        // Improve error messaging
        const errorElements = form.querySelectorAll('.form-error');
        errorElements.forEach(error => {
            const input = error.previousElementSibling;
            if (input && input.tagName !== 'LABEL') {
                const errorId = `error-${input.id || Math.random().toString(36).substr(2, 9)}`;
                error.id = errorId;
                input.setAttribute('aria-describedby', errorId);
            }
        });
    });
}

// Initialize form accessibility improvements
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(improveFormAccessibility, 100);
});

// Export accessibility functions
window.Accessibility = {
    announceToScreenReader,
    toggleColorblindMode,
    toggleLargeText,
    toggleHighContrast,
    toggleDarkMode,
    getState: () => accessibilityState
};