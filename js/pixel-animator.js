/**
 * Pixel Workstation Interactive Scroll-Driven Animator
 * Synchronizes character animation frames and live dual-monitor terminal feeds
 * with user scroll position across 5 distinct phases.
 * 
 * Artwork: "Sleepy Programmer at Dual Monitors"
 * Stack: HTML5 Canvas 2D (pixelated), vanilla JS requestAnimationFrame with lerped scrubbing.
 */

(function () {
  'use strict';

  // Coordinate Bounds for Dual CRT Monitors in 1024x1024 canvas space
  const MONITORS = {
    left: {
      x: 95,
      y: 132,
      w: 368,
      h: 372
    },
    right: {
      x: 560,
      y: 80,
      w: 385,
      h: 288
    }
  };

  // Phase Definitions & Story Milestones
  const PHASES = [
    {
      id: 1,
      min: 0.00,
      max: 0.10,
      name: 'Phase 1: Standby & Sleep',
      shortName: '01. Standby',
      badge: 'STANDBY // SLEEPING',
      desc: 'Developer resting on desk at dual-monitor workstation before sprint. Terminal cursors blink softly.',
      terminalStatus: 'SYS_STANDBY // IDLE'
    },
    {
      id: 2,
      min: 0.10,
      max: 0.25,
      name: 'Phase 2: Waking Up',
      shortName: '02. Waking Up',
      badge: 'BOOTING // WAKING UP',
      desc: 'Lifting head from arms, opening eyes, warming up OpenJDK 21 & dual-screen development environment.',
      terminalStatus: 'JVM_WARMUP // JAVA 21'
    },
    {
      id: 3,
      min: 0.25,
      max: 0.45,
      name: 'Phase 3: Starting Work',
      shortName: '03. Booting JVM',
      badge: 'INITIALIZING // ARCHITECTURE',
      desc: 'Sitting upright, hands approaching keyboard, starting Spring Boot microservices & database connection pool.',
      terminalStatus: 'SPRING_BOOT_3.2 // STARTING'
    },
    {
      id: 4,
      min: 0.45,
      max: 0.80,
      name: 'Phase 4: Backend Engineering',
      shortName: '04. Backend Dev',
      badge: 'ACTIVE // LIVE CODING',
      desc: 'Active typing on keyboard: building REST APIs, executing SQL queries, serializing JSON & running test suites.',
      terminalStatus: 'COMPILING // API_TRAFFIC'
    },
    {
      id: 5,
      min: 0.80,
      max: 1.00,
      name: 'Phase 5: Build Complete',
      shortName: '05. Deployed',
      badge: 'SUCCESS // LIVE OPERATIONAL',
      desc: '14/14 integration tests passed, build successful, Spring Boot service deployed & ready for recruiter requests.',
      terminalStatus: 'BUILD_SUCCESS // HTTP 200'
    }
  ];

  class PixelWorkstationAnimator {
    constructor() {
      this.canvas = document.getElementById('pixel-workstation-canvas');
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d', { alpha: false });
      this.container = document.getElementById('developer-scene');
      
      // HUD UI elements
      this.badgeEl = document.getElementById('workstation-phase-badge');
      this.descEl = document.getElementById('workstation-phase-desc');
      this.progressEl = document.getElementById('workstation-progress-fill');
      this.percentEl = document.getElementById('workstation-progress-pct');
      this.phasePills = document.querySelectorAll('.phase-pill');

      // Internal Canvas resolution
      this.width = 1024;
      this.height = 1024;
      this.canvas.width = this.width;
      this.canvas.height = this.height;

      // Scroll scrubbing state
      this.targetProgress = 0;
      this.currentProgress = 0;
      this.currentPhaseIndex = 0;

      // Typing & idle animation timers
      this.clock = 0;
      this.typingTick = 0;
      this.lastScrollDelta = 0;
      this.lastScrollY = window.scrollY;

      // Asset storage
      this.images = {
        bg: null,
        char0: null,
        char1: null,
        char2: null,
        char3: null,
        char4: null,
        fallbackScene0: null
      };
      this.isLoaded = false;
      this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      this.init();
    }

    async init() {
      this.bindEvents();
      await this.loadAssets();
      // Support direct phase URL parameter (e.g. ?phase=4) or ?scroll=1200
      const urlParams = new URLSearchParams(window.location.search);
      const phaseParam = urlParams.get('phase');
      const scrollParam = urlParams.get('scroll');

      if (scrollParam) {
        window.scrollTo(0, parseInt(scrollParam, 10));
      } else if (phaseParam) {
        this.jumpToPhase(parseInt(phaseParam, 10), false);
      }

      this.calculateScrollProgress();
      this.currentProgress = this.targetProgress;
      this.startLoop();
    }

    // Preload image assets
    loadImage(src) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => {
          console.warn('Failed to load image:', src);
          resolve(null);
        };
        img.src = src;
      });
    }

    async loadAssets() {
      try {
        const [bg, c0, c1, c2, c3, c4, fallback] = await Promise.all([
          this.loadImage('assets/pixel-art/bg_workstation.png'),
          this.loadImage('assets/pixel-art/char_0_sleeping.png'),
          this.loadImage('assets/pixel-art/char_1_sleepy.png'),
          this.loadImage('assets/pixel-art/char_2_awake.png'),
          this.loadImage('assets/pixel-art/char_3_typing_1.png'),
          this.loadImage('assets/pixel-art/char_4_typing_2.png'),
          this.loadImage('assets/pixel-art/scene_0_sleeping.png')
        ]);

        this.images.bg = bg;
        this.images.char0 = c0;
        this.images.char1 = c1;
        this.images.char2 = c2;
        this.images.char3 = c3;
        this.images.char4 = c4;
        this.images.fallbackScene0 = fallback;

        this.isLoaded = true;
      } catch (err) {
        console.error('Error loading pixel-art assets:', err);
      }
    }

    bindEvents() {
      // Scroll listener (throttled naturally by requestAnimationFrame)
      window.addEventListener('scroll', () => {
        this.calculateScrollProgress();
      }, { passive: true });

      // Resize listener
      window.addEventListener('resize', () => {
        this.calculateScrollProgress();
      }, { passive: true });

      // Phase Pill Click Handlers (allow direct navigation through timeline)
      this.phasePills.forEach((pill) => {
        pill.addEventListener('click', (e) => {
          e.preventDefault();
          const targetPhase = parseInt(pill.getAttribute('data-phase'), 10);
          this.jumpToPhase(targetPhase);
        });
      });

      // Handle accessibility reduced motion toggle
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      mediaQuery.addEventListener('change', (e) => {
        this.reducedMotion = e.matches;
      });
    }

    // Jump to specific phase via pill click or url parameter
    jumpToPhase(phaseNumber, smooth = true) {
      if (!this.container) return;
      const rect = this.container.getBoundingClientRect();
      const containerTop = window.scrollY + rect.top;
      const scrollableDistance = rect.height - window.innerHeight;

      if (scrollableDistance <= 0) return;

      let progressTarget = 0.05;
      if (phaseNumber === 2) progressTarget = 0.18;
      else if (phaseNumber === 3) progressTarget = 0.35;
      else if (phaseNumber === 4) progressTarget = 0.62;
      else if (phaseNumber === 5) progressTarget = 0.92;

      const headerOffset = 76;
      const targetScrollY = containerTop - headerOffset + (progressTarget * scrollableDistance);
      window.scrollTo({
        top: Math.max(0, targetScrollY),
        behavior: smooth ? 'smooth' : 'auto'
      });
      this.targetProgress = progressTarget;
      if (!smooth) {
        this.currentProgress = progressTarget;
      }
      this.calculateScrollProgress();
    }

    // Compute normalized scroll progress in range [0, 1]
    calculateScrollProgress() {
      if (!this.container) return;

      const rect = this.container.getBoundingClientRect();
      const containerTop = rect.top;
      const containerHeight = rect.height;
      const viewportHeight = window.innerHeight;

      const headerOffset = 76;
      const scrollableDistance = containerHeight - viewportHeight;

      if (scrollableDistance <= 0) {
        this.targetProgress = 0;
        return;
      }

      // Progress begins when container reaches sticky top (headerOffset)
      const currentScroll = headerOffset - containerTop;
      let progress = currentScroll / scrollableDistance;

      // Clamp progress strictly to [0, 1]
      if (progress < 0) progress = 0;
      if (progress > 1) progress = 1;

      // Track scroll delta for typing motion reactivity
      const scrollDelta = Math.abs(window.scrollY - this.lastScrollY);
      this.lastScrollDelta = scrollDelta;
      this.lastScrollY = window.scrollY;

      this.targetProgress = progress;
    }

    // Determine phase from progress value
    getPhase(progress) {
      for (let i = 0; i < PHASES.length; i++) {
        const p = PHASES[i];
        if (progress >= p.min && progress <= p.max) {
          return { phase: p, index: i };
        }
      }
      return { phase: PHASES[PHASES.length - 1], index: PHASES.length - 1 };
    }

    // Update HTML UI HUD indicators
    updateHUD(phaseIndex, progress) {
      if (phaseIndex !== this.currentPhaseIndex) {
        this.currentPhaseIndex = phaseIndex;
        const p = PHASES[phaseIndex];

        if (this.badgeEl) this.badgeEl.textContent = p.badge;
        if (this.descEl) this.descEl.textContent = p.desc;

        // Update active class on pills
        this.phasePills.forEach((pill) => {
          const pillPhase = parseInt(pill.getAttribute('data-phase'), 10);
          if (pillPhase === p.id) {
            pill.classList.add('active');
          } else {
            pill.classList.remove('active');
          }
        });
      }

      // Smooth progress bar update
      const pct = Math.round(progress * 100);
      if (this.progressEl) this.progressEl.style.width = `${pct}%`;
      if (this.percentEl) this.percentEl.textContent = `${pct}%`;
    }

    // Main animation loop (runs at display refresh rate)
    startLoop() {
      const render = (timestamp) => {
        this.clock = timestamp * 0.001; // seconds

        // Lerp progress for ultra-smooth fluid scrubbing
        if (this.reducedMotion) {
          this.currentProgress = this.targetProgress;
        } else {
          const diff = this.targetProgress - this.currentProgress;
          if (Math.abs(diff) > 0.35) {
            this.currentProgress = this.targetProgress;
          } else {
            this.currentProgress += diff * 0.16;
          }
        }

        const { phase, index } = this.getPhase(this.currentProgress);
        this.updateHUD(index, this.currentProgress);

        this.drawScene(this.currentProgress, phase, index);

        requestAnimationFrame(render);
      };

      requestAnimationFrame(render);
    }

    // Drawing master pipeline
    drawScene(progress, phase, phaseIndex) {
      const ctx = this.ctx;
      ctx.imageSmoothingEnabled = false;

      // If assets haven't loaded yet, draw fallback or dark canvas
      if (!this.isLoaded) {
        if (this.images.fallbackScene0) {
          ctx.drawImage(this.images.fallbackScene0, 0, 0, this.width, this.height);
        } else {
          ctx.fillStyle = '#0a0d10';
          ctx.fillRect(0, 0, this.width, this.height);
        }
        return;
      }

      // 1. Draw Workstation Background (Desk, monitors bezels, PC, mugs)
      ctx.drawImage(this.images.bg, 0, 0, this.width, this.height);

      // 2. Render Dynamic Interactive Terminals onto Screens
      this.drawMonitors(progress, phaseIndex);

      // 3. Render Active Character Layer with Micro-Idle Motions
      this.drawCharacter(progress, phaseIndex);

      // 4. Subtle CRT Screen Scanlines & Monitor Glow Reflection
      this.drawCRTOverlay(progress, phaseIndex);
    }

    // Dynamic Dual Monitor Screen Renderer
    drawMonitors(progress, phaseIndex) {
      const ctx = this.ctx;
      const t = this.clock;

      // Cursor blink rate (faster in higher phases)
      const blinkRate = phaseIndex === 0 ? 1.8 : (phaseIndex >= 3 ? 4.5 : 2.5);
      const cursorVisible = Math.floor(t * blinkRate) % 2 === 0;

      // ── RIGHT MONITOR: Backend Console / Spring Boot Logs ──
      const r = MONITORS.right;
      
      // In Phases 2-5, lay down a deep dark CRT screen backdrop to render clean live terminal output
      if (phaseIndex >= 1) {
        ctx.fillStyle = 'rgba(4, 8, 6, 0.90)';
        ctx.fillRect(r.x, r.y, r.w, r.h);

        // Terminal header bar
        ctx.fillStyle = 'rgba(15, 30, 20, 0.95)';
        ctx.fillRect(r.x, r.y, r.w, 18);
        ctx.fillStyle = '#22c55e';
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillText(`bash - tushar@workstation: ~/backend-core [${PHASES[phaseIndex].terminalStatus}]`, r.x + 8, r.y + 12);
        
        // Window dots
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(r.x + r.w - 30, r.y + 6, 6, 6);
        ctx.fillStyle = '#eab308';
        ctx.fillRect(r.x + r.w - 20, r.y + 6, 6, 6);
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(r.x + r.w - 10, r.y + 6, 6, 6);

        // Render phase-specific terminal log stream
        this.drawRightMonitorContent(r, phaseIndex, progress, cursorVisible);
      } else {
        // Phase 1 (Standby / Sleeping):
        // Canonical artwork with soft breathing green cursor
        if (cursorVisible) {
          ctx.fillStyle = '#34d399';
          ctx.fillRect(574, 98, 9, 14);
        }
      }

      // ── LEFT MONITOR: IDE / Java Source Code Editor ──
      const l = MONITORS.left;
      if (phaseIndex >= 2) {
        ctx.fillStyle = 'rgba(5, 10, 8, 0.88)';
        ctx.fillRect(l.x, l.y, l.w, l.h);

        // IDE Tab bar
        ctx.fillStyle = 'rgba(12, 24, 16, 0.95)';
        ctx.fillRect(l.x, l.y, l.w, 20);
        ctx.fillStyle = '#4ade80';
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillText('ProjectController.java  ●', l.x + 10, l.y + 14);

        this.drawLeftMonitorContent(l, phaseIndex, progress, cursorVisible);
      } else {
        // Phase 1 & 2: Subtle blinking prompt on left screen
        if (cursorVisible && phaseIndex === 0) {
          ctx.fillStyle = '#34d399';
          ctx.fillRect(115, 150, 8, 13);
        }
      }
    }

    // Right Monitor Terminal Lines
    drawRightMonitorContent(rect, phaseIndex, progress, cursorVisible) {
      const ctx = this.ctx;
      const startX = rect.x + 10;
      let startY = rect.y + 35;
      const lineHeight = 16;

      ctx.font = '11px "JetBrains Mono", monospace';

      const renderLine = (text, color = '#22c55e', dim = false) => {
        ctx.fillStyle = dim ? 'rgba(34, 197, 94, 0.65)' : color;
        ctx.fillText(text, startX, startY);
        startY += lineHeight;
      };

      if (phaseIndex === 1) {
        // Phase 2: Waking Up & Booting
        renderLine('tushar@mac:~$ java --version', '#ffffff');
        renderLine('openjdk 21.0.2 2024-01-16 LTS', '#4ade80');
        renderLine('OpenJDK Runtime Environment (build 21.0.2+13)', '#4ade80', true);
        renderLine('tushar@mac:~$ cd ~/repo/spring-backend-core', '#ffffff');
        renderLine('> Initializing JVM bytecode JIT compiler...', '#86efac');
        renderLine('> Loading application.properties [profile=prod]', '#86efac');
        if (cursorVisible) {
          ctx.fillStyle = '#22c55e';
          ctx.fillRect(startX + 185, startY - 14, 7, 12);
        }
      } else if (phaseIndex === 2) {
        // Phase 3: Starting Work & Initializing Spring Boot
        renderLine('  .   ____          _            __ _ _', '#4ade80');
        renderLine(' /\\\\ / ___\'_ __ _ _(_)_ __  __ _ \\ \\ \\ \\', '#4ade80');
        renderLine('( ( )\\___ | \'_ | \'_| | \'_ \\/ _` | \\ \\ \\ \\', '#4ade80');
        renderLine(' \\\\/  ___)| |_)| | | | | || (_| |  ) ) ) )', '#4ade80');
        renderLine('  \'  |____| .__|_| |_|_| |_\\__, | / / / /', '#4ade80');
        renderLine('=========|_|==============|___/=/_/_/_/', '#4ade80');
        renderLine(':: Spring Boot ::                (v3.2.4)', '#ffffff');
        renderLine('[INFO] Starting Application using Java 21', '#86efac');
        renderLine('[INFO] HikariCP: Connecting MySQL pool...', '#fbbf24');
        renderLine('[INFO] Tomcat initialized on port 8080 (http)', '#86efac');
      } else if (phaseIndex === 3) {
        // Phase 4: Active Backend Development & Streaming Traffic
        // Compute line scroll offset based on normalized progress inside phase 4
        const p4Norm = (progress - 0.45) / (0.80 - 0.45);
        const cycle = Math.floor(this.clock * 3 + p4Norm * 12);

        const allLogs = [
          { text: '[INFO] GET  /api/v1/projects 200 OK (11ms)', col: '#4ade80' },
          { text: '[DEBUG] HikariPool-1: Connection borrowed [pool=10]', col: '#94a3b8' },
          { text: '[SQL]   SELECT * FROM projects WHERE active=true', col: '#38bdf8' },
          { text: '[INFO] POST /api/v1/auth/jwt 201 CREATED (token)', col: '#4ade80' },
          { text: '[DEBUG] SecurityContextHolder: Authenticated "recruiter"', col: '#c084fc' },
          { text: '[INFO] GET  /api/v1/skills 200 OK (8ms)', col: '#4ade80' },
          { text: '[WARN] RateLimitBucket: Request tokens 98/100 remaining', col: '#facc15' },
          { text: '[INFO] POST /api/v1/messages - 200 OK dispatched', col: '#4ade80' },
          { text: '[DEBUG] Cache hit: Redis Key "portfolio:v1:stats"', col: '#38bdf8' },
          { text: '[INFO] GET  /api/v1/resume/cv.pdf 200 OK (stream)', col: '#4ade80' },
          { text: '[DEBUG] GarbageCollector: ZGC pause 0.42ms', col: '#94a3b8' },
          { text: '[INFO] Compiling module: com.tushar.backend.services', col: '#86efac' }
        ];

        // Shift window of visible logs
        const visibleCount = 10;
        const offset = cycle % (allLogs.length - visibleCount + 1);
        for (let i = 0; i < visibleCount; i++) {
          const item = allLogs[(offset + i) % allLogs.length];
          renderLine(item.text, item.col);
        }

        if (cursorVisible) {
          ctx.fillStyle = '#22c55e';
          ctx.fillRect(startX + 180, startY - 14, 7, 12);
        }
      } else if (phaseIndex === 4) {
        // Phase 5: Finished Working & Build Successful
        renderLine('------------------------------------------------', '#4ade80');
        renderLine('[INFO] BUILD SUCCESSFUL [1.482s]', '#ffffff');
        renderLine('[INFO] 14/14 UNIT & INTEGRATION TESTS PASSED', '#4ade80');
        renderLine('[INFO] Packaging JAR: tushar-backend-21.jar', '#86efac');
        renderLine('[INFO] Embedded Tomcat started on port 8080', '#4ade80');
        renderLine('------------------------------------------------', '#4ade80');
        renderLine('[LIVE] Service deployed to production!', '#38bdf8');
        renderLine('[LIVE] Ready for incoming recruiter inquiries.', '#ffffff');
        renderLine('tushar@workstation:~$ ready_to_connect', '#4ade80');
        if (cursorVisible) {
          ctx.fillStyle = '#22c55e';
          ctx.fillRect(startX + 185, startY - 14, 7, 12);
        }
      }
    }

    // Left Monitor Java IDE Code Content
    drawLeftMonitorContent(rect, phaseIndex, progress, cursorVisible) {
      const ctx = this.ctx;
      const startX = rect.x + 8;
      let startY = rect.y + 36;
      const lineHeight = 15;

      ctx.font = '10px "JetBrains Mono", monospace';

      const codeLines = [
        { no: '01', text: '@RestController', col: '#facc15' },
        { no: '02', text: '@RequestMapping("/api/v1")', col: '#38bdf8' },
        { no: '03', text: 'public class PortfolioApi {', col: '#ffffff' },
        { no: '04', text: '  @Autowired', col: '#facc15' },
        { no: '05', text: '  private ProjectService service;', col: '#94a3b8' },
        { no: '06', text: '', col: '#ffffff' },
        { no: '07', text: '  @GetMapping("/projects")', col: '#38bdf8' },
        { no: '08', text: '  public ResponseEntity<?> list() {', col: '#ffffff' },
        { no: '09', text: '    var list = service.getActive();', col: '#86efac' },
        { no: '10', text: '    return ResponseEntity.ok(list);', col: '#4ade80' },
        { no: '11', text: '  }', col: '#ffffff' },
        { no: '12', text: '', col: '#ffffff' },
        { no: '13', text: '  @PostMapping("/contact")', col: '#38bdf8' },
        { no: '14', text: '  public Response submitNote(', col: '#ffffff' },
        { no: '15', text: '      @Valid @RequestBody Note n) {', col: '#94a3b8' },
        { no: '16', text: '    service.deliverMessage(n);', col: '#86efac' },
        { no: '17', text: '    return Response.ok();', col: '#4ade80' },
        { no: '18', text: '  }', col: '#ffffff' },
        { no: '19', text: '}', col: '#ffffff' }
      ];

      // Draw line numbers and code
      for (let i = 0; i < codeLines.length; i++) {
        const item = codeLines[i];
        
        // Line number gutter
        ctx.fillStyle = '#475569';
        ctx.fillText(item.no, startX, startY);

        // Code text
        ctx.fillStyle = item.col;
        ctx.fillText(item.text, startX + 24, startY);

        // Active line cursor in phase 3 & 4
        if (i === 16 && (phaseIndex === 2 || phaseIndex === 3) && cursorVisible) {
          ctx.fillStyle = '#4ade80';
          ctx.fillRect(startX + 185, startY - 11, 6, 12);
        }

        startY += lineHeight;
      }
    }

    // Character Rendering & Micro-Idle Movements
    drawCharacter(progress, phaseIndex) {
      const ctx = this.ctx;
      const t = this.clock;

      let charImg = null;
      let yOffset = 0;

      switch (phaseIndex) {
        case 0: // Phase 1: Sleeping (0 - 10%)
          charImg = this.images.char0;
          // Subtle natural breathing rhythm (+- 1px)
          if (!this.reducedMotion) {
            yOffset = Math.round(Math.sin(t * 2.2) * 1.2);
          }
          break;

        case 1: // Phase 2: Waking Up (10 - 25%)
          // Transition from sleeping pose to sleepy awake pose
          charImg = this.images.char1;
          if (!this.reducedMotion) {
            yOffset = Math.round(Math.sin(t * 1.5) * 0.8);
          }
          break;

        case 2: // Phase 3: Starting Work (25 - 45%)
          // Sits upright, gaze toward screens
          charImg = this.images.char2;
          break;

        case 3: // Phase 4: Active Backend Development (45 - 80%)
          // Rapid typing keystroke oscillation between char3 and char4
          // Driven by both scroll activity and subtle typing clock
          this.typingTick += this.lastScrollDelta * 0.12 + 0.15;
          const typingFrame = Math.floor(this.typingTick) % 2;
          charImg = typingFrame === 0 ? this.images.char3 : this.images.char4;
          break;

        case 4: // Phase 5: Finished Working (80 - 100%)
          // Calm, focused resting posture
          // Slow occasional keystroke or calm sitting upright
          const calmKeystroke = Math.sin(t * 0.8) > 0.85;
          charImg = calmKeystroke ? this.images.char4 : this.images.char3;
          if (!this.reducedMotion) {
            yOffset = Math.round(Math.sin(t * 1.2) * 0.5);
          }
          break;

        default:
          charImg = this.images.char0;
      }

      if (charImg) {
        ctx.drawImage(charImg, 0, yOffset, this.width, this.height);
      }
    }

    // Subtle CRT Scanline & Glow Overlay
    drawCRTOverlay(progress, phaseIndex) {
      const ctx = this.ctx;
      
      // Gentle green glow radiating from dual monitors
      const glowAlpha = phaseIndex >= 3 ? 0.04 : 0.02;
      ctx.fillStyle = `rgba(34, 197, 94, ${glowAlpha})`;
      ctx.fillRect(0, 0, this.width, this.height * 0.6);
    }
  }

  // Auto-instantiate when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.pixelAnimator = new PixelWorkstationAnimator();
    });
  } else {
    window.pixelAnimator = new PixelWorkstationAnimator();
  }
})();
