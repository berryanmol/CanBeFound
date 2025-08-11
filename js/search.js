// CanBeFound.com - Search Functionality

// Search state
let searchState = {
    query: '',
    filters: {
        status: '',
        category: '',
        location: '',
        date: ''
    },
    sort: 'newest',
    view: 'grid',
    currentPage: 1,
    itemsPerPage: 12,
    totalItems: 0,
    items: []
};

// Initialize search functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
    loadInitialData();
});

// Initialize search components
function initializeSearch() {
    // Search input and button
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Debounced search as user types
        searchInput.addEventListener('input', window.CanBeFound?.debounce(performSearch, 500));
    }
    
    // Filter toggle
    const filterToggle = document.getElementById('filterToggle');
    const filtersPanel = document.getElementById('filtersPanel');
    
    if (filterToggle && filtersPanel) {
        filterToggle.addEventListener('click', function() {
            const isActive = filtersPanel.classList.contains('active');
            
            if (isActive) {
                filtersPanel.classList.remove('active');
                filterToggle.classList.remove('active');
            } else {
                filtersPanel.classList.add('active');
                filterToggle.classList.add('active');
            }
        });
    }
    
    // Filter controls
    initializeFilters();
    
    // View toggle
    initializeViewToggle();
    
    // Sort controls
    initializeSortControls();
    
    // Load URL parameters
    loadURLParameters();
    
    console.log('Search functionality initialized');
}

// Initialize filters
function initializeFilters() {
    const statusFilter = document.getElementById('statusFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const locationFilter = document.getElementById('locationFilter');
    const dateFilter = document.getElementById('dateFilter');
    const clearFilters = document.getElementById('clearFilters');
    const applyFilters = document.getElementById('applyFilters');
    
    // Filter change handlers
    [statusFilter, categoryFilter, locationFilter, dateFilter].forEach(filter => {
        if (filter) {
            filter.addEventListener('change', updateFilters);
        }
    });
    
    // Clear filters
    if (clearFilters) {
        clearFilters.addEventListener('click', function() {
            searchState.filters = {
                status: '',
                category: '',
                location: '',
                date: ''
            };
            
            // Reset filter UI
            if (statusFilter) statusFilter.value = '';
            if (categoryFilter) categoryFilter.value = '';
            if (locationFilter) locationFilter.value = '';
            if (dateFilter) dateFilter.value = '';
            
            performSearch();
        });
    }
    
    // Apply filters
    if (applyFilters) {
        applyFilters.addEventListener('click', performSearch);
    }
}

// Update filters
function updateFilters() {
    const statusFilter = document.getElementById('statusFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const locationFilter = document.getElementById('locationFilter');
    const dateFilter = document.getElementById('dateFilter');
    
    searchState.filters = {
        status: statusFilter?.value || '',
        category: categoryFilter?.value || '',
        location: locationFilter?.value || '',
        date: dateFilter?.value || ''
    };
    
    searchState.currentPage = 1; // Reset to first page
}

// Initialize view toggle
function initializeViewToggle() {
    const viewBtns = document.querySelectorAll('.view-btn');
    const itemsContainer = document.getElementById('itemsContainer');
    
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.getAttribute('data-view');
            
            // Update active state
            viewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update container class
            if (itemsContainer) {
                itemsContainer.className = `items-container ${view}-view`;
            }
            
            searchState.view = view;
            
            // Announce to screen readers
            if (window.Accessibility) {
                window.Accessibility.announceToScreenReader(`Switched to ${view} view`);
            }
        });
    });
}

// Initialize sort controls
function initializeSortControls() {
    const sortSelect = document.getElementById('sortSelect');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            searchState.sort = this.value;
            searchState.currentPage = 1; // Reset to first page
            performSearch();
        });
    }
}

// Load URL parameters
function loadURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    
    if (query) {
        searchState.query = query;
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = query;
        }
    }
}

// Load initial data
function loadInitialData() {
    // Generate mock data
    generateMockData();
    
    // Perform initial search
    performSearch();
}

