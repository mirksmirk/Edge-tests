// === EDGE Terminal - Main JavaScript ===

document.addEventListener('DOMContentLoaded', () => {
    initSidebars();
    initAgentCards();
    initTerminalInput();
    initPageNavigation();
    initEditModal();
    initResultsPage();
    initRecentResults();
});

// === Sidebar Toggle ===
function initSidebars() {
    const leftSidebar = document.getElementById('sidebarLeft');
    const rightSidebar = document.getElementById('sidebarRight');
    const toggleLeft = document.getElementById('toggleLeft');
    const toggleHistory = document.getElementById('toggleHistory');
    const toggleHistoryInner = document.getElementById('toggleHistoryInner');
    
    // Create overlay for mobile
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
    
    // Toggle left sidebar
    if (toggleLeft) {
        toggleLeft.addEventListener('click', () => {
            leftSidebar.classList.toggle('collapsed');
            toggleLeft.querySelector('svg').style.transform = 
                leftSidebar.classList.contains('collapsed') ? 'rotate(180deg)' : '';
        });
    }
    
    // Toggle right sidebar (history) - from main content
    if (toggleHistory) {
        toggleHistory.addEventListener('click', () => {
            const isOpen = rightSidebar.classList.toggle('open');
            overlay.classList.toggle('active', isOpen);
            toggleHistory.classList.toggle('active', isOpen);
            if (toggleHistoryInner) {
                toggleHistoryInner.classList.toggle('active', isOpen);
            }
        });
    }
    
    // Toggle right sidebar (history) - from inside sidebar
    if (toggleHistoryInner) {
        toggleHistoryInner.addEventListener('click', () => {
            rightSidebar.classList.remove('open');
            overlay.classList.remove('active');
            if (toggleHistory) {
                toggleHistory.classList.remove('active');
            }
            toggleHistoryInner.classList.remove('active');
        });
    }
    
    // Close sidebars when clicking overlay
    overlay.addEventListener('click', () => {
        leftSidebar.classList.remove('open');
        rightSidebar.classList.remove('open');
        overlay.classList.remove('active');
        if (toggleHistory) toggleHistory.classList.remove('active');
        if (toggleHistoryInner) toggleHistoryInner.classList.remove('active');
    });
    
    // Handle responsive behavior
    const handleResize = () => {
        if (window.innerWidth > 768) {
            leftSidebar.classList.remove('open');
        }
    };
    
    window.addEventListener('resize', handleResize);
}

// === Page Navigation ===
function initPageNavigation() {
    const navItems = document.querySelectorAll('.nav-item[data-page]');
    const pages = document.querySelectorAll('.page');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetPage = item.dataset.page;
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Show target page
            pages.forEach(page => {
                page.classList.remove('active');
                if (page.id === `page-${targetPage}`) {
                    page.classList.add('active');
                }
            });
        });
    });
}

// === Agent Cards Expansion ===
function initAgentCards() {
    const agentCards = document.querySelectorAll('.agent-card');
    
    agentCards.forEach(card => {
        const header = card.querySelector('.agent-header');
        
        header.addEventListener('click', () => {
            card.classList.toggle('expanded');
        });
    });
}

// === Terminal Input ===
function initTerminalInput() {
    const input = document.querySelector('.terminal-input');
    
    if (input) {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && input.value.trim()) {
                handleCommand(input.value.trim());
            }
        });
        
        // Focus input on page load
        input.focus();
    }
}

// === Command Handler (placeholder) ===
function handleCommand(command) {
    console.log('Command submitted:', command);
    addToHistory(command);
}

// === Add to History (demo function) ===
function addToHistory(query) {
    const historyList = document.querySelector('.history-list');
    if (!historyList) return;
    
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
    }) + ', ' + now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });
    
    const historyItem = document.createElement('a');
    historyItem.href = '#';
    historyItem.className = 'history-item';
    historyItem.innerHTML = `
        <span class="history-title">${escapeHtml(query)}</span>
        <span class="history-date">${dateStr}</span>
    `;
    
    historyList.insertBefore(historyItem, historyList.firstChild);
}

// === Utility: Escape HTML ===
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// === Search Functionality ===
const searchInput = document.querySelector('.search-input');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const historyItems = document.querySelectorAll('.history-item');
        
        historyItems.forEach(item => {
            const title = item.querySelector('.history-title').textContent.toLowerCase();
            item.style.display = title.includes(query) ? 'flex' : 'none';
        });
    });
}

