// CanBeFound.com - Help Page Functionality

// Help page state
let helpState = {
    currentSection: 'getting-started',
    searchQuery: '',
    expandedFAQs: new Set()
};

// Initialize help page
document.addEventListener('DOMContentLoaded', function() {
    initializeHelpPage();
});

// Initialize help page functionality
function initializeHelpPage() {
    // Help search
    initializeHelpSearch();
    
    // Navigation
    initializeHelpNavigation();
    
    // FAQ functionality
    initializeFAQs();
    
    // Contact form
    initializeContactForm();
    
    // Load initial section
    showHelpSection('getting-started');
    
    console.log('Help page initialized');
}

// Initialize help search
function initializeHelpSearch() {
    const searchInput = document.getElementById('helpSearch');
    const searchBtn = document.getElementById('helpSearchBtn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', performHelpSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performHelpSearch();
            }
        });
        
        // Real-time search
        searchInput.addEventListener('input', window.CanBeFound?.debounce(performHelpSearch, 300));
    }
}

// Perform help search
function performHelpSearch() {
    const searchInput = document.getElementById('helpSearch');
    const query = searchInput?.value.trim().toLowerCase();
    
    if (!query) {
        clearSearchHighlights();
        return;
    }
    
    helpState.searchQuery = query;
    
    // Search through FAQ content
    searchFAQContent(query);
    
    // Highlight search results
    highlightSearchResults(query);
    
    // Announce results to screen readers
    if (window.Accessibility) {
        const resultCount = document.querySelectorAll('.search-highlight').length;
        window.Accessibility.announceToScreenReader(`Found ${resultCount} search results for "${query}"`);
    }
}

// Search FAQ content
function searchFAQContent(query) {
    const faqItems = document.querySelectorAll('.faq-item');
    let hasResults = false;
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question')?.textContent.toLowerCase();
        const answer = item.querySelector('.faq-answer')?.textContent.toLowerCase();
        
        if (question?.includes(query) || answer?.includes(query)) {
            item.style.display = 'block';
            item.classList.add('search-result');
            hasResults = true;
            
            // Auto-expand matching FAQs
            if (!item.classList.contains('active')) {
                item.classList.add('active');
                helpState.expandedFAQs.add(item.id || item.querySelector('.faq-question')?.textContent);
            }
        } else {
            item.style.display = 'none';
            item.classList.remove('search-result');
        }
    });
    
    // Show no results message if needed
    showNoSearchResults(!hasResults);
}

// Highlight search results
function highlightSearchResults(query) {
    clearSearchHighlights();
    
    const textNodes = getTextNodes(document.querySelector('.help-main'));
    
    textNodes.forEach(node => {
        const text = node.textContent;
        const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
        
        if (regex.test(text)) {
            const highlightedText = text.replace(regex, '<mark class="search-highlight">$1</mark>');
            const wrapper = document.createElement('span');
            wrapper.innerHTML = highlightedText;
            node.parentNode.replaceChild(wrapper, node);
        }
    });
}

// Clear search highlights
function clearSearchHighlights() {
    const highlights = document.querySelectorAll('.search-highlight');
    highlights.forEach(highlight => {
        const parent = highlight.parentNode;
        parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
        parent.normalize();
    });
    
    // Show all FAQ items
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.style.display = 'block';
        item.classList.remove('search-result');
    });
    
    hideNoSearchResults();
}

// Get text nodes
function getTextNodes(element) {
    const textNodes = [];
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: function(node) {
                // Skip script and style elements
                const parent = node.parentElement;
                if (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') {
                    return NodeFilter.FILTER_REJECT;
                }
                // Only include text nodes with actual content
                if (node.textContent.trim().length > 0) {
                    return NodeFilter.FILTER_ACCEPT;
                }
                return NodeFilter.FILTER_REJECT;
            }
        }
    );
    
    let node;
    while (node = walker.nextNode()) {
        textNodes.push(node);
    }
    
    return textNodes;
}

// Escape regex special characters
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Show no search results message
function showNoSearchResults(show) {
    let noResultsMsg = document.getElementById('noSearchResults');
    
    if (show && !noResultsMsg) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.id = 'noSearchResults';
        noResultsMsg.className = 'no-search-results';
        noResultsMsg.innerHTML = `
            <div class="no-results-icon">🔍</div>
            <h3>No results found</h3>
            <p>Try different keywords or browse the help topics below.</p>
        `;
        
        const helpMain = document.querySelector('.help-main');
        if (helpMain) {
            helpMain.appendChild(noResultsMsg);
        }
    } else if (!show && noResultsMsg) {
        noResultsMsg.remove();
    }
}

