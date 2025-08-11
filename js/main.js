// CanBeFound.com - Main JavaScript

// Global variables
let currentUser = null;
let isLoggedIn = false;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    // Initialize navigation
    initializeNavigation();
    
    // Initialize modals
    initializeModals();
    
    // Initialize back to top button
    initializeBackToTop();
    
    // Initialize stats counter animation
    initializeStatsCounter();
    
    // Load recent items on homepage
    if (document.getElementById('recentItemsGrid')) {
        loadRecentItems();
    }
    
    // Initialize search functionality
    if (document.getElementById('searchInput')) {
        initializeSearch();
    }
    
    // Initialize authentication will be handled by auth.js
    
    console.log('CanBeFound.com initialized successfully');
}

// Navigation functionality
function initializeNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            const isActive = navMenu.classList.contains('active');
            
            if (isActive) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            } else {
                navMenu.classList.add('active');
                navToggle.classList.add('active');
                navToggle.setAttribute('aria-expanded', 'true');
                document.body.style.overflow = 'hidden';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }
}

// Modal functionality
function initializeModals() {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const loginModal = document.getElementById('loginModal');
    
    if (loginBtn && loginModal) {
        loginBtn.addEventListener('click', function() {
            openModal('loginModal');
        });
    }
    
    if (signupBtn) {
        signupBtn.addEventListener('click', function() {
            // For now, just show login modal
            openModal('loginModal');
        });
    }
    
    // Close modal functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-close') || e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
    
    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

// Open modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Focus first input
        const firstInput = modal.querySelector('input, button, textarea, select');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}

// Close all modals
function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    });
    document.body.style.overflow = '';
}

// Back to top button
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.display = 'flex';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });
        
        // Scroll to top when clicked
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Stats counter animation
function initializeStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    
    if (statNumbers.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        statNumbers.forEach(stat => observer.observe(stat));
    }
}

// Animate counter
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// Load recent items (mock data)
function loadRecentItems() {
    const container = document.getElementById('recentItemsGrid');
    if (!container) return;
    
    // Mock data for recent items
    const recentItems = [
        {
            id: 1,
            title: 'iPhone 13 Pro',
            category: 'Electronics',
            status: 'lost',
            location: 'Library',
            date: '2025-01-15',
            image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=300'
        },
        {
            id: 2,
            title: 'Black Backpack',
            category: 'Bags',
            status: 'found',
            location: 'Cafeteria',
            date: '2025-01-14',
            image: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=300'
        },
        {
            id: 3,
            title: 'Silver Watch',
            category: 'Jewelry',
            status: 'found',
            location: 'Gymnasium',
            date: '2025-01-13',
            image: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=300'
        },
        {
            id: 4,
            title: 'Blue Notebook',
            category: 'Books',
            status: 'lost',
            location: 'Classroom',
            date: '2025-01-12',
            image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=300'
        }
    ];
    
    container.innerHTML = recentItems.map(item => createItemCard(item)).join('');
}

// Create item card HTML
function createItemCard(item) {
    const statusClass = item.status === 'lost' ? 'lost' : 'found';
    const statusText = item.status === 'lost' ? 'Lost' : 'Found';
    
    return `
        <div class="item-card" onclick="openItemModal(${item.id})">
            <div class="item-image">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
                <div class="item-status ${statusClass}">${statusText}</div>
            </div>
            <div class="item-content">
                <h3 class="item-title">${item.title}</h3>
                <div class="item-category">${item.category}</div>
                <div class="item-meta">
                    <div class="item-location">
                        <span>📍</span>
                        <span>${item.location}</span>
                    </div>
                    <div class="item-date">
                        <span>📅</span>
                        <span>${formatDate(item.date)}</span>
                    </div>
                </div>
                <div class="item-actions">
                    <button class="claim-btn" onclick="event.stopPropagation(); claimItem(${item.id})">
                        ${item.status === 'lost' ? 'I Found This' : 'This is Mine'}
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
}

// Open item modal
function openItemModal(itemId) {
    // This would typically fetch item details from an API
    console.log('Opening item modal for ID:', itemId);
    // For now, just show an alert
    alert('Item details modal would open here');
}

// Claim item
function claimItem(itemId) {
    if (!window.Auth?.isLoggedIn()) {
        if (window.ModalManager) {
            window.ModalManager.openModal('loginModal');
        }
        return;
    }
    
    // Use enhanced claim functionality if available
    if (window.enhancedClaimItem) {
        window.enhancedClaimItem(itemId);
    } else {
        console.log('Claiming item ID:', itemId);
        if (window.CanBeFound) {
            window.CanBeFound.showNotification('Claim process started. Please provide verification details.', 'info');
        }
    }
}

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

// Perform search
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    
    if (query) {
        // Redirect to search page with query
        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    }
}

// Utility functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions for use in other files
window.CanBeFound = {
    openModal,
    closeAllModals,
    showNotification,
    debounce,
    formatDate,
    isLoggedIn: () => window.Auth?.isLoggedIn() || false,
    getCurrentUser: () => window.Auth?.getCurrentUser() || null
};