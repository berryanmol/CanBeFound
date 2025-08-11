// CanBeFound.com - Form Handling

// Form state management
let currentStep = 1;
let totalSteps = 3;
let formData = {};

// Initialize form functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeForms();
});

// Initialize all forms
function initializeForms() {
    // Initialize multi-step form
    initializeMultiStepForm();
    
    // Initialize file uploads
    initializeFileUploads();
    
    // Initialize form validation
    initializeFormValidation();
    
    // Initialize dependent fields
    initializeDependentFields();
    
    console.log('Form system initialized');
}

// Initialize multi-step form
function initializeMultiStepForm() {
    const form = document.getElementById('lostItemForm');
    if (!form) return;
    
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => goToStep(currentStep - 1));
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (validateCurrentStep()) {
                goToStep(currentStep + 1);
            }
        });
    }
    
    if (submitBtn) {
        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (validateCurrentStep()) {
                submitForm();
            }
        });
    }
    
    // Initialize progress
    updateProgress();
}

// Go to specific step
function goToStep(step) {
    if (step < 1 || step > totalSteps) return;
    
    // Hide current step
    const currentStepElement = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    if (currentStepElement) {
        currentStepElement.classList.remove('active');
    }
    
    // Show target step
    const targetStepElement = document.querySelector(`.form-step[data-step="${step}"]`);
    if (targetStepElement) {
        targetStepElement.classList.add('active');
    }
    
    // Update current step
    currentStep = step;
    
    // Update navigation buttons
    updateNavigationButtons();
    
    // Update progress
    updateProgress();
    
    // Focus first input in new step
    setTimeout(() => {
        const firstInput = targetStepElement?.querySelector('input, select, textarea');
        if (firstInput) {
            firstInput.focus();
        }
    }, 100);
    
    // Announce step change to screen readers
    if (window.Accessibility) {
        window.Accessibility.announceToScreenReader(`Step ${step} of ${totalSteps}`);
    }
}

// Update navigation buttons
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    if (prevBtn) {
        prevBtn.style.display = currentStep === 1 ? 'none' : 'inline-flex';
    }
    
    if (nextBtn) {
        nextBtn.style.display = currentStep === totalSteps ? 'none' : 'inline-flex';
    }
    
    if (submitBtn) {
        submitBtn.style.display = currentStep === totalSteps ? 'inline-flex' : 'none';
    }
}

// Update progress bar
function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const progressSteps = document.querySelectorAll('.progress-step');
    
    if (progressFill) {
        const percentage = (currentStep / totalSteps) * 100;
        progressFill.style.width = `${percentage}%`;
    }
    
    progressSteps.forEach((step, index) => {
        const stepNumber = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNumber === currentStep) {
            step.classList.add('active');
        } else if (stepNumber < currentStep) {
            step.classList.add('completed');
        }
    });
}

// Validate current step
function validateCurrentStep() {
    const currentStepElement = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    if (!currentStepElement) return true;
    
    const requiredFields = currentStepElement.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
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
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate > today) {
            isValid = false;
            errorMessage = 'Date cannot be in the future';
        }
    }
    
    // Text length validation
    else if (fieldType === 'text' || fieldType === 'textarea') {
        if (fieldName === 'description' && value.length < 10) {
            isValid = false;
            errorMessage = 'Description must be at least 10 characters long';
        }
    }
    
    // Phone validation
    else if (fieldType === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
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
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;
    
    formGroup.classList.add('has-error');
    
    const errorElement = formGroup.querySelector('.form-error');
    if (errorElement) {
        errorElement.textContent = message;
    }
    
    // Announce error to screen readers
    if (window.Accessibility) {
        window.Accessibility.announceToScreenReader(`Error: ${message}`);
    }
}

// Clear field error
function clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;
    
    formGroup.classList.remove('has-error');
    
    const errorElement = formGroup.querySelector('.form-error');
    if (errorElement) {
        errorElement.textContent = '';
    }
}

// Initialize file uploads
function initializeFileUploads() {
    const fileInputs = document.querySelectorAll('.file-input');
    
    fileInputs.forEach(input => {
        input.addEventListener('change', handleFileUpload);
        
        // Drag and drop functionality
        const label = input.nextElementSibling;
        if (label && label.classList.contains('file-label')) {
            label.addEventListener('dragover', handleDragOver);
            label.addEventListener('dragleave', handleDragLeave);
            label.addEventListener('drop', (e) => handleFileDrop(e, input));
        }
    });
}

// Handle file upload
function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file
    if (!validateFile(file)) {
        e.target.value = '';
        return;
    }
    
    // Show preview
    showFilePreview(file, e.target);
}

// Validate file
function validateFile(file) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    if (file.size > maxSize) {
        if (window.CanBeFound) {
            window.CanBeFound.showNotification('File size must be less than 5MB', 'error');
        }
        return false;
    }
    
    if (!allowedTypes.includes(file.type)) {
        if (window.CanBeFound) {
            window.CanBeFound.showNotification('Only image files are allowed', 'error');
        }
        return false;
    }
    
    return true;
}

