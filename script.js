/**
 * Secure real-time countdown logic for Jaron & Aiswarya's Wedding Brochure
 * Adheres strictly to Secure Frontend Coding standards: no innerHTML or unsafe sinks are used.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Set target wedding date: August 30, 2026 at 4:00 PM (16:00)
    const targetDateString = 'August 30, 2026 16:00:00';
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
});
