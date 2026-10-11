/**
 * Tushar Nakaskar - Developer Portfolio
 * Client-side interactions, navigation, skills filter, and resume verification.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initScrollSpy();
  initSkillsFilter();
  initResumeChecker();
  initCopyEmail();
  initContactForm();
  initDynamicYear();
});

/* --------------------------------------------------------------------------
   1. Mobile Navigation Drawer
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !mobileMenu) return;

  function toggleMenu(isOpen) {
    const state = typeof isOpen === 'boolean' ? isOpen : !mobileMenu.classList.contains('is-open');
    mobileMenu.classList.toggle('is-open', state);
    toggleBtn.setAttribute('aria-expanded', state.toString());
    mobileMenu.setAttribute('aria-hidden', (!state).toString());
    
    // Prevent body scrolling when menu is open on small mobile devices
    if (state && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  toggleBtn.addEventListener('click', () => toggleMenu());

  // Close when clicking any nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
      toggleMenu(false);
      toggleBtn.focus();
    }
  });

  // Reset overflow if resized to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 860 && mobileMenu.classList.contains('is-open')) {
      toggleMenu(false);
    }
  });
}

/* --------------------------------------------------------------------------
   2. Active Navigation ScrollSpy
   -------------------------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.nav-desktop .nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!sections.length) return;

  function setActiveLink(currentId) {
    desktopLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${currentId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    mobileLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${currentId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // IntersectionObserver for modern performant scroll tracking
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -65% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActiveLink(entry.target.id);
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));
}

/* --------------------------------------------------------------------------
   3. Technical Skills Category Filter
   -------------------------------------------------------------------------- */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-category-card');

  if (!filterBtns.length || !skillCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active state on buttons
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Filter cards
      skillCards.forEach(card => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
          card.style.display = '';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   4. Resume Verification & Friendly Fallback Modal
   -------------------------------------------------------------------------- */
function initResumeChecker() {
  const downloadBtn = document.getElementById('download-resume-btn');
  const heroResumeBtn = document.getElementById('hero-resume-btn');
  const viewBtn = document.getElementById('view-resume-btn');
  const statusBadge = document.getElementById('resume-status-badge');
  const modal = document.getElementById('resume-modal');
  const modalClose = document.getElementById('resume-modal-close');
  const modalOk = document.getElementById('resume-modal-ok');

  let resumeFileExists = false;

  // Check if assets/resume.pdf is accessible
  fetch('assets/resume.pdf', { method: 'HEAD' })
    .then(response => {
      if (response.ok && response.status !== 404) {
        resumeFileExists = true;
        if (statusBadge) {
          statusBadge.textContent = 'PDF Verified';
          statusBadge.style.color = '#10b981';
          statusBadge.style.borderColor = 'rgba(16, 185, 129, 0.3)';
        }
      } else {
        resumeFileExists = false;
        if (statusBadge) {
          statusBadge.textContent = 'Placeholder (Upload resume.pdf)';
        }
      }
    })
    .catch(() => {
      resumeFileExists = false;
    });

  function openModal() {
    if (modal) {
      modal.classList.add('is-active');
      modal.setAttribute('aria-hidden', 'false');
      if (modalClose) modalClose.focus();
    }
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove('is-active');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  // Intercept clicks if the file is not found
  if (downloadBtn) {
    downloadBtn.addEventListener('click', (e) => {
      if (!resumeFileExists) {
        e.preventDefault();
        openModal();
      }
    });
  }

  if (viewBtn) {
    viewBtn.addEventListener('click', (e) => {
      if (!resumeFileExists) {
        e.preventDefault();
        openModal();
      }
    });
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOk) modalOk.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('is-active')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   5. One-Click Copy Email to Clipboard
   -------------------------------------------------------------------------- */
function initCopyEmail() {
  const copyBtn = document.getElementById('copy-email-btn');
  const tooltip = document.getElementById('copy-tooltip');
  const email = 'tusharnakaskarp@gmail.com';

  if (!copyBtn || !tooltip) return;

  copyBtn.addEventListener('click', async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
      } else {
        // Fallback for non-https/legacy
        const textArea = document.createElement('textarea');
        textArea.value = email;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }

      tooltip.textContent = 'Copied!';
      tooltip.classList.add('show');

      setTimeout(() => {
        tooltip.textContent = 'Copy';
        tooltip.classList.remove('show');
      }, 2000);
    } catch (err) {
      console.warn('Unable to copy email to clipboard', err);
    }
  });
}

/* --------------------------------------------------------------------------
   6. Contact Form - Pre-filled Mail Client Launcher
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('contact-name');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');

    const name = nameInput ? nameInput.value.trim() : '';
    const subject = subjectInput ? subjectInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name || !subject || !message) {
      alert('Please fill out all fields before sending.');
      return;
    }

    const emailTo = 'tusharnakaskarp@gmail.com';
    const emailSubject = encodeURIComponent(`[Portfolio Contact] ${subject} - from ${name}`);
    const emailBody = encodeURIComponent(
      `Hello Tushar,\n\n${message}\n\nBest regards,\n${name}`
    );

    const mailtoUrl = `mailto:${emailTo}?subject=${emailSubject}&body=${emailBody}`;

    // Launch email application
    window.location.href = mailtoUrl;
  });
}

/* --------------------------------------------------------------------------
   7. Dynamic Current Year in Footer
   -------------------------------------------------------------------------- */
function initDynamicYear() {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    const year = new Date().getFullYear();
    yearElement.textContent = year >= 2026 ? year : 2026;
  }
}
