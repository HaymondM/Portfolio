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

    // Optional: Subtle CRT flicker effect
    // Performance-conscious implementation using CSS animation trigger
    initCRTFlicker();
});

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