// Show file preview
function showFilePreview(file, input) {
    const formGroup = input.closest('.form-group');
    const previewContainer = formGroup.querySelector('.file-preview');
    
    if (!previewContainer) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        previewContainer.innerHTML = `
            <div class="file-preview-item">
                <img src="${e.target.result}" alt="Preview" style="max-width: 200px; max-height: 200px; border-radius: 8px;">
                <button type="button" class="remove-file-btn" onclick="removeFilePreview(this)">Remove</button>
            </div>
        `;
    };
    reader.readAsDataURL(file);
}

// Remove file preview
function removeFilePreview(button) {
    const previewItem = button.closest('.file-preview-item');
    const formGroup = button.closest('.form-group');
    const fileInput = formGroup.querySelector('.file-input');
    
    if (previewItem) {
        previewItem.remove();
    }
    
    if (fileInput) {
        fileInput.value = '';
    }
}

// Handle drag over
function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}

// Handle drag leave
function handleDragLeave(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
}

// Handle file drop
function handleFileDrop(e, input) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        input.files = files;
        handleFileUpload({ target: input });
    }
}

// Initialize form validation
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            // Real-time validation
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('has-error')) {
                    validateField(input);
                }
            });
        });
        
        // Form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });
            
            if (isValid) {
                if (form.id === 'lostItemForm') {
                    submitForm();
                } else {
                    // Handle other forms
                    handleFormSubmission(form);
                }
            } else {
                // Focus first error field
                const firstError = form.querySelector('.has-error input, .has-error select, .has-error textarea');
                if (firstError) {
                    firstError.focus();
                }
            }
        });
    });
}

// Initialize dependent fields
function initializeDependentFields() {
    // Custom location field
    const locationSelect = document.getElementById('location');
    const customLocationGroup = document.getElementById('customLocationGroup');
    
    if (locationSelect && customLocationGroup) {
        locationSelect.addEventListener('change', function() {
            if (this.value === 'other') {
                customLocationGroup.style.display = 'block';
                const customInput = customLocationGroup.querySelector('input');
                if (customInput) {
                    customInput.setAttribute('required', 'required');
                }
            } else {
                customLocationGroup.style.display = 'none';
                const customInput = customLocationGroup.querySelector('input');
                if (customInput) {
                    customInput.removeAttribute('required');
                    customInput.value = '';
                }
            }
        });
    }
    
    // Handover location for found items
    const handoverSelect = document.getElementById('handoverLocation');
    const customHandoverGroup = document.getElementById('customLocationGroup');
    
    if (handoverSelect && customHandoverGroup) {
        handoverSelect.addEventListener('change', function() {
            if (this.value === 'other') {
                customHandoverGroup.style.display = 'block';
            } else {
                customHandoverGroup.style.display = 'none';
            }
        });
    }
}

// Submit form
function submitForm() {
    const form = document.getElementById('lostItemForm');
    if (!form) return;
    
    // Collect form data
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // Show loading state
    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Mock successful submission
        showSuccessMessage();
        
        // Reset form after delay
        setTimeout(() => {
            form.reset();
            currentStep = 1;
            goToStep(1);
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 3000);
        
    }, 2000);
}

// Show success message
function showSuccessMessage() {
    const form = document.getElementById('lostItemForm');
    if (!form) return;
    
    const successHTML = `
        <div class="form-success">
            <div class="success-icon">✅</div>
            <h3 class="success-title">Report Submitted Successfully!</h3>
            <p class="success-text">
                Your lost item report has been submitted. We'll notify you if there are any matches.
                You can track the status of your report in your dashboard.
            </p>
            <div class="success-actions">
                <a href="search.html" class="btn btn-primary">Search for Items</a>
                <a href="index.html" class="btn btn-secondary">Back to Home</a>
            </div>
        </div>
    `;
    
    form.innerHTML = successHTML;
    
    // Announce success to screen readers
    if (window.Accessibility) {
        window.Accessibility.announceToScreenReader('Report submitted successfully');
    }
    
    // Show notification
    if (window.CanBeFound) {
        window.CanBeFound.showNotification('Your report has been submitted successfully!', 'success');
    }
}

// Handle other form submissions
function handleFormSubmission(form) {
    const formId = form.id;
    
    switch (formId) {
        case 'foundItemForm':
            handleFoundItemSubmission(form);
            break;
        case 'contactForm':
            handleContactFormSubmission(form);
            break;
        default:
            console.log('Form submitted:', formId);
    }
}

// Handle found item form submission
function handleFoundItemSubmission(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        if (window.CanBeFound) {
            window.CanBeFound.showNotification('Found item report submitted successfully!', 'success');
        }
        
        // Redirect to success page or reset form
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        
    }, 1500);
}

// Handle contact form submission
function handleContactFormSubmission(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        if (window.CanBeFound) {
            window.CanBeFound.showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
        }
        
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
    }, 1500);
}

// Export form functions
window.FormManager = {
    goToStep,
    validateField,
    submitForm,
    removeFilePreview
};