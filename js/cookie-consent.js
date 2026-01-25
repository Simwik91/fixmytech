(function() {
    console.log('COOKIE_CONSENT_DEBUG: Script js/cookie-consent.js loaded.');

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
        console.log('COOKIE_CONSENT_DEBUG: ensureModalLoaded called.');

        if (isModalLoaded) {
            console.log('COOKIE_CONSENT_DEBUG: Modal already loaded, running callback immediately.');
            if (callback) callback();
            return;
        }

        if (isInitializing) {
            console.log('COOKIE_CONSENT_DEBUG: Modal is already initializing, preventing multiple fetches.');
            return; // Prevent multiple fetches
        }
        isInitializing = true;
        console.log('COOKIE_CONSENT_DEBUG: Fetching /includes/cookie-consent.html...');

        fetch('/includes/cookie-consent.html')
            .then(res => {
                console.log(`COOKIE_CONSENT_DEBUG: Fetch response status: ${res.status}`);
                if (!res.ok) {
                    console.error('COOKIE_CONSENT: Failed to load cookie consent HTML, status:', res.status);
                    throw new Error('Failed to load cookie consent HTML');
                }
                return res.text();
            })
            .then(html => {
                console.log('COOKIE_CONSENT_DEBUG: cookie-consent.html fetched successfully, injecting into DOM.');
                const container = document.getElementById('cookie-consent-container');
                if (container) {
                    container.innerHTML = html;
                    isModalLoaded = true;
                    initializeModalEventListeners();
                    if (callback) callback();
                    console.log('COOKIE_CONSENT_DEBUG: Modal HTML injected and listeners initialized.');
                } else {
                    console.error('COOKIE_CONSENT: #cookie-consent-container not found in DOM.');
                }
                isInitializing = false;
            })
            .catch(error => {
                console.error('COOKIE_CONSENT: Error loading includes:', error);
                isInitializing = false;
            });
    }

    /**
     * Attaches all event listeners for the elements inside the modal.
     * This should only be called once the modal is loaded.
     */
    function initializeModalEventListeners() {
        console.log('COOKIE_CONSENT_DEBUG: initializeModalEventListeners called.');
        const modal = document.getElementById('cookie-consent-modal');
        const overlay = document.getElementById('cookie-consent-overlay');
        const acceptAllButton = document.getElementById('cookie-consent-accept-all');
        const acceptNecessaryButton = document.getElementById('cookie-consent-necessary');
        const saveButton = document.getElementById('cookie-consent-save');
        const closeSettingsButton = document.getElementById('cookie-settings-close'); // Assuming an ID for the close button

        if (!modal) {
            console.warn('COOKIE_CONSENT: #cookie-consent-modal not found. Cannot initialize event listeners.');
            return;
        }

        if (acceptAllButton) acceptAllButton.addEventListener('click', () => { console.log('COOKIE_CONSENT_DEBUG: acceptAllButton clicked.'); handleConsent('all'); });
        if (acceptNecessaryButton) acceptNecessaryButton.addEventListener('click', () => { console.log('COOKIE_CONSENT_DEBUG: acceptNecessaryButton clicked.'); handleConsent('necessary'); });
        if (saveButton) saveButton.addEventListener('click', () => { console.log('COOKIE_CONSENT_DEBUG: saveButton clicked.'); handleConsent('save'); });
        if (overlay) overlay.addEventListener('click', () => { console.log('COOKIE_CONSENT_DEBUG: overlay clicked.'); hideModal(); });
        if (closeSettingsButton) closeSettingsButton.addEventListener('click', () => { console.log('COOKIE_CONSENT_DEBUG: closeSettingsButton clicked.'); hideModal(); });
        console.log('COOKIE_CONSENT_DEBUG: Modal event listeners attached.');
    }

    // --- Event Handlers & Logic ---

    /**
     * Handles the logic for setting consent based on user action.
     * @param {string} type - 'all', 'necessary', or 'save'.
     */
    function handleConsent(type) {
        console.log(`COOKIE_CONSENT_DEBUG: handleConsent called with type: ${type}`);
        let consent = {
            necessary: true,
            analytics: false,
            marketing: false,
        };

        if (type === 'all') {
            consent.analytics = true;
            consent.marketing = true;
        } else if (type === 'save') {
            const analyticsToggle = document.getElementById('cookie-analytics');
            const marketingToggle = document.getElementById('cookie-marketing');
            consent.analytics = analyticsToggle ? analyticsToggle.checked : false;
            consent.marketing = marketingToggle ? marketingToggle.checked : false;
        } else if (type === 'necessary') {
            // Already set to necessary: true, analytics: false, marketing: false
        }
        
        consent.timestamp = new Date().toISOString();
        setCookie('cookie_consent', JSON.stringify(consent), 365);
        hideModal();
        console.log('COOKIE_CONSENT_DEBUG: Consent handled and modal hidden.');
    }


    // --- UI Functions (Show/Hide/Update) ---

    function showBanner() {
        console.log('COOKIE_CONSENT_DEBUG: showBanner called.');
        const modal = document.getElementById('cookie-consent-modal');
        const overlay = document.getElementById('cookie-consent-overlay');
        if (!modal || !overlay) {
            console.warn('COOKIE_CONSENT: Modal or overlay not found for banner.');
            return;
        }

        // Configure for banner view
        const toggles = document.querySelector('.cookie-consent-toggles');
        if (toggles) toggles.style.display = 'none';
        const saveBtn = document.getElementById('cookie-consent-save');
        if (saveBtn) saveBtn.style.display = 'none';
        const necessaryBtn = document.getElementById('cookie-consent-necessary');
        if (necessaryBtn) necessaryBtn.style.display = 'inline-block';
        const acceptAllBtn = document.getElementById('cookie-consent-accept-all');
        if (acceptAllBtn) acceptAllBtn.style.display = 'inline-block';
        
        const title = document.getElementById('cookie-consent-title');
        if (title) title.textContent = window.i18n.translate('cookie_banner_title');

        modal.style.display = 'block';
        overlay.style.display = 'block';
        console.log(`COOKIE_CONSENT_DEBUG: Banner modal display set to: "${modal.style.display}", Overlay display set to: "${overlay.style.display}".`); // NEW LOG
        console.log('COOKIE_CONSENT_DEBUG: Banner displayed.');
    }

    function showSettings() {
        console.log('COOKIE_CONSENT_DEBUG: showSettings called.');
        const modal = document.getElementById('cookie-consent-modal');
        const overlay = document.getElementById('cookie-consent-overlay');
        if (!modal || !overlay) {
            console.warn('COOKIE_CONSENT: Modal or overlay not found for settings.');
            return;
        }

        // Configure for settings view
        const toggles = document.querySelector('.cookie-consent-toggles');
        if (toggles) toggles.style.display = 'block';
        const saveBtn = document.getElementById('cookie-consent-save');
        if (saveBtn) saveBtn.style.display = 'inline-block';
        const necessaryBtn = document.getElementById('cookie-consent-necessary');
        if (necessaryBtn) necessaryBtn.style.display = 'none';
        const acceptAllBtn = document.getElementById('cookie-consent-accept-all');
        if (acceptAllBtn) acceptAllBtn.style.display = 'none';

        const title = document.getElementById('cookie-consent-title');
        if (title) title.textContent = window.i18n.translate('cookie_consent_title');

        let consent = {};
        const cookieValue = getCookie('cookie_consent');
        if (cookieValue) {
            try {
                consent = JSON.parse(cookieValue);
                if (typeof consent !== 'object' || consent === null) {
                    console.warn('COOKIE_CONSENT: Parsed cookie is not an object or null. Resetting consent.');
                    consent = {};
                }
            } catch (e) {
                console.warn('COOKIE_CONSENT: Could not parse cookie. Resetting to default.', e);
                consent = {};
            }
        }

        const analyticsToggle = document.getElementById('cookie-analytics');
        if (analyticsToggle) analyticsToggle.checked = consent.analytics || false;
        const marketingToggle = document.getElementById('cookie-marketing');
        if (marketingToggle) marketingToggle.checked = consent.marketing || false;

        modal.style.display = 'block';
        overlay.style.display = 'block';
        
        // Apply translations to the newly visible modal content
        if (window.i18n) {
            window.i18n.applyTranslations();
        }
        
        console.log(`COOKIE_CONSENT_DEBUG: Modal display set to: "${modal.style.display}", Overlay display set to: "${overlay.style.display}".`); // NEW LOG
        console.log('COOKIE_CONSENT_DEBUG: Settings displayed.');
    }

    function hideModal() {
        console.log('COOKIE_CONSENT_DEBUG: hideModal called.');
        const modal = document.getElementById('cookie-consent-modal');
        const overlay = document.getElementById('cookie-consent-overlay');
        if (!modal || !overlay) {
            console.warn('COOKIE_CONSENT: Modal or overlay not found for hiding.');
            return;
        }

        modal.style.display = 'none';
        overlay.style.display = 'none';
        console.log('COOKIE_CONSENT_DEBUG: Modal hidden.');
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
        console.log(`COOKIE_CONSENT_DEBUG: Cookie "${name}" set.`);
    }

    function getCookie(name) {
        console.log(`COOKIE_CONSENT_DEBUG: Attempting to get cookie "${name}".`);
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) {
                const cookieVal = c.substring(nameEQ.length, c.length);
                console.log(`COOKIE_CONSENT_DEBUG: Cookie "${name}" found: ${cookieVal}`);
                return cookieVal;
            }
        }
        console.log(`COOKIE_CONSENT_DEBUG: Cookie "${name}" not found.`);
        return null;
    }

    // --- Global Access & Initialization ---

    /**
     * Public function to open the settings modal.
     * It ensures the modal is loaded before showing the settings.
     */
    window.openCookieSettings = function() {
        console.log('COOKIE_CONSENT_DEBUG: window.openCookieSettings called.');
        ensureModalLoaded(showSettings);
    };

    /**
     * Initial check to see if the consent banner should be displayed.
     */
    function initializeBanner() {
        console.log('COOKIE_CONSENT_DEBUG: initializeBanner called.');
        const cookieValue = getCookie('cookie_consent');
        let hasValidConsent = false;

        if (cookieValue) {
            try {
                const consent = JSON.parse(cookieValue);
                if (typeof consent === 'object' && consent !== null && consent.hasOwnProperty('necessary')) {
                    hasValidConsent = true;
                } else {
                    console.warn('COOKIE_CONSENT: Invalid consent object structure.');
                }
            } catch (e) {
                console.warn('COOKIE_CONSENT: Could not parse cookie. Forcing banner display.', e);
            }
        }

        if (!hasValidConsent) {
            console.log('COOKIE_CONSENT_DEBUG: No valid consent, showing banner.');
            ensureModalLoaded(showBanner);
        } else {
            console.log('COOKIE_CONSENT_DEBUG: Valid consent found, no banner display needed.');
        }
    }

    // Delegated listener for the settings link in the footer.
    // This is robust and works even if the footer is loaded after this script runs.
    document.body.addEventListener('click', function(e) {
        if (e.target.matches('#cookie-settings-button')) {
            e.preventDefault();
            console.log('COOKIE_CONSENT_DEBUG: #cookie-settings-button clicked. Calling openCookieSettings.');
            window.openCookieSettings();
        }
    });

    // Run initial check on page load.
    document.addEventListener('DOMContentLoaded', initializeBanner);
    console.log('COOKIE_CONSENT_DEBUG: Event listener for DOMContentLoaded added.');

})();