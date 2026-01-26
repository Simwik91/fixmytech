(function() {

  // ===== DOM ELEMENTS =====
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const contactForm = document.getElementById('contact-form');
  const modal = document.getElementById('modal');
  const modalClose = document.querySelector('.modal-close');
  const termsCheckbox = document.getElementById('terms-checkbox');
  const submitButton = document.getElementById('submit-button');

  // ===== HEADER/FOOTER LOADING =====
  async function loadHeaderAndFooter() {
    try {
      const headerResponse = await fetch('/includes/header.html');
      if (!headerResponse.ok) throw new Error(window.i18n.translate('error_loading_header'));
      const headerHtml = await headerResponse.text();
      document.getElementById('header-container').innerHTML = headerHtml;
      initializeHeaderFunctionality();

      // Set language selector value based on current i18n language
      // Removed old language selector logic

      const footerResponse = await fetch('/includes/footer.html');
      if (!footerResponse.ok) throw new Error(window.i18n.translate('error_loading_footer'));
      const footerHtml = await footerResponse.text();
      document.getElementById('footer-container').innerHTML = footerHtml;

    } catch (error) {
      console.error('Error loading includes:', error);
      document.querySelectorAll('.error-message').forEach(el => el.style.display = 'block');
    }
  }

  function initializeHeaderFunctionality() {
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    // Initialize the theme switcher now that the header is loaded
    if (window.initializeTheme) {
      window.initializeTheme();
    }
    
    if (navToggle && mainNav) {
      navToggle.addEventListener('click', function() {
        mainNav.classList.toggle('active');
        const expanded = mainNav.classList.contains('active');
        navToggle.setAttribute('aria-expanded', expanded);
        
        const icon = navToggle.querySelector('i');
        if (icon) {
          if (mainNav.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
          } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
          }
        }
      });
    }

    // Toggle settings dropdown visibility
    const settingsToggle = document.querySelector('.settings-toggle');
    const settingsDropdown = document.querySelector('.settings-dropdown');

    if (settingsToggle && settingsDropdown) {
        settingsToggle.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent document click from closing immediately
            settingsDropdown.style.display = settingsDropdown.style.display === 'block' ? 'none' : 'block';
        });

        // Close dropdown if clicked outside
        document.addEventListener('click', (event) => {
            if (!settingsDropdown.contains(event.target) && settingsDropdown.style.display === 'block') {
                settingsDropdown.style.display = 'none';
            }
        });
    }
    
    populateToolsDropdown();
    populateSettingsDropdown();
  }

  // ===== POPULATE TOOLS DROPDOWN FROM JSON =====
  function populateToolsDropdown() {
    const dropdownContainer = document.getElementById('tools-dropdown');
    if (!dropdownContainer) return;

    fetch('/tools/tools.json')
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch tools.json');
        return response.json();
      })
      .then(data => {
        dropdownContainer.innerHTML = '';

                  data.forEach(tool => {
                    const translationKey = `tool_category_${tool.slug.replace(/-/g, '_')}`; // e.g., 'ean-generator' -> 'tool_category_ean_generator'
                    const translatedCategory = window.i18n.translate(translationKey);

                    const link = document.createElement('a');
                    link.href = tool.url;
                    link.setAttribute('aria-label', window.i18n.translate('go_to_category_aria', { category: translatedCategory }));
                    link.innerHTML = `<i class="${tool.icon}"></i>${translatedCategory}`;
                    dropdownContainer.appendChild(link);
                  });
        updateNavLinkListeners(document.querySelectorAll('.main-nav a'));
      })
      .catch(error => {
        console.error('Error loading tools:', error);
        dropdownContainer.innerHTML = `<a href="/tools/" aria-label="${window.i18n.translate('error_loading_tools_aria')}">${window.i18n.translate('error_loading_tools')}</a>`;
        updateNavLinkListeners(document.querySelectorAll('.main-nav a'));
      });
  }

  // ===== UPDATE NAV LINK LISTENERS =====
  function updateNavLinkListeners(links) {
    const navMenu = document.querySelector('.main-nav');
    const menuToggle = document.querySelector('.nav-toggle');
    if (links.length > 0 && navMenu && menuToggle) {
      links.forEach(link => {
        link.removeEventListener('click', handleNavLinkClick);
        link.addEventListener('click', handleNavLinkClick);
      });
    }
  }

  function handleNavLinkClick() {
    const navMenu = document.querySelector('.main-nav');
    if (navMenu && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      const menuToggle = document.querySelector('.nav-toggle');
      if (menuToggle) {
        menuToggle.setAttribute('aria-expanded', 'false');
        
        const icon = menuToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    }
  }

  // ===== SMOOTH SCROLLING =====
  function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]:not([data-smooth-scroll="false"])').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        // Add an early return for blob URLs
        if (this.getAttribute('href').startsWith('blob:')) {
            return;
        }

        if (this.getAttribute('href') === '#' || this.classList.contains('dropdown-toggle')) return;
        
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const header = document.querySelector('header');
          const headerHeight = header ? header.offsetHeight : 0;
          let targetPosition;

          if (targetId === '#contact') {
            targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
          } else {
            const offset = 20;
            targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - offset;
          }
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });

    document.querySelectorAll('.dropdown-content a').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && !href.startsWith('#')) {
          e.preventDefault();
          window.location.href = href;
        }
      });
    });
  }

  // ===== SCROLL TO TOP BUTTON =====
  function initializeScrollToTop() {
    function toggleScrollTopButton() {
      if (scrollTopBtn) {
        if (window.scrollY > 300) {
          scrollTopBtn.style.display = 'block';
        } else {
          scrollTopBtn.style.display = 'none';
        }
      }
    }

    if (scrollTopBtn) {
      window.addEventListener('scroll', toggleScrollTopButton);
      scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
      toggleScrollTopButton();
    }
  }

  // ===== FORM VALIDATION =====
  function validateForm(form) {
    if (!form) return false;
    
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    const errorElements = form.querySelectorAll('.error');
    errorElements.forEach(el => el.remove());
    
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
      field.classList.remove('error-border');
      
      if (!field.value.trim()) {
        showError(field, window.i18n.translate('form_field_required'));
        isValid = false;
      }
      
      if (field.type === 'email' && field.value.trim() && !emailRegex.test(field.value)) {
        showError(field, window.i18n.translate('form_invalid_email'));
        isValid = false;
      }
    });
    
    return isValid;
  }

  function showError(field, message) {
    if (!field) return;
    
    field.classList.add('error-border');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'error';
    errorElement.textContent = message;
    errorElement.style.color = 'var(--warning)';
    errorElement.style.fontSize = '0.8rem';
    errorElement.style.marginTop = '0.25rem';
    
    field.parentNode.insertBefore(errorElement, field.nextSibling);
  }

  // ===== FORM SUBMISSION HANDLER =====
  function initializeContactForm() {
    if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm(this)) return;
        
        const formData = {
          name: this.querySelector('[name="name"]').value,
          email: this.querySelector('[name="email"]').value,
          service: this.querySelector('[name="service"]').value,
          message: this.querySelector('[name="message"]').value
        };
        
        const notification = document.getElementById('notification');
        const notificationMessage = document.getElementById('notification-message');
        
        if (notification && notificationMessage) {
          notificationMessage.textContent = `${window.i18n.translate('notification_message', { service: formData.service, email: formData.email })}`;
          notification.classList.add('show');
          
          setTimeout(() => {
            notification.classList.remove('show');
          }, 5000);
        }
        
        this.reset();
      });
    }
  }

  // ===== TERMS CHECKBOX FUNCTIONALITY =====
  function initializeTermsCheckbox() {
    if (termsCheckbox && submitButton) {
      termsCheckbox.addEventListener('change', function() {
        submitButton.disabled = !this.checked;
      });
    }
  }

  // ===== MODAL FUNCTIONS =====
  const modalFunctions = {
    openModal: function(content) {
      if (modal) {
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
          modalContent.innerHTML = content;
          modal.style.display = 'block';
          document.body.style.overflow = 'hidden';
          
          const closeButtons = modalContent.querySelectorAll('[onclick*="closeModal"]');
          closeButtons.forEach(button => {
            button.onclick = modalFunctions.closeModal;
          });
        }
      }
    },
    closeModal: function() {
      if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }
    }
  };

  function initializeModal() {
    window.modalFunctions = modalFunctions;
    window.closeModal = modalFunctions.closeModal;

    if (modal) {
      window.addEventListener('click', (e) => {
        if (e.target === modal) {
          modalFunctions.closeModal();
        }
      });
    }

    if (modalClose) {
      modalClose.addEventListener('click', modalFunctions.closeModal);
    }
  }

  // ===== FAQ ACCORDION =====
  function initializeFaqAccordion() {
    const faqToggles = document.querySelectorAll('.faq-toggle');
    faqToggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        const item = toggle.parentElement;
        const panel = toggle.nextElementSibling;
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

        // Close all other panels
        faqToggles.forEach(otherToggle => {
          if (otherToggle !== toggle) {
            otherToggle.setAttribute('aria-expanded', 'false');
            otherToggle.nextElementSibling.style.maxHeight = null;
            otherToggle.querySelector('i').classList.remove('fa-minus');
            otherToggle.querySelector('i').classList.add('fa-plus');
          }
        });

        // Open or close the clicked panel
        if (isExpanded) {
          toggle.setAttribute('aria-expanded', 'false');
          panel.style.maxHeight = null;
          toggle.querySelector('i').classList.remove('fa-minus');
          toggle.querySelector('i').classList.add('fa-plus');
        } else {
          toggle.setAttribute('aria-expanded', 'true');
          panel.style.maxHeight = panel.scrollHeight + 'px';
          toggle.querySelector('i').classList.remove('fa-plus');
          toggle.querySelector('i').classList.add('fa-minus');
        }
      });
    });
  }

  // ===== RESPONSIVE BEHAVIOR =====
  function initializeResponsiveBehavior() {
    window.addEventListener('resize', () => {
      const navMenu = document.querySelector('.main-nav');
      if (window.innerWidth > 768 && navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        const menuToggle = document.querySelector('.nav-toggle');
        if (menuToggle) {
          menuToggle.setAttribute('aria-expanded', 'false');
          
          const icon = menuToggle.querySelector('i');
          if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                  }        }
      }
    });
  }


  // ===== POPULATE LANGUAGE DROPDOWN =====
  function populateSettingsDropdown() {
    const dropdownContainer = document.getElementById('language-options');
    if (!dropdownContainer) return;

    dropdownContainer.innerHTML = ''; // Clear existing content

    // Add Language header
    const langHeader = document.createElement('div');
    langHeader.className = 'settings-header';
    langHeader.textContent = window.i18n.translate('header_nav_language');
    dropdownContainer.appendChild(langHeader);

    // Create language options
    const languages = [
      { code: 'no', name_key: 'lang_norwegian' },
      { code: 'en', name_key: 'lang_english' }
    ];

    languages.forEach(lang => {
      const link = document.createElement('a');
      link.href = "javascript:void(0);";
      link.textContent = window.i18n.translate(lang.name_key);
      link.onclick = () => {
        window.i18n.setLanguage(lang.code);
        // Optionally, close the dropdown after selection
        const parentDropdown = link.closest('.settings-dropdown');
        if (parentDropdown) {
          parentDropdown.style.display = 'none';
          setTimeout(() => parentDropdown.style.display = '', 200);
        }
      };
      link.setAttribute('data-lang-code', lang.code); // Store language code
      dropdownContainer.appendChild(link);
    });

    // Highlight the current language
    const currentLangLink = dropdownContainer.querySelector(`[data-lang-code="${window.i18n.currentLang}"]`);
    if (currentLangLink) {
      currentLangLink.classList.add('active'); // Add 'active' class for styling
    }
  }

  async function loadAndTranslateContent() {
    await loadHeaderAndFooter();
    window.i18n.applyTranslations();
  }

  // ===== MAIN INITIALIZATION =====
  async function initializeAll() {
    await window.i18n.init(); // Initialize i18n first
    await loadAndTranslateContent(); // Load content and apply translations
    // The language dropdown population now handles its own active state.
    if (window.setInitialTheme) {
        window.setInitialTheme(); // Set initial theme after translations are loaded
    }
    
    // Initialize specific tool functionalities
    if (typeof window.initBarcodeGenerator === 'function') {
        window.initBarcodeGenerator();
    }
    if (typeof window.initQrGenerator === 'function') {
        window.initQrGenerator();
    }
    
    // Removed: window.addEventListener('langChange', updateLanguageButtons);

    window.addEventListener('langChange', async () => {
        await window.i18n.loadTranslations(window.i18n.currentLang);
        await loadAndTranslateContent(); // Reload content and re-apply all translations
        if (window.setInitialTheme) {
            window.setInitialTheme(); // Re-set theme to update button text with new language
        }
    });

    initializeSmoothScrolling();
    initializeScrollToTop();
    initializeContactForm();
    initializeTermsCheckbox();
    initializeModal();
    initializeFaqAccordion();
    initializeResponsiveBehavior();
  }

  // Start initialization
  initializeAll();
})();