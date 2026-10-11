/**
 * Tushar Nakaskar - Developer Portfolio
 * Minimal, fast, zero-dependency client interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initCopyEmail();
  initContactForm();
  initResumeDownload();
  initCurrentYear();
});

/* Mobile Menu Toggle */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const drawer = document.getElementById('mobile-drawer');

  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen.toString());
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      drawer.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* Toast Notification Utility */
function showToast(message) {
  let toast = document.getElementById('site-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'site-toast';
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

/* Copy Email to Clipboard */
function initCopyEmail() {
  const copyBtns = document.querySelectorAll('[data-copy-email]');
  const email = 'tusharnakaskarp@gmail.com';

  copyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email)
          .then(() => showToast('Copied email address: ' + email))
          .catch(() => window.location.href = 'mailto:' + email);
      } else {
        window.location.href = 'mailto:' + email;
      }
    });
  });
}

/* Contact Form to Mailto */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name')?.value.trim() || '';
    const subject = document.getElementById('subject')?.value.trim() || 'Portfolio Inquiry';
    const message = document.getElementById('message')?.value.trim() || '';

    const bodyText = `Hi Tushar,\n\n${message}\n\nBest regards,\n${name}`;
    const mailtoUrl = `mailto:tusharnakaskarp@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;

    window.location.href = mailtoUrl;
    showToast('Launching email client...');
  });
}

/* Resume PDF Link Fallback */
function initResumeDownload() {
  const resumeLinks = document.querySelectorAll('[data-resume-link]');
  resumeLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Check if file exists via HEAD request
      fetch('assets/resume.pdf', { method: 'HEAD' })
        .then(response => {
          if (!response.ok) {
            e.preventDefault();
            showToast('Resume PDF will be added shortly. You can contact me directly!');
          }
        })
        .catch(() => {
          // If local or offline, proceed normally
        });
    });
  });
}

/* Dynamic Copyright Year */
function initCurrentYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
