(function() {
    let isModalLoaded = false;
    let isInitializing = false;

    // --- Core Functions ---

    /**
     * Ensures the modal HTML is loaded into the DOM. If it already exists,
     * it runs the callback immediately. If not, it fetches, injects,
     * and then runs the callback.
     * @param {function} callback - The function to execute after the modal is ready.
     */
    function ensureModalLoaded(callback) {
        if (isModalLoaded) {
            if (callback) callback();
            return;
        }

        if (isInitializing) return; // Prevent multiple fetches
        isInitializing = true;

        fetch('/includes/cookie-consent.html')
            .then(res => {
                if (!res.ok) throw new Error('Failed to load cookie consent HTML');
                return res.text();
            })
            .then(html => {
                const container = document.getElementById('cookie-consent-container');
                if (container) {
                    container.innerHTML = html;
                    isModalLoaded = true;
                    initializeModalEventListeners();
                    if (callback) callback();
                }
                isInitializing = false;
            })
            .catch(error => {
                console.error('Cookie Consent Error:', error);
                isInitializing = false;
            });
    }

    /**
     * Attaches all event listeners for the elements inside the modal.
     * This should only be called once the modal is loaded.
     */
    function initializeModalEventListeners() {
        const modal = document.getElementById('cookie-consent-modal');
        const overlay = document.getElementById('cookie-consent-overlay');
        const acceptAllButton = document.getElementById('cookie-consent-accept-all');
        const acceptNecessaryButton = document.getElementById('cookie-consent-necessary');
        const saveButton = document.getElementById('cookie-consent-save');

        if (!modal) return;

        acceptAllButton.addEventListener('click', () => handleConsent('all'));
        acceptNecessaryButton.addEventListener('click', () => handleConsent('necessary'));
        saveButton.addEventListener('click', () => handleConsent('save'));
        overlay.addEventListener('click', hideModal);
    }

    // --- Event Handlers & Logic ---

    /**
     * Handles the logic for setting consent based on user action.
     * @param {string} type - 'all', 'necessary', or 'save'.
     */
    function handleConsent(type) {
        let consent = {
            necessary: true,
            analytics: false,
            marketing: false,
        };

        if (type === 'all') {
            consent.analytics = true;
            consent.marketing = true;
        } else if (type === 'save') {
            consent.analytics = document.getElementById('cookie-analytics').checked;
            consent.marketing = document.getElementById('cookie-marketing').checked;
        }
        
        consent.timestamp = new Date().toISOString();
        setCookie('cookie_consent', JSON.stringify(consent), 365);
        hideModal();
    }


    // --- UI Functions (Show/Hide/Update) ---

    function showBanner() {
        const modal = document.getElementById('cookie-consent-modal');
        const overlay = document.getElementById('cookie-consent-overlay');
        if (!modal || !overlay) return;

        // Configure for banner view
        document.querySelector('.cookie-consent-toggles').style.display = 'none';
        document.getElementById('cookie-consent-save').style.display = 'none';
        document.getElementById('cookie-consent-necessary').style.display = 'inline-block';
        document.getElementById('cookie-consent-accept-all').style.display = 'inline-block';
        document.getElementById('cookie-consent-title').textContent = 'Vi bruker informasjonskapsler';

        modal.style.display = 'block';
        overlay.style.display = 'block';
    }

    function showSettings() {
        const modal = document.getElementById('cookie-consent-modal');
        const overlay = document.getElementById('cookie-consent-overlay');
        if (!modal || !overlay) return;

        // Configure for settings view
        document.querySelector('.cookie-consent-toggles').style.display = 'block';
        document.getElementById('cookie-consent-save').style.display = 'inline-block';
        document.getElementById('cookie-consent-necessary').style.display = 'none';
        document.getElementById('cookie-consent-accept-all').style.display = 'none';
        document.getElementById('cookie-consent-title').textContent = 'Innstillinger for informasjonskapsler';

        const consent = JSON.parse(getCookie('cookie_consent') || '{}');
        document.getElementById('cookie-analytics').checked = consent.analytics || false;
        document.getElementById('cookie-marketing').checked = consent.marketing || false;

        modal.style.display = 'block';
        overlay.style.display = 'block';
    }

    function hideModal() {
        const modal = document.getElementById('cookie-consent-modal');
        const overlay = document.getElementById('cookie-consent-overlay');
        if (!modal || !overlay) return;

        modal.style.display = 'none';
        overlay.style.display = 'none';
    }

    // --- Cookie Utility Functions ---

    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // --- Global Access & Initialization ---

    /**
     * Public function to open the settings modal.
     * It ensures the modal is loaded before showing the settings.
     */
    window.openCookieSettings = function() {
        ensureModalLoaded(showSettings);
    };

    /**
     * Initial check to see if the consent banner should be displayed.
     */
    function initializeBanner() {
        if (!getCookie('cookie_consent')) {
            ensureModalLoaded(showBanner);
        }
    }

    // Delegated listener for the settings link in the footer.
    // This is robust and works even if the footer is loaded after this script runs.
    document.body.addEventListener('click', function(e) {
        if (e.target.matches('#cookie-settings-button')) {
            e.preventDefault();
            window.openCookieSettings();
        }
    });

    // Run initial check on page load.
    initializeBanner();

})();

