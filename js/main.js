// Main initialization function
function initMainJS() {
  console.log('Initializing main JavaScript...');

  // ===== DOM ELEMENTS =====
  const menuToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.main-nav');
  const navLinks = document.querySelectorAll('.main-nav a');
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const contactForm = document.getElementById('contact-form');
  const modal = document.getElementById('modal');
  const modalClose = document.querySelector('.modal-close');
  const themeToggle = document.getElementById('themeToggle');
  const cookieSettingsLink = document.getElementById('cookieSettingsLink');

  // ===== MOBILE MENU TOGGLE =====
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      
      // Toggle hamburger icon
      const icon = this.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('active')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-times');
        } else {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      }
    });
  }

  // ===== CLOSE MOBILE MENU WHEN CLICKING LINKS =====
  if (navLinks.length > 0 && navMenu && menuToggle) {
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          menuToggle.setAttribute('aria-expanded', 'false');
          
          // Reset hamburger icon
          const icon = menuToggle.querySelector('i');
          if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
          }
        }
      });
    });
  }

  // ===== SMOOTH SCROLLING =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      // Skip for dropdowns and external links
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

  // ===== SCROLL TO TOP BUTTON =====
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
    toggleScrollTopButton(); // Initial check
  }

  // ===== FORM VALIDATION =====
  function validateForm(form) {
    if (!form) return false;
    
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Reset errors
    const errorElements = form.querySelectorAll('.error');
    errorElements.forEach(el => el.remove());
    
    // Validate required fields
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
      field.classList.remove('error-border');
      
      if (!field.value.trim()) {
        showError(field, 'Dette feltet er påkrevd');
        isValid = false;
      }
      
      // Email validation
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
      
      // Show success notification
      const notification = document.getElementById('notification');
      const notificationMessage = document.getElementById('notification-message');
      
      if (notification && notificationMessage) {
        notificationMessage.textContent = `Vi har mottatt din henvendelse om ${formData.service}. Vi kontakter deg på ${formData.email} snarest.`;
        notification.classList.add('show');
        
        // Hide notification after 5 seconds
        setTimeout(() => {
          notification.classList.remove('show');
        }, 5000);
      }
      
      // Reset form
      this.reset();
    });
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
          
          // Add event listener to any close buttons in the modal content
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

  // Make modal functions available globally
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

  // ===== COOKIE MANAGEMENT =====
  function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Lax";
  }

  function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  function showCookieBanner() {
    const banner = document.getElementById('cookie-consent-banner');
    if (banner) {
      banner.style.display = 'block';
      setTimeout(() => {
        banner.classList.add('show');
      }, 10);
    }
  }

  function hideCookieBanner() {
    const banner = document.getElementById('cookie-consent-banner');
    if (banner) {
      banner.classList.remove('show');
      setTimeout(() => {
        banner.style.display = 'none';
      }, 300);
    }
  }

  function acceptCookies() {
    setCookie('cookie_consent', 'accepted', 365);
    setCookie('analytics_consent', 'true', 365);
    hideCookieBanner();
    updateStatusIndicators();
  }

  function rejectCookies() {
    setCookie('cookie_consent', 'rejected', 365);
    setCookie('analytics_consent', 'false', 365);
    hideCookieBanner();
    updateStatusIndicators();
  }

  function showCookieSettings() {
    const modal = document.getElementById('cookie-settings-modal');
    if (modal) {
      modal.style.display = 'flex';
      
      // Set toggle based on current settings
      const analyticsConsent = getCookie('analytics_consent');
      const analyticsCheckbox = document.getElementById('analytics-cookies');
      if (analyticsCheckbox) {
        analyticsCheckbox.checked = analyticsConsent === 'true';
      }
      
      updateStatusIndicators();
    }
  }

  function saveCookieSettings() {
    const analyticsCheckbox = document.getElementById('analytics-cookies');
    if (analyticsCheckbox) {
      const analyticsAllowed = analyticsCheckbox.checked;
      setCookie('analytics_consent', analyticsAllowed, 365);
      
      if (analyticsAllowed) {
        setCookie('cookie_consent', 'accepted', 365);
      } else {
        setCookie('cookie_consent', 'rejected', 365);
      }
    }
    
    const modal = document.getElementById('cookie-settings-modal');
    if (modal) {
      modal.style.display = 'none';
    }
    hideCookieBanner();
    updateStatusIndicators();
  }

  function updateStatusIndicators() {
    const analyticsConsent = getCookie('analytics_consent');
    const analyticsStatus = document.getElementById('analytics-status');
    const analyticsStatusText = document.getElementById('analytics-status-text');
    const overallStatus = document.getElementById('overall-status');
    const overallStatusText = document.getElementById('overall-status-text');
    
    if (analyticsStatus) {
      if (analyticsConsent === 'true') {
        analyticsStatus.classList.remove('off');
      } else {
        analyticsStatus.classList.add('off');
      }
    }
    
    if (analyticsStatusText) {
      analyticsStatusText.textContent = analyticsConsent === 'true' ? 'På' : 'Av';
    }
    
    if (overallStatusText) {
      if (getCookie('cookie_consent')) {
        overallStatusText.textContent = 'Innstillinger er lagret';
      } else {
        overallStatusText.textContent = 'Innstillinger er ikke lagret';
      }
    }
  }

  // Initialize cookie consent
  const cookieConsent = getCookie('cookie_consent');
  if (!cookieConsent) {
    showCookieBanner();
  }

  // Event listeners for cookie buttons
  const cookieAccept = document.getElementById('cookie-accept');
  const cookieReject = document.getElementById('cookie-reject');
  const cookieSettings = document.getElementById('cookie-settings');
  const saveCookieSettingsBtn = document.getElementById('save-cookie-settings');
  const closeCookieModal = document.querySelector('.close-modal');

  if (cookieAccept) cookieAccept.addEventListener('click', acceptCookies);
  if (cookieReject) cookieReject.addEventListener('click', rejectCookies);
  if (cookieSettings) cookieSettings.addEventListener('click', showCookieSettings);
  if (closeCookieModal) closeCookieModal.addEventListener('click', () => {
    document.getElementById('cookie-settings-modal').style.display = 'none';
  });
  if (saveCookieSettingsBtn) saveCookieSettingsBtn.addEventListener('click', saveCookieSettings);
  
  // Cookie settings link in footer
  if (cookieSettingsLink) {
    cookieSettingsLink.addEventListener('click', function(e) {
      e.preventDefault();
      showCookieSettings();
    });
  }

  // Close cookie modal when clicking outside
  window.addEventListener('click', (e) => {
    const cookieModal = document.getElementById('cookie-settings-modal');
    if (cookieModal && e.target === cookieModal) {
      cookieModal.style.display = 'none';
    }
  });

  // ===== DARK/LIGHT THEME TOGGLE =====
  function toggleTheme() {
    if (themeToggle) {
      const isDark = document.body.classList.toggle('dark-theme');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
  }

  function initTheme() {
    if (themeToggle) {
      const savedTheme = localStorage.getItem('theme') || 'light';
      if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
      } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
      }
      
      themeToggle.addEventListener('click', toggleTheme);
    }
  }

  // Initialize theme
  initTheme();

  // Close mobile menu on larger screens if resized
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu && navMenu.classList.contains('active') && menuToggle) {
      navMenu.classList.remove('active');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      
      // Reset hamburger icon
      const icon = menuToggle.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    }
  });

  console.log('Main JavaScript initialized successfully');
}

// Make init function available globally
window.initMainJS = initMainJS;

// Initialize immediately if DOM is already loaded
if (document.readyState === 'complete') {
  initMainJS();
} else {
  window.addEventListener('DOMContentLoaded', initMainJS);
}