// Hide no search results message
function hideNoSearchResults() {
    const noResultsMsg = document.getElementById('noSearchResults');
    if (noResultsMsg) {
        noResultsMsg.remove();
    }
}

// Initialize help navigation
function initializeHelpNavigation() {
    const navLinks = document.querySelectorAll('.help-nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const sectionId = this.getAttribute('href').substring(1);
            showHelpSection(sectionId);
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Clear search when navigating
            clearSearch();
        });
    });
}

// Show help section
function showHelpSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.help-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        helpState.currentSection = sectionId;
        
        // Scroll to top of section
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Announce to screen readers
        if (window.Accessibility) {
            const sectionTitle = targetSection.querySelector('.section-title')?.textContent;
            window.Accessibility.announceToScreenReader(`Switched to ${sectionTitle || sectionId} section`);
        }
    }
}

// Clear search
function clearSearch() {
    const searchInput = document.getElementById('helpSearch');
    if (searchInput) {
        searchInput.value = '';
    }
    
    helpState.searchQuery = '';
    clearSearchHighlights();
}

// Initialize FAQs
function initializeFAQs() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', function() {
                toggleFAQ(item);
            });
            
            // Keyboard support
            question.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleFAQ(item);
                }
            });
            
            // Make focusable
            question.setAttribute('tabindex', '0');
            question.setAttribute('role', 'button');
            question.setAttribute('aria-expanded', 'false');
        }
    });
}

// Toggle FAQ
function toggleFAQ(faqItem) {
    const question = faqItem.querySelector('.faq-question');
    const answer = faqItem.querySelector('.faq-answer');
    const isActive = faqItem.classList.contains('active');
    
    if (isActive) {
        // Close FAQ
        faqItem.classList.remove('active');
        answer.style.display = 'none';
        question.setAttribute('aria-expanded', 'false');
        
        // Remove from expanded set
        const questionText = question.textContent;
        helpState.expandedFAQs.delete(questionText);
        
        // Announce to screen readers
        if (window.Accessibility) {
            window.Accessibility.announceToScreenReader('FAQ collapsed');
        }
    } else {
        // Open FAQ
        faqItem.classList.add('active');
        answer.style.display = 'block';
        question.setAttribute('aria-expanded', 'true');
        
        // Add to expanded set
        const questionText = question.textContent;
        helpState.expandedFAQs.add(questionText);
        
        // Announce to screen readers
        if (window.Accessibility) {
            window.Accessibility.announceToScreenReader('FAQ expanded');
        }
    }
}

// Initialize contact form
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactFormSubmission();
        });
        
        // Form validation
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateContactField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    validateContactField(input);
                }
            });
        });
    }
}

// Validate contact field
function validateContactField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous error
    clearContactFieldError(field);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    else if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Message length validation
    else if (field.name === 'message' && value.length > 0 && value.length < 10) {
        isValid = false;
        errorMessage = 'Message must be at least 10 characters long';
    }
    
    // Show error if invalid
    if (!isValid) {
        showContactFieldError(field, errorMessage);
    }
    
    return isValid;
}

// Show contact field error
function showContactFieldError(field, message) {
    field.classList.add('error');
    
    // Create or update error element
    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    // Announce error to screen readers
    if (window.Accessibility) {
        window.Accessibility.announceToScreenReader(`Error: ${message}`);
    }
}

// Clear contact field error
function clearContactFieldError(field) {
    field.classList.remove('error');
    
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

// Handle contact form submission
function handleContactFormSubmission() {
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    let isValid = true;
    
    // Validate all fields
    inputs.forEach(input => {
        if (!validateContactField(input)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        // Focus first error field
        const firstError = form.querySelector('.error');
        if (firstError) {
            firstError.focus();
        }
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        // Show success message
        if (window.CanBeFound) {
            window.CanBeFound.showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
        }
        
        // Reset form
        form.reset();
        
        // Clear any errors
        const errorFields = form.querySelectorAll('.error');
        errorFields.forEach(field => {
            clearContactFieldError(field);
        });
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Announce success to screen readers
        if (window.Accessibility) {
            window.Accessibility.announceToScreenReader('Contact form submitted successfully');
        }
        
    }, 1500);
}

// Export help functions
window.HelpManager = {
    showHelpSection,
    toggleFAQ,
    performHelpSearch,
    clearSearch
};