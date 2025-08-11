// CanBeFound.com - Legal Pages Functionality

// Legal page state
let legalState = {
    currentSection: 'privacy',
    lastUpdated: {
        privacy: '2025-01-01',
        terms: '2025-01-01',
        cookies: '2025-01-01'
    }
};

// Initialize legal pages
document.addEventListener('DOMContentLoaded', function() {
    initializeLegalPages();
});

// Initialize legal pages functionality
function initializeLegalPages() {
    // Navigation
    initializeLegalNavigation();
    
    // Section switching
    initializeSectionSwitching();
    
    // Print functionality
    initializePrintFunctionality();
    
    // Accessibility improvements
    improveLegalAccessibility();
    
    // Load initial section
    const hash = window.location.hash.substring(1);
    const initialSection = hash || 'privacy';
    showLegalSection(initialSection);
    
    console.log('Legal pages initialized');
}

// Initialize legal navigation
function initializeLegalNavigation() {
    const navLinks = document.querySelectorAll('.legal-nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const sectionId = this.getAttribute('href').substring(1);
            showLegalSection(sectionId);
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Update URL hash
            window.history.pushState(null, null, `#${sectionId}`);
        });
    });
}

// Initialize section switching
function initializeSectionSwitching() {
    // Handle browser back/forward
    window.addEventListener('popstate', function() {
        const hash = window.location.hash.substring(1);
        const section = hash || 'privacy';
        showLegalSection(section);
        updateActiveNavLink(section);
    });
}

// Show legal section
function showLegalSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.legal-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        legalState.currentSection = sectionId;
        
        // Update page title
        updatePageTitle(sectionId);
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Announce to screen readers
        if (window.Accessibility) {
            const sectionTitle = targetSection.querySelector('.legal-title')?.textContent;
            window.Accessibility.announceToScreenReader(`Switched to ${sectionTitle || sectionId} section`);
        }
        
        // Update last read timestamp
        updateLastReadTimestamp(sectionId);
    }
}

// Update active navigation link
function updateActiveNavLink(sectionId) {
    const navLinks = document.querySelectorAll('.legal-nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });
}

// Update page title
function updatePageTitle(section) {
    const titles = {
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        cookies: 'Cookie Policy'
    };
    
    const title = titles[section] || section;
    document.title = `${title} - CanBeFound.com`;
}

// Update last read timestamp
function updateLastReadTimestamp(section) {
    const timestamp = new Date().toISOString();
    localStorage.setItem(`legal_${section}_read`, timestamp);
}

// Initialize print functionality
function initializePrintFunctionality() {
    // Add print button to each section
    const sections = document.querySelectorAll('.legal-section');
    
    sections.forEach(section => {
        const header = section.querySelector('.legal-title');
        if (header) {
            const printBtn = document.createElement('button');
            printBtn.className = 'print-btn';
            printBtn.innerHTML = '🖨️ Print';
            printBtn.setAttribute('aria-label', 'Print this section');
            printBtn.style.cssText = `
                float: right;
                margin-left: 1rem;
                padding: 0.5rem 1rem;
                background: var(--primary-color);
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.875rem;
            `;
            
            printBtn.addEventListener('click', () => printSection(section));
            header.appendChild(printBtn);
        }
    });
    
    // Handle print media queries
    window.addEventListener('beforeprint', function() {
        // Hide non-essential elements for printing
        const elementsToHide = document.querySelectorAll('.legal-nav, .print-btn');
        elementsToHide.forEach(el => {
            el.style.display = 'none';
        });
    });
    
    window.addEventListener('afterprint', function() {
        // Restore hidden elements after printing
        const elementsToShow = document.querySelectorAll('.legal-nav, .print-btn');
        elementsToShow.forEach(el => {
            el.style.display = '';
        });
    });
}

// Print section
function printSection(section) {
    const printWindow = window.open('', '_blank');
    const sectionTitle = section.querySelector('.legal-title')?.textContent || 'Legal Document';
    const sectionContent = section.innerHTML;
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${sectionTitle} - CanBeFound.com</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 2rem;
                }
                h1, h2, h3, h4, h5, h6 {
                    color: #003f5c;
                    margin-top: 2rem;
                    margin-bottom: 1rem;
                }
                h1 {
                    border-bottom: 2px solid #ffa600;
                    padding-bottom: 0.5rem;
                }
                h2 {
                    border-bottom: 1px solid #ffa600;
                    padding-bottom: 0.25rem;
                }
                ul, ol {
                    margin-bottom: 1rem;
                    padding-left: 2rem;
                }
                li {
                    margin-bottom: 0.5rem;
                }
                p {
                    margin-bottom: 1rem;
                }
                .legal-updated {
                    font-style: italic;
                    color: #666;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 1rem;
                    margin-bottom: 2rem;
                }
                .legal-intro {
                    background: #f8f9fa;
                    padding: 1.5rem;
                    border-left: 4px solid #003f5c;
                    margin-bottom: 2rem;
                }
                .print-btn {
                    display: none !important;
                }
                @media print {
                    body {
                        padding: 0;
                    }
                    h1 {
                        page-break-after: avoid;
                    }
                    h2, h3, h4, h5, h6 {
                        page-break-after: avoid;
                        page-break-inside: avoid;
                    }
                    ul, ol {
                        page-break-inside: avoid;
                    }
                }
            </style>
        </head>
        <body>
            ${sectionContent}
            <footer style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 0.875rem;">
                <p>Printed from CanBeFound.com on ${new Date().toLocaleDateString()}</p>
            </footer>
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    // Print after content loads
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
}