// Generate mock data
function generateMockData() {
    const mockItems = [
        {
            id: 1,
            title: 'iPhone 13 Pro',
            category: 'electronics',
            status: 'lost',
            location: 'library',
            date: '2025-01-15',
            description: 'Black iPhone 13 Pro with blue case',
            image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=300',
            reportedBy: 'John Doe'
        },
        {
            id: 2,
            title: 'Black Backpack',
            category: 'bags',
            status: 'found',
            location: 'cafeteria',
            date: '2025-01-14',
            description: 'Large black backpack with laptop compartment',
            image: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=300',
            reportedBy: 'Jane Smith'
        },
        {
            id: 3,
            title: 'Silver Watch',
            category: 'jewelry',
            status: 'found',
            location: 'gym',
            date: '2025-01-13',
            description: 'Silver digital watch with black strap',
            image: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=300',
            reportedBy: 'Mike Johnson'
        },
        {
            id: 4,
            title: 'Blue Notebook',
            category: 'books',
            status: 'lost',
            location: 'classroom',
            date: '2025-01-12',
            description: 'Blue spiral notebook with physics notes',
            image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=300',
            reportedBy: 'Sarah Wilson'
        },
        {
            id: 5,
            title: 'Red Jacket',
            category: 'clothing',
            status: 'found',
            location: 'auditorium',
            date: '2025-01-11',
            description: 'Red winter jacket, size medium',
            image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300',
            reportedBy: 'Tom Brown'
        },
        {
            id: 6,
            title: 'Car Keys',
            category: 'keys',
            status: 'lost',
            location: 'parking',
            date: '2025-01-10',
            description: 'Toyota car keys with blue keychain',
            image: 'https://images.pexels.com/photos/97080/pexels-photo-97080.jpeg?auto=compress&cs=tinysrgb&w=300',
            reportedBy: 'Lisa Davis'
        }
    ];
    
    // Add more items for pagination testing
    for (let i = 7; i <= 30; i++) {
        const categories = ['electronics', 'bags', 'books', 'clothing', 'jewelry', 'keys'];
        const statuses = ['lost', 'found'];
        const locations = ['library', 'cafeteria', 'gym', 'classroom', 'auditorium', 'parking'];
        
        mockItems.push({
            id: i,
            title: `Item ${i}`,
            category: categories[Math.floor(Math.random() * categories.length)],
            status: statuses[Math.floor(Math.random() * statuses.length)],
            location: locations[Math.floor(Math.random() * locations.length)],
            date: new Date(2025, 0, Math.floor(Math.random() * 15) + 1).toISOString().split('T')[0],
            description: `Description for item ${i}`,
            image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300',
            reportedBy: `User ${i}`
        });
    }
    
    searchState.items = mockItems;
    searchState.totalItems = mockItems.length;
}

// Perform search
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchState.query = searchInput.value.trim();
    }
    
    // Update filters
    updateFilters();
    
    // Show loading state
    showLoadingState();
    
    // Simulate API delay
    setTimeout(() => {
        const filteredItems = filterItems();
        const sortedItems = sortItems(filteredItems);
        const paginatedItems = paginateItems(sortedItems);
        
        displayItems(paginatedItems);
        updateResultsInfo(filteredItems.length);
        
        // Update URL
        updateURL();
        
    }, 500);
}

// Filter items
function filterItems() {
    let filtered = [...searchState.items];
    
    // Text search
    if (searchState.query) {
        const query = searchState.query.toLowerCase();
        filtered = filtered.filter(item => 
            item.title.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query)
        );
    }
    
    // Status filter
    if (searchState.filters.status) {
        filtered = filtered.filter(item => item.status === searchState.filters.status);
    }
    
    // Category filter
    if (searchState.filters.category) {
        filtered = filtered.filter(item => item.category === searchState.filters.category);
    }
    
    // Location filter
    if (searchState.filters.location) {
        filtered = filtered.filter(item => item.location === searchState.filters.location);
    }
    
    // Date filter
    if (searchState.filters.date) {
        const now = new Date();
        const filterDate = new Date();
        
        switch (searchState.filters.date) {
            case 'today':
                filterDate.setHours(0, 0, 0, 0);
                filtered = filtered.filter(item => new Date(item.date) >= filterDate);
                break;
            case 'week':
                filterDate.setDate(filterDate.getDate() - 7);
                filtered = filtered.filter(item => new Date(item.date) >= filterDate);
                break;
            case 'month':
                filterDate.setMonth(filterDate.getMonth() - 1);
                filtered = filtered.filter(item => new Date(item.date) >= filterDate);
                break;
        }
    }
    
    return filtered;
}

// Sort items
function sortItems(items) {
    const sorted = [...items];
    
    switch (searchState.sort) {
        case 'newest':
            sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'oldest':
            sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'status':
            sorted.sort((a, b) => a.status.localeCompare(b.status));
            break;
        case 'category':
            sorted.sort((a, b) => a.category.localeCompare(b.category));
            break;
    }
    
    return sorted;
}

// Paginate items
function paginateItems(items) {
    const startIndex = (searchState.currentPage - 1) * searchState.itemsPerPage;
    const endIndex = startIndex + searchState.itemsPerPage;
    return items.slice(startIndex, endIndex);
}

// Display items
function displayItems(items) {
    const container = document.getElementById('itemsContainer');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const noResults = document.getElementById('noResults');
    
    if (!container) return;
    
    // Hide loading and no results
    if (loadingSpinner) loadingSpinner.style.display = 'none';
    if (noResults) noResults.style.display = 'none';
    
    if (items.length === 0) {
        container.innerHTML = '';
        if (noResults) noResults.style.display = 'block';
        return;
    }
    
    // Generate HTML for items
    const itemsHTML = items.map(item => createItemHTML(item)).join('');
    container.innerHTML = itemsHTML;
    
    // Add click handlers
    items.forEach(item => {
        const itemElement = container.querySelector(`[data-item-id="${item.id}"]`);
        if (itemElement) {
            itemElement.addEventListener('click', () => openItemModal(item));
        }
    });
}

