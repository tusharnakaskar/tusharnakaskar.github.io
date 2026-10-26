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
  initCenteredNavScroll();
  initParallax();
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
  const IDLE_DELAY_MS = 2500; // 2.5s inactivity threshold before relaxing

  // Transition smoothly from current video to target video with instant play
  function transitionTo(targetVideo, newState, onEnded = null, crossfadeMs = 600) {
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

    // Waking clip: stirs, lifts head, opens eyes, sits up, hands to keyboard
    // Smooth 750ms fade transition so sleeping softly dissolves into waking
    transitionTo(videos.wake, State.WAKING, () => {
      startCoding();
    }, 750);
  }

  // Enter continuous coding state
  function startCoding() {
    transitionTo(videos.code, State.CODING, null, 500);
    resetIdleTimer();
  }

  // Settle into relaxing state after inactivity timeout
  function startRelaxing() {
    if (currentState !== State.CODING) return;

    transitionTo(videos.relaxEnter, State.RELAX_ENTER, () => {
      if (currentState === State.RELAX_ENTER) {
        transitionTo(videos.relaxIdle, State.RELAX_IDLE, null, 400);
      }
    }, 500);
  }

  // Resume coding from relaxing when visitor interacts
  function resumeCoding() {
    if (currentState === State.RELAX_ENTER || currentState === State.RELAX_IDLE) {
      if (idleTimer) clearTimeout(idleTimer);

      // Smooth, natural-paced transition: hands move down onto keyboard
      transitionTo(videos.relaxExit, State.RELAX_EXIT, () => {
        startCoding();
      }, 400);
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

/* Helper: Compute true unscaled document offset top */
function getElementDocTop(el) {
  let top = 0;
  let curr = el;
  while (curr) {
    top += curr.offsetTop;
    curr = curr.offsetParent;
  }
  return top;
}

/* ==========================================================================
   Scrollspy Navigation Indicator
   Dynamically shifts active shade between section links on scroll
   ========================================================================== */
function initScrollspy() {
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
      const secDocTop = getElementDocTop(section);
      if (triggerLine >= secDocTop) {
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
          .then(() => {
            showToast('Mail Copied : ' + email);
            btn.classList.add('copied');
            setTimeout(() => btn.classList.remove('copied'), 2200);
          })
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
   9. Page Transitions (Dual-Screen Black Shutters with Clean White Seam)
      Smooth closing (720ms) and opening (750ms).
      When navigating between portfolio pages (and returning), two black screens
      close inward with a solid white seam, and part smoothly on arrival.
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

  // Check if this page load is arriving from a portfolio page redirect transition
  let wasTransition = false;
  try {
    wasTransition = sessionStorage.getItem('portfolio_page_transition') === '1';
    if (wasTransition) {
      sessionStorage.removeItem('portfolio_page_transition');
    }
  } catch (err) {}

  try {
    if (window.location.search.indexOf('transition=1') !== -1) {
      wasTransition = true;
      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete('transition');
      window.history.replaceState({}, '', cleanUrl.pathname + cleanUrl.search + cleanUrl.hash);
    }
  } catch (err) {}

  if (wasTransition || document.documentElement.classList.contains('split-transition-active')) {
    overlay.classList.add('is-held-closed');

    // Prevent browser auto-scroll race conditions
    if ('scrollRestoration' in history) {
      try { history.scrollRestoration = 'manual'; } catch (e) {}
    }

    // Determine target section to restore on index.html
    let targetSectionId = window.location.hash ? window.location.hash.substring(1) : '';
    try {
      const savedSection = sessionStorage.getItem('portfolio_return_section');
      if (savedSection && !targetSectionId) {
        targetSectionId = savedSection;
      }
      if (savedSection) {
        sessionStorage.removeItem('portfolio_return_section');
      }
    } catch (e) {}

    // Position behind closed curtains instantly
    if (targetSectionId) {
      const targetEl = document.getElementById(targetSectionId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
    }

    requestAnimationFrame(() => {
      // Re-affirm position in case layout rendered
      if (targetSectionId) {
        const targetEl = document.getElementById(targetSectionId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
      }

      requestAnimationFrame(() => {
        if (targetSectionId) {
          const targetEl = document.getElementById(targetSectionId);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'instant', block: 'start' });
          }
        }

        document.documentElement.classList.remove('split-transition-active');
        overlay.classList.remove('is-held-closed');
        overlay.classList.remove('is-closing');
        overlay.classList.add('is-opening');

        setTimeout(() => {
          overlay.classList.remove('is-opening');
        }, 760);
      });
    });
  } else {
    document.documentElement.classList.remove('split-transition-active');
    overlay.classList.remove('is-closing', 'is-opening', 'is-held-closed');
  }

  // Handle browser back/forward cache (pageshow)
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      document.documentElement.classList.remove('split-transition-active');
      overlay.classList.remove('is-closing', 'is-opening', 'is-held-closed');
    }
  });

  // Support Browser Back Button with identical smooth closing transition
  const currentFileName = window.location.pathname.split('/').pop() || 'index.html';
  const isSubpage = ['projects.html', 'certificates.html', 'research.html'].includes(currentFileName);

  if (isSubpage && window.history && window.history.pushState) {
    try {
      if (!window.history.state || !window.history.state.isTransitionSubpage) {
        window.history.replaceState({ isTransitionSubpage: true, isBase: true }, '', window.location.href);
        window.history.pushState({ isTransitionSubpage: true, isTop: true }, '', window.location.href);
      }
    } catch (e) {}

    let isPoppingBack = false;
    window.addEventListener('popstate', () => {
      if (isPoppingBack) return;
      isPoppingBack = true;

      try {
        sessionStorage.setItem('portfolio_page_transition', '1');
      } catch (err) {}

      overlay.classList.remove('is-opening', 'is-held-closed');
      overlay.classList.add('is-closing');

      let returnSection = '';
      try {
        returnSection = sessionStorage.getItem('portfolio_return_section');
      } catch (e) {}
      if (!returnSection) {
        if (currentFileName === 'projects.html') returnSection = 'projects';
        else if (currentFileName === 'certificates.html' || currentFileName === 'research.html') returnSection = 'achievements';
      }

      let destination = 'index.html' + (returnSection ? '#' + returnSection : '');
      try {
        const u = new URL(destination, window.location.href);
        u.searchParams.set('transition', '1');
        if (returnSection) u.hash = '#' + returnSection;
        destination = u.toString();
      } catch (e) {}

      setTimeout(() => {
        window.location.href = destination;
      }, 700);
    });
  }

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

    // In-page hash jumps on the same page (e.g., #projects, #achievements, #contact)
    if (rawHref.startsWith('#')) {
      anchor.classList.add('btn-clicked');
      setTimeout(() => anchor.classList.remove('btn-clicked'), 300);
      return;
    }

    // Redirection between different pages within the portfolio
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

    // If navigating away from index.html, remember which section the visitor was on
    const isLeavingIndex = currentFileName === 'index.html' || currentFileName === '';
    if (isLeavingIndex) {
      let originSection = anchor.closest('section[id]')?.id || '';
      if (!originSection) {
        if (targetFile === 'projects.html') originSection = 'projects';
        else if (targetFile === 'certificates.html' || targetFile === 'research.html') originSection = 'achievements';
      }
      if (originSection) {
        try {
          sessionStorage.setItem('portfolio_return_section', originSection);
        } catch (err) {}
      }
    }

    try {
      sessionStorage.setItem('portfolio_page_transition', '1');
    } catch (err) {}

    overlay.classList.remove('is-opening', 'is-held-closed');
    overlay.classList.add('is-closing');

    // If navigating back to index.html from a subpage, ensure target section hash is included
    let destinationUrl = anchor.href;
    try {
      const u = new URL(anchor.href, window.location.href);
      const isTargetIndex = u.pathname.endsWith('index.html') || u.pathname.endsWith('/');
      if (isTargetIndex && !u.hash) {
        let returnSection = '';
        try {
          returnSection = sessionStorage.getItem('portfolio_return_section');
        } catch (e) {}
        if (!returnSection) {
          if (currentFileName === 'projects.html') returnSection = 'projects';
          else if (currentFileName === 'certificates.html' || currentFileName === 'research.html') returnSection = 'achievements';
        }
        if (returnSection) {
          u.hash = '#' + returnSection;
        }
      }
      u.searchParams.set('transition', '1');
      destinationUrl = u.toString();
    } catch (e) {}

    setTimeout(() => {
      window.location.href = destinationUrl;
    }, 700);

    setTimeout(() => {
      overlay.classList.remove('is-closing');
    }, 3000);
  });
}

