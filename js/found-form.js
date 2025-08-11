// CanBeFound.com - Found Item Form Handling

// Initialize found item form
document.addEventListener('DOMContentLoaded', function() {
    initializeFoundItemForm();
});

// Initialize found item form functionality
function initializeFoundItemForm() {
    const form = document.getElementById('foundItemForm');
    if (!form) return;
    
    // Initialize file upload
    initializeFileUpload();
    
    // Initialize dependent fields
    initializeDependentFields();
    
    // Initialize form validation
    initializeFormValidation();
    
    // Handle form submission
    form.addEventListener('submit', handleFormSubmission);
    
    console.log('Found item form initialized');
}

// Initialize file upload
function initializeFileUpload() {
    const fileInput = document.getElementById('itemPhoto');
    const fileLabel = document.querySelector('.file-label');
    const previewContainer = document.getElementById('photoPreview');
    
    if (!fileInput || !fileLabel || !previewContainer) return;
    
    // File input change
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file && validateFile(file)) {
            showFilePreview(file);
        }
    });
    
    // Drag and drop
    fileLabel.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('drag-over');
    });
    
    fileLabel.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
    });
    
    fileLabel.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0 && validateFile(files[0])) {
            fileInput.files = files;
            showFilePreview(files[0]);
        }
    });
}

// Validate file
function validateFile(file) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    if (file.size > maxSize) {
        showError('File size must be less than 5MB');
        return false;
    }
    
    if (!allowedTypes.includes(file.type)) {
        showError('Only image files (JPEG, PNG, GIF, WebP) are allowed');
        return false;
    }
    
    return true;
}

// Show file preview
function showFilePreview(file) {
    const previewContainer = document.getElementById('photoPreview');
    if (!previewContainer) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        previewContainer.innerHTML = `
            <div class="preview-item">
                <img src="${e.target.result}" alt="Item preview" class="preview-image">
                <button type="button" class="remove-preview" onclick="removePreview()" aria-label="Remove image">
                    <span>&times;</span>
                </button>
                <div class="preview-info">
                    <span class="file-name">${file.name}</span>
                    <span class="file-size">${formatFileSize(file.size)}</span>
                </div>
            </div>
        `;
    };
    reader.readAsDataURL(file);
}

