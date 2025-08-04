/**
 * Certificate Management System
 * Dynamically loads and displays certificates from JSON data
 */
class CertificateManager {
    constructor() {
        this.data = {};
        this.currentFilter = 'all';
        this.init();
    }

    async init() {
        try {
            await this.loadData();
            this.renderAllTabs();
            this.setupFilters();
            this.setupSearch();
        } catch (error) {
            console.error('Error initializing certificate manager:', error);
            this.showError('Failed to load certificate data. Please check your connection and try again.');
        }
    }

    async loadData() {
        try {
            const response = await fetch('data/certificates.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.data = await response.json();
        } catch (error) {
            console.error('Error loading certificate data:', error);
            throw error;
        }
    }

    renderAllTabs() {
        this.renderTab('certifications', this.data.certifications || []);
        this.renderTab('awards', this.data.achievements || []);
        this.renderTab('workshops', this.data.workshops || []);
        this.renderTab('seminars', this.data.seminars || []);
        this.renderTab('events', this.data.events || []);
    }

    renderTab(tabId, items) {
        const container = document.querySelector(`#${tabId} .achievements-grid`);
        if (!container) {
            console.warn(`Container for tab ${tabId} not found`);
            return;
        }

        if (items.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📋</div>
                    <h3>No items found</h3>
                    <p>No ${tabId} have been added yet.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = items.map(item => this.createItemCard(item, tabId === 'certifications')).join('');
    }

    createItemCard(item, isCertification = false) {
        const credentialSection = item.credentialId ? `
            <p class="credential-id">Credential ID: ${item.credentialId}</p>
        ` : '';

        const actionsSection = isCertification ? `
            <div class="certificate-actions">
                ${item.verificationUrl ? `
                    <a href="${item.verificationUrl}" target="_blank" class="verify-btn" rel="noopener noreferrer">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708z"/>
                        </svg>
                        Verify Certificate
                    </a>
                ` : `
                    <button onclick="certificateManager.verifyCertificate('${item.credentialId || 'N/A'}', '${item.verificationUrl || ''}', '${item.title}')" class="verify-btn">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708z"/>
                        </svg>
                        Verify Certificate
                    </button>
                `}
                ${item.image ? `
                    <button onclick="certificateManager.showCertificate('${item.image}', '${item.title}')" class="view-btn">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                        </svg>
                        View Certificate
                    </button>
                ` : ''}
            </div>
        ` : '';

        const certificatePreview = item.image ? `
            <div class="certificate-preview">
                <img src="${item.image}" alt="${item.title} Preview" class="certificate-thumbnail" onclick="certificateManager.showCertificate('${item.image}', '${item.title}')" onerror="this.style.display='none'">
                <div class="preview-overlay" onclick="certificateManager.showCertificate('${item.image}', '${item.title}')">
                    <svg width="20" height="20" fill="white" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                    </svg>
                </div>
            </div>
        ` : '';

        return `
            <div class="achievement-card" data-category="${item.category}" data-date="${item.date}">
                ${certificatePreview}
                <div class="achievement-content">
                    <div class="achievement-header">
                        <div class="achievement-title-section">
                            <h3>${item.title}</h3>
                            <span class="achievement-date">${item.issuer}</span>
                        </div>
                    </div>
                    <p class="achievement-issuer">${item.date}</p>
                    ${credentialSection}
                    <div class="achievement-tags">
                        ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    ${actionsSection}
                </div>
            </div>
        `;
    }

    setupFilters() {
        // Simplified - no additional filter controls needed
        // The tab navigation already provides sufficient filtering
    }

    setupSearch() {
        // Add search functionality
        const wrapper = document.querySelector('.search-controls-wrapper');
        if (wrapper) {
            const searchBox = document.createElement('div');
            searchBox.className = 'search-container';
            searchBox.innerHTML = `
                <div class="search-controls">
                    <div class="search-box">
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16" class="search-icon">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                        </svg>
                        <input type="text" id="searchInput" placeholder="Search certificates, skills, or issuers..." class="search-input">
                        <button class="clear-search" id="clearSearch" style="display: none;">
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                            </svg>
                        </button>
                    </div>
                    <div class="sort-controls">
                        <label for="sortSelect" class="sort-label">Sort by:</label>
                        <select id="sortSelect" class="sort-select">
                            <option value="default">Default</option>
                            <option value="name-asc">Name (A-Z)</option>
                            <option value="name-desc">Name (Z-A)</option>
                            <option value="issuer-asc">Issuer (A-Z)</option>
                            <option value="issuer-desc">Issuer (Z-A)</option>
                            <option value="date-newest">Date (Newest)</option>
                            <option value="date-oldest">Date (Oldest)</option>
                        </select>
                    </div>
                </div>
            `;
            wrapper.appendChild(searchBox);

            // Add search functionality
            const searchInput = document.getElementById('searchInput');
            const clearSearch = document.getElementById('clearSearch');
            const sortSelect = document.getElementById('sortSelect');

            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
                clearSearch.style.display = e.target.value ? 'block' : 'none';
            });

            clearSearch.addEventListener('click', () => {
                searchInput.value = '';
                this.handleSearch('');
                clearSearch.style.display = 'none';
                searchInput.focus();
            });

            // Add sorting functionality
            sortSelect.addEventListener('change', (e) => {
                this.handleSort(e.target.value);
            });
        }
    }

