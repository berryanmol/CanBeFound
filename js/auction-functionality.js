// CanBeFound.com - Enhanced Auction Functionality

// Initialize enhanced auction functionality
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('auctionsGrid')) {
        initializeEnhancedAuctions();
    }
});

// Initialize enhanced auction functionality
function initializeEnhancedAuctions() {
    // Override existing auction functions
    if (window.AuctionManager) {
        window.AuctionManager.openBidModal = enhancedOpenBidModal;
        window.AuctionManager.viewAuctionDetails = enhancedViewAuctionDetails;
    }
    
    console.log('Enhanced auction functionality initialized');
}

// Enhanced open bid modal
function enhancedOpenBidModal(auction) {
    // Check if user is logged in
    if (!window.Auth?.isLoggedIn()) {
        if (window.ModalManager) {
            window.ModalManager.openModal('loginModal');
        }
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
                <img src="${auction.image}" alt="${auction.title}" onerror="this.style.display='none'">
            </div>
            <div class="bid-item-details">
                <h3 class="bid-item-title">${auction.title}</h3>
                <div class="bid-item-category">${auction.category.charAt(0).toUpperCase() + auction.category.slice(1)}</div>
                <div class="bid-item-location">📍 ${auction.location}</div>
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
        
        // Clear any previous errors
        const errorElement = document.getElementById('bidAmountError');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
        
        if (window.ModalManager) {
            window.ModalManager.openModal('bidModal');
        }
    }
}

// Enhanced view auction details
function enhancedViewAuctionDetails(auction) {
    // Create auction detail modal if it doesn't exist
    if (!document.getElementById('auctionDetailModal')) {
        createAuctionDetailModal();
    }
    
    // Load auction details
    loadAuctionDetails(auction);
}

// Create auction detail modal
function createAuctionDetailModal() {
    const modalHTML = `
        <div class="modal" id="auctionDetailModal" role="dialog" aria-labelledby="auction-detail-title" aria-hidden="true">
            <div class="modal-content large">
                <div class="modal-header">
                    <h2 id="auction-detail-title" class="modal-title">Auction Details</h2>
                    <button class="modal-close" aria-label="Close auction details">&times;</button>
                </div>
                <div class="modal-body" id="auctionDetailBody">
                    <!-- Auction details will be loaded here -->
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Setup modal functionality
    const modal = document.getElementById('auctionDetailModal');
    if (window.ModalManager) {
        window.ModalManager.setupModal(modal);
    }
}

// Load auction details
function loadAuctionDetails(auction) {
    const modalBody = document.getElementById('auctionDetailBody');
    if (!modalBody) return;
    
    // Show loading state
    modalBody.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <span>Loading auction details...</span>
        </div>
    `;
    
    setTimeout(() => {
        const timeLeft = getTimeLeft(auction.endTime);
        const statusClass = auction.status === 'ending-soon' ? 'ending-soon' : 'active';
        
        modalBody.innerHTML = `
            <div class="auction-detail-header">
                <div class="auction-detail-image">
                    <img src="${auction.image}" alt="${auction.title}" loading="lazy" onerror="this.style.display='none'">
                    <div class="auction-status ${statusClass}">${auction.status === 'ending-soon' ? 'Ending Soon' : 'Active'}</div>
                </div>
                <div class="auction-detail-info">
                    <h3 class="auction-detail-title">${auction.title}</h3>
                    <div class="auction-detail-meta">
                        <div class="meta-item">
                            <div class="meta-label">Category</div>
                            <div class="meta-value">${auction.category.charAt(0).toUpperCase() + auction.category.slice(1)}</div>
                        </div>
                        <div class="meta-item">
                            <div class="meta-label">Location Found</div>
                            <div class="meta-value">${auction.location}</div>
                        </div>
                        <div class="meta-item">
                            <div class="meta-label">Starting Price</div>
                            <div class="meta-value">$${auction.startingPrice.toFixed(2)}</div>
                        </div>
                        <div class="meta-item">
                            <div class="meta-label">Current Bid</div>
                            <div class="meta-value">$${auction.currentBid.toFixed(2)}</div>
                        </div>
                        <div class="meta-item">
                            <div class="meta-label">Total Bids</div>
                            <div class="meta-value">${auction.bidCount}</div>
                        </div>
                        <div class="meta-item">
                            <div class="meta-label">Time Remaining</div>
                            <div class="meta-value">${timeLeft}</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="auction-detail-description">
                <h4>Item Description</h4>
                <p>${auction.description}</p>
            </div>
            
            <div class="auction-detail-actions">
                <button class="btn btn-primary" onclick="window.ModalManager?.closeModal('auctionDetailModal'); enhancedOpenBidModal(${JSON.stringify(auction).replace(/"/g, '&quot;')})">
                    Place Bid
                </button>
                <button class="btn btn-secondary" onclick="window.ModalManager?.closeModal('auctionDetailModal')">
                    Close
                </button>
            </div>
        `;
        
    }, 500);
    
    if (window.ModalManager) {
        window.ModalManager.openModal('auctionDetailModal');
    }
}

// Get time left (utility function)
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