// === Recent Results Cards ===
function initRecentResults() {
    const section = document.getElementById('recentResultsSection');
    if (!section) return;
    
    // Handle close button clicks
    section.addEventListener('click', (e) => {
        const closeBtn = e.target.closest('.card-close-btn');
        if (closeBtn) {
            e.preventDefault();
            const card = closeBtn.closest('.recent-result-card');
            dismissCard(card);
        }
        
        // Handle View Full Result button
        const viewBtn = e.target.closest('.btn-view-full');
        if (viewBtn) {
            e.preventDefault();
            const card = viewBtn.closest('.recent-result-card');
            viewFullResult(card);
        }
        
        // Handle empty state CTA
        const emptyCta = e.target.closest('.empty-cta');
        if (emptyCta) {
            e.preventDefault();
            const page = emptyCta.dataset.page;
            if (page) {
                navigateToPage(page);
            }
        }
    });
}

// Dismiss a recent result card with animation
function dismissCard(card) {
    card.style.opacity = '0';
    card.style.transform = 'scale(0.95)';
    card.style.transition = 'all 0.2s ease';
    
    setTimeout(() => {
        card.style.width = card.offsetWidth + 'px';
        card.style.padding = '0';
        card.style.margin = '0';
        card.style.border = 'none';
        card.style.overflow = 'hidden';
        
        requestAnimationFrame(() => {
            card.style.width = '0';
            card.style.minWidth = '0';
            card.style.flex = '0 0 0';
            card.style.marginRight = '0';
        });
        
        setTimeout(() => {
            card.remove();
            checkEmptyCarousel();
        }, 200);
    }, 200);
}

// Check if carousel is empty and show empty state
function checkEmptyCarousel() {
    const section = document.getElementById('recentResultsSection');
    const carousel = section?.querySelector('.recent-results-carousel');
    const emptyState = document.getElementById('recentResultsEmpty');
    const cards = section?.querySelectorAll('.recent-result-card');
    
    if (cards && cards.length === 0 && carousel && emptyState) {
        carousel.style.display = 'none';
        emptyState.style.display = 'flex';
    }
}

// View full result
function viewFullResult(card) {
    const promptName = card.querySelector('.recent-result-prompt')?.textContent || '';
    console.log('Viewing full result for:', promptName);
    
    // In a real app this would navigate to the full result page
}

// === Edit Modal ===
function initEditModal() {
    const modal = document.getElementById('editModal');
    const closeBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelModal');
    const saveBtn = document.getElementById('saveModal');
    
    // Store reference to currently editing card
    let currentCard = null;
    
    // Open modal when clicking Edit button on any recurring card
    document.addEventListener('click', (e) => {
        const editBtn = e.target.closest('.recurring-actions .btn-outline');
        if (editBtn && editBtn.querySelector('span')?.textContent === 'Edit') {
            e.preventDefault();
            currentCard = editBtn.closest('.recurring-card');
            openEditModal(currentCard);
        }
    });
    
    // Close modal functions
    function closeModal() {
        modal.classList.remove('active');
        currentCard = null;
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Save changes
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            if (currentCard) {
                saveChanges(currentCard);
            }
            closeModal();
        });
    }
}

// Open modal and populate with card data
function openEditModal(card) {
    const modal = document.getElementById('editModal');
    
    // Get card data
    const title = card.querySelector('.recurring-title')?.textContent || '';
    const description = card.querySelector('.recurring-description')?.textContent || '';
    const frequency = card.querySelector('.frequency-value')?.textContent || '';
    const emailChecked = card.querySelector('.recurring-notifications input:first-of-type')?.checked || false;
    const inAppChecked = card.querySelector('.recurring-notifications input:last-of-type')?.checked || false;
    
    // Populate form fields
    document.getElementById('promptTitle').value = title;
    document.getElementById('promptText').value = description;
    document.getElementById('emailNotif').checked = emailChecked;
    document.getElementById('inAppNotif').checked = inAppChecked;
    
    // Parse frequency and set values
    const frequencySelect = document.getElementById('frequency');
    const timeInput = document.getElementById('notificationTime');
    
    if (frequency.toLowerCase().includes('daily')) {
        frequencySelect.value = 'daily';
    } else if (frequency.toLowerCase().includes('weekly')) {
        frequencySelect.value = 'weekly';
    } else if (frequency.toLowerCase().includes('monthly')) {
        frequencySelect.value = 'monthly';
    }
    
    // Extract time from frequency string (e.g., "Daily at 9:00 AM")
    const timeMatch = frequency.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (timeMatch) {
        let hours = parseInt(timeMatch[1]);
        const minutes = timeMatch[2];
        const period = timeMatch[3].toUpperCase();
        
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        
        timeInput.value = `${hours.toString().padStart(2, '0')}:${minutes}`;
    }
    
    // Set default start date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('startDate').value = today;
    
    // Show modal
    modal.classList.add('active');
    
    // Focus first input
    setTimeout(() => {
        document.getElementById('promptTitle').focus();
    }, 100);
}

