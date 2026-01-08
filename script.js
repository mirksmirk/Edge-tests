// === EDGE Terminal - Main JavaScript ===

document.addEventListener('DOMContentLoaded', () => {
    initSidebars();
    initAgentCards();
    initTerminalInput();
    initPageNavigation();
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
