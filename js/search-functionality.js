// CanBeFound.com - Enhanced Search Functionality

// Initialize enhanced search functionality
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('searchInput')) {
        initializeEnhancedSearch();
    }
});

// Initialize enhanced search functionality
function initializeEnhancedSearch() {
    // Override existing search functions
    if (window.SearchManager) {
        window.SearchManager.claimItem = enhancedClaimItem;
        window.SearchManager.openItemModal = enhancedOpenItemModal;
    }
    
    // Initialize claim functionality
    initializeClaimFunctionality();
    
    console.log('Enhanced search functionality initialized');
}

// Enhanced claim item function
function enhancedClaimItem(itemId) {
    // Check if user is logged in
    if (!window.Auth?.isLoggedIn()) {
        if (window.ModalManager) {
            window.ModalManager.openModal('loginModal');
        }
        return;
    }
    
    // Create claim modal if it doesn't exist
    if (!document.getElementById('claimModal')) {
        createClaimModal();
    }
    
    // Load item data and open claim modal
    loadItemForClaim(itemId);
}

// Create claim modal
function createClaimModal() {
    const claimModalHTML = `
        <div class="modal" id="claimModal" role="dialog" aria-labelledby="claim-title" aria-hidden="true">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="claim-title" class="modal-title">Claim Item</h2>
                    <button class="modal-close" aria-label="Close claim modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="claim-item-info" id="claimItemInfo">
                        <!-- Item info will be loaded here -->
                    </div>
                    <form class="claim-form" id="claimForm">
                        <div class="form-group">
                            <label for="proofOfOwnership" class="form-label">Proof of Ownership</label>
                            <textarea id="proofOfOwnership" name="proofOfOwnership" class="form-textarea" 
                                      rows="4" required placeholder="Please provide detailed proof that this item belongs to you (serial numbers, unique features, purchase details, etc.)"></textarea>
                            <div class="form-error" id="proofOfOwnershipError"></div>
                        </div>
                        <div class="form-group">
                            <label for="additionalDetails" class="form-label">Additional Details</label>
                            <textarea id="additionalDetails" name="additionalDetails" class="form-textarea" 
                                      rows="3" placeholder="Any additional information that proves ownership..."></textarea>
                        </div>
                        <div class="form-group checkbox-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="claimAgreement" name="claimAgreement" required>
                                <span class="checkbox-custom"></span>
                                I confirm that this item belongs to me and I can provide additional verification if needed
                            </label>
                            <div class="form-error" id="claimAgreementError"></div>
                        </div>
                        <div class="claim-actions">
                            <button type="button" class="btn btn-secondary" onclick="window.ModalManager?.closeModal('claimModal')">Cancel</button>
                            <button type="submit" class="btn btn-primary">Submit Claim</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', claimModalHTML);
    
    // Setup modal functionality
    const modal = document.getElementById('claimModal');
    if (window.ModalManager) {
        window.ModalManager.setupModal(modal);
    }
    
    // Setup form submission
    const claimForm = document.getElementById('claimForm');
    if (claimForm) {
        claimForm.addEventListener('submit', handleClaimSubmission);
    }
}

// Load item for claim
function loadItemForClaim(itemId) {
    const itemInfo = document.getElementById('claimItemInfo');
    if (!itemInfo) return;
    
    // Mock item data (in real app, this would fetch from API)
    const mockItems = {
        1: { title: 'iPhone 13 Pro', category: 'Electronics', status: 'lost', image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=300' },
        2: { title: 'Black Backpack', category: 'Bags', status: 'found', image: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=300' },
        3: { title: 'Silver Watch', category: 'Jewelry', status: 'found', image: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=300' }
    };
    
    const item = mockItems[itemId] || { title: 'Unknown Item', category: 'Other', status: 'unknown', image: '' };
    
    itemInfo.innerHTML = `
        <div class="claim-item-display">
            <div class="claim-item-image">
                <img src="${item.image}" alt="${item.title}" onerror="this.style.display='none'">
            </div>
            <div class="claim-item-details">
                <h3 class="claim-item-title">${item.title}</h3>
                <div class="claim-item-category">${item.category}</div>
                <div class="claim-item-status ${item.status}">${item.status.charAt(0).toUpperCase() + item.status.slice(1)}</div>
            </div>
        </div>
    `;
    
    // Store item ID for submission
    const modal = document.getElementById('claimModal');
    if (modal) {
        modal.setAttribute('data-item-id', itemId);
        
        if (window.ModalManager) {
            window.ModalManager.openModal('claimModal');
        }
    }
}

// Handle claim submission
function handleClaimSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const modal = document.getElementById('claimModal');
    const itemId = modal?.getAttribute('data-item-id');
    const proofOfOwnership = form.proofOfOwnership.value.trim();
    const claimAgreement = form.claimAgreement.checked;
    
    // Validate form
    if (!proofOfOwnership) {
        showClaimError('proofOfOwnership', 'Proof of ownership is required');
        return;
    }
    
    if (proofOfOwnership.length < 20) {
        showClaimError('proofOfOwnership', 'Please provide more detailed proof of ownership');
        return;
    }
    
    if (!claimAgreement) {
        showClaimError('claimAgreement', 'You must agree to the terms');
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting Claim...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Close modal
        if (window.ModalManager) {
            window.ModalManager.closeModal('claimModal');
        }
        
        // Show success message
        if (window.CanBeFound) {
            window.CanBeFound.showNotification('Claim submitted successfully! You will be contacted for verification.', 'success');
        }
        
        // Reset form
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
    }, 1500);
}

// Show claim error
function showClaimError(fieldName, message) {
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

// Enhanced open item modal
function enhancedOpenItemModal(itemId) {
    // Create or get item modal
    let itemModal = document.getElementById('itemModal');
    if (!itemModal) {
        createEnhancedItemModal();
        itemModal = document.getElementById('itemModal');
    }
    
    // Load item data
    loadEnhancedItemDetails(itemId);
    
    // Open modal
    if (window.ModalManager) {
        window.ModalManager.openModal('itemModal');
    }
}

// Create enhanced item modal
function createEnhancedItemModal() {
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
    if (window.ModalManager) {
        window.ModalManager.setupModal(modal);
    }
}

// Load enhanced item details
function loadEnhancedItemDetails(itemId) {
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
        const mockItems = {
            1: {
                id: 1,
                title: 'iPhone 13 Pro',
                category: 'Electronics',
                status: 'lost',
                description: 'Black iPhone 13 Pro with a blue case. Has a small scratch on the back. Contains important photos and contacts.',
                location: 'Library - 2nd Floor Study Area',
                date: '2025-01-15',
                time: '14:30',
                reportedBy: 'Anonymous',
                image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400'
            },
            2: {
                id: 2,
                title: 'Black Backpack',
                category: 'Bags',
                status: 'found',
                description: 'Large black backpack with laptop compartment. Contains some textbooks and a water bottle.',
                location: 'Cafeteria - Near Window Tables',
                date: '2025-01-14',
                time: '12:15',
                reportedBy: 'Jane Smith',
                image: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=400'
            },
            3: {
                id: 3,
                title: 'Silver Watch',
                category: 'Jewelry',
                status: 'found',
                description: 'Silver digital watch with black leather strap. Shows date and time.',
                location: 'Gymnasium - Locker Area',
                date: '2025-01-13',
                time: '16:45',
                reportedBy: 'Mike Johnson',
                image: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=400'
            }
        };
        
        const item = mockItems[itemId] || mockItems[1];
        
        modalBody.innerHTML = createEnhancedItemDetailHTML(item);
        
        // Setup claim button
        const claimBtn = modalBody.querySelector('.claim-btn');
        if (claimBtn) {
            claimBtn.addEventListener('click', () => {
                if (window.ModalManager) {
                    window.ModalManager.closeModal('itemModal');
                }
                enhancedClaimItem(item.id);
            });
        }
    }, 800);
}

// Create enhanced item detail HTML
function createEnhancedItemDetailHTML(item) {
    const statusClass = item.status === 'lost' ? 'lost' : 'found';
    const statusText = item.status === 'lost' ? 'Lost' : 'Found';
    const actionText = item.status === 'lost' ? 'I Found This Item' : 'This Is My Item';
    
    return `
        <div class="item-detail-header">
            <div class="item-detail-image">
                <img src="${item.image}" alt="${item.title}" loading="lazy" onerror="this.style.display='none'">
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

// Initialize claim functionality
function initializeClaimFunctionality() {
    // Add styles for claim modal
    const claimStyles = `
        <style>
        .claim-item-display {
            display: flex;
            gap: var(--spacing-lg);
            margin-bottom: var(--spacing-xl);
            padding: var(--spacing-lg);
            background: var(--gray-100);
            border-radius: var(--radius-lg);
        }
        
        .claim-item-image {
            width: 80px;
            height: 80px;
            background: var(--gray-200);
            border-radius: var(--radius-md);
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            flex-shrink: 0;
        }
        
        .claim-item-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .claim-item-details {
            flex: 1;
        }
        
        .claim-item-title {
            font-size: var(--font-size-lg);
            font-weight: var(--font-weight-semibold);
            margin-bottom: var(--spacing-xs);
        }
        
        .claim-item-category {
            display: inline-block;
            padding: var(--spacing-xs) var(--spacing-sm);
            background: var(--gray-200);
            color: var(--text-light);
            border-radius: var(--radius-full);
            font-size: var(--font-size-xs);
            margin-bottom: var(--spacing-xs);
        }
        
        .claim-item-status {
            font-size: var(--font-size-sm);
            font-weight: var(--font-weight-medium);
            padding: var(--spacing-xs) var(--spacing-sm);
            border-radius: var(--radius-full);
        }
        
        .claim-item-status.lost {
            background: rgba(220, 53, 69, 0.1);
            color: var(--error-color);
        }
        
        .claim-item-status.found {
            background: rgba(40, 167, 69, 0.1);
            color: var(--success-color);
        }
        
        .claim-actions {
            display: flex;
            gap: var(--spacing-md);
            justify-content: center;
            margin-top: var(--spacing-lg);
        }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', claimStyles);
}