/**
 * Retro Portfolio - Interactive Features
 * Minimal JavaScript for smooth scrolling and subtle CRT effects
 */

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', () => {
    // Add smooth scrolling to all anchor links that point to sections
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Only handle internal anchor links
            if (href && href !== '#') {
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update focus for accessibility
                    targetElement.focus({ preventScroll: true });
                }
            }
        });
    });

    // Initialize retro toggle functionality
    initRetroToggle();

    // Optional: Subtle CRT flicker effect
    // Performance-conscious implementation using CSS animation trigger
    initCRTFlicker();
});

/**
 * Initialize retro effects toggle
 * Allows users to turn off retro effects for a cleaner, professional look
 */
function initRetroToggle() {
    const toggleButton = document.getElementById('retro-toggle');
    const toggleText = toggleButton.querySelector('.toggle-text');
    const body = document.body;
    
    // Check for saved preference
    const retroDisabled = localStorage.getItem('retro-disabled') === 'true';
    
    // Apply saved state
    if (retroDisabled) {
        body.classList.add('retro-disabled');
        toggleText.textContent = '[ RETRO: OFF ]';
        toggleButton.setAttribute('aria-pressed', 'false');
    } else {
        toggleButton.setAttribute('aria-pressed', 'true');
    }
    
    // Toggle functionality
    toggleButton.addEventListener('click', () => {
        const isDisabled = body.classList.contains('retro-disabled');
        
        if (isDisabled) {
            // Enable retro effects
            body.classList.remove('retro-disabled');
            toggleText.textContent = '[ RETRO: ON ]';
            toggleButton.setAttribute('aria-pressed', 'true');
            localStorage.setItem('retro-disabled', 'false');
        } else {
            // Disable retro effects
            body.classList.add('retro-disabled');
            toggleText.textContent = '[ RETRO: OFF ]';
            toggleButton.setAttribute('aria-pressed', 'false');
            localStorage.setItem('retro-disabled', 'true');
        }
    });
}

/**
 * Initialize subtle CRT flicker effect
 * Creates a very subtle, occasional flicker to enhance retro aesthetic
 * Performance-conscious: uses CSS animations and infrequent triggers
 */
function initCRTFlicker() {
    const body = document.body;
    
    // Only add flicker if user hasn't indicated preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        return; // Respect accessibility preferences
    }
    
    // Add flicker class to body for CSS animation
    body.classList.add('crt-flicker-enabled');
    
    // Trigger subtle flicker at random intervals (infrequent)
    function triggerFlicker() {
        // Don't flicker if retro effects are disabled
        if (body.classList.contains('retro-disabled')) {
            // Schedule next check
            setTimeout(triggerFlicker, 2000);
            return;
        }
        
        body.classList.add('crt-flicker');
        
        // Remove class after brief moment
        setTimeout(() => {
            body.classList.remove('crt-flicker');
        }, 100);
        
        // Schedule next flicker (between 8-15 seconds)
        const nextFlicker = Math.random() * 7000 + 8000;
        setTimeout(triggerFlicker, nextFlicker);
    }
    
    // Start flicker cycle after initial delay
    setTimeout(triggerFlicker, 5000);
}
