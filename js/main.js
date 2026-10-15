/**
 * Tushar Nakaskar - Developer Portfolio
 * Advanced Minimalist Canvas Background & Client Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initAdvancedCanvas();
  initBgVideo();
  initHeaderScroll();
  initPageTransitions();
  initMobileNav();
  initScrollspy();
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
   1b. Interactive Programmer Video Background State Machine
       SLEEPING -> WAKING -> CODING <-> RELAXING
   ========================================================================== */
function initBgVideo() {
  const wrapper = document.getElementById('video-bg-wrapper');
  if (!wrapper) return;

  const videos = {
    sleep: document.getElementById('vid-sleep'),
    wake: document.getElementById('vid-wake'),
    code: document.getElementById('vid-code'),
    relaxEnter: document.getElementById('vid-relax-enter'),
    relaxIdle: document.getElementById('vid-relax-idle'),
    relaxExit: document.getElementById('vid-relax-exit')
  };

  // Graceful fallback for legacy single video element
  if (!videos.sleep) {
    const single = document.getElementById('bg-video') || document.getElementById('bg-video-a');
    if (single) single.play().catch(() => {});
    return;
  }

  const State = {
    SLEEPING: 'SLEEPING',
    WAKING: 'WAKING',
    CODING: 'CODING',
    RELAX_ENTER: 'RELAX_ENTER',
    RELAX_IDLE: 'RELAX_IDLE',
    RELAX_EXIT: 'RELAX_EXIT'
  };

  let currentState = State.SLEEPING;
  let hasAwoken = false;
  let currentVideo = videos.sleep;
  let transitionTimer = null;
  let idleTimer = null;
  const IDLE_DELAY_MS = 1800; // 1.8s inactivity threshold before relaxing

  // Transition smoothly from current video to target video with instant play
  function transitionTo(targetVideo, newState, onEnded = null, crossfadeMs = 250) {
    if (!targetVideo) return;
    if (currentVideo === targetVideo && targetVideo.classList.contains('active')) return;

    if (transitionTimer) {
      clearTimeout(transitionTimer);
      transitionTimer = null;
    }

    const previousVideo = currentVideo;
    currentVideo = targetVideo;
    currentState = newState;

    // Reset playback position and set onended listener
    targetVideo.currentTime = 0;
    targetVideo.onended = onEnded;

    // Start playback immediately (video is already preloaded in DOM)
    const playPromise = targetVideo.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        targetVideo.classList.add('active');
        if (previousVideo && previousVideo !== targetVideo) {
          previousVideo.classList.remove('active');
          transitionTimer = setTimeout(() => {
            previousVideo.pause();
            transitionTimer = null;
          }, crossfadeMs);
        }
      }).catch(err => {
        console.warn('Playback notice:', err);
      });
    }
  }

  // Trigger waking sequence on first interaction
  function triggerWake() {
    if (hasAwoken || currentState !== State.SLEEPING) return;
    hasAwoken = true;
    removeWakeListeners();

    // Waking clip is 2.8s: stirs, lifts head, opens eyes, sits up, hands to keyboard
    transitionTo(videos.wake, State.WAKING, () => {
      startCoding();
    }, 200);
  }

  // Enter continuous coding state
  function startCoding() {
    transitionTo(videos.code, State.CODING, null, 250);
    resetIdleTimer();
  }

  // Settle into relaxing state after inactivity timeout
  function startRelaxing() {
    if (currentState !== State.CODING) return;

    transitionTo(videos.relaxEnter, State.RELAX_ENTER, () => {
      if (currentState === State.RELAX_ENTER) {
        transitionTo(videos.relaxIdle, State.RELAX_IDLE, null, 200);
      }
    }, 250);
  }

  // Resume coding from relaxing when visitor interacts
  function resumeCoding() {
    if (currentState === State.RELAX_ENTER || currentState === State.RELAX_IDLE) {
      if (idleTimer) clearTimeout(idleTimer);

      // Fast 1.3s reverse transition: hands move down onto keyboard
      transitionTo(videos.relaxExit, State.RELAX_EXIT, () => {
        startCoding();
      }, 200);
    } else if (currentState === State.CODING) {
      resetIdleTimer();
    }
  }

  // Reset inactivity timer
  function resetIdleTimer() {
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      startRelaxing();
    }, IDLE_DELAY_MS);
  }

  // Centralized interaction dispatcher
  function onUserActivity() {
    if (!hasAwoken) {
      triggerWake();
      return;
    }

    if (currentState === State.CODING) {
      resetIdleTimer();
    } else if (currentState === State.RELAX_ENTER || currentState === State.RELAX_IDLE) {
      resumeCoding();
    }
  }

  // First wake interaction listeners
  const wakeEvents = ['scroll', 'wheel', 'touchstart', 'keydown'];
  function onFirstWakeEvent(e) {
    if (e.type === 'keydown') {
      const keys = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Space', 'Tab', 'Home', 'End'];
      if (!keys.includes(e.code) && !keys.includes(e.key)) return;
    }
    triggerWake();
  }

  function addWakeListeners() {
    wakeEvents.forEach(evt => {
      window.addEventListener(evt, onFirstWakeEvent, { passive: true, once: true });
    });
    document.addEventListener('click', onFirstWakeEvent, { once: true });
  }

  function removeWakeListeners() {
    wakeEvents.forEach(evt => {
      window.removeEventListener(evt, onFirstWakeEvent);
    });
    document.removeEventListener('click', onFirstWakeEvent);
  }

  // Throttled activity listener (100ms) for ongoing activity
  let lastActivity = 0;
  function handleActivity() {
    const now = Date.now();
    if (now - lastActivity > 100) {
      lastActivity = now;
      onUserActivity();
    }
  }

  window.addEventListener('scroll', handleActivity, { passive: true });
  window.addEventListener('wheel', handleActivity, { passive: true });
  window.addEventListener('touchmove', handleActivity, { passive: true });
  document.addEventListener('click', handleActivity, { passive: true });
  document.addEventListener('keydown', (e) => {
    const keys = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Space', 'Tab'];
    if (keys.includes(e.code) || keys.includes(e.key)) {
      handleActivity();
    }
  }, { passive: true });

  // Tab visibility: pause active video when hidden, resume when visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (currentVideo && !currentVideo.paused) currentVideo.pause();
    } else {
      if (currentVideo && currentVideo.paused) {
        currentVideo.play().catch(() => {});
      }
    }
  });

  // Respect prefers-reduced-motion
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mediaQuery.matches) {
    Object.values(videos).forEach(v => {
      if (v) v.playbackRate = 0.5;
    });
  }

  // Initial playback of sleep clip
  videos.sleep.play().catch(() => {});
  addWakeListeners();
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

  // Close drawer when any mobile link is clicked
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
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
   Scrollspy Navigation Indicator
   Dynamically shifts active shade between section links on scroll
   ========================================================================== */
