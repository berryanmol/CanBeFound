// CanBeFound.com - Auction Functionality

// Auction state
let auctionState = {
    filters: {
        category: '',
        status: '',
        priceRange: ''
    },
    sort: 'ending-soon',
    auctions: [],
    currentPage: 1,
    itemsPerPage: 12
};

// Initialize auction functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeAuctions();
    loadAuctionData();
});

// Initialize auction components
function initializeAuctions() {
    // Filter controls
    initializeFilters();
    
    // Sort controls
    initializeSortControls();
    
    // Load more button
    initializeLoadMore();
    
    // Bid modal
    initializeBidModal();
    
    console.log('Auction functionality initialized');
}

// Initialize filters
function initializeFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const priceFilter = document.getElementById('priceFilter');
    const clearFilters = document.getElementById('clearFilters');
    
    [categoryFilter, statusFilter, priceFilter].forEach(filter => {
        if (filter) {
            filter.addEventListener('change', function() {
                updateFilters();
                filterAndDisplayAuctions();
            });
        }
    });
    
    if (clearFilters) {
        clearFilters.addEventListener('click', function() {
            auctionState.filters = {
                category: '',
                status: '',
                priceRange: ''
            };
            
            // Reset filter UI
            if (categoryFilter) categoryFilter.value = '';
            if (statusFilter) statusFilter.value = '';
            if (priceFilter) priceFilter.value = '';
            
            filterAndDisplayAuctions();
        });
    }
}

// Update filters
function updateFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const priceFilter = document.getElementById('priceFilter');
    
    auctionState.filters = {
        category: categoryFilter?.value || '',
        status: statusFilter?.value || '',
        priceRange: priceFilter?.value || ''
    };
    
    auctionState.currentPage = 1; // Reset to first page
}

// Initialize sort controls
function initializeSortControls() {
    const sortSelect = document.getElementById('sortSelect');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            auctionState.sort = this.value;
            filterAndDisplayAuctions();
        });
    }
}

// Initialize load more button
function initializeLoadMore() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            auctionState.currentPage++;
            loadMoreAuctions();
        });
    }
}

// Load auction data
function loadAuctionData() {
    // Generate mock auction data
    generateMockAuctions();
    
    // Display initial auctions
    filterAndDisplayAuctions();
    
    // Start auction timers
    startAuctionTimers();
}

// Generate mock auction data
function generateMockAuctions() {
    const mockAuctions = [
        {
            id: 1,
            title: 'iPhone 12 Pro',
            category: 'electronics',
            description: 'Unclaimed iPhone 12 Pro in good condition',
            image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400',
            startingPrice: 25.00,
            currentBid: 45.00,
            bidCount: 8,
            endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
            status: 'active',
            location: 'Library'
        },
        {
            id: 2,
            title: 'Designer Backpack',
            category: 'bags',
            description: 'High-quality leather backpack, unclaimed for 45 days',
            image: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=400',
            startingPrice: 15.00,
            currentBid: 32.00,
            bidCount: 12,
            endTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
            status: 'ending-soon',
            location: 'Cafeteria'
        },
        {
            id: 3,
            title: 'Silver Watch',
            category: 'jewelry',
            description: 'Elegant silver watch with leather strap',
            image: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=400',
            startingPrice: 20.00,
            currentBid: 28.00,
            bidCount: 5,
            endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
            status: 'active',
            location: 'Gymnasium'
        },
        {
            id: 4,
            title: 'Textbook Set',
            category: 'books',
            description: 'Set of engineering textbooks in excellent condition',
            image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400',
            startingPrice: 10.00,
            currentBid: 18.00,
            bidCount: 3,
            endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
            status: 'active',
            location: 'Classroom'
        },
        {
            id: 5,
            title: 'Winter Jacket',
            category: 'clothing',
            description: 'Warm winter jacket, size medium',
            image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400',
            startingPrice: 12.00,
            currentBid: 12.00,
            bidCount: 0,
            endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
            status: 'active',
            location: 'Auditorium'
        },
        {
            id: 6,
            title: 'Bluetooth Headphones',
            category: 'electronics',
            description: 'Wireless headphones with noise cancellation',
            image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
            startingPrice: 30.00,
            currentBid: 55.00,
            bidCount: 15,
            endTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
            status: 'ending-soon',
            location: 'Library'
        }
    ];
    
    auctionState.auctions = mockAuctions;
}

