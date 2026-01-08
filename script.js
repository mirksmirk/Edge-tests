// === EDGE Terminal - Main JavaScript ===

document.addEventListener('DOMContentLoaded', () => {
    initSidebars();
    initAgentCards();
    initTerminalInput();
});

// === Sidebar Toggle ===
function initSidebars() {
    const leftSidebar = document.getElementById('sidebarLeft');
    const rightSidebar = document.getElementById('sidebarRight');
    const toggleLeft = document.getElementById('toggleLeft');
    const toggleHistory = document.getElementById('toggleHistory');
    
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
    
    // Toggle right sidebar (history)
    if (toggleHistory) {
        toggleHistory.addEventListener('click', () => {
            rightSidebar.classList.toggle('open');
            overlay.classList.toggle('active');
        });
    }
    
    // Close sidebars when clicking overlay
    overlay.addEventListener('click', () => {
        leftSidebar.classList.remove('open');
        rightSidebar.classList.remove('open');
        overlay.classList.remove('active');
    });
    
    // Handle responsive behavior
    const handleResize = () => {
        if (window.innerWidth > 1200) {
            rightSidebar.classList.remove('open');
            overlay.classList.remove('active');
        }
        if (window.innerWidth > 768) {
            leftSidebar.classList.remove('open');
        }
    };
    
    window.addEventListener('resize', handleResize);
}

// === Agent Cards Expansion ===
function initAgentCards() {
    const agentCards = document.querySelectorAll('.agent-card');
    
    agentCards.forEach(card => {
        const header = card.querySelector('.agent-header');
        
        header.addEventListener('click', () => {
            // Close other cards (optional - remove if you want multiple open)
            // agentCards.forEach(c => {
            //     if (c !== card) c.classList.remove('expanded');
            // });
            
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
                // For demo purposes, clear input
                // input.value = '';
            }
        });
        
        // Focus input on page load
        input.focus();
    }
}

// === Command Handler (placeholder) ===
function handleCommand(command) {
    console.log('Command submitted:', command);
    
    // Add to history (demo - would normally call API)
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
    
    // Insert at the beginning
    historyList.insertBefore(historyItem, historyList.firstChild);
}

// === Utility: Escape HTML ===
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// === Navigation Active State ===
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    });
});

// === Search Functionality (placeholder) ===
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
