// Decorative "data constellation" background: faint drifting points with
// hairline connections, rendered behind all content (see #bg-canvas in style.css).
// Purely visual — safe to remove without affecting any feature.

const MIN_WIDTH = 640;
const LINK_DISTANCE = 110;

if (window.innerWidth >= MIN_WIDTH) {
  init();
}

function init() {
  const canvas = document.createElement('canvas');
  canvas.id = 'bg-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let width = 0;
  let height = 0;
  let dpr = 1;
  let particles = [];
  let particleColor = 'rgb(211, 178, 115)';
  let lineColor = 'rgb(91, 100, 116)';
  let lineAlphaBase = 0.1;
  let rafId = null;

  // Unregistered custom properties don't resolve light-dark() via
  // getComputedStyle, so route each token through a real color property.
  function resolveToken(token) {
    canvas.style.color = `var(${token})`;
    return getComputedStyle(canvas).color;
  }

  function readColors() {
    particleColor = resolveToken('--bg-particle');
    lineColor = resolveToken('--bg-line');
    const bg = resolveToken('--bg');
    const rgb = bg.match(/\d+/g);
    const isDark = rgb
      ? (Number(rgb[0]) + Number(rgb[1]) + Number(rgb[2])) / 3 < 128
      : true;
    lineAlphaBase = isDark ? 0.1 : 0.08;
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.max(24, Math.min(70, Math.round((width * height) / 26000)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: 1 + Math.random() * 0.8,
    }));
  }

  function draw(advance) {
    ctx.clearRect(0, 0, width, height);

    if (advance) {
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;
      }
    }

    if (!reducedMotion.matches) {
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.hypot(dx, dy);
          if (d < LINK_DISTANCE) {
            ctx.globalAlpha = lineAlphaBase * (1 - d / LINK_DISTANCE);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    ctx.globalAlpha = 0.35;
    ctx.fillStyle = particleColor;
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function loop() {
    draw(true);
    rafId = requestAnimationFrame(loop);
  }

  function start() {
    if (rafId !== null) return;
    if (reducedMotion.matches) {
      draw(false); // single static frame, points only
    } else {
      rafId = requestAnimationFrame(loop);
    }
  }

  function stop() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth < MIN_WIDTH) {
        stop();
        canvas.style.display = 'none';
        return;
      }
      canvas.style.display = '';
      resize();
      stop();
      start();
    }, 200);
  });

  reducedMotion.addEventListener('change', () => {
    stop();
    start();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stop();
    } else {
      start();
    }
  });

  // Theme changes: the switcher select (created by global.js, which imports
  // this module afterward) and OS-level scheme changes.
  document.querySelector('.color-scheme select')?.addEventListener('input', () => {
    readColors();
    if (reducedMotion.matches) draw(false);
  });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    readColors();
    if (reducedMotion.matches) draw(false);
  });

  readColors();
  resize();
  start();
}