// Filter and display auctions
function filterAndDisplayAuctions() {
    let filtered = [...auctionState.auctions];
    
    // Apply filters
    if (auctionState.filters.category) {
        filtered = filtered.filter(auction => auction.category === auctionState.filters.category);
    }
    
    if (auctionState.filters.status) {
        if (auctionState.filters.status === 'ending-soon') {
            filtered = filtered.filter(auction => auction.status === 'ending-soon');
        } else if (auctionState.filters.status === 'active') {
            filtered = filtered.filter(auction => auction.status === 'active');
        }
    }
    
    if (auctionState.filters.priceRange) {
        filtered = filtered.filter(auction => {
            const price = auction.currentBid;
            switch (auctionState.filters.priceRange) {
                case '0-25':
                    return price >= 0 && price <= 25;
                case '25-50':
                    return price > 25 && price <= 50;
                case '50-100':
                    return price > 50 && price <= 100;
                case '100+':
                    return price > 100;
                default:
                    return true;
            }
        });
    }
    
    // Apply sorting
    filtered = sortAuctions(filtered);
    
    // Display auctions
    displayAuctions(filtered);
}

// Sort auctions
function sortAuctions(auctions) {
    const sorted = [...auctions];
    
    switch (auctionState.sort) {
        case 'ending-soon':
            sorted.sort((a, b) => new Date(a.endTime) - new Date(b.endTime));
            break;
        case 'newest':
            sorted.sort((a, b) => b.id - a.id);
            break;
        case 'price-low':
            sorted.sort((a, b) => a.currentBid - b.currentBid);
            break;
        case 'price-high':
            sorted.sort((a, b) => b.currentBid - a.currentBid);
            break;
        case 'popular':
            sorted.sort((a, b) => b.bidCount - a.bidCount);
            break;
    }
    
    return sorted;
}

// Display auctions
function displayAuctions(auctions) {
    const container = document.getElementById('auctionsGrid');
    if (!container) return;
    
    const auctionsHTML = auctions.map(auction => createAuctionHTML(auction)).join('');
    container.innerHTML = auctionsHTML;
    
    // Add event listeners
    auctions.forEach(auction => {
        const auctionElement = container.querySelector(`[data-auction-id="${auction.id}"]`);
        if (auctionElement) {
            // Bid button
            const bidBtn = auctionElement.querySelector('.bid-btn');
            if (bidBtn) {
                bidBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openBidModal(auction);
                });
            }
            
            // View details button
            const viewBtn = auctionElement.querySelector('.view-details-btn');
            if (viewBtn) {
                viewBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    viewAuctionDetails(auction);
                });
            }
        }
    });
}

// Create auction HTML
function createAuctionHTML(auction) {
    const timeLeft = getTimeLeft(auction.endTime);
    const statusClass = auction.status === 'ending-soon' ? 'ending-soon' : 'active';
    const categoryText = auction.category.charAt(0).toUpperCase() + auction.category.slice(1);
    
    return `
        <div class="auction-card" data-auction-id="${auction.id}">
            <div class="auction-image">
                <img src="${auction.image}" alt="${auction.title}" loading="lazy">
                <div class="auction-status ${statusClass}">${auction.status === 'ending-soon' ? 'Ending Soon' : 'Active'}</div>
                <div class="auction-timer" data-end-time="${auction.endTime.toISOString()}">${timeLeft}</div>
            </div>
            <div class="auction-content">
                <h3 class="auction-title">${auction.title}</h3>
                <div class="auction-category">${categoryText}</div>
                <p class="auction-description">${auction.description}</p>
                <div class="auction-pricing">
                    <div class="price-info starting-price">
                        <div class="price-label">Starting Price</div>
                        <div class="price-value">$${auction.startingPrice.toFixed(2)}</div>
                    </div>
                    <div class="price-info current-bid">
                        <div class="price-label">Current Bid</div>
                        <div class="price-value">$${auction.currentBid.toFixed(2)}</div>
                    </div>
                </div>
                <div class="auction-meta">
                    <div class="bid-count">
                        <span>👥</span>
                        <span>${auction.bidCount} bid${auction.bidCount !== 1 ? 's' : ''}</span>
                    </div>
                    <div class="time-left">
                        <span>⏰</span>
                        <span class="time-remaining" data-end-time="${auction.endTime.toISOString()}">${timeLeft}</span>
                    </div>
                </div>
                <div class="auction-actions">
                    <button class="bid-btn" ${auction.status === 'ended' ? 'disabled' : ''}>
                        ${auction.status === 'ended' ? 'Auction Ended' : 'Place Bid'}
                    </button>
                    <button class="view-details-btn">View Details</button>
                </div>
            </div>
        </div>
    `;
}

// Get time left
function getTimeLeft(endTime) {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;
    
    if (diff <= 0) {
        return 'Ended';
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
        return `${days}d ${hours}h`;
    } else if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else {
        return `${minutes}m`;
    }
}

