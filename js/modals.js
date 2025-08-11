// CanBeFound.com - Modal Management

// Modal state management
let activeModal = null;
let previousFocus = null;

// Initialize modal functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeModals();
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');

    if (loginBtn) {
        loginBtn.addEventListener('click', () => openModal('loginModal'));
    }
    if (signupBtn) {
        signupBtn.addEventListener('click', () => {
            // TODO: create signupModal in HTML
            openModal('signupModal');
        });
    }
});



// Initialize all modals
function initializeModals() {
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        setupModal(modal);
    });
    
    // Initialize login form
    initializeLoginForm();
    
    console.log('Modal system initialized');
}

// Setup individual modal
function setupModal(modal) {
    const modalId = modal.id;
    const closeButtons = modal.querySelectorAll('.modal-close');
    
    // Close button functionality
    closeButtons.forEach(button => {
        button.addEventListener('click', () => closeModal(modalId));
    });
    
    // Close on backdrop click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal(modalId);
        }
    });
    
    // Prevent modal content clicks from closing modal
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
}

// Open modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) {
        console.error(`Modal with ID "${modalId}" not found`);
        return;
    }
    
    // Close any currently active modal
    if (activeModal) {
        closeModal(activeModal);
    }
    
    // Store previous focus
    previousFocus = document.activeElement;
    
    // Show modal
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    activeModal = modalId;
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Focus management
    setTimeout(() => {
        const firstFocusable = modal.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (firstFocusable) {
            firstFocusable.focus();
        }
    }, 100);
    
    // Announce to screen readers
    if (window.Accessibility) {
        const modalTitle = modal.querySelector('.modal-title');
        const title = modalTitle ? modalTitle.textContent : 'Modal opened';
        window.Accessibility.announceToScreenReader(title);
    }
    
    // Trigger custom event
    modal.dispatchEvent(new CustomEvent('modalOpened', {
        detail: { modalId }
    }));
}

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    // Hide modal
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Restore focus
    if (previousFocus) {
        previousFocus.focus();
        previousFocus = null;
    }
    
    // Clear active modal
    if (activeModal === modalId) {
        activeModal = null;
    }
    
    // Announce to screen readers
    if (window.Accessibility) {
        window.Accessibility.announceToScreenReader('Modal closed');
    }
    
    // Trigger custom event
    modal.dispatchEvent(new CustomEvent('modalClosed', {
        detail: { modalId }
    }));
}

// Close all modals
function closeAllModals() {
    const activeModals = document.querySelectorAll('.modal.active');
    activeModals.forEach(modal => {
        closeModal(modal.id);
    });
}

// Initialize login form
function initializeLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });
}

// Handle login
function handleLogin() {
    const collegeId = document.getElementById('collegeId').value;
    const password = document.getElementById('password').value;
    
    // Basic validation
    if (!collegeId || !password) {
        showFormError('Please fill in all fields');
        return;
    }
    
    // Show loading state
    const submitBtn = document.querySelector('#loginForm button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Logging in...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Mock successful login
        //const userData = {
          //  id: collegeId,
            //name: 'John Doe',
            //email: `${collegeId}@college.edu`,
            //role: 'student'
        //};
        
        // Store auth data
        localStorage.setItem('authToken', 'mock-token-' + Date.now());
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        // Close modal
        closeModal('loginModal');
        
        // Show success message
        if (window.CanBeFound) {
            window.CanBeFound.showNotification('Login successful! Welcome back.', 'success');
        }
        
        // Reload page to update UI
        setTimeout(() => {
            window.location.reload();
        }, 1000);
        
    }, 1500);
}

// Show form error
function showFormError(message) {
    // Remove existing error
    const existingError = document.querySelector('.login-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error element
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
    
    // Insert error
    const loginForm = document.getElementById('loginForm');
    const firstFormGroup = loginForm.querySelector('.form-group');
    loginForm.insertBefore(errorDiv, firstFormGroup);
    
    // Announce error to screen readers
    if (window.Accessibility) {
        window.Accessibility.announceToScreenReader(`Error: ${message}`);
    }
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentElement) {
            errorDiv.remove();
        }
    }, 5000);
}

