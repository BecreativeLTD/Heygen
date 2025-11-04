// Global state
let selectedAvatar = 'sophia';
let selectedBackground = 'office';

// DOM elements
const scriptInput = document.getElementById('scriptInput');
const charCount = document.getElementById('charCount');
const generateBtn = document.getElementById('generateBtn');
const previewSection = document.getElementById('previewSection');
const generatingOverlay = document.getElementById('generatingOverlay');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const playerControls = document.getElementById('playerControls');

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeAvatarSelection();
    initializeBackgroundSelection();
    initializeScriptInput();
    initializeGenerateButton();
});

// Avatar Selection
function initializeAvatarSelection() {
    const avatarCards = document.querySelectorAll('.avatar-card');
    
    avatarCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove active class from all cards
            avatarCards.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked card
            card.classList.add('active');
            
            // Update selected avatar
            selectedAvatar = card.dataset.avatar;
            
            console.log('Selected avatar:', selectedAvatar);
        });
    });
}

// Background Selection
function initializeBackgroundSelection() {
    const backgroundCards = document.querySelectorAll('.background-card');
    
    backgroundCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove active class from all cards
            backgroundCards.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked card
            card.classList.add('active');
            
            // Update selected background
            selectedBackground = card.dataset.bg;
            
            console.log('Selected background:', selectedBackground);
        });
    });
}

// Script Input
function initializeScriptInput() {
    scriptInput.addEventListener('input', (e) => {
        const length = e.target.value.length;
        charCount.textContent = length;
        
        // Change color based on character count
        if (length > 500) {
            charCount.style.color = '#ef4444';
        } else if (length > 400) {
            charCount.style.color = '#f59e0b';
        } else {
            charCount.style.color = '#6b7280';
        }
    });
}

// Generate Button
function initializeGenerateButton() {
    generateBtn.addEventListener('click', async () => {
        const script = scriptInput.value.trim();
        
        // Validation
        if (!script) {
            alert('Please enter a script for your video.');
            return;
        }
        
        if (script.length > 500) {
            alert('Script is too long. Please keep it under 500 characters.');
            return;
        }
        
        // Get selected options
        const language = document.getElementById('language').value;
        const voice = document.getElementById('voice').value;
        
        console.log('Generating video with:', {
            avatar: selectedAvatar,
            background: selectedBackground,
            script: script,
            language: language,
            voice: voice
        });
        
        // Start generation process
        await generateVideo({
            avatar: selectedAvatar,
            background: selectedBackground,
            script: script,
            language: language,
            voice: voice
        });
    });
}

// Generate Video Function
async function generateVideo(config) {
    // Show preview section
    previewSection.style.display = 'block';
    
    // Scroll to preview
    previewSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Show generating overlay
    generatingOverlay.style.display = 'flex';
    playerControls.style.display = 'none';
    
    // Simulate progress
    await simulateProgress();
    
    // Hide generating overlay and show controls
    setTimeout(() => {
        generatingOverlay.style.display = 'none';
        playerControls.style.display = 'flex';
        
        // Show success message
        showNotification('Video generated successfully! 🎉', 'success');
    }, 100);
}

// Simulate Progress
async function simulateProgress() {
    const steps = [
        { progress: 0, message: 'Initializing...' },
        { progress: 20, message: 'Processing avatar...' },
        { progress: 40, message: 'Generating speech...' },
        { progress: 60, message: 'Rendering background...' },
        { progress: 80, message: 'Compositing video...' },
        { progress: 100, message: 'Finalizing...' }
    ];
    
    for (const step of steps) {
        await sleep(800);
        progressFill.style.width = step.progress + '%';
        progressText.textContent = step.progress + '%';
        
        // Update message if element exists
        const messageElement = document.querySelector('.generating-overlay p');
        if (messageElement && step.message) {
            messageElement.textContent = step.message;
        }
    }
}

// Utility Functions
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 2rem',
        borderRadius: '8px',
        background: type === 'success' ? '#10b981' : '#6366f1',
        color: 'white',
        fontWeight: '600',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        zIndex: '9999',
        animation: 'slideIn 0.3s ease'
    });
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Player Controls
document.addEventListener('DOMContentLoaded', () => {
    // Add click handlers for control buttons when they exist
    setTimeout(() => {
        const controlBtns = document.querySelectorAll('.control-btn');
        controlBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const text = e.target.textContent;
                if (text.includes('▶') || text.includes('⏸')) {
                    // Toggle play/pause
                    e.target.textContent = e.target.textContent.includes('▶') ? '⏸' : '▶';
                    showNotification('Video ' + (e.target.textContent.includes('⏸') ? 'playing' : 'paused'), 'info');
                } else if (text.includes('Download')) {
                    showNotification('Video download started!', 'success');
                }
            });
        });
    }, 1000);
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add typing animation to placeholder
function addTypingAnimation() {
    const placeholder = "Enter your video script here...\n\nExample: \nHello! Welcome to our platform. Today, I'll show you how easy it is to create professional videos with AI avatars. \n\nIn just a few simple steps, you can have a studio-quality video ready to share with your audience.";
    let index = 0;
    
    scriptInput.addEventListener('focus', function onFocus() {
        if (!this.value) {
            // Removed typing animation on focus
        }
        this.removeEventListener('focus', onFocus);
    });
}

addTypingAnimation();

console.log('Heygen Clone - Frontend Initialized ✨');
console.log('Ready to create amazing videos!');
