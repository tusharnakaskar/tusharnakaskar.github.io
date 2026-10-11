/**
 * Tushar Nakaskar - Developer Portfolio
 * Interactions: mobile nav, copy email, contact form, resume fallback,
 *               current year, and interactive particle background.
 */

document.addEventListener('DOMContentLoaded', () => {
  initBgCanvas();
  initMobileNav();
  initCopyEmail();
  initContactForm();
  initResumeDownload();
  initCurrentYear();
});

/* ==========================================================================
   1. Interactive Particle Canvas Background
   ========================================================================== */
function initBgCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W = window.innerWidth;
  let H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;

  // Mouse position tracking
  const mouse = { x: W / 2, y: H / 2 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('resize', () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
    initParticles();
  });

  // Particle settings
  const PARTICLE_COUNT = Math.min(80, Math.floor((W * H) / 16000));
  const MAX_DIST = 130;       // max connection distance
  const MOUSE_REPEL = 100;    // mouse repel radius
  const SPEED = 0.35;

  let particles = [];

  function Particle() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * SPEED;
    this.vy = (Math.random() - 0.5) * SPEED;
    this.r = Math.random() * 1.5 + 0.8;
    // 65% neutral grey, 25% emerald-tinted, 10% amber-tinted
    const roll = Math.random();
    if (roll < 0.65) {
      const b = Math.floor(Math.random() * 70 + 70);
      this.color = `rgb(${b},${b},${b})`;
    } else if (roll < 0.90) {
      const g = Math.floor(Math.random() * 80 + 100);
      this.color = `rgb(10,${g},80)`;       // emerald family
    } else {
      const r = Math.floor(Math.random() * 60 + 180);
      this.color = `rgb(${r},${Math.floor(r * 0.62)},0)`;  // amber family
    }
  }

  function initParticles() {
    particles = [];
    const count = Math.min(80, Math.floor((W * H) / 16000));
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  initParticles();

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Update & draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Gentle mouse repulsion
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_REPEL) {
        const force = (MOUSE_REPEL - dist) / MOUSE_REPEL * 0.015;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }

      // Dampen velocity slightly to prevent runaway
      p.vx *= 0.995;
      p.vy *= 0.995;

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Wrap edges
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.55;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Draw connection lines to nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const qx = p.x - q.x;
        const qy = p.y - q.y;
        const d = Math.sqrt(qx * qx + qy * qy);

        if (d < MAX_DIST) {
          const alpha = (1 - d / MAX_DIST) * 0.16;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(16,185,129,${alpha})`;
          ctx.lineWidth = 0.65;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  draw();
}

/* ==========================================================================
   2. Mobile Navigation Drawer
   ========================================================================== */
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
      toggleBtn.focus();
    }
  });
}

/* ==========================================================================
   3. Toast Notification
   ========================================================================== */
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
  setTimeout(() => toast.classList.remove('show'), 3200);
}

/* ==========================================================================
   4. Copy Email to Clipboard
   ========================================================================== */
function initCopyEmail() {
  const copyBtns = document.querySelectorAll('[data-copy-email]');
  const email = 'tusharnakaskarp@gmail.com';

  copyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email)
          .then(() => showToast('✓ Email copied: ' + email))
          .catch(() => { window.location.href = 'mailto:' + email; });
      } else {
        window.location.href = 'mailto:' + email;
      }
    });
  });
}

/* ==========================================================================
   5. Contact Form → Mailto Composer
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name    = document.getElementById('name')?.value.trim() || '';
    const subject = document.getElementById('subject')?.value.trim() || 'Portfolio Inquiry';
    const message = document.getElementById('message')?.value.trim() || '';

    const body = `Hi Tushar,\n\n${message}\n\nBest regards,\n${name}`;
    const href = `mailto:tusharnakaskarp@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = href;
    showToast('Opening your email client...');
  });
}

/* ==========================================================================
   6. Resume PDF Fallback
   ========================================================================== */
function initResumeDownload() {
  const resumeLinks = document.querySelectorAll('[data-resume-link]');
  resumeLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      fetch('assets/resume.pdf', { method: 'HEAD' })
        .then(res => {
          if (!res.ok) {
            e.preventDefault();
            showToast('Resume PDF will be added soon. Contact me directly!');
          }
        })
        .catch(() => {
          // Offline or local — proceed normally
        });
    });
  });
}

/* ==========================================================================
   7. Dynamic Copyright Year
   ========================================================================== */
function initCurrentYear() {
  const el = document.getElementById('current-year');
  if (el) el.textContent = new Date().getFullYear();
}