// === Results Page ===
let currentResultsData = null; // Store current results page data for editing

function initResultsPage() {
    // Handle Results button click
    document.addEventListener('click', (e) => {
        const resultsBtn = e.target.closest('.btn-results');
        if (resultsBtn) {
            e.preventDefault();
            const card = resultsBtn.closest('.recurring-card');
            openResultsPage(card);
        }
    });
    
    // Handle breadcrumb back navigation
    document.addEventListener('click', (e) => {
        const breadcrumbLink = e.target.closest('.breadcrumb-link');
        if (breadcrumbLink) {
            e.preventDefault();
            const targetPage = breadcrumbLink.dataset.page;
            navigateToPage(targetPage);
        }
    });
    
    // Handle Edit button on Results page
    const resultsEditBtn = document.getElementById('resultsEditBtn');
    if (resultsEditBtn) {
        resultsEditBtn.addEventListener('click', () => {
            openEditModalFromResults();
        });
    }
}

// Open results page with card data
function openResultsPage(card) {
    // Get card data
    const title = card.querySelector('.recurring-title')?.textContent || '';
    const description = card.querySelector('.recurring-description')?.textContent || '';
    const frequency = card.querySelector('.frequency-value')?.textContent || '';
    const totalRuns = card.querySelector('.results-count')?.textContent || '0';
    const emailChecked = card.querySelector('.recurring-notifications label:first-of-type input')?.checked || false;
    const inAppChecked = card.querySelector('.recurring-notifications label:last-of-type input')?.checked || false;
    
    // Store current data for editing
    currentResultsData = {
        card: card,
        title: title,
        description: description,
        frequency: frequency,
        totalRuns: totalRuns,
        emailChecked: emailChecked,
        inAppChecked: inAppChecked
    };
    
    // Populate results page
    document.getElementById('resultsBreadcrumbTitle').textContent = title;
    document.getElementById('resultsTitle').textContent = title;
    document.getElementById('resultsDescription').textContent = description;
    document.getElementById('resultsFrequency').textContent = frequency;
    document.getElementById('resultsTotalRuns').textContent = totalRuns;
    
    // Update notification badges
    const emailBadge = document.getElementById('resultsEmailBadge');
    const inAppBadge = document.getElementById('resultsInAppBadge');
    
    if (emailBadge) {
        emailBadge.classList.toggle('active', emailChecked);
    }
    if (inAppBadge) {
        inAppBadge.classList.toggle('active', inAppChecked);
    }
    
    // Navigate to results page
    navigateToPage('results');
}

// Open edit modal from Results page
function openEditModalFromResults() {
    if (!currentResultsData) return;
    
    const modal = document.getElementById('editModal');
    
    // Populate form fields with current results data
    document.getElementById('promptTitle').value = currentResultsData.title;
    document.getElementById('promptText').value = currentResultsData.description;
    document.getElementById('emailNotif').checked = currentResultsData.emailChecked;
    document.getElementById('inAppNotif').checked = currentResultsData.inAppChecked;
    
    // Parse frequency and set values
    const frequencySelect = document.getElementById('frequency');
    const timeInput = document.getElementById('notificationTime');
    const frequency = currentResultsData.frequency;
    
    if (frequency.toLowerCase().includes('daily')) {
        frequencySelect.value = 'daily';
    } else if (frequency.toLowerCase().includes('weekly')) {
        frequencySelect.value = 'weekly';
    } else if (frequency.toLowerCase().includes('monthly')) {
        frequencySelect.value = 'monthly';
    }
    
    // Extract time from frequency string
    const timeMatch = frequency.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (timeMatch) {
        let hours = parseInt(timeMatch[1]);
        const minutes = timeMatch[2];
        const period = timeMatch[3].toUpperCase();
        
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        
        timeInput.value = `${hours.toString().padStart(2, '0')}:${minutes}`;
    }
    
    // Set default start date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('startDate').value = today;
    
    // Show modal
    modal.classList.add('active');
    
    // Focus first input
    setTimeout(() => {
        document.getElementById('promptTitle').focus();
    }, 100);
}

