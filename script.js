// ================================
// SAMPLE DATA
// ================================

const categoryData = {
    fresh: ['🥐 Croissant', '🍞 Sourdough', '🥯 Bagel', '🧈 Butter Roll', '🌾 Wheat', '🥜 Nut Bread'],
    commission: ['💌 Love Letter', '🎂 Cake Design', '🍰 Pastry Art', '🎨 Custom', '✨ Special', '🌸 Seasonal'],
    adoptable: ['🎨 Canvas I', '🌸 Spring Blossom', '🍂 Autumn Glow', '🌙 Night Dream', '☀️ Summer Joy', '❄️ Winter Peace'],
    about: ['📖 Our Story', '👨‍🍳 Chef', '🏠 Location', '💝 Mission', '🌍 Community']
};

const adoptableCards = [
    { id: 1, title: 'Canvas I', emoji: '🎨', desc: 'Modern Art', price: '50k', status: 'available' },
    { id: 2, title: 'Spring Blossom', emoji: '🌸', desc: 'Pastel Vibes', price: '45k', status: 'available' },
    { id: 3, title: 'Autumn Glow', emoji: '🍂', desc: 'Warm Tones', price: '48k', status: 'sold' },
    { id: 4, title: 'Night Dream', emoji: '🌙', desc: 'Dark Fantasy', price: '55k', status: 'available' },
    { id: 5, title: 'Summer Joy', emoji: '☀️', desc: 'Bright Energy', price: '50k', status: 'available' },
    { id: 6, title: 'Winter Peace', emoji: '❄️', desc: 'Serene Cold', price: '52k', status: 'available' },
];

// ================================
// STATE MANAGEMENT
// ================================

let currentTab = 'fresh';
let curtainOffset = 0;
let maxCurtainOffset = 0;

// ================================
// AUDIO
// ================================

function playSound(soundType) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    if (soundType === 'curtain') {
        // Whoosh sound
        const now = audioContext.currentTime;
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(audioContext.destination);
        
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.15);
        
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        
        osc.start(now);
        osc.stop(now + 0.15);
    } else if (soundType === 'tab') {
        // Pop sound
        const now = audioContext.currentTime;
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(audioContext.destination);
        
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
        
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0, now + 0.1);
        
        osc.start(now);
        osc.stop(now + 0.1);
    }
}

// ================================
// CURTAIN SYSTEM
// ================================

function renderCurtain() {
    const track = document.querySelector('.curtain-track');
    const items = categoryData[currentTab];
    
    track.innerHTML = '';
    
    items.forEach((item, index) => {
        const curtainItem = document.createElement('div');
        curtainItem.className = 'curtain-item';
        curtainItem.textContent = item;
        curtainItem.dataset.index = index;
        
        if (index === 0 && curtainOffset > 0) {
            curtainItem.classList.add('collapsed');
        }
        
        curtainItem.addEventListener('click', () => {
            console.log('Selected:', item);
        });
        
        track.appendChild(curtainItem);
    });
    
    updateCurtainNav();
}

function shiftCurtain(direction) {
    const track = document.querySelector('.curtain-track');
    const items = categoryData[currentTab];
    
    playSound('curtain');
    
    if (direction === 'next') {
        curtainOffset = Math.min(curtainOffset + 1, items.length - 1);
    } else if (direction === 'prev') {
        curtainOffset = Math.max(curtainOffset - 1, 0);
    }
    
    const itemWidth = 130; // approx width + gap
    const shift = curtainOffset * itemWidth;
    
    track.style.transform = `translateX(-${shift}px)`;
    
    // Update collapsed state
    const curtainItems = document.querySelectorAll('.curtain-item');
    curtainItems.forEach((item, index) => {
        if (index === 0 && curtainOffset > 0) {
            item.classList.add('collapsed');
        } else {
            item.classList.remove('collapsed');
        }
    });
    
    updateCurtainNav();
}

function updateCurtainNav() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const items = categoryData[currentTab];
    
    prevBtn.disabled = curtainOffset === 0;
    nextBtn.disabled = curtainOffset >= items.length - 1;
    
    prevBtn.style.opacity = curtainOffset === 0 ? '0.5' : '1';
    nextBtn.style.opacity = curtainOffset >= items.length - 1 ? '0.5' : '1';
}

// ================================
// TAB SWITCHING
// ================================

function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    
    // Update active button
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Switch tab
    currentTab = tabName;
    curtainOffset = 0; // Reset curtain
    
    playSound('tab');
    
    // Render new curtain
    renderCurtain();
    
    // Render cards if adoptable
    if (tabName === 'adoptable') {
        renderCards();
    }
}

// ================================
// CARD RENDERING
// ================================

function renderCards() {
    const cardGrid = document.getElementById('cardGrid');
    cardGrid.innerHTML = '';
    
    adoptableCards.forEach(card => {
        const cardEl = document.createElement('div');
        cardEl.className = 'card';
        cardEl.innerHTML = `
            <div class="card-image">
                <span>${card.emoji}</span>
            </div>
            <div class="card-content">
                <div>
                    <h3 class="card-title">${card.title}</h3>
                    <p class="card-desc">${card.desc}</p>
                </div>
                <div class="card-footer">
                    <span class="card-price">${card.price}</span>
                    <span class="card-status ${card.status === 'sold' ? 'sold' : ''}">${card.status === 'sold' ? 'SOLD' : 'AVAIL'}</span>
                </div>
            </div>
        `;
        
        cardEl.addEventListener('click', () => {
            console.log('Card clicked:', card);
            // Could add modal here
        });
        
        cardGrid.appendChild(cardEl);
    });
}

// ================================
// EVENT LISTENERS
// ================================

document.addEventListener('DOMContentLoaded', () => {
    // Tab buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            switchTab(e.target.dataset.tab);
        });
    });
    
    // Curtain navigation
    document.getElementById('prevBtn').addEventListener('click', () => {
        shiftCurtain('prev');
    });
    
    document.getElementById('nextBtn').addEventListener('click', () => {
        shiftCurtain('next');
    });
    
    // Initialize
    renderCurtain();
});
