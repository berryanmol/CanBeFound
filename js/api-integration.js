// CanBeFound.com - API Integration for Frontend

// Initialize API integration
document.addEventListener('DOMContentLoaded', function() {
  initializeAPIIntegration();
});

// Initialize API integration
function initializeAPIIntegration() {
  // Override existing functions to use real API
  overrideFormSubmissions();
  overrideDataLoading();
  overrideAuthenticationFunctions();
  
  console.log('API integration initialized');
}

// Override form submissions to use real API
function overrideFormSubmissions() {
  // Lost item form
  const lostItemForm = document.getElementById('lostItemForm');
  if (lostItemForm) {
    lostItemForm.removeEventListener('submit', window.FormManager?.submitForm);
    lostItemForm.addEventListener('submit', handleLostItemSubmission);
  }

  // Found item form
  const foundItemForm = document.getElementById('foundItemForm');
  if (foundItemForm) {
    foundItemForm.removeEventListener('submit', handleFormSubmission);
    foundItemForm.addEventListener('submit', handleFoundItemSubmission);
  }

  // Contact form
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactFormSubmission);
  }

  // Login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.removeEventListener('submit', handleLogin);
    loginForm.addEventListener('submit', handleRealLogin);
  }
}

// Handle lost item form submission
async function handleLostItemSubmission(e) {
  e.preventDefault();
  
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  
  // Show loading state
  submitBtn.textContent = 'Submitting...';
  submitBtn.disabled = true;
  
  try {
    // Collect form data
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }
    
    // Submit to API
    const result = await window.API.submitLostItem(data);
    
    if (result.createLostItem) {
      // Show success message
      showSuccessMessage('Lost item report submitted successfully!');
      
      // Reset form after delay
      setTimeout(() => {
        form.reset();
        if (window.FormManager) {
          window.FormManager.goToStep(1);
        }
      }, 3000);
    }
    
  } catch (error) {
    console.error('Failed to submit lost item:', error);
    showErrorMessage('Failed to submit report. Please try again.');
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}

// Handle found item form submission
async function handleFoundItemSubmission(e) {
  e.preventDefault();
  
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  
  // Show loading state
  submitBtn.textContent = 'Submitting...';
  submitBtn.disabled = true;
  
  try {
    // Collect form data
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }
    
    // Submit to API
    const result = await window.API.submitFoundItem(data);
    
    if (result.createFoundItem) {
      // Show success message
      showSuccessMessage('Found item report submitted successfully!');
      
      // Redirect after delay
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
    }
    
  } catch (error) {
    console.error('Failed to submit found item:', error);
    showErrorMessage('Failed to submit report. Please try again.');
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}

// Handle contact form submission
async function handleContactFormSubmission(e) {
  e.preventDefault();
  
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  
  // Show loading state
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;
  
  try {
    // Collect form data
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }
    
    // Submit to API
    const result = await window.API.submitContactMessage(data);
    
    if (result.createContactMessage) {
      // Show success message
      if (window.CanBeFound) {
        window.CanBeFound.showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
      }
      
      // Reset form
      form.reset();
    }
    
  } catch (error) {
    console.error('Failed to submit contact message:', error);
    showErrorMessage('Failed to send message. Please try again.');
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}