// Improve legal accessibility
function improveLegalAccessibility() {
    // Add skip links for long documents
    const sections = document.querySelectorAll('.legal-section');
    
    sections.forEach(section => {
        const headings = section.querySelectorAll('h2');
        if (headings.length > 3) {
            // Create table of contents
            createTableOfContents(section, headings);
        }
    });
    
    // Improve link accessibility
    const links = document.querySelectorAll('.legal-section a[href^="http"]');
    links.forEach(link => {
        if (!link.getAttribute('aria-label')) {
            link.setAttribute('aria-label', `External link: ${link.textContent}`);
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });
    
    // Add reading time estimates
    addReadingTimeEstimates();
}

// Create table of contents
function createTableOfContents(section, headings) {
    const tocContainer = document.createElement('div');
    tocContainer.className = 'legal-toc';
    tocContainer.innerHTML = '<h3>Table of Contents</h3>';
    
    const tocList = document.createElement('ul');
    
    headings.forEach((heading, index) => {
        // Add ID to heading if it doesn't have one
        if (!heading.id) {
            heading.id = `section-${index + 1}`;
        }
        
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent;
        link.addEventListener('click', function(e) {
            e.preventDefault();
            heading.scrollIntoView({ behavior: 'smooth' });
            heading.focus();
        });
        
        listItem.appendChild(link);
        tocList.appendChild(listItem);
    });
    
    tocContainer.appendChild(tocList);
    
    // Insert TOC after the intro
    const intro = section.querySelector('.legal-intro');
    if (intro) {
        intro.parentNode.insertBefore(tocContainer, intro.nextSibling);
    } else {
        const title = section.querySelector('.legal-title');
        if (title) {
            title.parentNode.insertBefore(tocContainer, title.nextSibling);
        }
    }
}

// Add reading time estimates
function addReadingTimeEstimates() {
    const sections = document.querySelectorAll('.legal-section');
    
    sections.forEach(section => {
        const content = section.querySelector('.legal-section-content');
        if (content) {
            const wordCount = content.textContent.split(/\s+/).length;
            const readingTime = Math.ceil(wordCount / 200); // Average reading speed: 200 words per minute
            
            const timeEstimate = document.createElement('div');
            timeEstimate.className = 'reading-time';
            timeEstimate.innerHTML = `<small>📖 Estimated reading time: ${readingTime} minute${readingTime !== 1 ? 's' : ''}</small>`;
            timeEstimate.style.cssText = `
                color: #666;
                font-style: italic;
                margin-bottom: 1rem;
                padding: 0.5rem;
                background: #f8f9fa;
                border-radius: 4px;
                text-align: center;
            `;
            
            const updated = section.querySelector('.legal-updated');
            if (updated) {
                updated.parentNode.insertBefore(timeEstimate, updated.nextSibling);
            }
        }
    });
}

// Check for updates
function checkForUpdates() {
    // In a real application, this would check with the server
    const lastChecked = localStorage.getItem('legal_last_checked');
    const now = new Date().toISOString().split('T')[0];
    
    if (lastChecked !== now) {
        localStorage.setItem('legal_last_checked', now);
        
        // Simulate checking for updates
        setTimeout(() => {
            // Show notification if there are updates
            const hasUpdates = Math.random() > 0.8; // 20% chance of updates
            
            if (hasUpdates && window.CanBeFound) {
                window.CanBeFound.showNotification(
                    'Legal documents have been updated. Please review the changes.',
                    'info'
                );
            }
        }, 2000);
    }
}

// Initialize update checking
setTimeout(checkForUpdates, 1000);

// Export legal functions
window.LegalManager = {
    showLegalSection,
    printSection,
    checkForUpdates
};