/* ==========================================================================
   4. Proper Center-Screen Smooth Navigation Scrolling
      Centers targeted sections (Projects, Achievements, About) directly in the
      middle of the viewport upon clicking navigation buttons.
   ========================================================================== */
function scrollToSectionMiddle(targetEl) {
  if (!targetEl) return;
  const vh = window.innerHeight;
  const header = document.querySelector('.site-header');
  const headerHeight = header ? header.offsetHeight : 72;
  const visualMiddle = headerHeight + (vh - headerHeight) / 2;
  const availableHeight = vh - headerHeight;

  const elTop = getElementDocTop(targetEl);
  const elHeight = targetEl.offsetHeight;

  let targetScrollY;
  if (elHeight <= availableHeight) {
    targetScrollY = Math.round((elTop + elHeight / 2) - visualMiddle);
  } else {
    targetScrollY = Math.round(elTop - headerHeight - 16);
  }

  const maxScroll = Math.max(0, document.documentElement.scrollHeight - vh);
  targetScrollY = Math.max(0, Math.min(maxScroll, targetScrollY));

  window.scrollTo({
    top: targetScrollY,
    behavior: 'smooth'
  });
}

function initCenteredNavScroll() {
  // Capture all navigation and in-page anchor links
  document.querySelectorAll('a[href^="#"], a[href*="index.html#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const rawHref = link.getAttribute('href');
      if (!rawHref) return;

      const hashIndex = rawHref.indexOf('#');
      if (hashIndex === -1) return;
      const hash = rawHref.slice(hashIndex);
      if (!hash || hash === '#' || hash === '#main') return;

      const targetId = hash.slice(1);
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;

      e.preventDefault();
      scrollToSectionMiddle(targetEl);

      try {
        history.pushState(null, '', hash);
      } catch (err) {}
    });
  });

  // Handle initial page load with a hash (e.g. index.html#achievements)
  if (window.location.hash) {
    const hash = window.location.hash;
    const initialTarget = document.getElementById(hash.slice(1));
    if (initialTarget) {
      setTimeout(() => {
        scrollToSectionMiddle(initialTarget);
      }, 150);
    }
  }

  // Smooth scroll to top when clicking brand logo on home page
  const brandLogo = document.querySelector('.brand-logo');
  if (brandLogo) {
    brandLogo.addEventListener('click', (e) => {
      const href = brandLogo.getAttribute('href') || '';
      const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || window.location.pathname === '';
      if (isHomePage && (href === 'index.html' || href === '/' || href.startsWith('#'))) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        try {
          history.pushState(null, '', window.location.pathname);
        } catch (err) {}
      }
    });
  }
}