// Item detail modal
function openItemModal(itemId) {
    // Create or get item modal
    let itemModal = document.getElementById('itemModal');
    if (!itemModal) {
        createItemModal();
        itemModal = document.getElementById('itemModal');
    }
    
    // Load item data (mock)
    loadItemDetails(itemId);
    
    // Open modal
    openModal('itemModal');
}

// Create item modal
function createItemModal() {
    const modalHTML = `
        <div class="modal" id="itemModal" role="dialog" aria-labelledby="item-title" aria-hidden="true">
            <div class="modal-content large">
                <div class="modal-header">
                    <h2 id="item-title" class="modal-title">Item Details</h2>
                    <button class="modal-close" aria-label="Close item details">&times;</button>
                </div>
                <div class="modal-body" id="itemModalBody">
                    <!-- Item details will be loaded here -->
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Setup the new modal
    const modal = document.getElementById('itemModal');
    setupModal(modal);
}

// Load item details
function loadItemDetails(itemId) {
    const modalBody = document.getElementById('itemModalBody');
    if (!modalBody) return;
    
    // Show loading state
    modalBody.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <span>Loading item details...</span>
        </div>
    `;
    
    // Mock item data
    setTimeout(() => {
        const itemData = {
            id: itemId,
            title: 'iPhone 13 Pro',
            category: 'Electronics',
            status: 'lost',
            description: 'Black iPhone 13 Pro with a blue case. Has a small scratch on the back. Contains important photos and contacts.',
            location: 'Library - 2nd Floor Study Area',
            date: '2025-01-15',
            time: '14:30',
            reportedBy: 'Anonymous',
            image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400'
        };
        
        modalBody.innerHTML = createItemDetailHTML(itemData);
        
        // Setup claim button
        const claimBtn = modalBody.querySelector('.claim-btn');
        if (claimBtn) {
            claimBtn.addEventListener('click', () => {
                closeModal('itemModal');
                if (window.CanBeFound && !window.CanBeFound.isLoggedIn()) {
                    openModal('loginModal');
                } else {
                    startClaimProcess(itemId);
                }
            });
        }
    }, 800);
}

// Create item detail HTML
function createItemDetailHTML(item) {
    const statusClass = item.status === 'lost' ? 'lost' : 'found';
    const statusText = item.status === 'lost' ? 'Lost' : 'Found';
    const actionText = item.status === 'lost' ? 'I Found This Item' : 'This Is My Item';
    
    return `
        <div class="item-detail-header">
            <div class="item-detail-image">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
            </div>
            <div class="item-detail-info">
                <h3 class="item-detail-title">${item.title}</h3>
                <div class="item-status ${statusClass}">${statusText}</div>
                <div class="item-detail-meta">
                    <div class="meta-item">
                        <div class="meta-label">Category</div>
                        <div class="meta-value">${item.category}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">Location</div>
                        <div class="meta-value">${item.location}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">Date</div>
                        <div class="meta-value">${window.CanBeFound?.formatDate(item.date) || item.date}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">Time</div>
                        <div class="meta-value">${item.time}</div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="item-detail-description">
            <h4>Description</h4>
            <p>${item.description}</p>
        </div>
        
        <div class="item-detail-actions">
            <button class="btn btn-primary claim-btn">${actionText}</button>
            <button class="btn btn-secondary" onclick="closeModal('itemModal')">Close</button>
        </div>
    `;
}

// Start claim process
function startClaimProcess(itemId) {
    if (window.CanBeFound) {
        window.CanBeFound.showNotification('Claim process started. You will be contacted for verification.', 'info');
    }
    console.log('Starting claim process for item:', itemId);
}

// Keyboard event handling
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && activeModal) {
        closeModal(activeModal);
    }
    
    // Tab trapping in modals
    if (e.key === 'Tab' && activeModal) {
        const modal = document.getElementById(activeModal);
        if (modal) {
            trapFocus(e, modal);
        }
    }
});

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

// Export modal functions
window.ModalManager = {
    openModal,
    closeModal,
    closeAllModals,
    openItemModal,
    getActiveModal: () => activeModal
};