// Create item HTML
function createItemHTML(item) {
    const statusClass = item.status === 'lost' ? 'lost' : 'found';
    const statusText = item.status === 'lost' ? 'Lost' : 'Found';
    const actionText = item.status === 'lost' ? 'I Found This' : 'This is Mine';
    const categoryText = item.category.charAt(0).toUpperCase() + item.category.slice(1);
    const locationText = item.location.charAt(0).toUpperCase() + item.location.slice(1);
    
    return `
        <div class="item-card" data-item-id="${item.id}">
            <div class="item-image">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
                <div class="item-status ${statusClass}">${statusText}</div>
            </div>
            <div class="item-content">
                <h3 class="item-title">${item.title}</h3>
                <div class="item-category">${categoryText}</div>
                <p class="item-description">${item.description}</p>
                <div class="item-meta">
                    <div class="item-location">
                        <span>📍</span>
                        <span>${locationText}</span>
                    </div>
                    <div class="item-date">
                        <span>📅</span>
                        <span>${window.CanBeFound?.formatDate(item.date) || item.date}</span>
                    </div>
                </div>
                <div class="item-actions">
                    <button class="claim-btn" onclick="event.stopPropagation(); claimItem(${item.id})">
                        ${actionText}
                    </button>
                    <button class="view-btn-item" onclick="event.stopPropagation(); openItemModal(${item.id})">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Show loading state
function showLoadingState() {
    const container = document.getElementById('itemsContainer');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const noResults = document.getElementById('noResults');
    
    if (container) container.innerHTML = '';
    if (loadingSpinner) loadingSpinner.style.display = 'flex';
    if (noResults) noResults.style.display = 'none';
}

// Update results info
function updateResultsInfo(totalResults) {
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        const startItem = (searchState.currentPage - 1) * searchState.itemsPerPage + 1;
        const endItem = Math.min(startItem + searchState.itemsPerPage - 1, totalResults);
        
        if (totalResults === 0) {
            resultsCount.textContent = 'No items found';
        } else {
            resultsCount.textContent = `Showing ${startItem}-${endItem} of ${totalResults} items`;
        }
    }
}

// Update URL with search parameters
function updateURL() {
    const params = new URLSearchParams();
    
    if (searchState.query) {
        params.set('q', searchState.query);
    }
    
    if (searchState.filters.status) {
        params.set('status', searchState.filters.status);
    }
    
    if (searchState.filters.category) {
        params.set('category', searchState.filters.category);
    }
    
    if (searchState.filters.location) {
        params.set('location', searchState.filters.location);
    }
    
    if (searchState.filters.date) {
        params.set('date', searchState.filters.date);
    }
    
    if (searchState.sort !== 'newest') {
        params.set('sort', searchState.sort);
    }
    
    if (searchState.currentPage > 1) {
        params.set('page', searchState.currentPage);
    }
    
    const newURL = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname;
    window.history.replaceState({}, '', newURL);
}

// Open item modal
function openItemModal(item) {
    // Use enhanced function if available
    if (window.enhancedOpenItemModal) {
        window.enhancedOpenItemModal(typeof item === 'object' ? item.id : item);
    } else if (window.ModalManager) {
        // Create modal content
        const modalBody = document.getElementById('itemModalBody');
        if (modalBody) {
            modalBody.innerHTML = createItemDetailHTML(item);
            
            // Setup claim button
            const claimBtn = modalBody.querySelector('.claim-btn');
            if (claimBtn) {
                claimBtn.addEventListener('click', () => {
                    window.ModalManager.closeModal('itemModal');
                    claimItem(item.id);
                });
            }
        }
        
        window.ModalManager.openModal('itemModal');
    }
}

// Create item detail HTML
function createItemDetailHTML(item) {
    const statusClass = item.status === 'lost' ? 'lost' : 'found';
    const statusText = item.status === 'lost' ? 'Lost' : 'Found';
    const actionText = item.status === 'lost' ? 'I Found This Item' : 'This Is My Item';
    const categoryText = item.category.charAt(0).toUpperCase() + item.category.slice(1);
    const locationText = item.location.charAt(0).toUpperCase() + item.location.slice(1);
    
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
                        <div class="meta-value">${categoryText}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">Location</div>
                        <div class="meta-value">${locationText}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">Date</div>
                        <div class="meta-value">${window.CanBeFound?.formatDate(item.date) || item.date}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">Reported By</div>
                        <div class="meta-value">${item.reportedBy}</div>
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
            <button class="btn btn-secondary" onclick="window.ModalManager?.closeModal('itemModal')">Close</button>
        </div>
    `;
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
        // Show claim process
        if (window.CanBeFound) {
            window.CanBeFound.showNotification('Claim process started. Please provide verification details.', 'info');
        }
    }
    
    console.log('Claiming item:', itemId);
}

// Export search functions
window.SearchManager = {
    performSearch,
    openItemModal,
    claimItem
};