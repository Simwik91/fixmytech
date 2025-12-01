// ===== FixMyTech Cookie Consent Management v2.0 =====

// --- CONFIGURATION ---
const COOKIE_NAME = 'fixmytech_cookie_consent';
const COOKIE_VERSION = '2'; // Increment to invalidate old cookies
const COOKIE_EXPIRATION_DAYS = 365;
const CONSENT_CATEGORIES = {
    necessary: true,
    analytics: false,
    marketing: false
};

// --- DOM ELEMENT REFERENCES ---
let banner, modal, backdrop;
let acceptAllBtn, rejectAllBtn, openSettingsBtn, saveSettingsBtn, closeModalBtn;
let consentToggles = {};

// --- CORE FUNCTIONS ---

/**
 * Sets a cookie with a given name, value, and expiration.
 * @param {string} name The name of the cookie.
 * @param {string} value The value of the cookie.
 * @param {number} days The number of days until the cookie expires.
 */
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
}

/**
 * Gets the value of a cookie by its name.
 * @param {string} name The name of the cookie.
 * @returns {string|null} The cookie value or null if not found.
 */
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

/**
 * Gets the user's current consent status from the cookie.
 * If no valid cookie is found, returns the default state.
 * @returns {object} The user's consent preferences.
 */
function getConsent() {
    const cookieValue = getCookie(COOKIE_NAME);
    if (cookieValue) {
        try {
            const parsed = JSON.parse(cookieValue);
            // Invalidate cookie if the version is different
            if (parsed.version === COOKIE_VERSION) {
                return parsed.consent;
            }
        } catch (e) {
            console.error("Error parsing cookie consent:", e);
            return CONSENT_CATEGORIES;
        }
    }
    return null; // No valid consent given yet
}

/**
 * Saves the user's consent choices to a cookie.
 * @param {object} consent The consent object to save.
 */
function saveConsent(consent) {
    const cookieValue = JSON.stringify({
        version: COOKIE_VERSION,
        consent: consent
    });
    setCookie(COOKIE_NAME, cookieValue, COOKIE_EXPIRATION_DAYS);
    hideBanner();
    hideModal();
    applyConsent(consent);
}

// --- UI FUNCTIONS ---

/**
 * Shows the cookie consent banner.
 */
function showBanner() {
    if (banner) {
        banner.classList.remove('hidden');
    }
}

/**
 * Hides the cookie consent banner.
 */
function hideBanner() {
    if (banner) {
        banner.classList.add('hidden');
    }
}

/**
 * Shows the cookie settings modal.
 */
function showModal() {
    updateModalToggles();
    if (modal && backdrop) {
        backdrop.classList.remove('hidden');
        modal.classList.remove('hidden');
    }
}

/**
 * Hides the cookie settings modal.
 */
function hideModal() {
    if (modal && backdrop) {
        modal.classList.add('hidden');
        backdrop.classList.add('hidden');
    }
}

/**
 * Updates the toggle switches in the modal based on current consent.
 */
function updateModalToggles() {
    const currentConsent = getConsent() || CONSENT_CATEGORIES;
    for (const category in consentToggles) {
        consentToggles[category].checked = currentConsent[category] || false;
    }
}


// --- EVENT HANDLERS ---

function handleAcceptAll() {
    const allConsent = { ...CONSENT_CATEGORIES };
    for (const category in allConsent) {
        allConsent[category] = true;
    }
    saveConsent(allConsent);
}

function handleRejectAll() {
    const noExtraConsent = { ...CONSENT_CATEGORIES };
    // Necessary is always true, others are set to false
    for (const category in noExtraConsent) {
        if (category !== 'necessary') {
            noExtraConsent[category] = false;
        }
    }
    saveConsent(noExtraConsent);
}

function handleSaveSettings() {
    const newConsent = { ...CONSENT_CATEGORIES };
    for (const category in consentToggles) {
        newConsent[category] = consentToggles[category].checked;
    }
    saveConsent(newConsent);
}

// --- INITIALIZATION ---

/**
 * Fetches and injects the cookie consent HTML.
 */
async function loadCookieHTML() {
    try {
        const response = await fetch('/includes/cookie-consent.html');
        if (!response.ok) throw new Error('Cookie HTML not found');
        const html = await response.text();
        const container = document.createElement('div');
        container.id = 'cookie-consent-container';
        container.innerHTML = html;
        document.body.appendChild(container);
    } catch (error) {
        console.error("Failed to load cookie consent UI:", error);
    }
}

/**
 * Binds event listeners to the UI elements.
 */
function bindUIEvents() {
    // Get elements
    banner = document.getElementById('cookie-consent-banner');
    modal = document.getElementById('cookie-settings-modal');
    backdrop = document.getElementById('cookie-backdrop');
    acceptAllBtn = document.getElementById('cookie-accept-all');
    rejectAllBtn = document.getElementById('cookie-reject-all');
    openSettingsBtn = document.getElementById('cookie-open-settings');
    saveSettingsBtn = document.getElementById('cookie-save-settings');
    closeModalBtn = document.getElementById('cookie-close-modal');

    consentToggles.analytics = document.getElementById('cookie-consent-analytics');
    consentToggles.marketing = document.getElementById('cookie-consent-marketing');
    
    // Check if elements exist
    if (!banner || !modal || !acceptAllBtn) {
        console.error("Could not find all required cookie consent elements.");
        return;
    }

    // Attach listeners
    acceptAllBtn.addEventListener('click', handleAcceptAll);
    rejectAllBtn.addEventListener('click', handleRejectAll);
    openSettingsBtn.addEventListener('click', showModal);
    saveSettingsBtn.addEventListener('click', handleSaveSettings);
    closeModalBtn.addEventListener('click', hideModal);
    backdrop.addEventListener('click', hideModal);
    
    // Also add a global function to open the settings
    window.openCookieSettings = showModal;
}

/**
 * Applies consent decisions, e.g., by loading scripts.
 * @param {object} consent The user's consent choices.
 */
function applyConsent(consent) {
    console.log("Applying consent:", consent);
    if (consent.analytics) {
        // Example: Load Google Analytics
        // const script = document.createElement('script');
        // script.src = 'https://www.googletagmanager.com/gtag/js?id=...';
        // document.head.appendChild(script);
        console.log("Analytics enabled.");
    }
    if (consent.marketing) {
        // Example: Load Marketing scripts (e.g., Facebook Pixel)
        console.log("Marketing enabled.");
    }
}

/**
 * Main initialization function for the cookie consent script.
 */
async function initializeCookieConsent() {
    await loadCookieHTML();
    bindUIEvents();

    const currentConsent = getConsent();
    if (currentConsent) {
        console.log("User has existing consent.", currentConsent);
        applyConsent(currentConsent);
        hideBanner();
    } else {
        console.log("No valid consent found. Showing banner.");
        showBanner();
    }
}

// Run the script once the DOM is ready.
if (document.readyState === 'complete') {
    initializeCookieConsent();
} else {
    document.addEventListener('DOMContentLoaded', initializeCookieConsent);
}
