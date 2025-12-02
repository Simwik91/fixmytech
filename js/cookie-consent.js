// Function to manage cookie consent
window.initCookieConsent = function() {
    // DOM elements
    const modal = document.getElementById('cookie-consent-modal');
    const overlay = document.getElementById('cookie-consent-overlay');
    const acceptAllButton = document.getElementById('cookie-consent-accept-all');
    const acceptNecessaryButton = document.getElementById('cookie-consent-necessary');
    const saveButton = document.getElementById('cookie-consent-save');

    // Check if consent has already been given
    const hasConsent = getCookie('cookie_consent');

    // If no consent has been given, show the banner
    if (!hasConsent) {
        showBanner();
    }

    // --- Event Listeners ---

    // When "Accept All" is clicked
    acceptAllButton.addEventListener('click', () => {
        const consent = {
            necessary: true,
            analytics: true,
            marketing: true,
            timestamp: new Date().toISOString()
        };
        setConsent(consent);
        hideModal();
    });

    // When "Accept Necessary" is clicked
    acceptNecessaryButton.addEventListener('click', () => {
        const consent = {
            necessary: true,
            analytics: false,
            marketing: false,
            timestamp: new Date().toISOString()
        };
        setConsent(consent);
        hideModal();
    });

    // When "Save Settings" is clicked
    saveButton.addEventListener('click', () => {
        const consent = {
            necessary: true,
            analytics: document.getElementById('cookie-analytics').checked,
            marketing: document.getElementById('cookie-marketing').checked,
            timestamp: new Date().toISOString()
        };
        setConsent(consent);
        hideModal();
    });

    // When the settings button in the footer is clicked
    // This needs to be robust in case the footer hasn't loaded the button yet
    document.body.addEventListener('click', function(e) {
        if (e.target.matches('#cookie-settings-button')) {
            e.preventDefault();
            showSettings();
        }
    });

    // Allow closing the modal by clicking the overlay
    overlay.addEventListener('click', () => {
        hideModal();
    });

    // --- Functions ---

    /**
     * Shows the initial consent banner.
     * The banner is a simplified view of the modal.
     */
    function showBanner() {
        if (!modal || !overlay) return;
        modal.style.display = 'block';
        overlay.style.display = 'block';
        
        // In banner mode, we hide the detailed toggle settings and save button
        document.querySelector('.cookie-consent-toggles').style.display = 'none';
        saveButton.style.display = 'none';
        acceptNecessaryButton.style.display = 'inline-block';
        acceptAllButton.style.display = 'inline-block';
        
        document.getElementById('cookie-consent-title').textContent = 'Vi bruker informasjonskapsler';
    }

    /**
     * Shows the detailed settings modal.
     * This view allows users to customize their cookie preferences.
     */
    function showSettings() {
        if (!modal || !overlay) return;
        // Restore modal to its full settings view
        document.querySelector('.cookie-consent-toggles').style.display = 'block';
        saveButton.style.display = 'inline-block';
        // In settings view, we might want to hide the initial accept buttons
        acceptNecessaryButton.style.display = 'none';
        acceptAllButton.style.display = 'none';
        
        document.getElementById('cookie-consent-title').textContent = 'Innstillinger for informasjonskapsler';

        // Load current settings into the toggles
        const consent = JSON.parse(getCookie('cookie_consent') || '{}');
        document.getElementById('cookie-analytics').checked = consent.analytics || false;
        document.getElementById('cookie-marketing').checked = consent.marketing || false;

        modal.style.display = 'block';
        overlay.style.display = 'block';
    }

    /**
     * Hides the modal and the overlay.
     */
    function hideModal() {
        if (!modal || !overlay) return;
        modal.style.display = 'none';
        overlay.style.display = 'none';
    }

    /**
     * Sets the user's consent preferences in a cookie.
     * @param {object} consent - The consent object to save.
     */
    function setConsent(consent) {
        // The cookie will expire in 1 year
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        // The consent object is stored as a JSON string
        const cookieValue = `cookie_consent=${JSON.stringify(consent)}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
        document.cookie = cookieValue;
    }

    /**
     * Retrieves a cookie value by its name.
     * @param {string} name - The name of the cookie to retrieve.
     * @returns {string|null} - The value of the cookie or null if not found.
     */
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop().split(';').shift();
        }
        return null;
    }

    /**
     * Exposes the showSettings function globally so it can be called from the footer link.
     */
    window.openCookieSettings = showSettings;
};

