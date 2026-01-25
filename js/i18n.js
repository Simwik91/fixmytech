// js/i18n.js

const i18n = {
  translations: {},
  currentLang: 'no', // Default language

  /**
   * Initializes the i18n module by loading the preferred language.
   * Checks localStorage, then browser language, then defaults.
   */
  async init() {
    this.currentLang = this.getPreferredLanguage();
    await this.loadTranslations(this.currentLang);
  },

  /**
   * Determines the preferred language.
   * Precedence: localStorage > browser language > default ('no').
   * @returns {string} The preferred language code.
   */
  getPreferredLanguage() {
    const storedLang = localStorage.getItem('lang');
    if (storedLang) {
      return storedLang;
    }

    const browserLang = navigator.language.split('-')[0];
    if (['en', 'no'].includes(browserLang)) { // Only support 'en' and 'no' for now
      return browserLang;
    }

    return 'no'; // Fallback default
  },

  /**
   * Loads the translation file for the given language.
   * @param {string} lang The language code (e.g., 'en', 'no').
   */
  async loadTranslations(lang) {
    try {
      const response = await fetch(`/lang/${lang}.json`);
      if (!response.ok) {
        console.warn(`Translations for ${lang}.json not found, falling back to 'no'.`);
        const fallbackResponse = await fetch('/lang/no.json');
        this.translations = await fallbackResponse.json();
        this.currentLang = 'no';
        document.documentElement.lang = this.currentLang; // Update html lang attribute
      } else {
        this.translations = await response.json();
        this.currentLang = lang;
        localStorage.setItem('lang', lang);
        document.documentElement.lang = this.currentLang; // Update html lang attribute
      }
    } catch (error) {
      console.error('Error loading translations:', error);
      // Ensure translations is an empty object on error to prevent further issues
      this.translations = {};
    }
  },

  /**
   * Translates a given key into the current language.
   * @param {string} key The translation key.
   * @param {object} replacements Optional object for dynamic replacements (e.g., {name: "John"}).
   * @returns {string} The translated string or the key itself if not found.
   */
  translate(key, replacements = {}) {
    let translated = this.translations[key] || key;

    for (const placeholder in replacements) {
      translated = translated.replace(`{{${placeholder}}}`, replacements[placeholder]);
    }
    return translated;
  },

  /**
   * Applies translations to the entire document or a specific element.
   * Elements with `data-translate="key"` will have their `textContent` updated.
   * Elements with `data-translate-placeholder="key"` will have their `placeholder` attribute updated.
   * Elements with `data-translate-title="key"` will have their `title` attribute updated.
   * Elements with `data-translate-value="key"` will have their `value` attribute updated.
   * Elements with `data-translate-html="key"` will have their `innerHTML` updated (use with caution).
   */
  applyTranslations() {
    document.querySelectorAll('[data-translate]').forEach(element => {
      const key = element.getAttribute('data-translate');
      element.textContent = this.translate(key);
    });

    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
      const key = element.getAttribute('data-translate-placeholder');
      element.setAttribute('placeholder', this.translate(key));
    });

    document.querySelectorAll('[data-translate-title]').forEach(element => {
      const key = element.getAttribute('data-translate-title');
      element.setAttribute('title', this.translate(key));
    });

    document.querySelectorAll('[data-translate-value]').forEach(element => {
      const key = element.getAttribute('data-translate-value');
      element.setAttribute('value', this.translate(key));
    });

    // Use with caution for HTML content
    document.querySelectorAll('[data-translate-html]').forEach(element => {
      const key = element.getAttribute('data-translate-html');
      element.innerHTML = this.translate(key);
    });

    document.querySelectorAll('[data-translate-attr]').forEach(element => {
      const attrKey = element.getAttribute('data-translate-attr');
      const [attrName, key] = attrKey.split(':');
      if (attrName && key) {
        element.setAttribute(attrName, this.translate(key));
      } else {
        console.warn(`Invalid data-translate-attr format for element:`, element);
      }
    });
  },

  /**
   * Sets a new language and re-applies translations.
   * @param {string} lang The new language code.
   */
  async setLanguage(lang) {
    if (this.currentLang === lang) {
      return;
    }
    await this.loadTranslations(lang);
    this.applyTranslations();
    // Dispatch a custom event so other modules can react to language change
    window.dispatchEvent(new CustomEvent('langChange', { detail: { lang: this.currentLang } }));
  }
};

// Make i18n globally accessible
window.i18n = i18n;