// Remove preview
function removePreview() {
    const previewContainer = document.getElementById('photoPreview');
    const fileInput = document.getElementById('itemPhoto');
    
    if (previewContainer) {
        previewContainer.innerHTML = '';
    }
    
    if (fileInput) {
        fileInput.value = '';
    }
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Initialize dependent fields
function initializeDependentFields() {
    const handoverSelect = document.getElementById('handoverLocation');
    const customLocationGroup = document.getElementById('customLocationGroup');
    
    if (handoverSelect && customLocationGroup) {
        handoverSelect.addEventListener('change', function() {
            if (this.value === 'other') {
                customLocationGroup.style.display = 'block';
                const customInput = document.getElementById('customLocation');
                if (customInput) {
                    customInput.setAttribute('required', 'required');
                    customInput.focus();
                }
            } else {
                customLocationGroup.style.display = 'none';
                const customInput = document.getElementById('customLocation');
                if (customInput) {
                    customInput.removeAttribute('required');
                    customInput.value = '';
                }
            }
        });
    }
}

// Initialize form validation
function initializeFormValidation() {
    const form = document.getElementById('foundItemForm');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        // Real-time validation
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous errors
    clearFieldError(field);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    else if (fieldType === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Date validation
    else if (fieldType === 'date' && value) {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(23, 59, 59, 999); // End of today
        
        if (selectedDate > today) {
            isValid = false;
            errorMessage = 'Date cannot be in the future';
        }
        
        // Check if date is too old (more than 1 year ago)
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        
        if (selectedDate < oneYearAgo) {
            isValid = false;
            errorMessage = 'Date cannot be more than 1 year ago';
        }
    }
    
    // Text length validation
    else if (fieldName === 'description' && value.length > 0 && value.length < 10) {
        isValid = false;
        errorMessage = 'Description must be at least 10 characters long';
    }
    
    // College ID validation
    else if (fieldName === 'collegeId' && value) {
        if (value.length < 3) {
            isValid = false;
            errorMessage = 'College ID must be at least 3 characters long';
        }
    }
    
    // Show error if invalid
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    field.classList.add('error');
    
    const errorElement = document.getElementById(field.name + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    // Announce error to screen readers
    if (window.Accessibility) {
        window.Accessibility.announceToScreenReader(`Error: ${message}`);
    }
}

// Clear field error
function clearFieldError(field) {
    field.classList.remove('error');
    
    const errorElement = document.getElementById(field.name + 'Error');
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

// Handle form submission
function handleFormSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const inputs = form.querySelectorAll('input, select, textarea');
    let isValid = true;
    
    // Validate all fields
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        // Focus first error field
        const firstError = form.querySelector('.error');
        if (firstError) {
            firstError.focus();
        }
        
        showError('Please correct the errors above');
        return;
    }
    
    // Collect form data
    const formData = collectFormData(form);
    
    // Submit form
    submitFoundItemForm(formData);
}

// Collect form data
function collectFormData(form) {
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // Add timestamp
    data.submittedAt = new Date().toISOString();
    
    return data;
}

// Submit found item form
function submitFoundItemForm(data) {
    const submitBtn = document.querySelector('#foundItemForm button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    
    // Simulate API call
    setTimeout(() => {
        // Mock successful submission
        console.log('Found item submitted:', data);
        
        // Show success message
        showSuccessMessage();
        
        // Reset form after delay
        setTimeout(() => {
            resetForm();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        }, 3000);
        
    }, 2000);
}

// Show success message
function showSuccessMessage() {
    const form = document.getElementById('foundItemForm');
    const container = form.closest('.form-container');
    
    if (container) {
        container.innerHTML = `
            <div class="success-message">
                <div class="success-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22,4 12,14.01 9,11.01"></polyline>
                    </svg>
                </div>
                <h2 class="success-title">Thank You!</h2>
                <p class="success-text">
                    Your found item report has been submitted successfully. 
                    We'll help match it with someone who has lost this item.
                </p>
                <div class="success-details">
                    <p><strong>What happens next?</strong></p>
                    <ul>
                        <li>We'll review your submission within 24 hours</li>
                        <li>If there are potential matches, we'll contact you</li>
                        <li>You'll receive updates via email</li>
                    </ul>
                </div>
                <div class="success-actions">
                    <a href="search.html" class="btn btn-primary">Browse Lost Items</a>
                    <a href="index.html" class="btn btn-secondary">Back to Home</a>
                </div>
            </div>
        `;
    }
    
    // Show notification
    if (window.CanBeFound) {
        window.CanBeFound.showNotification('Found item report submitted successfully!', 'success');
    }
    
    // Announce to screen readers
    if (window.Accessibility) {
        window.Accessibility.announceToScreenReader('Found item report submitted successfully');
    }
}

// Reset form
function resetForm() {
    const form = document.getElementById('foundItemForm');
    if (form) {
        form.reset();
        
        // Clear file preview
        removePreview();
        
        // Clear all errors
        const errorElements = form.querySelectorAll('.form-error');
        errorElements.forEach(error => {
            error.textContent = '';
            error.style.display = 'none';
        });
        
        // Remove error classes
        const errorFields = form.querySelectorAll('.error');
        errorFields.forEach(field => {
            field.classList.remove('error');
        });
        
        // Hide custom location field
        const customLocationGroup = document.getElementById('customLocationGroup');
        if (customLocationGroup) {
            customLocationGroup.style.display = 'none';
        }
    }
}

// Show error message
function showError(message) {
    if (window.CanBeFound) {
        window.CanBeFound.showNotification(message, 'error');
    }
}

// Export functions for global access
window.removePreview = removePreview;