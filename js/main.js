/**
 * Tushar Nakaskar - Developer Portfolio
 * Computer Science Interactive Background Animation & Utilities
 */

document.addEventListener('DOMContentLoaded', () => {
  initCsCanvas();
  initMobileNav();
  initCopyEmail();
  initContactForm();
  initResumeDownload();
  initCurrentYear();
});

/* ==========================================================================
   1. Interactive Computer Science Background Animation
      Features: Floating CS Glyphs, Binary Bits & Dynamic Circuit/Network Nodes
      Colors: Ruby Red, Faded White, Golden Amber, Electric Blue & Cyan
   ========================================================================== */
function initCsCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W = window.innerWidth;
  let H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;

  // Track mouse coordinates
  const mouse = { x: -1000, y: -1000, radius: 130 };

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
    createParticles();
  });

  // Computer Science glyphs library
  const CS_SYMBOLS = ['0', '1', '{ }', '</>', '&&', '=>', ';', 'git', '0x1', '[]', '==', '()', '::', 'fn()'];

  // Color palette definitions: Red, Golden Amber, Faded White, Electric Blue, Cyan
  const COLOR_PALETTE = [
    { r: 239, g: 68,  b: 68,  name: 'red' },      // Ruby Red
    { r: 245, g: 158, b: 11,  name: 'gold' },     // Golden Amber
    { r: 240, g: 243, b: 248, name: 'white' },    // Faded White
    { r: 59,  g: 130, b: 246, name: 'blue' },     // Electric Blue
    { r: 6,   g: 182, b: 212, name: 'cyan' }      // Cyan
  ];

  let particles = [];

  class CsParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * W;
      this.y = initial ? Math.random() * H : (Math.random() < 0.5 ? -10 : H + 10);
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      
      // 55% network nodes, 45% code syntax glyphs
      this.isGlyph = Math.random() < 0.45;
      this.glyph = CS_SYMBOLS[Math.floor(Math.random() * CS_SYMBOLS.length)];
      this.size = this.isGlyph ? (Math.random() * 3 + 10) : (Math.random() * 1.6 + 1.2);
      
      // Pick a random accent color
      this.colorObj = COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)];
      this.baseAlpha = Math.random() * 0.35 + 0.25;
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseSpeed = Math.random() * 0.02 + 0.01;
    }

    update() {
      // Gentle floating pulse
      this.pulse += this.pulseSpeed;
      const currentAlpha = this.baseAlpha + Math.sin(this.pulse) * 0.12;

      // Mouse interactive push
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        const angle = Math.atan2(dy, dx);
        this.vx += Math.cos(angle) * force * 0.04;
        this.vy += Math.sin(angle) * force * 0.04;
      }

      // Air resistance / friction
      this.vx *= 0.99;
      this.vy *= 0.99;

      // Position update
      this.x += this.vx;
      this.y += this.vy;

      // Wrap around bounds
      if (this.x < -30) this.x = W + 30;
      if (this.x > W + 30) this.x = -30;
      if (this.y < -30) this.y = H + 30;
      if (this.y > H + 30) this.y = -30;

      return currentAlpha;
    }

    draw(alpha) {
      const { r, g, b } = this.colorObj;

      if (this.isGlyph) {
        ctx.font = `500 ${Math.round(this.size)}px 'JetBrains Mono', monospace`;
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.max(0.15, alpha)})`;
        ctx.fillText(this.glyph, this.x, this.y);
      } else {
        // Draw circuit/node dot
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.max(0.2, alpha)})`;
        ctx.fill();

        // Subtle glowing halo for nodes
        if (alpha > 0.3) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.05)`;
          ctx.fill();
        }
      }
    }
  }

  function createParticles() {
    particles = [];
    const count = Math.min(95, Math.floor((W * H) / 14000));
    for (let i = 0; i < count; i++) {
      particles.push(new CsParticle());
    }
  }

  createParticles();

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, W, H);

    // 1. Draw connecting circuit lines between nearby nodes
    const maxLinkDist = 125;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];

        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxLinkDist) {
          const lineAlpha = (1 - dist / maxLinkDist) * 0.16;
          // Gradient between p1 color and p2 color
          const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
          grad.addColorStop(0, `rgba(${p1.colorObj.r}, ${p1.colorObj.g}, ${p1.colorObj.b}, ${lineAlpha})`);
          grad.addColorStop(1, `rgba(${p2.colorObj.r}, ${p2.colorObj.g}, ${p2.colorObj.b}, ${lineAlpha})`);

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }
    }

    // 2. Update and draw each particle
    for (let i = 0; i < particles.length; i++) {
      const alpha = particles[i].update();
      particles[i].draw(alpha);
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. Mobile Navigation Drawer Toggle
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
    const subject = document.getElementById('subject')?.value.trim() || 'Software Developer Opportunity';
    const message = document.getElementById('message')?.value.trim() || '';

    const body = `Hi Tushar,\n\n${message}\n\nBest regards,\n${name}`;
    const href = `mailto:tusharnakaskarp@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = href;
    showToast('Launching email client...');
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
