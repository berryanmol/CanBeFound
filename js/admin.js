// CanBeFound.com - Admin Dashboard

// Admin state
let adminState = {
    currentSection: 'dashboard',
    sidebarCollapsed: false,
    items: [],
    claims: [],
    auctions: []
};

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeAdminDashboard();
    loadAdminData();
});

// Initialize admin dashboard
function initializeAdminDashboard() {
    // Sidebar navigation
    initializeSidebarNavigation();
    
    // Sidebar toggle
    initializeSidebarToggle();
    
    // Section switching
    initializeSectionSwitching();
    
    // Dashboard components
    initializeDashboardComponents();
    
    console.log('Admin dashboard initialized');
}

// Initialize sidebar navigation
function initializeSidebarNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const section = this.getAttribute('data-section');
            if (section) {
                switchToSection(section);
                
                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
}

// Initialize sidebar toggle
function initializeSidebarToggle() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('adminSidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            adminState.sidebarCollapsed = !adminState.sidebarCollapsed;
            
            if (adminState.sidebarCollapsed) {
                sidebar.classList.add('collapsed');
            } else {
                sidebar.classList.remove('collapsed');
            }
        });
    }
    
    // Auto-collapse on mobile
    if (window.innerWidth <= 1024) {
        adminState.sidebarCollapsed = true;
        if (sidebar) {
            sidebar.classList.add('collapsed');
        }
    }
}

// Initialize section switching
function initializeSectionSwitching() {
    // Set initial section
    switchToSection('dashboard');
}

// Switch to section
function switchToSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
        adminState.currentSection = sectionName;
        
        // Load section-specific data
        loadSectionData(sectionName);
        
        // Update page title
        updatePageTitle(sectionName);
        
        // Announce to screen readers
        if (window.Accessibility) {
            window.Accessibility.announceToScreenReader(`Switched to ${sectionName} section`);
        }
    }
}

// Update page title
function updatePageTitle(section) {
    const titles = {
        dashboard: 'Dashboard',
        items: 'Manage Items',
        claims: 'Manage Claims',
        auctions: 'Auction Management',
        reports: 'Reports & Analytics',
        settings: 'System Settings'
    };
    
    document.title = `${titles[section] || section} - Admin Dashboard - CanBeFound.com`;
}

// Initialize dashboard components
function initializeDashboardComponents() {
    // Items table
    initializeItemsTable();
    
    // Claims management
    initializeClaimsManagement();
    
    // Auction management
    initializeAuctionManagement();
    
    // Settings forms
    initializeSettingsForms();
}

// Load admin data
function loadAdminData() {
    // Generate mock data
    generateMockAdminData();
    
    // Load dashboard data
    loadDashboardData();
}

// Generate mock admin data
function generateMockAdminData() {
    // Mock items data
    adminState.items = [
        {
            id: 1,
            name: 'iPhone 13 Pro',
            category: 'Electronics',
            status: 'Lost',
            dateReported: '2025-01-15',
            location: 'Library',
            reportedBy: 'John Doe'
        },
        {
            id: 2,
            name: 'Black Backpack',
            category: 'Bags',
            status: 'Found',
            dateReported: '2025-01-14',
            location: 'Cafeteria',
            reportedBy: 'Jane Smith'
        },
        {
            id: 3,
            name: 'Silver Watch',
            category: 'Jewelry',
            status: 'Claimed',
            dateReported: '2025-01-13',
            location: 'Gymnasium',
            reportedBy: 'Mike Johnson'
        }
    ];
    
    // Mock claims data
    adminState.claims = [
        {
            id: 1,
            itemName: 'iPhone 13 Pro',
            claimantName: 'Sarah Wilson',
            status: 'Pending',
            dateSubmitted: '2025-01-16',
            verificationStatus: 'In Review'
        },
        {
            id: 2,
            itemName: 'Black Backpack',
            claimantName: 'Tom Brown',
            status: 'Approved',
            dateSubmitted: '2025-01-15',
            verificationStatus: 'Verified'
        }
    ];
    
    // Mock auctions data
    adminState.auctions = [
        {
            id: 1,
            itemName: 'Bluetooth Headphones',
            currentBid: 45.00,
            bidCount: 8,
            endTime: '2025-01-20',
            status: 'Active'
        },
        {
            id: 2,
            itemName: 'Designer Backpack',
            currentBid: 32.00,
            bidCount: 12,
            endTime: '2025-01-18',
            status: 'Ending Soon'
        }
    ];
}

