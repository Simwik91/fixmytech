// Main initialization function
function initMainJS() {
  console.log('Initializing main JavaScript...');

  // ===== DOM ELEMENTS =====
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.main-nav ul');
  const navLinks = document.querySelectorAll('.main-nav a');
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const contactForm = document.getElementById('contact-form');
  const modal = document.getElementById('modal');
  const modalClose = document.querySelector('.modal-close');
  const themeToggle = document.getElementById('themeToggle');

  // ===== MODAL FUNCTIONS =====
  const modalFunctions = {
    openModal: function(content) {
      if (modal) {
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
          modalContent.innerHTML = content;
          modal.style.display = 'flex';
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

  // ===== MOBILE MENU TOGGLE =====
  if (menuToggle && navMenu) {
    console.log('Initializing mobile menu toggle...');
    menuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('show');
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      this.classList.toggle('active');
    });
  }

  // ===== CLOSE MOBILE MENU WHEN CLICKING LINKS =====
  if (navLinks.length > 0 && navMenu && menuToggle) {
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('show')) {
          navMenu.classList.remove('show');
          menuToggle.classList.remove('active');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // ===== SMOOTH SCROLLING =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const header = document.querySelector('header');
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
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
        message: this.querySelector('[name="message"]').value
      };
      
      // Show success message
      const successMessage = `
        <div class="success-message">
          <i class="fas fa-check-circle"></i>
          <h2>Takk, ${formData.name}!</h2>
          <p>Din melding er sendt.</p>
          <p>Vi tar kontakt med deg på ${formData.email} snart.</p>
          <button class="btn" onclick="modalFunctions.closeModal()">Lukk</button>
        </div>
      `;
      
      modalFunctions.openModal(successMessage);
      this.reset();
    });
  }

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
    if (window.innerWidth > 768 && navMenu && navMenu.classList.contains('show') && menuToggle) {
      navMenu.classList.remove('show');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });

  console.log('Main JavaScript initialized successfully');
}

// Make init function available globally
window.initMainJS = initMainJS;

// Initialize immediately if DOM is already loaded
if (document.readyState === 'complete') {
  initMainJS();
}
