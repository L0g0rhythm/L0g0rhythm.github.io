// tools/password-generator/src/js/utils.js

export function message(text, status = 'success') {
    const successColor = '#9a4efc'; // Using primary accent for success
    const dangerColor = '#ff6b6b'; // Using 404 title color for danger

    // Check if Toastify library is loaded
    if (typeof Toastify === 'undefined') {
        console.error('Toastify library not loaded.');
        // Fallback alert
        alert(`${status === 'success' ? 'Success' : 'Error'}: ${text}`);
        return;
    }

    Toastify({
        text: text,
        duration: 3000,
        close: true, // Added close button for accessibility/convenience
        gravity: "top", // Changed from bottom - POSITION TOP
        position: "right", // Changed from center - POSITION RIGHT
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: status === 'success' ? successColor : dangerColor,
            color: '#ffffff', // White text for both backgrounds for better contrast
            boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
            borderRadius: '8px',
            textAlign: 'center', // Keep text centered within the toast
            fontFamily: '"Poppins", sans-serif', // Keeping font as originally defined, change if needed
            fontWeight: '500'
        }
    }).showToast();
}

export function getRandomCryptoNumber(max) {
    if (max <= 0 || !Number.isInteger(max)) {
         // Use try-catch to avoid error if message itself fails initially
         try { message('Internal Error: Invalid range for random number.', 'danger'); } catch(e){}
         throw new Error('Max must be a positive integer.');
    }
    // Check for crypto API availability
    if (!window.crypto || !window.crypto.getRandomValues) {
        // Use try-catch here too
        try { message('Error: Secure random generation is not available in this browser. Use HTTPS or localhost.', 'danger'); } catch(e){}
        // Fallback to less secure method (with warning) or throw error
        // Math.random() is NOT cryptographically secure, use only if unavoidable
        // console.warn("Falling back to Math.random() - not cryptographically secure!");
        // return Math.floor(Math.random() * max);
        throw new Error('Crypto API not available.'); // Prefer failing securely
    }
    // Generate secure random number
    const randomValues = new Uint32Array(1);
    window.crypto.getRandomValues(randomValues);
    return randomValues[0] % max;
}