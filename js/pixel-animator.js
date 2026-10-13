/**
 * Pixel Workstation Background Scroll-Driven Animator
 * Synchronizes character animation frames and dual-monitor terminal feeds
 * with the visitor's page scroll position across 5 distinct phases.
 * 
 * Artwork: "Sleepy Programmer at Dual Monitors"
 * Mode: Full-Page Interactive Background Animation (Continuous, Uninterrupted Scroll)
 * Stack: HTML5 Canvas 2D (pixelated), vanilla JS requestAnimationFrame with smooth lerp.
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

  // Phase Definitions across the full webpage scroll timeline:
  // Phase 1 (0.00 - 0.15): Hero section (Sleeping on desk, breathing, green cursor pulses)
  // Phase 2 (0.15 - 0.35): Transition past Hero (Waking up, lifting head, opening eyes)
  // Phase 3 (0.35 - 0.55): Practical Projects Header (Sits upright, arms reach keyboard, IDE & Spring Boot boot)
  // Phase 4 (0.55 - 0.82): Practical Projects Grid (Active typing, live API traffic, SQL queries, server logs)
  // Phase 5 (0.82 - 1.00): Contact & Connect (Typing finishes, BUILD SUCCESSFUL, calm focused pose)
  const PHASES = [
    {
      id: 1,
      min: 0.00,
      max: 0.15,
      name: 'Standby & Sleep',
      terminalStatus: 'SYS_STANDBY // IDLE'
    },
    {
      id: 2,
      min: 0.15,
      max: 0.35,
      name: 'Waking Up',
      terminalStatus: 'JVM_WARMUP // JAVA 21'
    },
    {
      id: 3,
      min: 0.35,
      max: 0.55,
      name: 'Starting Work',
      terminalStatus: 'SPRING_BOOT_3.2 // STARTING'
    },
    {
      id: 4,
      min: 0.55,
      max: 0.82,
      name: 'Backend Engineering',
      terminalStatus: 'COMPILING // API_TRAFFIC'
    },
    {
      id: 5,
      min: 0.82,
      max: 1.00,
      name: 'Build Complete',
      terminalStatus: 'BUILD_SUCCESS // HTTP 200'
    }
  ];

  class PixelWorkstationBackgroundAnimator {
    constructor() {
      this.canvas = document.getElementById('pixel-workstation-canvas');
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d', { alpha: false });

      // Internal Canvas coordinate space
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
      this.lastScrollY = window.scrollY || window.pageYOffset || 0;

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
      // Check URL query parameters for test/preview (?scrollPct=50 or ?phase=4)
      const urlParams = new URLSearchParams(window.location.search);
      const scrollPct = urlParams.get('scrollPct');
      const phaseParam = urlParams.get('phase');

      if (scrollPct !== null) {
        const pct = parseFloat(scrollPct) / 100.0;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo(0, maxScroll * pct);
        this.targetProgress = pct;
        this.currentProgress = pct;
      } else if (phaseParam !== null) {
        const p = parseInt(phaseParam, 10);
        let pct = 0.05;
        if (p === 2) pct = 0.25;
        if (p === 3) pct = 0.45;
        if (p === 4) pct = 0.68;
        if (p === 5) pct = 0.92;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo(0, maxScroll * pct);
        this.targetProgress = pct;
        this.currentProgress = pct;
      } else {
        this.calculateScrollProgress();
        this.currentProgress = this.targetProgress;
      }

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
      // Natural whole-page scroll listener
      window.addEventListener('scroll', () => {
        this.calculateScrollProgress();
      }, { passive: true });

      // Window resize listener
      window.addEventListener('resize', () => {
        this.calculateScrollProgress();
      }, { passive: true });

      // Accessibility reduced-motion toggle
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      mediaQuery.addEventListener('change', (e) => {
        this.reducedMotion = e.matches;
      });
    }

    // Calculate normalized scroll progress [0, 1] across the whole page
    calculateScrollProgress() {
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const maxScroll = docHeight - winHeight;

      if (maxScroll <= 0) {
        this.targetProgress = 0;
        return;
      }

      const currentY = window.scrollY || window.pageYOffset || 0;
      let progress = currentY / maxScroll;

      // Clamp strictly between 0 and 1
      if (progress < 0) progress = 0;
      if (progress > 1) progress = 1;

      // Track scroll delta for typing keystroke reaction
      const scrollDelta = Math.abs(currentY - this.lastScrollY);
      this.lastScrollDelta = scrollDelta;
      this.lastScrollY = currentY;

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

    // Main 60fps render loop
    startLoop() {
      const render = (timestamp) => {
        this.clock = timestamp * 0.001; // seconds

        // Lerp progress for smooth, fluid motion
        if (this.reducedMotion) {
          this.currentProgress = this.targetProgress;
        } else {
          const diff = this.targetProgress - this.currentProgress;
          if (Math.abs(diff) > 0.40) {
            // Instant snap on large jumps (e.g. clicking nav links)
            this.currentProgress = this.targetProgress;
          } else {
            this.currentProgress += diff * 0.18;
          }
        }

        const { phase, index } = this.getPhase(this.currentProgress);
        this.currentPhaseIndex = index;

        this.drawScene(this.currentProgress, phase, index);

        requestAnimationFrame(render);
      };

      requestAnimationFrame(render);
    }

    // Master render pipeline
    drawScene(progress, phase, phaseIndex) {
      const ctx = this.ctx;
      ctx.imageSmoothingEnabled = false;

      // If assets haven't loaded yet, draw fallback scene
      if (!this.isLoaded) {
        if (this.images.fallbackScene0) {
          ctx.drawImage(this.images.fallbackScene0, 0, 0, this.width, this.height);
        } else {
          ctx.fillStyle = '#0a0d10';
          ctx.fillRect(0, 0, this.width, this.height);
        }
        return;
      }

      // 1. Draw Workstation Background (Desk, monitor frames, mugs, PC case)
      ctx.drawImage(this.images.bg, 0, 0, this.width, this.height);

      // 2. Render Dynamic Interactive Terminals on Monitor Screens
      this.drawMonitors(progress, phaseIndex);

      // 3. Render Active Character Layer with Micro-Idle Motions
      this.drawCharacter(progress, phaseIndex);

      // 4. Subtle CRT Screen Scanlines & Green Phosphor Glow
      this.drawCRTOverlay(progress, phaseIndex);
    }

    // Dual Monitor Terminal Screens
    drawMonitors(progress, phaseIndex) {
      const ctx = this.ctx;
      const t = this.clock;

      // Cursor blink rate
      const blinkRate = phaseIndex === 0 ? 1.8 : (phaseIndex >= 3 ? 4.5 : 2.5);
      const cursorVisible = Math.floor(t * blinkRate) % 2 === 0;

      // ── RIGHT MONITOR: Backend Console / Spring Boot Logs ──
      const r = MONITORS.right;

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

        this.drawRightMonitorContent(r, phaseIndex, progress, cursorVisible);
      } else {
        // Phase 1 (Sleeping): Canonical artwork with softly pulsing cursor
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
        // Phase 3: Starting Work & Spring Boot Initializing
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
        const p4Norm = (progress - 0.55) / (0.82 - 0.55);
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

      for (let i = 0; i < codeLines.length; i++) {
        const item = codeLines[i];
        ctx.fillStyle = '#475569';
        ctx.fillText(item.no, startX, startY);

        ctx.fillStyle = item.col;
        ctx.fillText(item.text, startX + 24, startY);

        if (i === 16 && (phaseIndex === 2 || phaseIndex === 3) && cursorVisible) {
          ctx.fillStyle = '#4ade80';
          ctx.fillRect(startX + 185, startY - 11, 6, 12);
        }

        startY += lineHeight;
      }
    }

    // Character Rendering & Micro-Idle Motions
    drawCharacter(progress, phaseIndex) {
      const ctx = this.ctx;
      const t = this.clock;

      let charImg = null;
      let yOffset = 0;

      switch (phaseIndex) {
        case 0: // Phase 1: Sleeping (0 - 15%)
          charImg = this.images.char0;
          if (!this.reducedMotion) {
            yOffset = Math.round(Math.sin(t * 2.2) * 1.2);
          }
          break;

        case 1: // Phase 2: Waking Up (15 - 35%)
          charImg = this.images.char1;
          if (!this.reducedMotion) {
            yOffset = Math.round(Math.sin(t * 1.5) * 0.8);
          }
          break;

        case 2: // Phase 3: Starting Work (35 - 55%)
          charImg = this.images.char2;
          break;

        case 3: // Phase 4: Active Backend Development (55 - 82%)
          this.typingTick += this.lastScrollDelta * 0.12 + 0.15;
          const typingFrame = Math.floor(this.typingTick) % 2;
          charImg = typingFrame === 0 ? this.images.char3 : this.images.char4;
          break;

        case 4: // Phase 5: Finished Working (82 - 100%)
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

    // CRT Scanline & Subtle Glow Overlay
    drawCRTOverlay(progress, phaseIndex) {
      const ctx = this.ctx;
      const glowAlpha = phaseIndex >= 3 ? 0.04 : 0.02;
      ctx.fillStyle = `rgba(34, 197, 94, ${glowAlpha})`;
      ctx.fillRect(0, 0, this.width, this.height * 0.6);
    }
  }

  // Auto-instantiate
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.pixelAnimator = new PixelWorkstationBackgroundAnimator();
    });
  } else {
    window.pixelAnimator = new PixelWorkstationBackgroundAnimator();
  }
})();