// Load dashboard data
function loadDashboardData() {
    // Load recent activity
    loadRecentActivity();
    
    // Load urgent actions
    loadUrgentActions();
}

// Load section data
function loadSectionData(section) {
    switch (section) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'items':
            loadItemsTable();
            break;
        case 'claims':
            loadClaimsGrid();
            break;
        case 'auctions':
            loadAuctionsList();
            break;
        case 'reports':
            loadReportsData();
            break;
    }
}

// Load recent activity
function loadRecentActivity() {
    const container = document.getElementById('recentActivity');
    if (!container) return;
    
    const activities = [
        {
            text: 'New lost item reported: iPhone 13 Pro',
            time: '2 hours ago'
        },
        {
            text: 'Claim approved for Black Backpack',
            time: '4 hours ago'
        },
        {
            text: 'Auction ended: Silver Watch',
            time: '6 hours ago'
        },
        {
            text: 'New user registered: Alice Johnson',
            time: '8 hours ago'
        }
    ];
    
    container.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-text">${activity.text}</div>
            <div class="activity-time">${activity.time}</div>
        </div>
    `).join('');
}

// Load urgent actions
function loadUrgentActions() {
    const container = document.getElementById('urgentActions');
    if (!container) return;
    
    const urgentItems = [
        {
            text: '3 claims pending verification',
            priority: 'high'
        },
        {
            text: '2 auctions ending in 24 hours',
            priority: 'medium'
        },
        {
            text: '5 items unclaimed for 30+ days',
            priority: 'medium'
        }
    ];
    
    container.innerHTML = urgentItems.map(item => `
        <div class="urgent-item">
            <div class="urgent-text">${item.text}</div>
            <div class="urgent-priority ${item.priority}">${item.priority.toUpperCase()}</div>
        </div>
    `).join('');
}

// Initialize items table
function initializeItemsTable() {
    const selectAllCheckbox = document.getElementById('selectAll');
    
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            const itemCheckboxes = document.querySelectorAll('#itemsTableBody input[type="checkbox"]');
            itemCheckboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }
    
    // Pagination
    initializeItemsPagination();
}

// Load items table
function loadItemsTable() {
    const tableBody = document.getElementById('itemsTableBody');
    if (!tableBody) return;
    
    const itemsHTML = adminState.items.map(item => `
        <tr>
            <td><input type="checkbox" data-item-id="${item.id}"></td>
            <td>#${item.id}</td>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td><span class="status-badge ${item.status.toLowerCase()}">${item.status}</span></td>
            <td>${formatDate(item.dateReported)}</td>
            <td>${item.location}</td>
            <td>
                <div class="table-actions">
                    <button class="action-btn edit" onclick="editItem(${item.id})" title="Edit">✏️</button>
                    <button class="action-btn approve" onclick="approveItem(${item.id})" title="Approve">✅</button>
                    <button class="action-btn delete" onclick="deleteItem(${item.id})" title="Delete">🗑️</button>
                </div>
            </td>
        </tr>
    `).join('');
    
    tableBody.innerHTML = itemsHTML;
}

// Initialize items pagination
function initializeItemsPagination() {
    const prevBtn = document.getElementById('itemsPrev');
    const nextBtn = document.getElementById('itemsNext');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            // Handle previous page
            console.log('Previous page');
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            // Handle next page
            console.log('Next page');
        });
    }
}

// Initialize claims management
function initializeClaimsManagement() {
    // Claims will be loaded when section is activated
}

// Load claims grid
function loadClaimsGrid() {
    const container = document.getElementById('claimsGrid');
    if (!container) return;
    
    const claimsHTML = adminState.claims.map(claim => `
        <div class="claim-card">
            <div class="claim-header">
                <h3 class="claim-title">${claim.itemName}</h3>
                <div class="claim-status ${claim.status.toLowerCase()}">${claim.status}</div>
            </div>
            <div class="claim-info">
                <div class="claim-detail">
                    <span class="claim-detail-label">Claimant:</span>
                    <span>${claim.claimantName}</span>
                </div>
                <div class="claim-detail">
                    <span class="claim-detail-label">Date:</span>
                    <span>${formatDate(claim.dateSubmitted)}</span>
                </div>
                <div class="claim-detail">
                    <span class="claim-detail-label">Verification:</span>
                    <span>${claim.verificationStatus}</span>
                </div>
            </div>
            <div class="claim-actions">
                <button class="btn btn-sm btn-primary" onclick="reviewClaim(${claim.id})">Review</button>
                <button class="btn btn-sm btn-secondary" onclick="contactClaimant(${claim.id})">Contact</button>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = claimsHTML;
}

