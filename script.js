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

    // Initialize contact form functionality (if form exists)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        initContactForm();
    }

    // Initialize collapsible skills functionality
    initSkillsToggle();

    // Optional: Subtle CRT flicker effect
    // Performance-conscious implementation using CSS animation trigger
    initCRTFlicker();
});

/**
 * Initialize contact form functionality
 * Handles form validation, submission, and user feedback with spam protection
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const submitText = submitBtn.querySelector('.submit-text');
    const submitLoading = submitBtn.querySelector('.submit-loading');
    const formStatus = document.getElementById('form-status');
    const submitTimer = document.getElementById('submit-timer');
    const countdown = document.getElementById('countdown');
    
    let formStartTime = Date.now();
    let submissionAttempts = 0;
    const maxAttempts = 3;
    const minFormTime = 5000; // 5 seconds minimum
    
    // Initialize security timer
    initSecurityTimer();
    
    // Form validation rules with spam detection
    const validators = {
        name: (value) => {
            if (!value.trim()) return 'Name is required';
            if (value.trim().length < 2) return 'Name must be at least 2 characters';
            if (value.trim().length > 100) return 'Name is too long';
            // Check for suspicious patterns
            if (/[<>{}[\]\\\/]/.test(value)) return 'Name contains invalid characters';
            return null;
        },
        email: (value) => {
            if (!value.trim()) return 'Email is required';
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) return 'Please enter a valid email address';
            if (value.length > 254) return 'Email address is too long';
            // Check for suspicious domains
            const suspiciousDomains = ['tempmail', '10minutemail', 'guerrillamail'];
            if (suspiciousDomains.some(domain => value.toLowerCase().includes(domain))) {
                return 'Please use a permanent email address';
            }
            return null;
        },
        subject: (value) => {
            if (!value.trim()) return 'Subject is required';
            if (value.trim().length < 3) return 'Subject must be at least 3 characters';
            if (value.trim().length > 200) return 'Subject is too long';
            // Check for spam patterns
            if (/\b(viagra|casino|lottery|winner|congratulations|urgent|act now)\b/i.test(value)) {
                return 'Subject contains suspicious content';
            }
            return null;
        },
        message: (value) => {
            if (!value.trim()) return 'Message is required';
            if (value.trim().length < 10) return 'Message must be at least 10 characters';
            if (value.trim().length > 5000) return 'Message is too long';
            
            // Check for spam patterns
            const spamPatterns = [
                /https?:\/\/[^\s]+/gi, // Multiple URLs
                /\b(viagra|casino|lottery|winner|congratulations|urgent|act now|click here|limited time)\b/gi,
                /(.)\1{10,}/, // Repeated characters
                /[A-Z]{20,}/ // Excessive caps
            ];
            
            const urlCount = (value.match(/https?:\/\/[^\s]+/gi) || []).length;
            if (urlCount > 2) return 'Too many links in message';
            
            for (let pattern of spamPatterns.slice(1)) {
                if (pattern.test(value)) {
                    return 'Message contains suspicious content';
                }
            }
            
            return null;
        }
    };
    
    // Real-time validation
    Object.keys(validators).forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        field.addEventListener('blur', () => validateField(fieldName, field.value, errorElement));
        field.addEventListener('input', () => {
            // Clear error on input if field was previously invalid
            if (errorElement.textContent) {
                validateField(fieldName, field.value, errorElement);
            }
        });
    });
    
    // Form submission with spam protection
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Check submission attempts
        submissionAttempts++;
        if (submissionAttempts > maxAttempts) {
            showFormStatus('> TOO MANY ATTEMPTS. Please wait before trying again.', 'error');
            return;
        }
        
        // Check honeypot field
        const honeypot = form.querySelector('[name="website"]');
        if (honeypot && honeypot.value.trim() !== '') {
            // Silent fail for bots
            showFormStatus('> TRANSMISSION FAILED. Please try again later.', 'error');
            return;
        }
        
        // Check minimum form interaction time
        const formInteractionTime = Date.now() - formStartTime;
        if (formInteractionTime < minFormTime) {
            showFormStatus('> PLEASE TAKE MORE TIME TO FILL OUT THE FORM.', 'error');
            return;
        }
        
        // Validate all fields
        const formData = new FormData(form);
        let isValid = true;
        
        Object.keys(validators).forEach(fieldName => {
            const value = formData.get(fieldName);
            const errorElement = document.getElementById(`${fieldName}-error`);
            const fieldValid = validateField(fieldName, value, errorElement);
            if (!fieldValid) isValid = false;
        });
        
        if (!isValid) {
            showFormStatus('Please correct the errors above.', 'error');
            return;
        }
        
        // Additional spam checks
        const spamScore = calculateSpamScore(formData);
        if (spamScore > 5) {
            showFormStatus('> MESSAGE FLAGGED AS SUSPICIOUS. Please revise and try again.', 'error');
            return;
        }
        
        // Show loading state
        setSubmitLoading(true);
        
        try {
            // Add timestamp and spam score to form data
            const submissionData = {
                ...Object.fromEntries(formData),
                timestamp: new Date().toISOString(),
                spamScore: spamScore,
                formInteractionTime: formInteractionTime
            };
            
            await simulateFormSubmission(submissionData);
            
            // Success
            showFormStatus('> MESSAGE TRANSMITTED SUCCESSFULLY! I\'ll get back to you soon.', 'success');
            form.reset();
            formStartTime = Date.now(); // Reset timer
            submissionAttempts = 0; // Reset attempts on success
            
        } catch (error) {
            showFormStatus('> TRANSMISSION FAILED. Please try again or use direct email.', 'error');
        } finally {
            setSubmitLoading(false);
        }
    });
    
    function initSecurityTimer() {
        let timeLeft = 5;
        const timer = setInterval(() => {
            timeLeft--;
            countdown.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                submitBtn.disabled = false;
                submitTimer.classList.add('hidden');
            }
        }, 1000);
    }
    
    function calculateSpamScore(formData) {
        let score = 0;
        const data = Object.fromEntries(formData);
        
        // Check for excessive capitalization
        const allText = `${data.name} ${data.subject} ${data.message}`;
        const capsRatio = (allText.match(/[A-Z]/g) || []).length / allText.length;
        if (capsRatio > 0.3) score += 2;
        
        // Check for excessive punctuation
        const punctRatio = (allText.match(/[!?]{2,}/g) || []).length;
        score += punctRatio;
        
        // Check for suspicious keywords
        const spamKeywords = ['urgent', 'act now', 'limited time', 'winner', 'congratulations'];
        spamKeywords.forEach(keyword => {
            if (allText.toLowerCase().includes(keyword)) score += 1;
        });
        
        // Check message length vs content ratio
        if (data.message.length < 50 && data.message.includes('http')) score += 2;
        
        return score;
    }
    
    function validateField(fieldName, value, errorElement) {
        const error = validators[fieldName](value);
        errorElement.textContent = error || '';
        return !error;
    }
    
    function setSubmitLoading(loading) {
        submitBtn.disabled = loading;
        submitText.style.display = loading ? 'none' : 'inline';
        submitLoading.style.display = loading ? 'inline' : 'none';
    }
    
    function showFormStatus(message, type) {
        formStatus.textContent = message;
        formStatus.className = `form-status ${type}`;
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 5000);
        }
    }
    
    // Simulate form submission - replace with actual backend integration
    async function simulateFormSubmission(submissionData) {
        // In a real implementation, you would:
        // 1. Send to your backend API with spam detection
        // 2. Use services like Formspree (has built-in spam protection)
        // 3. Integrate with reCAPTCHA for additional protection
        // 4. Use rate limiting on your server
        
        console.log('Form submission data:', submissionData); // For debugging
        
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success (90% of the time)
                if (Math.random() > 0.1) {
                    resolve();
                } else {
                    reject(new Error('Simulated network error'));
                }
            }, 2000);
        });
    }
}

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
/**
 * Initialize collapsible skills functionality
 * Allows users to expand/collapse skill categories to save space
 */
function initSkillsToggle() {
    const toggleButtons = document.querySelectorAll('.skill-category-toggle');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            const targetId = button.getAttribute('aria-controls');
            const targetElement = document.getElementById(targetId);
            const indicator = button.querySelector('.toggle-indicator');
            
            if (targetElement) {
                // Toggle expanded state
                button.setAttribute('aria-expanded', !isExpanded);
                
                if (isExpanded) {
                    // Collapse
                    targetElement.classList.add('collapsed');
                    indicator.textContent = '[+]';
                } else {
                    // Expand
                    targetElement.classList.remove('collapsed');
                    indicator.textContent = '[-]';
                }
            }
        });
        
        // Handle keyboard navigation
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    });
}