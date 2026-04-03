/* ═══════════════════════════════════════════════════════
   AVIATION 3D EFFECTS — DROP-IN ENHANCEMENT
   Just add: <script src="js/effects.js"></script>
   before </body> in any HTML page. Nothing else changes.
═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────
     INJECT STYLES
  ───────────────────────────────────────── */
  const css = `
    /* ── PARTICLE CANVAS ── */
    #fx-canvas {
      position: fixed; top: 0; left: 0;
      width: 100%; height: 100%;
      pointer-events: none;
      z-index: 0;
      opacity: 0.55;
    }

    /* ── CURSOR GLOW ── */
    #fx-cursor {
      position: fixed;
      width: 18px; height: 18px;
      border: 1.5px solid rgba(0,229,255,0.8);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      transition: width 0.2s, height 0.2s, opacity 0.2s;
      mix-blend-mode: screen;
    }
    #fx-cursor-trail {
      position: fixed;
      width: 6px; height: 6px;
      background: rgba(0,229,255,0.6);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9998;
      transform: translate(-50%, -50%);
      transition: left 0.12s ease, top 0.12s ease;
    }
    body:hover #fx-cursor { opacity: 1; }

    /* ── CARD 3D TILT ── */
    .card,
    .aircraft-card,
    .feature-card,
    .part-card-outer,
    .login-card {
      transition: transform 0.25s cubic-bezier(0.23,1,0.32,1),
                  box-shadow 0.25s ease !important;
      will-change: transform;
      transform-style: preserve-3d;
    }

    /* ── CARD INNER GLOW ON HOVER ── */
    .card:hover,
    .aircraft-card:hover,
    .feature-card:hover {
      box-shadow:
        0 20px 60px rgba(0,0,0,0.5),
        0 0 0 1px rgba(0,229,255,0.2),
        0 0 40px rgba(0,229,255,0.06) !important;
    }

    /* ── PARALLAX HERO ── */
    .hero, .overlay {
      transform-style: preserve-3d;
    }

    /* ── SCROLL REVEAL ── */
    .fx-reveal {
      opacity: 0;
      transform: translateY(32px) rotateX(4deg);
      transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.23,1,0.32,1);
      transform-origin: center bottom;
    }
    .fx-reveal.fx-visible {
      opacity: 1;
      transform: translateY(0) rotateX(0deg);
    }

    /* ── MAGNETIC BUTTONS ── */
    .btn, a.btn, button.btn {
      transition: transform 0.2s cubic-bezier(0.23,1,0.32,1),
                  box-shadow 0.2s ease !important;
      will-change: transform;
    }

    /* ── GLITCH TITLE EFFECT ── */
    @keyframes fx-glitch {
      0%   { clip-path: inset(0 0 100% 0); transform: translate(0); }
      10%  { clip-path: inset(10% 0 60% 0); transform: translate(-2px, 1px); }
      20%  { clip-path: inset(50% 0 20% 0); transform: translate(2px, -1px); }
      30%  { clip-path: inset(80% 0 5% 0); transform: translate(-1px, 2px); }
      40%  { clip-path: inset(0 0 100% 0); transform: translate(0); }
      100% { clip-path: inset(0 0 100% 0); transform: translate(0); }
    }
    .fx-glitch-wrap { position: relative; display: inline-block; }
    .fx-glitch-wrap::before,
    .fx-glitch-wrap::after {
      content: attr(data-text);
      position: absolute; top: 0; left: 0;
      width: 100%; height: 100%;
      pointer-events: none;
    }
    .fx-glitch-wrap::before {
      color: #ff6b2b;
      animation: fx-glitch 4s infinite;
      animation-delay: 0.5s;
      opacity: 0.6;
    }
    .fx-glitch-wrap::after {
      color: #00e5ff;
      animation: fx-glitch 4s infinite;
      animation-delay: 0.8s;
      opacity: 0.4;
    }

    /* ── FLOATING ANIMATION ── */
    @keyframes fx-float {
      0%,100% { transform: translateY(0px) rotate(0deg); }
      33%      { transform: translateY(-8px) rotate(1deg); }
      66%      { transform: translateY(-4px) rotate(-1deg); }
    }
    .fx-float { animation: fx-float 5s ease-in-out infinite; }

    /* ── SCAN LINE SWEEP ON IMAGES ── */
    .aircraft-img, .card img, img.aircraft-img {
      position: relative;
      overflow: hidden;
    }
    .fx-img-wrap {
      position: relative;
      overflow: hidden;
      display: inline-block;
      width: 100%;
    }
    .fx-img-scan {
      position: absolute;
      top: -4px; left: 0; right: 0;
      height: 3px;
      background: linear-gradient(90deg, transparent, rgba(0,229,255,0.8), transparent);
      pointer-events: none;
      animation: fx-scan 3.5s linear infinite;
      z-index: 2;
    }
    @keyframes fx-scan {
      from { top: -4px; }
      to   { top: calc(100% + 4px); }
    }

    /* ── DEPTH SHADOW ON SECTIONS ── */
    .aircraft-details,
    .panel-form,
    .login-card {
      box-shadow:
        0 4px 16px rgba(0,0,0,0.3),
        0 24px 64px rgba(0,0,0,0.4),
        inset 0 1px 0 rgba(255,255,255,0.04) !important;
    }

    /* ── NEON BORDER PULSE on focus inputs ── */
    input:focus, textarea:focus, .form-input:focus, .panel-input:focus {
      box-shadow:
        0 0 0 2px rgba(0,229,255,0.25),
        0 0 16px rgba(0,229,255,0.12) !important;
    }

    /* ── RIPPLE ON CLICK ── */
    .fx-ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(0,229,255,0.25);
      transform: scale(0);
      animation: fx-ripple-anim 0.55s ease-out;
      pointer-events: none;
      z-index: 10;
    }
    @keyframes fx-ripple-anim {
      to { transform: scale(4); opacity: 0; }
    }

    /* ── HUD CORNER BRACKETS (if not present) ── */
    .fx-corner {
      position: fixed;
      width: 26px; height: 26px;
      pointer-events: none;
      z-index: 50;
      opacity: 0.55;
    }
    .fx-corner::before, .fx-corner::after {
      content: ''; position: absolute;
      background: #00e5ff;
    }
    .fx-corner::before { width: 100%; height: 1.5px; top: 0; left: 0; }
    .fx-corner::after  { width: 1.5px; height: 100%; top: 0; left: 0; }
    .fx-c-tl { top: 10px; left: 10px; }
    .fx-c-tr { top: 10px; right: 10px; transform: scaleX(-1); }
    .fx-c-bl { bottom: 10px; left: 10px; transform: scaleY(-1); }
    .fx-c-br { bottom: 10px; right: 10px; transform: scale(-1); }

    /* ── LOADING SHIMMER on images ── */
    img[src=""], img:not([src]) {
      background: linear-gradient(90deg, #071628 25%, #0d2540 50%, #071628 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }
    @keyframes shimmer {
      from { background-position: -200% 0; }
      to   { background-position:  200% 0; }
    }
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ─────────────────────────────────────────
     WAIT FOR DOM
  ───────────────────────────────────────── */
  function init() {

    /* ── 1. PARTICLE CANVAS BACKGROUND ── */
    initParticles();

    /* ── 2. CUSTOM CURSOR ── */
    initCursor();

    /* ── 3. HUD CORNERS (only if none exist) ── */
    if (!document.querySelector('.corner-bracket, .fx-corner')) {
      initCorners();
    }

    /* ── 4. 3D CARD TILT ── */
    initCardTilt();

    /* ── 5. MAGNETIC BUTTONS ── */
    initMagneticButtons();

    /* ── 6. SCROLL REVEAL ── */
    initScrollReveal();

    /* ── 7. GLITCH ON H1 ── */
    initGlitchTitle();

    /* ── 8. RIPPLE ON BUTTONS ── */
    initRipple();

    /* ── 9. SCAN LINE ON IMAGES ── */
    initImageScan();

    /* ── 10. PARALLAX HERO ── */
    initParallax();

    /* ── 11. FLOAT EFFECT ON ICONS/LOGOS ── */
    document.querySelectorAll('.nav-brand::before, .login-logo .icon, .status-dot').forEach(el => {
      el.classList.add('fx-float');
    });
  }

  /* ─────────────────────────────────────────
     PARTICLE SYSTEM
  ───────────────────────────────────────── */
  function initParticles() {
    const canvas = document.createElement('canvas');
    canvas.id = 'fx-canvas';
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d');

    let W, H, particles = [], mouse = { x: -999, y: -999 };
    const COUNT = window.innerWidth < 768 ? 60 : 120;

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

    // Create particles
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x:   Math.random() * W,
        y:   Math.random() * H,
        vx:  (Math.random() - 0.5) * 0.4,
        vy:  (Math.random() - 0.5) * 0.4,
        r:   Math.random() * 1.5 + 0.4,
        a:   Math.random() * 0.7 + 0.2,
        hue: Math.random() > 0.85 ? 20 : 190, // mostly cyan, some orange
      });
    }

    const LINK_DIST = 130;

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // Update & draw particles
      particles.forEach(p => {
        // Attract slightly to mouse
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          p.vx += dx / dist * 0.012;
          p.vy += dy / dist * 0.012;
        }
        // Dampen
        p.vx *= 0.995; p.vy *= 0.995;
        p.x += p.vx; p.y += p.vy;
        // Wrap
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        // Draw dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},100%,70%,${p.a})`;
        ctx.fill();
      });

      // Draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK_DIST) {
            const alpha = (1 - d / LINK_DIST) * 0.2;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(0,229,255,${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ─────────────────────────────────────────
     CUSTOM CURSOR
  ───────────────────────────────────────── */
  function initCursor() {
    if (window.innerWidth < 768) return; // skip on mobile

    const cursor = document.createElement('div');
    cursor.id = 'fx-cursor';
    const trail = document.createElement('div');
    trail.id = 'fx-cursor-trail';
    document.body.appendChild(cursor);
    document.body.appendChild(trail);

    let cx = 0, cy = 0;
    window.addEventListener('mousemove', e => {
      cx = e.clientX; cy = e.clientY;
      cursor.style.left = cx + 'px';
      cursor.style.top  = cy + 'px';
      setTimeout(() => {
        trail.style.left = cx + 'px';
        trail.style.top  = cy + 'px';
      }, 80);
    });

    // Expand on hoverable elements
    document.querySelectorAll('a, button, .card, .aircraft-card, .btn, [onclick]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.width  = '36px';
        cursor.style.height = '36px';
        cursor.style.borderColor = 'rgba(255,107,43,0.9)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.width  = '18px';
        cursor.style.height = '18px';
        cursor.style.borderColor = 'rgba(0,229,255,0.8)';
      });
    });
  }

  /* ─────────────────────────────────────────
     HUD CORNERS
  ───────────────────────────────────────── */
  function initCorners() {
    ['tl','tr','bl','br'].forEach(pos => {
      const d = document.createElement('div');
      d.className = `fx-corner fx-c-${pos}`;
      document.body.appendChild(d);
    });
  }

  /* ─────────────────────────────────────────
     3D CARD TILT
  ───────────────────────────────────────── */
  function initCardTilt() {
    const selectors = '.card, .aircraft-card, .feature-card, .panel-aircraft-card';
    document.querySelectorAll(selectors).forEach(card => applyTilt(card));

    // Also observe future DOM additions (dynamic cards)
    const mo = new MutationObserver(muts => {
      muts.forEach(m => m.addedNodes.forEach(node => {
        if (node.nodeType === 1) {
          if (node.matches && node.matches(selectors)) applyTilt(node);
          node.querySelectorAll && node.querySelectorAll(selectors).forEach(applyTilt);
        }
      }));
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  function applyTilt(card) {
    if (card._fxTilt) return;
    card._fxTilt = true;

    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const x  = (e.clientX - r.left) / r.width  - 0.5;
      const y  = (e.clientY - r.top)  / r.height - 0.5;
      const rx = -y * 10;
      const ry =  x * 10;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.03,1.03,1.03)`;
      // Inner glow at cursor position
      const px = (e.clientX - r.left) / r.width  * 100;
      const py = (e.clientY - r.top)  / r.height * 100;
      card.style.backgroundImage = `radial-gradient(circle at ${px}% ${py}%, rgba(0,229,255,0.07) 0%, transparent 60%), ${card.style.backgroundImage || ''}`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.backgroundImage = '';
    });
  }

  /* ─────────────────────────────────────────
     MAGNETIC BUTTONS
  ───────────────────────────────────────── */
  function initMagneticButtons() {
    document.querySelectorAll('.btn, button.btn, a.btn').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r  = btn.getBoundingClientRect();
        const x  = (e.clientX - r.left - r.width  / 2) * 0.25;
        const y  = (e.clientY - r.top  - r.height / 2) * 0.25;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ─────────────────────────────────────────
     SCROLL REVEAL
  ───────────────────────────────────────── */
  function initScrollReveal() {
    // Tag elements that aren't already animated
    const targets = 'h1, h2, h3, p.overlay > p, .card, .aircraft-card, .feature-card, .aircraft-details, .login-card';
    document.querySelectorAll(targets).forEach((el, i) => {
      if (!el.classList.contains('fx-reveal') && !el.classList.contains('reveal')) {
        el.classList.add('fx-reveal');
        el.style.transitionDelay = `${(i % 8) * 0.06}s`;
      }
    });

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('fx-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fx-reveal').forEach(el => io.observe(el));

    // Also handle dynamically added elements
    const mo = new MutationObserver(() => {
      document.querySelectorAll('.fx-reveal:not(.fx-visible)').forEach(el => io.observe(el));
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  /* ─────────────────────────────────────────
     GLITCH ON H1
  ───────────────────────────────────────── */
  function initGlitchTitle() {
    const h1 = document.querySelector('.overlay h1, .hero h1, h1.page-title');
    if (!h1) return;
    const text = h1.textContent;
    h1.classList.add('fx-glitch-wrap');
    h1.setAttribute('data-text', text);
  }

  /* ─────────────────────────────────────────
     RIPPLE ON CLICK
  ───────────────────────────────────────── */
  function initRipple() {
    document.addEventListener('click', e => {
      const target = e.target.closest('.btn, button, .card, .aircraft-card');
      if (!target) return;
      const r    = target.getBoundingClientRect();
      const size = Math.max(r.width, r.height);
      const rip  = document.createElement('span');
      rip.className = 'fx-ripple';
      rip.style.cssText = `
        width: ${size}px; height: ${size}px;
        left: ${e.clientX - r.left - size/2}px;
        top:  ${e.clientY - r.top  - size/2}px;
      `;
      target.style.position = 'relative';
      target.style.overflow = 'hidden';
      target.appendChild(rip);
      setTimeout(() => rip.remove(), 600);
    });
  }

  /* ─────────────────────────────────────────
     SCAN LINE ON IMAGES
  ───────────────────────────────────────── */
  function initImageScan() {
    function wrapImg(img) {
      if (img._fxScan) return;
      img._fxScan = true;
      if (!img.src && !img.style.backgroundImage) return;
      const wrap = document.createElement('div');
      wrap.className = 'fx-img-wrap';
      img.parentNode.insertBefore(wrap, img);
      wrap.appendChild(img);
      const scan = document.createElement('div');
      scan.className = 'fx-img-scan';
      wrap.appendChild(scan);
    }

    document.querySelectorAll('img.aircraft-img, .card-img-wrap img, .detail-img-wrap img').forEach(wrapImg);

    // Watch for dynamic images
    const mo = new MutationObserver(() => {
      document.querySelectorAll('img.aircraft-img, .card-img-wrap img').forEach(wrapImg);
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  /* ─────────────────────────────────────────
     MOUSE PARALLAX ON HERO
  ───────────────────────────────────────── */
  function initParallax() {
    const hero = document.querySelector('.hero, .overlay');
    if (!hero) return;
    window.addEventListener('mousemove', e => {
      const x = (e.clientX / window.innerWidth  - 0.5) * 14;
      const y = (e.clientY / window.innerHeight - 0.5) * 8;
      hero.style.backgroundPosition = `calc(50% + ${x}px) calc(50% + ${y}px)`;
    });
  }

  /* ─────────────────────────────────────────
     RUN
  ───────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