function initScrollspy() {
  if (document.querySelector('.main-home')) return; // Main page uses dedicated single-section panel switcher

  const sectionIds = ['projects', 'achievements', 'contact'];
  const sections = sectionIds
    .map(id => document.getElementById(id))
    .filter(Boolean);

  if (sections.length === 0) return;

  const desktopLinks = document.querySelectorAll('.nav-desktop .nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-drawer .mobile-link');

  function updateActive() {
    const scrollPos = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Check if near bottom of document - activate About button (contact section)
    if (scrollPos + windowHeight >= documentHeight - 50) {
      setActive('contact');
      return;
    }

    // Responsive trigger line (around 32% of viewport height, bounded between 180px and 280px)
    const triggerOffset = Math.min(Math.max(windowHeight * 0.32, 180), 280);
    const triggerLine = scrollPos + triggerOffset;

    let currentId = null; // Stays null when in the hero section above projects

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      if (triggerLine >= section.offsetTop) {
        currentId = section.id;
      }
    }

    setActive(currentId);
  }

  function setActive(id) {
    desktopLinks.forEach(link => {
      const href = link.getAttribute('href') || '';
      const text = link.textContent.trim().toLowerCase();
      const isMatch = !!id && (
        href === `#${id}` ||
        href.endsWith(`#${id}`) ||
        (id === 'contact' && (href === '#contact' || href.endsWith('#contact') || text === 'about'))
      );
      if (isMatch) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    mobileLinks.forEach(link => {
      const href = link.getAttribute('href') || '';
      const text = link.textContent.trim().toLowerCase();
      const isMatch = !!id && (
        href === `#${id}` ||
        href.endsWith(`#${id}`) ||
        (id === 'contact' && (href === '#contact' || href.endsWith('#contact') || text === 'about'))
      );
      if (isMatch) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Smooth rAF throttling for jitter-free scroll responsiveness
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateActive();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', updateActive, { passive: true });
  updateActive();
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

/* ==========================================================================
   8. Header Scroll Elevation
   Refines translucent glass depth smoothly as user scrolls past hero
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  function onScroll() {
    const scrollPos = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    if (scrollPos > 15) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  onScroll();
}

/* ==========================================================================
   9. Page & Section Transitions (Dual-Screen Black Shutters with White Seam)
      Smooth closing (720ms) and opening (750ms).
      When switching sections on the main page, only that particular section
      is visible, fitting the interface completely (just like an info page).
   ========================================================================== */
function initPageTransitions() {
  // Ensure overlay DOM exists
  let overlay = document.getElementById('screen-split-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'screen-split-overlay';
    overlay.className = 'screen-split-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = `
      <div class="split-curtain split-curtain-left"></div>
      <div class="split-curtain split-curtain-right"></div>
    `;
    document.body.prepend(overlay);
  }

  const isMainPage = document.querySelector('.main-home') !== null;
  const sectionPanels = document.querySelectorAll('.main-section-panel');

  // Helper: Show specific section on main page without playing closing animation
  function setActiveSection(sectionId) {
    if (!isMainPage || sectionPanels.length === 0) return;

    let target = document.getElementById(sectionId);
    if (!target) {
      target = document.getElementById('home');
      sectionId = 'home';
    }

    sectionPanels.forEach(panel => {
      panel.classList.toggle('active', panel.id === sectionId);
    });

    if (sectionId === 'home') {
      document.body.classList.remove('section-non-hero');
    } else {
      document.body.classList.add('section-non-hero');
    }

    // Update active state in desktop and mobile nav
    const allNavLinks = document.querySelectorAll('.nav-desktop .nav-link, .mobile-drawer .mobile-link');
    allNavLinks.forEach(link => {
      const linkSection = link.getAttribute('data-section') || (link.getAttribute('href') || '').replace('#', '');
      link.classList.toggle('active', linkSection === sectionId);
    });

    window.scrollTo(0, 0);
  }

  // Trigger smooth dual-screen transition to switch active section on main page
  let isTransitioning = false;
  function transitionToSection(sectionId) {
    if (isTransitioning) return;

    const currentActive = document.querySelector('.main-section-panel.active');
    if (currentActive && currentActive.id === sectionId) return;

    isTransitioning = true;
    overlay.classList.remove('is-opening');
    overlay.classList.add('is-closing');

    // After two black screens close smoothly (720ms), swap active section
    setTimeout(() => {
      setActiveSection(sectionId);
      history.pushState(null, '', '#' + sectionId);

      // Smooth opening (750ms)
      overlay.classList.remove('is-closing');
      overlay.classList.add('is-opening');

      setTimeout(() => {
        overlay.classList.remove('is-opening');
        isTransitioning = false;
      }, 760);
    }, 720);
  }

  // Initial Section setup on main page based on hash or default
  if (isMainPage && sectionPanels.length > 0) {
    const rawHash = (window.location.hash || '').replace('#', '').toLowerCase();
    const validSections = ['home', 'projects', 'achievements', 'contact'];
    const initialSection = validSections.includes(rawHash) ? rawHash : 'home';
    setActiveSection(initialSection);

    // Listen to browser Back/Forward between sections
    window.addEventListener('popstate', () => {
      const hash = (window.location.hash || '').replace('#', '').toLowerCase();
      const target = validSections.includes(hash) ? hash : 'home';
      transitionToSection(target);
    });
  }

  // Check if this page load is arriving from a portfolio page redirect transition
  let wasTransition = false;
  try {
    wasTransition = sessionStorage.getItem('portfolio_page_transition') === '1';
    if (wasTransition) {
      sessionStorage.removeItem('portfolio_page_transition');
    }
  } catch (err) {}

  if (wasTransition) {
    requestAnimationFrame(() => {
      document.documentElement.classList.remove('split-transition-active');
      overlay.classList.remove('is-closing');
      overlay.classList.add('is-opening');

      setTimeout(() => {
        overlay.classList.remove('is-opening');
      }, 760);
    });
  } else {
    document.documentElement.classList.remove('split-transition-active');
    overlay.classList.remove('is-closing', 'is-opening');
  }

  // Handle browser back/forward cache (pageshow)
  window.addEventListener('pageshow', () => {
    document.documentElement.classList.remove('split-transition-active');
    overlay.classList.remove('is-closing');
    overlay.classList.add('is-opening');
    setTimeout(() => {
      overlay.classList.remove('is-opening');
    }, 760);
  });

  // Delegated click handler for navigation and transitions
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a');
    if (!anchor) return;

    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || (e.button && e.button !== 0)) {
      return;
    }

    if (anchor.target && anchor.target !== '_self') return;
    if (anchor.hasAttribute('download')) return;

    const rawHref = anchor.getAttribute('href');
    if (!rawHref || rawHref.startsWith('javascript:') || rawHref.startsWith('mailto:') || rawHref.startsWith('tel:')) {
      return;
    }

    // Case 1: In-page section switch on the main page (e.g., #home, #projects, #achievements, #contact)
    if (isMainPage && (rawHref.startsWith('#') || anchor.hasAttribute('data-section'))) {
      const sectionId = anchor.getAttribute('data-section') || rawHref.replace('#', '');
      const targetPanel = document.getElementById(sectionId);
      if (targetPanel && targetPanel.classList.contains('main-section-panel')) {
        e.preventDefault();
        anchor.classList.add('btn-clicked');
        transitionToSection(sectionId);
        return;
      }
    }

    // Case 2: Redirection between different pages within the portfolio
    let targetUrl;
    try {
      targetUrl = new URL(anchor.href, window.location.href);
    } catch (err) {
      return;
    }

    if (targetUrl.origin !== window.location.origin) return;

    // Check if redirecting to a different page
    if (targetUrl.pathname === window.location.pathname && targetUrl.search === window.location.search) {
      return;
    }

    const portfolioPages = [
      '',
      '/',
      'index.html',
      'projects.html',
      'certificates.html',
      'research.html',
      'about.html',
      'contact.html'
    ];

    const targetFile = targetUrl.pathname.split('/').pop();
    const isTargetPortfolioPage = portfolioPages.includes(targetFile) || targetUrl.pathname.endsWith('/');

    if (!isTargetPortfolioPage) return;

    // Trigger smooth closing transition and navigate
    e.preventDefault();
    anchor.classList.add('btn-clicked');

    try {
      sessionStorage.setItem('portfolio_page_transition', '1');
    } catch (err) {}

    overlay.classList.remove('is-opening');
    overlay.classList.add('is-closing');

    setTimeout(() => {
      window.location.href = anchor.href;
    }, 720);

    setTimeout(() => {
      overlay.classList.remove('is-closing');
    }, 3000);
  });
}
