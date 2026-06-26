/**
 * Secure real-time countdown logic for Jaron & Aiswarya's Wedding Brochure
 * Adheres strictly to Secure Frontend Coding standards: no innerHTML or unsafe sinks are used.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Lock scroll and initialize cover active state
    document.body.classList.add('cover-active');

    // Cache core elements
    const openBtn = document.getElementById('btn-open-invitation');
    const invitationCover = document.getElementById('invitation-cover');
    const revealItems = document.querySelectorAll('.reveal-item');
    const bgMusic = document.getElementById('bg-music');

    if (openBtn && invitationCover) {
        openBtn.addEventListener('click', () => {
            invitationCover.classList.add('opened');
            document.body.classList.remove('cover-active');
            document.body.classList.add('cover-opened');

            // Trigger staggered fade-in reveal animations
            revealItems.forEach(item => {
                item.classList.add('active');
            });

            // Start background music
            if (bgMusic) {
                bgMusic.play().catch((error) => {
                    console.log("Audio play prevented or file not loaded yet: ", error);
                });
            }
        });
    }

    // Handle Page Visibility Change (minimize, tab switch, app backgrounding)
    document.addEventListener('visibilitychange', () => {
        if (bgMusic) {
            if (document.hidden) {
                bgMusic.pause();
            } else {
                // Only resume if the user has already opened the invitation
                if (document.body.classList.contains('cover-opened')) {
                    bgMusic.play().catch((error) => {
                        console.log("Audio resume prevented: ", error);
                    });
                }
            }
        }
    });

    // Handle Page Hide / Navigation Away (back button, closing page)
    window.addEventListener('pagehide', () => {
        if (bgMusic) {
            bgMusic.pause();
        }
    });

    // Set target wedding date: August 30, 2026 at 9:00 AM (09:00)
    const targetDateString = 'August 30, 2026 09:00:00';
    const targetDate = new Date(targetDateString).getTime();

    // Cache DOM element selectors
    const daysEl = document.getElementById('days-val');
    const hoursEl = document.getElementById('hours-val');
    const minutesEl = document.getElementById('minutes-val');
    const secondsEl = document.getElementById('seconds-val');

    // Update function for the countdown timer
    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference < 0) {
            // Event has already started or passed, set values to 00
            if (daysEl) daysEl.textContent = '00';
            if (hoursEl) hoursEl.textContent = '00';
            if (minutesEl) minutesEl.textContent = '00';
            if (secondsEl) secondsEl.textContent = '00';
            
            // Clean up the interval
            clearInterval(countdownInterval);
            return;
        }

        // Time calculations for days, hours, minutes, and seconds
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Safe DOM updates using textContent to prevent XSS vulnerability vectors
        if (daysEl) {
            daysEl.textContent = days < 10 ? '0' + days : String(days);
        }
        if (hoursEl) {
            hoursEl.textContent = hours < 10 ? '0' + hours : String(hours);
        }
        if (minutesEl) {
            minutesEl.textContent = minutes < 10 ? '0' + minutes : String(minutes);
        }
        if (secondsEl) {
            secondsEl.textContent = seconds < 10 ? '0' + seconds : String(seconds);
        }
    }

    // Run countdown update instantly to avoid empty boxes during layout load
    updateCountdown();

    // Set interval to update every 1 second (1000ms)
    const countdownInterval = setInterval(updateCountdown, 1000);

    // Buttery Smooth Parallax Scrolling for the Couple Image
    const portraitImg = document.getElementById('couple-portrait-img');
    const portraitFrame = document.getElementById('portrait-frame');
    
    // Intersection Observer for Scroll-triggered Entry Reveal
    if (portraitFrame) {
        if ('IntersectionObserver' in window) {
            const revealObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        observer.unobserve(entry.target); // Reveal once
                    }
                });
            }, {
                threshold: 0.05 // Triggers when 5% of the frame is visible
            });
            
            revealObserver.observe(portraitFrame);
        } else {
            // Fallback for older browsers/webviews without IntersectionObserver support
            portraitFrame.classList.add('revealed');
        }
    }
    
    if (portraitImg && portraitFrame) {
        function applyParallax() {
            const rect = portraitFrame.getBoundingClientRect();
            const viewHeight = window.innerHeight;
            
            // Only perform calculation if the image block is in viewport
            if (rect.top < viewHeight && rect.bottom > 0) {
                // Calculate distance from screen center
                const relativeScroll = (rect.top + rect.height / 2) - (viewHeight / 2);
                
                // Fine-tuned parallax vertical displacement (moves at an elegant fraction of scroll speed)
                const translateY = relativeScroll * -0.06;
                
                // Set scale slightly larger to completely cover borders and apply the shift
                portraitImg.style.transform = `scale(1.15) translateY(${translateY}px)`;
            }
        }

        // Apply immediately on load
        applyParallax();
        
        // Listen to scroll events (using standard requestAnimationFrame for flawless performance)
        // Use capturing listener so it intercepts scroll events from sub-scrollable containers on mobile
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    applyParallax();
                    ticking = false;
                });
                ticking = true;
            }
        }, { capture: true, passive: true });
    }
});