// Start auction timers
function startAuctionTimers() {
    setInterval(() => {
        const timers = document.querySelectorAll('.auction-timer, .time-remaining');
        timers.forEach(timer => {
            const endTime = timer.getAttribute('data-end-time');
            if (endTime) {
                const timeLeft = getTimeLeft(endTime);
                timer.textContent = timeLeft;
                
                // Update status if auction ended
                if (timeLeft === 'Ended') {
                    const auctionCard = timer.closest('.auction-card');
                    if (auctionCard) {
                        const bidBtn = auctionCard.querySelector('.bid-btn');
                        if (bidBtn) {
                            bidBtn.textContent = 'Auction Ended';
                            bidBtn.disabled = true;
                        }
                    }
                }
            }
        });
    }, 60000); // Update every minute
}

// Load more auctions
function loadMoreAuctions() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.textContent = 'Loading...';
        loadMoreBtn.disabled = true;
        
        // Simulate loading delay
        setTimeout(() => {
            // In a real app, this would load more data from the server
            loadMoreBtn.textContent = 'Load More Auctions';
            loadMoreBtn.disabled = false;
            
            // For demo, just show message
            if (window.CanBeFound) {
                window.CanBeFound.showNotification('No more auctions to load', 'info');
            }
        }, 1000);
    }
}

// Initialize bid modal
function initializeBidModal() {
    const bidForm = document.getElementById('bidForm');
    
    if (bidForm) {
        bidForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleBidSubmission();
        });
    }
}

// Open bid modal
function openBidModal(auction) {
    if (!window.CanBeFound?.isLoggedIn()) {
        window.ModalManager?.openModal('loginModal');
        return;
    }
    
    const modal = document.getElementById('bidModal');
    const itemInfo = document.getElementById('bidItemInfo');
    const currentBidAmount = document.getElementById('currentBidAmount');
    const minBidAmount = document.getElementById('minBidAmount');
    const bidAmountInput = document.getElementById('bidAmount');
    
    if (modal && itemInfo && currentBidAmount && minBidAmount && bidAmountInput) {
        // Update item info
        itemInfo.innerHTML = `
            <div class="bid-item-image">
                <img src="${auction.image}" alt="${auction.title}">
            </div>
            <div class="bid-item-details">
                <h3 class="bid-item-title">${auction.title}</h3>
                <div class="bid-item-category">${auction.category.charAt(0).toUpperCase() + auction.category.slice(1)}</div>
            </div>
        `;
        
        // Update bid amounts
        const minBid = auction.currentBid + 1;
        currentBidAmount.textContent = `$${auction.currentBid.toFixed(2)}`;
        minBidAmount.textContent = minBid.toFixed(2);
        bidAmountInput.min = minBid;
        bidAmountInput.value = minBid;
        
        // Store auction ID for submission
        modal.setAttribute('data-auction-id', auction.id);
        
        window.ModalManager?.openModal('bidModal');
    }
}

// Handle bid submission
function handleBidSubmission() {
    const modal = document.getElementById('bidModal');
    const bidAmountInput = document.getElementById('bidAmount');
    const auctionId = modal?.getAttribute('data-auction-id');
    const bidAmount = parseFloat(bidAmountInput?.value || '0');
    
    if (!auctionId || !bidAmount) {
        showBidError('Invalid bid amount');
        return;
    }
    
    // Find auction
    const auction = auctionState.auctions.find(a => a.id === parseInt(auctionId));
    if (!auction) {
        showBidError('Auction not found');
        return;
    }
    
    // Validate bid amount
    const minBid = auction.currentBid + 1;
    if (bidAmount < minBid) {
        showBidError(`Bid must be at least $${minBid.toFixed(2)}`);
        return;
    }
    
    // Show loading state
    const submitBtn = document.querySelector('#bidForm button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Placing Bid...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Update auction data
        auction.currentBid = bidAmount;
        auction.bidCount++;
        
        // Close modal
        window.ModalManager?.closeModal('bidModal');
        
        // Show success message
        if (window.CanBeFound) {
            window.CanBeFound.showNotification(`Bid of $${bidAmount.toFixed(2)} placed successfully!`, 'success');
        }
        
        // Refresh display
        filterAndDisplayAuctions();
        
        // Reset form
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
    }, 1500);
}

// Show bid error
function showBidError(message) {
    const errorElement = document.getElementById('bidAmountError');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    if (window.Accessibility) {
        window.Accessibility.announceToScreenReader(`Error: ${message}`);
    }
}

// View auction details
function viewAuctionDetails(auction) {
    // In a real app, this would open a detailed view
    console.log('Viewing auction details:', auction);
    
    if (window.CanBeFound) {
        window.CanBeFound.showNotification('Auction details view would open here', 'info');
    }
}

// Close bid modal
function closeBidModal() {
    window.ModalManager?.closeModal('bidModal');
}

// Export auction functions
window.AuctionManager = {
    openBidModal,
    closeBidModal,
    viewAuctionDetails
};