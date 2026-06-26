// ── Nav scroll ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── Mobile burger ──
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  burger.classList.toggle('is-open');
});
navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.classList.remove('is-open');
  })
);

// ── Reveal on scroll ──
const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
reveals.forEach(el => revealObs.observe(el));

// ── Menu filter ──
const tabs = document.querySelectorAll('.tab');
const cards = document.querySelectorAll('.mcard');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const f = tab.dataset.filter;
    cards.forEach(c => c.classList.toggle('hidden', f !== 'all' && c.dataset.cat !== f));
  });
});

// ── Cursor pirohy ──
(function () {
  const PIROHY = ['🥟', '🥟', '🥟', '🥟', '🫕'];
  var last = 0;
  var count = 0;

  function emitPirog(x, y, burst) {
    const el = document.createElement('span');
    el.className = 'cursor-pirog';
    el.textContent = PIROHY[Math.floor(Math.random() * PIROHY.length)];
    const spread = burst ? 80 : 50;
    const dx = (Math.random() - 0.5) * spread;
    const dy = -(burst ? 60 : 35) - Math.random() * 45;
    const rot = (Math.random() < 0.5 ? -1 : 1) * (20 + Math.random() * 50) + 'deg';
    const size = burst ? (18 + Math.random() * 10) : (16 + Math.random() * 8);
    el.style.cssText = `left:${x}px;top:${y}px;font-size:${size}px`;
    el.style.setProperty('--dx', dx + 'px');
    el.style.setProperty('--dy', dy + 'px');
    el.style.setProperty('--rot', rot);
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }

  window.addEventListener('mousemove', function (e) {
    const now = Date.now();
    if (now - last < 85) return;
    last = now;
    count++;
    // Every 5th mousemove emit 2 pirohy for a "trail burst"
    emitPirog(e.clientX, e.clientY, false);
    if (count % 5 === 0) emitPirog(e.clientX + (Math.random()-0.5)*20, e.clientY + (Math.random()-0.5)*20, false);
  }, { passive: true });

  // Click burst
  window.addEventListener('click', function (e) {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => emitPirog(
        e.clientX + (Math.random()*40-20),
        e.clientY + (Math.random()*20-10),
        true
      ), i * 55);
    }
  });

  window.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'touch') {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => emitPirog(
          e.clientX + (Math.random()*40-20),
          e.clientY + (Math.random()*20-10),
          true
        ), i * 60);
      }
    }
  }, { passive: true });
})();

// ── Floating flour particles (rising from bottom, continuous) ──
(function () {
  const container = document.getElementById('particles');
  if (!container) return;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes flourRise {
      0%   { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
      10%  { opacity: var(--op, .4); }
      85%  { opacity: var(--op, .4); }
      100% { transform: translateY(-110vh) translateX(var(--drift)) rotate(var(--spin)); opacity: 0; }
    }
    .flour-dot {
      position: absolute;
      border-radius: 50%;
      animation: flourRise var(--dur) var(--delay) ease-in-out infinite;
      will-change: transform, opacity;
      pointer-events: none;
    }
  `;
  document.head.appendChild(style);

  const count = 28;
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('span');
    dot.className = 'flour-dot';
    const size = 1.2 + Math.random() * 3.5;
    const x = Math.random() * 100;
    const dur = 12 + Math.random() * 18;
    const delay = -(Math.random() * dur); // start at random point in cycle
    const isGold = Math.random() > 0.55;
    const op = (.08 + Math.random() * .22).toFixed(2);
    const drift = ((Math.random() - 0.5) * 120).toFixed(0) + 'px';
    const spin = ((Math.random() - 0.5) * 360).toFixed(0) + 'deg';
    dot.style.cssText = `
      left:${x}%;
      bottom:${-size}px;
      width:${size}px; height:${size}px;
      background: ${isGold ? `rgba(212,168,67,${op})` : `rgba(255,252,235,${op})`};
      --dur: ${dur}s;
      --delay: ${delay}s;
      --op: ${op};
      --drift: ${drift};
      --spin: ${spin};
    `;
    container.appendChild(dot);
  }
})();

// ── Gold shimmer on menu cards ──
(function () {
  document.querySelectorAll('.mcard').forEach(card => {
    card.addEventListener('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
      const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
      this.style.setProperty('--mx', x + '%');
      this.style.setProperty('--my', y + '%');
    });
    card.addEventListener('mouseleave', function () {
      this.style.removeProperty('--mx');
      this.style.removeProperty('--my');
    });
  });
})();
