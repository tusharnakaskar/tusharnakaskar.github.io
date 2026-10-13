/**
 * Tushar Nakaskar - Developer Portfolio
 * Advanced Minimalist Canvas Background & Client Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initAdvancedCanvas();
  initBgVideo();
  initMobileNav();
  initCopyEmail();
  initContactForm();
  initResumeDownload();
  initCurrentYear();
});

/* ==========================================================================
   1. Advanced Subtle Tech Canvas Background
      Clean, non-distracting constellation mesh with cursor illumination.
      Professional, calm, and recruiter-focused (no gaming arcade glyphs).
   ========================================================================== */
function initAdvancedCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W = window.innerWidth;
  let H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;

  // Smooth mouse coordinates tracking with lerp
  const mouse = { x: -1000, y: -1000, currentX: -1000, currentY: -1000, radius: 150 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  window.addEventListener('resize', () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
    createNodes();
  });

  let nodes = [];

  class TechNode {
    constructor() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.28;
      this.vy = (Math.random() - 0.5) * 0.28;
      this.radius = Math.random() * 1.3 + 0.9;
      
      // Aesthetic multi-color distribution: Faded Slate/White, Ruby Red, and Warm Gold
      const rand = Math.random();
      if (rand < 0.50) {
        this.color = { r: 160, g: 168, b: 180 }; // Faded Slate Grey / White
        this.alpha = Math.random() * 0.22 + 0.12;
      } else if (rand < 0.80) {
        this.color = { r: 225, g: 29, b: 72 };   // Aesthetic Ruby Red
        this.alpha = Math.random() * 0.28 + 0.18;
      } else {
        this.color = { r: 245, g: 158, b: 11 };  // Warm Gold
        this.alpha = Math.random() * 0.25 + 0.16;
      }
    }

    update() {
      // Soft repulsion from cursor
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        this.vx += (dx / dist) * force * 0.025;
        this.vy += (dy / dist) * force * 0.025;
      }

      // Gentle damping
      this.vx *= 0.99;
      this.vy *= 0.99;

      this.x += this.vx;
      this.y += this.vy;

      // Wrap around viewport edges
      if (this.x < -10) this.x = W + 10;
      if (this.x > W + 10) this.x = -10;
      if (this.y < -10) this.y = H + 10;
      if (this.y > H + 10) this.y = -10;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha})`;
      ctx.fill();
    }
  }

  function createNodes() {
    nodes = [];
    const count = Math.min(70, Math.floor((W * H) / 17000));
    for (let i = 0; i < count; i++) {
      nodes.push(new TechNode());
    }
  }

  createNodes();

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, W, H);

    // 1. Soft subtle radial glow around mouse cursor (Red & Gold aura)
    if (mouse.x > 0 && mouse.y > 0) {
      const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 190);
      gradient.addColorStop(0, 'rgba(225, 29, 72, 0.04)');
      gradient.addColorStop(0.5, 'rgba(245, 158, 11, 0.015)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, W, H);
    }

    // 2. Connecting faint lines between nearby nodes
    const maxLinkDist = 135;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const n1 = nodes[i];
        const n2 = nodes[j];

        const dx = n1.x - n2.x;
        const dy = n1.y - n2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxLinkDist) {
          const lineAlpha = (1 - dist / maxLinkDist) * 0.12;
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.strokeStyle = `rgba(${n1.color.r}, ${n1.color.g}, ${n1.color.b}, ${lineAlpha})`;
          ctx.lineWidth = 0.65;
          ctx.stroke();
        }
      }
    }

    // 3. Draw nodes
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].update();
      nodes[i].draw();
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   1b. Background Video Graceful Fallback
   ========================================================================== */
function initBgVideo() {
  const video = document.getElementById('bg-video');
  if (!video) return;

  // Gracefully hide video container if video file is missing or triggers error
  video.addEventListener('error', () => {
    video.style.display = 'none';
  }, true);

  // If video is loaded and ready, ensure it plays smoothly
  video.addEventListener('loadeddata', () => {
    video.style.display = 'block';
    video.play().catch(() => {
      // Autoplay with sound restricted, muted is already set
    });
  });
}

/* ==========================================================================
   2. Mobile Drawer Navigation Toggle
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const drawer = document.getElementById('mobile-drawer');

  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen.toString());
  });

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
    const subject = document.getElementById('subject')?.value.trim() || 'Opportunity / Inquiry';
    const message = document.getElementById('message')?.value.trim() || '';

    const body = `Hi Tushar,\n\n${message}\n\nBest regards,\n${name}`;
    const href = `mailto:tusharnakaskarp@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = href;
    showToast('Redirecting to email compose...');
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
            showToast('Resume PDF will be available soon. Please feel free to email me directly!');
          }
        })
        .catch(() => {
          // Local/offline test
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