// Handle real login
async function handleRealLogin(e) {
  e.preventDefault();
  
  const form = e.target;
  const collegeId = form.collegeId.value;
  const password = form.password.value;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  
  // Show loading state
  submitBtn.textContent = 'Logging in...';
  submitBtn.disabled = true;
  
  try {
    // Convert college ID to email format for API
    const email = `${collegeId}@college.edu`;
    
    const result = await window.API.login(email, password);
    
    if (result.item) {
      // Store auth data
      localStorage.setItem('authToken', result.sessionToken || 'authenticated');
      localStorage.setItem('currentUser', JSON.stringify(result.item));
      
      // Close modal
      if (window.ModalManager) {
        window.ModalManager.closeModal('loginModal');
      }
      
      // Show success message
      if (window.CanBeFound) {
        window.CanBeFound.showNotification('Login successful! Welcome back.', 'success');
      }
      
      // Reload page to update UI
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } else {
      showLoginError(result.message || 'Invalid credentials');
    }
    
  } catch (error) {
    console.error('Login failed:', error);
    showLoginError('Login failed. Please check your credentials.');
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}

// Override data loading functions
function overrideDataLoading() {
  // Override loadRecentItems
  if (typeof loadRecentItems === 'function') {
    window.originalLoadRecentItems = loadRecentItems;
  }
  window.loadRecentItems = loadRecentItemsFromAPI;
  
  // Override search functionality
  if (window.SearchManager) {
    window.SearchManager.performSearch = performRealSearch;
  }
  
  // Override stats loading
  if (typeof initializeStatsCounter === 'function') {
    window.originalInitializeStatsCounter = initializeStatsCounter;
  }
  window.initializeStatsCounter = loadRealStats;
}

// Load recent items from API
async function loadRecentItemsFromAPI() {
  const container = document.getElementById('recentItemsGrid');
  if (!container) return;
  
  try {
    const items = await window.API.getRecentItems(8);
    
    if (items && items.length > 0) {
      container.innerHTML = items.map(item => createItemCard(item)).join('');
    } else {
      container.innerHTML = '<p class="no-items">No recent items found.</p>';
    }
    
  } catch (error) {
    console.error('Failed to load recent items:', error);
    container.innerHTML = '<p class="error-message">Failed to load recent items.</p>';
  }
}

// Perform real search
async function performRealSearch() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;
  
  const query = searchInput.value.trim();
  
  // Show loading state
  if (window.SearchManager) {
    showLoadingState();
  }
  
  try {
    // Get filter values
    const filters = {
      search: query,
      category: document.getElementById('categoryFilter')?.value || '',
      location: document.getElementById('locationFilter')?.value || '',
      status: document.getElementById('statusFilter')?.value || '',
      limit: 20,
      offset: 0,
    };
    
    const items = await window.API.getAllItems(filters);
    
    // Display items
    if (window.SearchManager) {
      displayItems(items);
      updateResultsInfo(items.length);
    }
    
  } catch (error) {
    console.error('Search failed:', error);
    showErrorMessage('Search failed. Please try again.');
  }
}

// Load real stats
async function loadRealStats() {
  try {
    const stats = await window.API.getPlatformStats();
    
    // Update stat numbers
    const statElements = {
      'totalActiveItems': stats.totalActiveItems,
      'successfullyReturned': stats.successfullyReturned,
      'activeLostReports': stats.activeLostReports,
      'foundItemsAwaiting': stats.foundItemsAwaiting,
    };
    
    Object.entries(statElements).forEach(([key, value]) => {
      const element = document.querySelector(`[data-stat="${key}"]`);
      if (element) {
        animateCounterToValue(element, value);
      }
    });
    
    // Fallback to data-count attributes
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    statNumbers.forEach((stat, index) => {
      const values = Object.values(statElements);
      if (values[index] !== undefined) {
        stat.setAttribute('data-count', values[index]);
        animateCounterToValue(stat, values[index]);
      }
    });
    
  } catch (error) {
    console.error('Failed to load stats:', error);
    // Fallback to original function if available
    if (window.originalInitializeStatsCounter) {
      window.originalInitializeStatsCounter();
    }
  }
}

// Animate counter to specific value
function animateCounterToValue(element, targetValue) {
  const duration = 2000;
  const step = targetValue / (duration / 16);
  let current = 0;
  
  const timer = setInterval(() => {
    current += step;
    if (current >= targetValue) {
      current = targetValue;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current);
  }, 16);
}

// Override authentication functions
function overrideAuthenticationFunctions() {
  // Override checkAuthStatus
  window.checkAuthStatus = checkRealAuthStatus;
  
  // Override logout
  window.logout = performRealLogout;
}

// Check real authentication status
async function checkRealAuthStatus() {
  try {
    const user = await window.API.getCurrentUser();
    
    if (user) {
      isLoggedIn = true;
      currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(user));
      updateAuthUI();
    } else {
      isLoggedIn = false;
      currentUser = null;
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken');
    }
    
  } catch (error) {
    console.error('Auth check failed:', error);
    isLoggedIn = false;
    currentUser = null;
  }
}

// Perform real logout
async function performRealLogout() {
  try {
    await window.API.logout();
  } catch (error) {
    console.error('Logout failed:', error);
  } finally {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    isLoggedIn = false;
    currentUser = null;
    window.location.reload();
  }
}

// Utility functions
function showSuccessMessage(message) {
  if (window.CanBeFound) {
    window.CanBeFound.showNotification(message, 'success');
  }
}

function showErrorMessage(message) {
  if (window.CanBeFound) {
    window.CanBeFound.showNotification(message, 'error');
  }
}

function showLoginError(message) {
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
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (errorDiv.parentElement) {
      errorDiv.remove();
    }
  }, 5000);
}

// Initialize real data loading on page load
if (document.getElementById('recentItemsGrid')) {
  loadRecentItemsFromAPI();
}

if (document.querySelector('.stat-number[data-count]')) {
  loadRealStats();
}

// Check authentication status on page load
checkRealAuthStatus();