// Initialize auction management
function initializeAuctionManagement() {
    // Auction management will be loaded when section is activated
}

// Load auctions list
function loadAuctionsList() {
    const container = document.getElementById('auctionsList');
    if (!container) return;
    
    const auctionsHTML = adminState.auctions.map(auction => `
        <div class="auction-item">
            <div class="auction-details">
                <div class="auction-name">${auction.itemName}</div>
                <div class="auction-meta">
                    Current Bid: $${auction.currentBid.toFixed(2)} | 
                    ${auction.bidCount} bids | 
                    Ends: ${formatDate(auction.endTime)}
                </div>
            </div>
            <div class="auction-controls">
                <button class="btn btn-sm btn-secondary" onclick="editAuction(${auction.id})">Edit</button>
                <button class="btn btn-sm btn-primary" onclick="endAuction(${auction.id})">End</button>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = auctionsHTML;
}

// Initialize settings forms
function initializeSettingsForms() {
    const settingsForms = document.querySelectorAll('.settings-form');
    
    settingsForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSettingsSubmission(this);
        });
    });
}

// Load reports data
function loadReportsData() {
    // Mock chart data
    const itemsChart = document.getElementById('itemsChart');
    const successChart = document.getElementById('successChart');
    
    if (itemsChart) {
        itemsChart.innerHTML = '<p style="text-align: center; color: #666;">Items Chart Placeholder</p>';
    }
    
    if (successChart) {
        successChart.innerHTML = '<p style="text-align: center; color: #666;">Success Rate Chart Placeholder</p>';
    }
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Admin action functions
function editItem(itemId) {
    console.log('Editing item:', itemId);
    if (window.CanBeFound) {
        window.CanBeFound.showNotification('Edit item functionality would open here', 'info');
    }
}

function approveItem(itemId) {
    console.log('Approving item:', itemId);
    if (window.CanBeFound) {
        window.CanBeFound.showNotification('Item approved successfully', 'success');
    }
}

function deleteItem(itemId) {
    if (confirm('Are you sure you want to delete this item?')) {
        console.log('Deleting item:', itemId);
        if (window.CanBeFound) {
            window.CanBeFound.showNotification('Item deleted successfully', 'success');
        }
    }
}

function reviewClaim(claimId) {
    console.log('Reviewing claim:', claimId);
    if (window.CanBeFound) {
        window.CanBeFound.showNotification('Claim review interface would open here', 'info');
    }
}

function contactClaimant(claimId) {
    console.log('Contacting claimant for claim:', claimId);
    if (window.CanBeFound) {
        window.CanBeFound.showNotification('Contact interface would open here', 'info');
    }
}

function editAuction(auctionId) {
    console.log('Editing auction:', auctionId);
    if (window.CanBeFound) {
        window.CanBeFound.showNotification('Auction edit interface would open here', 'info');
    }
}

function endAuction(auctionId) {
    if (confirm('Are you sure you want to end this auction?')) {
        console.log('Ending auction:', auctionId);
        if (window.CanBeFound) {
            window.CanBeFound.showNotification('Auction ended successfully', 'success');
        }
    }
}

// Handle settings form submission
function handleSettingsSubmission(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Saving...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        if (window.CanBeFound) {
            window.CanBeFound.showNotification('Settings saved successfully', 'success');
        }
        
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1000);
}

// Responsive handling
window.addEventListener('resize', function() {
    if (window.innerWidth <= 1024) {
        adminState.sidebarCollapsed = true;
        const sidebar = document.getElementById('adminSidebar');
        if (sidebar) {
            sidebar.classList.add('collapsed');
        }
    }
});

// Export admin functions
window.AdminManager = {
    switchToSection,
    editItem,
    approveItem,
    deleteItem,
    reviewClaim,
    contactClaimant,
    editAuction,
    endAuction
};