/* ==========================================================================
   5. Continuous Middle-Aligned Parallax (Foreground Interfaces Only)
      Kinetic damped lerp for buttery lag-free 60fps/120fps smoothness.
      Sections expand to 1.0 scale and 100% opacity in middle of screen,
      and shrink/fade when moving up or down away from middle.
      All cards and section boxes stay level in the same horizontal line.
      Background canvas (#bg-canvas) and video layer (#video-bg-wrapper)
      remain completely fixed, isolated, and undisturbed.
   ========================================================================== */
function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // 1. Hero Section cached elements
  const heroSection = document.getElementById('home');
  const heroPill = heroSection ? heroSection.querySelector('.hero-status-pill') : null;
  const heroName = heroSection ? heroSection.querySelector('.hero-name-center') : null;
  const heroRole = heroSection ? heroSection.querySelector('.hero-role-center') : null;
  const heroBio = heroSection ? heroSection.querySelector('.hero-bio-center') : null;
  const heroSkills = heroSection ? heroSection.querySelector('.quick-skills-strip') : null;

  // 2. Sections cached elements (Projects, Achievements, About)
  const sectionIds = ['projects', 'achievements', 'contact'];
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  const sectionData = sections.map(sec => ({
    sec,
    top: 0,
    height: 0
  }));

  // 3. Subpage elements (e.g., projects.html)
  const pageHeader = document.querySelector('.page-header');
  const subpageCards = Array.from(document.querySelectorAll('.projects-stack .project-card'));

  // Pre-measure section coordinates to eliminate layout thrashing during scroll
  function measureLayout() {
    sectionData.forEach(item => {
      item.top = getElementDocTop(item.sec);
      item.height = item.sec.offsetHeight;
    });
  }

  measureLayout();

  // Kinetic damped smoothing loop state
  let currentScrollY = window.scrollY || window.pageYOffset || 0;
  let targetScrollY = currentScrollY;
  let isTicking = false;

  function render(scrollY) {
    const vh = window.innerHeight;
    const header = document.querySelector('.site-header');
    const headerHeight = header ? header.offsetHeight : 72;
    const availableHeight = vh - headerHeight;
    const visualMiddle = headerHeight + availableHeight / 2;
    const viewportCenter = scrollY + visualMiddle;

    // A. Hero Section 3D Recede & Name Shrinking (Vice Versa)
    if (heroSection) {
      if (scrollY <= vh * 1.35) {
        // Hero stays 100% original crisp look while in view; triggers only when exiting off-screen
        const heroExitThreshold = Math.max(120, vh * 0.18);
        let p = 0;
        if (scrollY > heroExitThreshold) {
          p = Math.min(1.0, (scrollY - heroExitThreshold) / (vh * 0.50));
        }

        // 1. Name shrinks smoothly into 3D backward depth just when scrolling off
        const ease = p * p * (3 - 2 * p);
        const nameScale = (1.0 - ease * 0.54).toFixed(3);
        const nameY = (ease * 40).toFixed(1);
        const nameOpacity = Math.max(0, 1.0 - ease * 1.25).toFixed(3);

        if (heroName) {
          heroName.style.setProperty('--name-scale', nameScale);
          heroName.style.setProperty('--name-y', `${nameY}px`);
          heroName.style.setProperty('--name-opacity', nameOpacity);
        }

        // 2. Below text (role, bio, skills) steps forward in sync
        const roleScale = (1.0 + ease * 0.02).toFixed(3);
        const roleY = (ease * 50).toFixed(1);
        const roleOpacity = Math.max(0, 1.0 - ease * 1.15).toFixed(3);

        if (heroRole) {
          heroRole.style.setProperty('--role-scale', roleScale);
          heroRole.style.setProperty('--role-y', `${roleY}px`);
          heroRole.style.setProperty('--role-opacity', roleOpacity);
        }

        if (heroBio) {
          heroBio.style.setProperty('--role-scale', roleScale);
          heroBio.style.setProperty('--role-y', `${roleY}px`);
          heroBio.style.setProperty('--role-opacity', roleOpacity);
        }

        if (heroSkills) {
          heroSkills.style.setProperty('--role-scale', roleScale);
          heroSkills.style.setProperty('--role-y', `${(ease * 45).toFixed(1)}px`);
          heroSkills.style.setProperty('--role-opacity', roleOpacity);
        }

        if (heroPill) {
          heroPill.style.transform = `translate3d(0, ${(ease * 20).toFixed(1)}px, 0)`;
          heroPill.style.opacity = Math.max(0, 1.0 - ease * 1.35).toFixed(3);
        }

        const heroSectionOpacity = Math.max(0, 1.0 - ease * 1.15).toFixed(3);
        heroSection.style.setProperty('--section-opacity', heroSectionOpacity);
      } else {
        if (heroSection.style.getPropertyValue('--section-opacity') !== '0') {
          heroSection.style.setProperty('--section-opacity', '0');
        }
      }
    }

    // B. Sections Middle-Aligned Parallax:
    // Sections stay 100% in their original crisp look while on the interface.
    // The 3D recede and fade effect triggers just when the section is going off the screen.
    // All cards stay strictly level in the same horizontal line without vertical shifts.
    for (let i = 0; i < sectionData.length; i++) {
      const item = sectionData[i];
      let dist = 0;

      if (item.height <= availableHeight) {
        const secCenter = item.top + item.height / 2;
        dist = secCenter - viewportCenter;
      } else {
        const centerTop = item.top + availableHeight / 2;
        const centerBottom = item.top + item.height - availableHeight / 2;
        if (viewportCenter < centerTop) {
          dist = centerTop - viewportCenter;
        } else if (viewportCenter > centerBottom) {
          dist = centerBottom - viewportCenter;
        } else {
          dist = 0;
        }
      }

      // Only calculate if in or near viewport
      if (Math.abs(dist) < vh * 0.95 + item.height / 2) {
        const absDist = Math.abs(dist);
        let secScale = 1.0;
        let secOpacity = 1.0;

        // Interface viewing zone: remains 100% original crisp look.
        // Effect triggers just as the section starts going off the interface.
        const exitThreshold = Math.max(220, availableHeight * 0.30);
        if (absDist > exitThreshold) {
          const norm = Math.min(1.0, (absDist - exitThreshold) / (availableHeight * 0.40));
          const ease = norm * norm * (3 - 2 * norm); // smoothstep
          secScale = (1.0 - ease * 0.12).toFixed(3);
          secOpacity = Math.max(0.20, 1.0 - ease * 0.80).toFixed(3);
        }

        item.sec.style.setProperty('--section-scale', secScale);
        item.sec.style.setProperty('--section-opacity', secOpacity);
      }
    }

    // C. Subpage Header & Cards
    if (pageHeader && scrollY <= vh) {
      const headerThreshold = Math.max(80, vh * 0.15);
      let p = 0;
      if (scrollY > headerThreshold) {
        p = Math.min(1.0, (scrollY - headerThreshold) / (vh * 0.55));
      }
      const ease = p * p * (3 - 2 * p);
      pageHeader.style.setProperty('--section-scale', (1.0 - ease * 0.14).toFixed(3));
      pageHeader.style.setProperty('--section-opacity', Math.max(0, 1.0 - ease * 1.15).toFixed(3));
    }

    if (subpageCards.length) {
      subpageCards.forEach((card) => {
        const cardTop = getElementDocTop(card);
        const cardCenter = cardTop + card.offsetHeight / 2;
        const dist = cardCenter - viewportCenter;
        const absDist = Math.abs(dist);
        let cardScale = 1.0;
        let cardOpacity = 1.0;
        const cardExitThreshold = Math.max(160, vh * 0.25);
        if (absDist > cardExitThreshold) {
          const norm = Math.min(1.0, (absDist - cardExitThreshold) / (vh * 0.4));
          const ease = norm * norm * (3 - 2 * norm);
          cardScale = (1.0 - ease * 0.08).toFixed(3);
          cardOpacity = Math.max(0.35, 1.0 - ease * 0.65).toFixed(3);
        }
        card.style.transform = `scale(${cardScale})`;
        card.style.opacity = cardOpacity;
      });
    }
  }

  // Liquid kinetic smoothing animation loop
  function loop() {
    const diff = targetScrollY - currentScrollY;

    if (Math.abs(diff) > 0.08) {
      currentScrollY += diff * 0.18;
      render(currentScrollY);
      requestAnimationFrame(loop);
    } else {
      currentScrollY = targetScrollY;
      render(currentScrollY);
      isTicking = false;
    }
  }

  function onScroll() {
    targetScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    if (!isTicking) {
      isTicking = true;
      requestAnimationFrame(loop);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  window.addEventListener('resize', () => {
    measureLayout();
    onScroll();
  }, { passive: true });

  render(currentScrollY);
}






