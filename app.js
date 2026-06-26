// ── Nav scroll ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── Mobile burger ──
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);

// ── Reveal on scroll ──
const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 70);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
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

// ── Cursor pirohy (ako mrazosoft snowflakes) ──
(function () {
  const PIROHY = ['🥟', '🥟', '🥟', '🫕'];
  var last = 0;
  function emitPirog(x, y) {
    const el = document.createElement('span');
    el.className = 'cursor-pirog';
    el.textContent = PIROHY[Math.floor(Math.random() * PIROHY.length)];
    const dx = (Math.random() - 0.5) * 60;
    const dy = -(30 + Math.random() * 50);
    const rot = (Math.random() < 0.5 ? -1 : 1) * (15 + Math.random() * 40) + 'deg';
    el.style.left = x + 'px';
    el.style.top  = y + 'px';
    el.style.setProperty('--dx', dx + 'px');
    el.style.setProperty('--dy', dy + 'px');
    el.style.setProperty('--rot', rot);
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }
  window.addEventListener('mousemove', function (e) {
    const now = Date.now();
    if (now - last < 80) return;
    last = now;
    emitPirog(e.clientX, e.clientY);
  }, { passive: true });
  window.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'touch') {
      for (let i = 0; i < 4; i++) {
        setTimeout(() => emitPirog(e.clientX + (Math.random()*30-15), e.clientY + (Math.random()*30-15)), i * 60);
      }
    }
  }, { passive: true });
})();

// ── Flour particles ──
(function () {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = 22;
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('span');
    const size = Math.random() * 3 + 1;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const delay = Math.random() * 8;
    const dur = 6 + Math.random() * 10;
    dot.style.cssText = `
      position:absolute;
      left:${x}%; top:${y}%;
      width:${size}px; height:${size}px;
      border-radius:50%;
      background:rgba(${Math.random()>.6?'212,168,67':'255,248,220'},${.1+Math.random()*.25});
      animation: floatDot ${dur}s ${delay}s ease-in-out infinite alternate;
      pointer-events:none;
    `;
    container.appendChild(dot);
  }
  const style = document.createElement('style');
  style.textContent = `
    @keyframes floatDot {
      from { transform: translate(0,0) scale(1); opacity:.3; }
      to   { transform: translate(${Math.random()>0.5?'':'-'}${8+Math.random()*14}px, ${Math.random()>0.5?'':'-'}${8+Math.random()*14}px) scale(1.4); opacity:.85; }
    }
  `;
  document.head.appendChild(style);
})();