// Navigate to a specific page
function navigateToPage(pageName) {
    const pages = document.querySelectorAll('.page');
    const navItems = document.querySelectorAll('.nav-item[data-page]');
    
    // Hide all pages and show target
    pages.forEach(page => {
        page.classList.remove('active');
        if (page.id === `page-${pageName}`) {
            page.classList.add('active');
        }
    });
    
    // Update nav active state
    navItems.forEach(nav => {
        nav.classList.remove('active');
        if (nav.dataset.page === pageName) {
            nav.classList.add('active');
        }
    });
    
    // Special case: results page should highlight recurring nav
    if (pageName === 'results') {
        navItems.forEach(nav => {
            if (nav.dataset.page === 'recurring') {
                nav.classList.add('active');
            }
        });
    }
}

// Save changes back to card and results page
function saveChanges(card) {
    const title = document.getElementById('promptTitle').value;
    const description = document.getElementById('promptText').value;
    const frequency = document.getElementById('frequency').value;
    const startDate = document.getElementById('startDate').value;
    const time = document.getElementById('notificationTime').value;
    const emailNotif = document.getElementById('emailNotif').checked;
    const inAppNotif = document.getElementById('inAppNotif').checked;
    
    // Format time for display
    let displayTime = '';
    if (time) {
        const [hours, minutes] = time.split(':');
        const h = parseInt(hours);
        const period = h >= 12 ? 'PM' : 'AM';
        const displayHour = h > 12 ? h - 12 : (h === 0 ? 12 : h);
        displayTime = `${displayHour}:${minutes} ${period}`;
    }
    
    // Format frequency for display
    const frequencyLabels = {
        daily: 'Daily',
        weekly: 'Weekly',
        biweekly: 'Bi-weekly',
        monthly: 'Monthly'
    };
    const frequencyDisplay = `${frequencyLabels[frequency]} at ${displayTime}`;
    
    // Update card if provided
    if (card) {
        const titleEl = card.querySelector('.recurring-title');
        const descEl = card.querySelector('.recurring-description');
        const freqEl = card.querySelector('.frequency-value');
        const emailCheckbox = card.querySelector('.recurring-notifications label:first-of-type input');
        const inAppCheckbox = card.querySelector('.recurring-notifications label:last-of-type input');
        
        if (titleEl) titleEl.textContent = title;
        if (descEl) descEl.textContent = description;
        if (freqEl) freqEl.textContent = frequencyDisplay;
        if (emailCheckbox) emailCheckbox.checked = emailNotif;
        if (inAppCheckbox) inAppCheckbox.checked = inAppNotif;
    }
    
    // Update results page if we're viewing it
    if (currentResultsData) {
        document.getElementById('resultsBreadcrumbTitle').textContent = title;
        document.getElementById('resultsTitle').textContent = title;
        document.getElementById('resultsDescription').textContent = description;
        document.getElementById('resultsFrequency').textContent = frequencyDisplay;
        
        const emailBadge = document.getElementById('resultsEmailBadge');
        const inAppBadge = document.getElementById('resultsInAppBadge');
        
        if (emailBadge) emailBadge.classList.toggle('active', emailNotif);
        if (inAppBadge) inAppBadge.classList.toggle('active', inAppNotif);
        
        // Update stored data
        currentResultsData.title = title;
        currentResultsData.description = description;
        currentResultsData.frequency = frequencyDisplay;
        currentResultsData.emailChecked = emailNotif;
        currentResultsData.inAppChecked = inAppNotif;
        
        // Also update the original card
        if (currentResultsData.card) {
            const origCard = currentResultsData.card;
            const titleEl = origCard.querySelector('.recurring-title');
            const descEl = origCard.querySelector('.recurring-description');
            const freqEl = origCard.querySelector('.frequency-value');
            const emailCheckbox = origCard.querySelector('.recurring-notifications label:first-of-type input');
            const inAppCheckbox = origCard.querySelector('.recurring-notifications label:last-of-type input');
            
            if (titleEl) titleEl.textContent = title;
            if (descEl) descEl.textContent = description;
            if (freqEl) freqEl.textContent = frequencyDisplay;
            if (emailCheckbox) emailCheckbox.checked = emailNotif;
            if (inAppCheckbox) inAppCheckbox.checked = inAppNotif;
        }
    }
    
    console.log('Saved changes:', { title, description, frequency, startDate, time, emailNotif, inAppNotif });
}