    handleFilterClick(button) {
        // Removed - using tab navigation instead
    }

    handleSearch(query) {
        const searchTerm = query.toLowerCase().trim();
        const cards = document.querySelectorAll('.achievement-card');
        const tabPanes = document.querySelectorAll('.tab-pane');
        let anyMatch = false;
        
        cards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const issuer = card.querySelector('.achievement-issuer').textContent.toLowerCase();
            const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase()).join(' ');
            const matches = title.includes(searchTerm) || issuer.includes(searchTerm) || tags.includes(searchTerm);
            card.style.display = matches ? 'block' : 'none';
            if (matches) anyMatch = true;
        });

        // Hide other tab panes if searching
        if (searchTerm) {
            tabPanes.forEach(pane => {
                if (!pane.classList.contains('active')) {
                    pane.style.display = 'none';
                }
            });
        } else {
            tabPanes.forEach(pane => {
                pane.style.display = '';
            });
        }

        // Show/hide empty state
        this.updateEmptyStates();
    }

    handleSort(sortValue) {
        const activeTab = document.querySelector('.tab-pane.active');
        if (!activeTab) return;

        const grid = activeTab.querySelector('.achievements-grid');
        if (!grid) return;

        const cards = Array.from(grid.querySelectorAll('.achievement-card'));
        
        // Store original data for each card
        cards.forEach(card => {
            if (!card.dataset.originalData) {
                const title = card.querySelector('h3').textContent;
                const issuer = card.querySelector('.achievement-date').textContent; // This is actually the issuer
                const date = card.querySelector('.achievement-issuer').textContent; // This is actually the date
                
                card.dataset.originalData = JSON.stringify({
                    title: title,
                    issuer: issuer,
                    date: date
                });
            }
        });

        // Sort the cards
        let sortedCards;
        switch (sortValue) {
            case 'name-asc':
                sortedCards = cards.sort((a, b) => {
                    const titleA = JSON.parse(a.dataset.originalData).title.toLowerCase();
                    const titleB = JSON.parse(b.dataset.originalData).title.toLowerCase();
                    return titleA.localeCompare(titleB);
                });
                break;
            case 'name-desc':
                sortedCards = cards.sort((a, b) => {
                    const titleA = JSON.parse(a.dataset.originalData).title.toLowerCase();
                    const titleB = JSON.parse(b.dataset.originalData).title.toLowerCase();
                    return titleB.localeCompare(titleA);
                });
                break;
            case 'issuer-asc':
                sortedCards = cards.sort((a, b) => {
                    const issuerA = JSON.parse(a.dataset.originalData).issuer.toLowerCase();
                    const issuerB = JSON.parse(b.dataset.originalData).issuer.toLowerCase();
                    return issuerA.localeCompare(issuerB);
                });
                break;
            case 'issuer-desc':
                sortedCards = cards.sort((a, b) => {
                    const issuerA = JSON.parse(a.dataset.originalData).issuer.toLowerCase();
                    const issuerB = JSON.parse(b.dataset.originalData).issuer.toLowerCase();
                    return issuerB.localeCompare(issuerA);
                });
                break;
            case 'date-newest':
                sortedCards = cards.sort((a, b) => {
                    const dateA = new Date(JSON.parse(a.dataset.originalData).date);
                    const dateB = new Date(JSON.parse(b.dataset.originalData).date);
                    return dateB - dateA;
                });
                break;
            case 'date-oldest':
                sortedCards = cards.sort((a, b) => {
                    const dateA = new Date(JSON.parse(a.dataset.originalData).date);
                    const dateB = new Date(JSON.parse(b.dataset.originalData).date);
                    return dateA - dateB;
                });
                break;
            case 'default':
            default:
                // Sort by original order (using id from dataset)
                sortedCards = cards.sort((a, b) => {
                    const categoryA = a.dataset.category;
                    const categoryB = b.dataset.category;
                    const dateA = a.dataset.date;
                    const dateB = b.dataset.date;
                    
                    // First sort by category, then by date
                    if (categoryA !== categoryB) {
                        return categoryA.localeCompare(categoryB);
                    }
                    return new Date(dateB) - new Date(dateA);
                });
                break;
        }

        // Remove all cards from grid
        cards.forEach(card => card.remove());
        
        // Re-append cards in sorted order
        sortedCards.forEach(card => grid.appendChild(card));
    }

    applyFilters() {
        // Removed - using tab-based navigation instead
    }

    updateEmptyStates() {
        const tabPanes = document.querySelectorAll('.tab-pane');
        
        tabPanes.forEach(pane => {
            if (!pane.classList.contains('active')) return; // Only check active tab
            
            const visibleCards = pane.querySelectorAll('.achievement-card:not([style*="none"])');
            const grid = pane.querySelector('.achievements-grid');
            
            if (visibleCards.length === 0 && grid && !grid.querySelector('.empty-state')) {
                const emptyState = document.createElement('div');
                emptyState.className = 'empty-state temporary';
                emptyState.innerHTML = `
                    <div class="empty-icon">🔍</div>
                    <h3>No matches found</h3>
                    <p>Try adjusting your search criteria.</p>
                `;
                grid.appendChild(emptyState);
            } else if (visibleCards.length > 0) {
                const tempEmptyState = pane.querySelector('.empty-state.temporary');
                if (tempEmptyState) {
                    tempEmptyState.remove();
                }
            }
        });
    }

    showCertificate(imagePath, title) {
        const modal = document.createElement('div');
        modal.className = 'certificate-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="close-modal" aria-label="Close certificate view">
                        <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                        </svg>
                    </button>
                </div>
                <div class="modal-body">
                    <img src="${imagePath}" alt="${title} Certificate" class="certificate-image" onerror="this.parentNode.innerHTML='<div class=&quot;certificate-placeholder&quot;><div class=&quot;placeholder-icon&quot;>📜</div><p>Certificate image not available</p><small>Image path: ${imagePath}</small></div>'" oncontextmenu="return false;" ondragstart="return false;" onselectstart="return false;">
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        // Disable right-click and other interactions on the entire modal
        modal.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            return false;
        });

        modal.addEventListener('dragstart', (e) => {
            e.preventDefault();
            return false;
        });

        modal.addEventListener('selectstart', (e) => {
            e.preventDefault();
            return false;
        });

        // Disable F12, Ctrl+Shift+I, Ctrl+U, etc. when modal is open
        const handleKeydown = (e) => {
            if (e.key === 'F12' || 
                (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                (e.ctrlKey && e.shiftKey && e.key === 'J') ||
                (e.ctrlKey && e.key === 'U')) {
                e.preventDefault();
                return false;
            }
        };

        document.addEventListener('keydown', handleKeydown);

        // Close modal functionality
        const closeModal = () => {
            modal.remove();
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleKeydown);
        };

        modal.querySelector('.close-modal').onclick = closeModal;
        modal.querySelector('.modal-overlay').onclick = closeModal;
        
        // Close on Escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);

        // Animate in
        requestAnimationFrame(() => {
            modal.classList.add('active');
        });
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <div class="error-content">
                <div class="error-icon">⚠️</div>
                <div class="error-text">
                    <h3>Error Loading Data</h3>
                    <p>${message}</p>
                </div>
                <button class="retry-btn" onclick="location.reload()">Retry</button>
            </div>
        `;

        const container = document.querySelector('.achievements-content .container');
        if (container) {
            container.appendChild(errorDiv);
        }
    }

    // Method to add new items (for future admin functionality)
    addCertificate(certificate) {
        this.data.certifications = this.data.certifications || [];
        this.data.certifications.push({
            ...certificate,
            id: Date.now() // Simple ID generation
        });
        this.renderAllTabs();
    }

    addAchievement(achievement) {
        this.data.achievements = this.data.achievements || [];
        this.data.achievements.push({
            ...achievement,
            id: Date.now()
        });
        this.renderAllTabs();
    }

    verifyCertificate(credentialId, verificationUrl, title) {
        // Create verification modal
        const modal = document.createElement('div');
        modal.className = 'certificate-modal active';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Certificate Verification</h3>
                    <button class="close-modal">
                        <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                        </svg>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="verification-content">
                        <div class="verification-header">
                            <svg width="48" height="48" fill="#4CAF50" viewBox="0 0 16 16" style="margin-bottom: 1rem;">
                                <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zm.287 5.984-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708.708z"/>
                            </svg>
                            <h4>Certificate Details</h4>
                        </div>
                        <div class="verification-details">
                            <p><strong>Certificate:</strong> ${title}</p>
                            <p><strong>Credential ID:</strong> ${credentialId}</p>
                            ${verificationUrl ? `
                                <p><strong>Status:</strong> <span style="color: #4CAF50; font-weight: 600;">Verified ✓</span></p>
                                <div style="margin-top: 1.5rem;">
                                    <a href="${verificationUrl}" target="_blank" rel="noopener noreferrer" class="verify-link-btn">
                                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
                                            <path d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
                                        </svg>
                                        Verify on Official Website
                                    </a>
                                </div>
                            ` : `
                                <p><strong>Status:</strong> <span style="color: #ff9800; font-weight: 600;">Certificate ID Available</span></p>
                                <p style="color: #666; font-size: 0.9rem; margin-top: 1rem;">
                                    This certificate can be verified using the credential ID provided. Contact the issuing organization for verification details.
                                </p>
                            `}
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        // Close modal functionality
        const closeModal = () => {
            modal.remove();
            document.body.style.overflow = '';
        };

        modal.querySelector('.close-modal').onclick = closeModal;
        modal.querySelector('.modal-overlay').onclick = closeModal;
        
        // Close on Escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }
}

// Initialize certificate manager when DOM is loaded
let certificateManager;

document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on achievements page
    if (document.querySelector('.achievements-content')) {
        certificateManager = new CertificateManager();
    }
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CertificateManager;
}
