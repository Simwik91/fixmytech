// ===== DOM ELEMENTS =====
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('nav ul');
const navLinks = document.querySelectorAll('nav a');
const scrollTopBtn = document.getElementById('scrollTopBtn');
const contactForm = document.getElementById('contact-form'); // Fixed ID to match HTML
const modal = document.getElementById('modal');
const modalClose = document.querySelector('.modal-close');
const themeToggle = document.getElementById('themeToggle');

// ===== MOBILE MENU TOGGLE =====
function toggleMobileMenu() {
  if (navMenu) {
    navMenu.classList.toggle('show');
    // Toggle aria-expanded attribute
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    // Toggle hamburger icon
    menuToggle.classList.toggle('active');
  }
}

if (menuToggle) {
  menuToggle.addEventListener('click', toggleMobileMenu);
}

// Close mobile menu when clicking on links
if (navLinks.length > 0) {
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu && navMenu.classList.contains('show')) {
        navMenu.classList.remove('show');
        if (menuToggle) {
          menuToggle.classList.remove('active');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
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
      const headerHeight = document.querySelector('header').offsetHeight || 0;
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
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ===== FORM VALIDATION =====
function validateForm(form) {
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
  field.classList.add('error-border');
  
  const errorElement = document.createElement('div');
  errorElement.className = 'error';
  errorElement.textContent = message;
  errorElement.style.color = 'var(--warning)';
  errorElement.style.fontSize = '0.8rem';
  errorElement.style.marginTop = '0.25rem';
  
  field.parentNode.insertBefore(errorElement, field.nextSibling);
}

// ===== MODAL FUNCTIONS =====
function openModal(content) {
  if (modal) {
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
      modalContent.innerHTML = content;
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
  }
}

function closeModal() {
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = ''; // Restore scrolling
  }
}

// Close modal when clicking outside content
if (modal) {
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
}

// Close modal with close button
if (modalClose) {
  modalClose.addEventListener('click', closeModal);
}

// ===== FORM SUBMISSION HANDLER =====
function handleFormSubmit(e) {
  e.preventDefault();
  
  if (!validateForm(contactForm)) return;
  
  // Form data collection
  const formData = {
    name: contactForm.querySelector('[name="name"]').value,
    email: contactForm.querySelector('[name="email"]').value,
    message: contactForm.querySelector('[name="message"]').value
  };
  
  // Show success message
  const successMessage = `
    <div class="success-message">
      <i class="fas fa-check-circle" style="font-size: 3rem; color: var(--success);"></i>
      <h2>Takk, ${formData.name}!</h2>
      <p>Din melding er sendt.</p>
      <p>Vi tar kontakt med deg på ${formData.email} snart.</p>
      <button class="btn" onclick="closeModal()">Lukk</button>
    </div>
  `;
  
  openModal(successMessage);
  
  // Reset form
  contactForm.reset();
}

// ===== DARK/LIGHT THEME TOGGLE =====
function toggleTheme() {
  if (themeToggle) {
    const isDark = document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  }
}

// Check for saved theme preference
function initTheme() {
  if (themeToggle) {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
  }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');
  
  // Initialize theme
  initTheme();
  
  // Event listeners
  if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
  }
  
  window.addEventListener('scroll', toggleScrollTopButton);
  
  // Initialize scroll position
  toggleScrollTopButton();
  
  // Close mobile menu on larger screens if resized
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu && navMenu.classList.contains('show')) {
      navMenu.classList.remove('show');
      if (menuToggle) {
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    }
  });
});

// ===== ADDITIONAL UTILITY FUNCTIONS =====
// Debounce function for performance optimization
function debounce(func, wait = 100) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

// Lazy loading for images
function lazyLoadImages() {
  const lazyImages = document.querySelectorAll('img.lazy');
  
  const lazyImageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const lazyImage = entry.target;
        lazyImage.src = lazyImage.dataset.src;
        lazyImage.classList.remove('lazy');
        lazyImageObserver.unobserve(lazyImage);
      }
    });
  });
  
  lazyImages.forEach(lazyImage => {
    lazyImageObserver.observe(lazyImage);
  });
}

// Initialize lazy loading
if ('IntersectionObserver' in window) {
  lazyLoadImages();
}
