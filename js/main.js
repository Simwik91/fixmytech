function initMainJS() {
  console.log('Initializing main JavaScript...');

  // ===== DOM ELEMENTS =====
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const contactForm = document.getElementById('contact-form');
  const modal = document.getElementById('modal');
  const modalClose = document.querySelector('.modal-close');
  const termsCheckbox = document.getElementById('terms-checkbox');
  const submitButton = document.getElementById('submit-button');

  // ===== HEADER/FOOTER LOADING =====
  function loadHeaderAndFooter() {
    fetch('/includes/header.html')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load header');
        return res.text();
      })
      .then(header => {
        document.getElementById('header-container').innerHTML = header;
        initializeHeaderFunctionality();
        
        return fetch('/includes/footer.html');
      })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load footer');
        return res.text();
      })
      .then(footer => {
        document.getElementById('footer-container').innerHTML = footer;
        console.log('Footer loaded and initialized');
      })
      .catch(error => {
        console.error('Error loading includes:', error);
        document.querySelectorAll('.error-message').forEach(el => el.style.display = 'block');
      });
  }

  function loadCookieConsent() {
    fetch('/includes/cookie-consent.html')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load cookie consent');
        return res.text();
      })
      .then(consentHTML => {
        document.getElementById('cookie-consent-container').innerHTML = consentHTML;
        // The cookie-consent.js will handle the rest
        if (window.initCookieConsent) {
          window.initCookieConsent();
        }
        console.log('Cookie consent module loaded and initialized.');
      })
      .catch(error => {
        console.error('Error loading cookie consent:', error);
      });
  }

  function initializeHeaderFunctionality() {
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    
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
    
    populateServicesDropdown();
  }

  // ===== POPULATE DROPDOWN MENU FROM JSON =====
  function populateServicesDropdown() {
    const dropdownContainer = document.getElementById('dropdown-services');
    if (!dropdownContainer) return;

    fetch('/tjenester/tjenester.json')
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch tjenester.json');
        return response.json();
      })
      .then(data => {
        const iconMap = {
          'Backup & Skylagring': 'fa-cloud',
          'Feilretting & Vedlikehold': 'fa-wrench',
          'Webdesign & Domene': 'fa-paint-brush'
        };

        dropdownContainer.innerHTML = '';

        data.tjenester.forEach(service => {
          const iconClass = iconMap[service.name] || 'fa-cogs';
          const link = document.createElement('a');
          link.href = service.path;
          link.setAttribute('aria-label', `Gå til ${service.name}`);
          link.innerHTML = `<i class="fas ${iconClass}"></i>${service.name}`;
          dropdownContainer.appendChild(link);
        });

        updateNavLinkListeners(document.querySelectorAll('.main-nav a'));
      })
      .catch(error => {
        console.error('Error loading services:', error);
        dropdownContainer.innerHTML = `
          <a href="/tjenester/feilretting/index.html" aria-label="Feilretting og Vedlikehold"><i class="fas fa-wrench"></i>Feilretting og Vedlikehold</a>
          <a href="/verktøy/backup/index.html" aria-label="Backup og Skylagring"><i class="fas fa-cloud"></i>Backup & Skylagring</a>
          <a href="/verktøy/webdesign/index.html" aria-label="Webdesign og Domene"><i class="fas fa-paint-brush"></i>Webdesign & Domene</a>
        `;
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
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        if (this.getAttribute('href') === '#' || this.classList.contains('dropdown-toggle')) return;
        
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const header = document.querySelector('header');
          const headerHeight = header ? header.offsetHeight : 0;
          const offset = 20;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - offset;
          
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
        showError(field, 'Dette feltet er påkrevd');
        isValid = false;
      }
      
      if (field.type === 'email' && field.value.trim() && !emailRegex.test(field.value)) {
        showError(field, 'Vennligst skriv inn en gyldig e-postadresse');
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
          notificationMessage.textContent = `Vi har mottatt din henvendelse om ${formData.service}. Vi kontakter deg på ${formData.email} snarest.`;
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

  // ===== MAIN INITIALIZATION =====
  function initializeAll() {
    loadHeaderAndFooter();
    loadCookieConsent();
    initializeSmoothScrolling();
    initializeScrollToTop();
    initializeContactForm();
    initializeTermsCheckbox();
    initializeModal();
    initializeResponsiveBehavior();
    
    console.log('All JavaScript functionality initialized successfully');
  }

  // Start initialization
  initializeAll();
}

// Export for global access
window.initMainJS = initMainJS;

// Auto-initialize based on document ready state
if (document.readyState === 'complete') {
  initMainJS();
} else {
  window.addEventListener('DOMContentLoaded', initMainJS);
}