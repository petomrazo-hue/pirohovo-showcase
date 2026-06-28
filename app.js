/* Pirohovo app.js v38 */

// ── Closing countdown ──
(function () {
  const el = document.getElementById('heroClosing');
  if (!el) return;
  function update() {
    const now = new Date();
    const day = now.getDay(), h = now.getHours(), m = now.getMinutes();
    if (day === 1 || h < 11 || h >= 20) { el.style.display = 'none'; return; }
    const mins = (19 - h) * 60 + (60 - m);
    const hh = Math.floor(mins / 60), mm = mins % 60;
    el.textContent = hh > 0 ? `· Zatvára za ${hh}h ${mm}min` : `· Zatvára za ${mm} min ⚡`;
    el.style.display = 'inline';
  }
  update();
  setInterval(update, 60000);
})();

// ── Sticky order strip ──
(function () {
  const strip = document.getElementById('orderStrip');
  if (!strip) return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  window.addEventListener('scroll', () => {
    strip.classList.toggle('is-visible', hero.getBoundingClientRect().bottom < 0);
  }, { passive: true });
})();

// ── Nav scroll ──
const nav = document.getElementById('nav');
const heroBg = document.getElementById('heroBg');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (nav) nav.classList.toggle('scrolled', y > 60);
  if (heroBg) heroBg.style.transform = `scale(1.06) translateY(${y * 0.22}px)`;
}, { passive: true });

// ── Mobile burger ──
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
if (burger && navLinks) {
  burger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    if (nav) nav.classList.toggle('menu-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

// ── Reveal on scroll (so stagger podľa pozície v skupine) ──
const reveals = document.querySelectorAll('.reveal');
if (reveals.length) {
  // nastav stagger index: poradie medzi .reveal súrodencami v rovnakom rodičovi
  reveals.forEach((el) => {
    const sibs = Array.from(el.parentElement ? el.parentElement.children : [])
      .filter((c) => c.classList && c.classList.contains('reveal'));
    const idx = sibs.indexOf(el);
    el.style.setProperty('--rvi', Math.min(idx < 0 ? 0 : idx, 6));
  });
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');   // delay rieši CSS --rvi
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });
  reveals.forEach((el) => revealObs.observe(el));
}

// ── Menu category filter (menu.html) ──
const catBtns = document.querySelectorAll('.menu-cat-btn');
const catSections = document.querySelectorAll('.menu-cat-section');
if (catBtns.length && catSections.length) {
  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const f = btn.dataset.filter;
      catSections.forEach(sec => {
        if (f === 'all' || sec.dataset.group === f) {
          sec.style.display = '';
        } else {
          sec.style.display = 'none';
        }
      });
    });
  });
}

// ── Cursor pirog effect (brand logo-style outline dumpling) ──
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if ('ontouchstart' in window && navigator.maxTouchPoints > 1) return;

  const PIROG_SVG = `<svg viewBox="0 0 64 46" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 38 C4 38 2 36 4 30 C8 14 18 4 32 4 C46 4 56 14 60 30 C62 36 60 38 60 38 Z"
          fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.92)" stroke-width="2.2" stroke-linejoin="round"/>
    <path d="M6 33 C8 27 7 24 10 22 C13 20 15 24 18 22 C21 20 22 17 25 15 C28 13 29 17 32 16 C35 15 36 19 39 17 C42 15 43 19 46 18 C49 17 50 21 53 20 C56 19 57 24 58 28"
          fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M16 18 Q24 9 32 8 Q40 7 48 12" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="2" stroke-linecap="round"/>
  </svg>`;

  let last = 0, count = 0;

  function emitPirog(x, y, burst) {
    const el = document.createElement('span');
    el.className = 'cursor-pirog';
    el.innerHTML = PIROG_SVG;
    const spread = burst ? 80 : 50;
    const dx = (Math.random() - 0.5) * spread;
    const dy = -(burst ? 60 : 32) - Math.random() * 40;
    const rot = (Math.random() < 0.5 ? -1 : 1) * (20 + Math.random() * 50) + 'deg';
    const size = burst ? (18 + Math.random() * 10) : (15 + Math.random() * 7);
    el.style.cssText = `left:${x}px;top:${y}px;font-size:${size}px`;
    el.style.setProperty('--dx', dx + 'px');
    el.style.setProperty('--dy', dy + 'px');
    el.style.setProperty('--rot', rot);
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove(), { once: true });
  }

  window.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - last < 90) return;
    last = now; count++;
    emitPirog(e.clientX, e.clientY, false);
    if (count % 6 === 0) emitPirog(e.clientX + (Math.random()-0.5)*16, e.clientY + (Math.random()-0.5)*16, false);
  }, { passive: true });

  window.addEventListener('click', (e) => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => emitPirog(e.clientX + (Math.random()*36-18), e.clientY + (Math.random()*18-9), true), i * 55);
    }
  });

  window.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'touch') {
      for (let i = 0; i < 4; i++) {
        setTimeout(() => emitPirog(e.clientX + (Math.random()*36-18), e.clientY + (Math.random()*18-9), true), i * 60);
      }
    }
  }, { passive: true });
})();

// ── Flour particles ──
(function () {
  const container = document.getElementById('particles');
  if (!container) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes flourRise {
      0%   { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
      10%  { opacity: var(--op, .4); }
      85%  { opacity: var(--op, .4); }
      100% { transform: translateY(-110vh) translateX(var(--drift)) rotate(var(--spin)); opacity: 0; }
    }
    .flour-dot {
      position: absolute; border-radius: 50%;
      animation: flourRise var(--dur) var(--delay) ease-in-out infinite;
      will-change: transform, opacity; pointer-events: none;
    }
  `;
  document.head.appendChild(style);

  for (let i = 0; i < 24; i++) {
    const dot = document.createElement('span');
    dot.className = 'flour-dot';
    const size = 1 + Math.random() * 3.2;
    const x = Math.random() * 100;
    const dur = 12 + Math.random() * 18;
    const delay = -(Math.random() * dur);
    const isGold = Math.random() > 0.5;
    const op = (.07 + Math.random() * .18).toFixed(2);
    const drift = ((Math.random() - 0.5) * 110).toFixed(0) + 'px';
    const spin = ((Math.random() - 0.5) * 360).toFixed(0) + 'deg';
    dot.style.cssText = `left:${x}%;bottom:${-size}px;width:${size}px;height:${size}px;
      background:${isGold ? `rgba(212,168,67,${op})` : `rgba(255,252,240,${op})`};
      --dur:${dur}s;--delay:${delay}s;--op:${op};--drift:${drift};--spin:${spin};`;
    container.appendChild(dot);
  }
})();

// ── Back to top ──
const backTop = document.getElementById('backTop');
if (backTop) {
  window.addEventListener('scroll', () => {
    backTop.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ── Dynamic year ──
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ── Open/closed badge + delivery badge (jedna spoločná logika) ──
(function () {
  const now = new Date();
  const day = now.getDay();  // 0=Sun, 1=Mon
  const time = now.getHours() * 60 + now.getMinutes();
  const isMonday = day === 1;
  const inHours = time >= 11 * 60 && time < 20 * 60;
  const isOpen = !isMonday && inHours;   // skutočne otvorené teraz

  // Status badge (hero + kontakt)
  const badges = [document.getElementById('openBadge'), document.getElementById('heroOpenBadge')].filter(Boolean);
  let cls, txt;
  if (isOpen) {
    cls = 'open-badge is-open'; txt = 'Teraz otvorené · do 20:00';
  } else if (isMonday) {
    cls = 'open-badge is-closed'; txt = 'Dnes zatvorené (Pondelok)';
  } else if (time >= 20 * 60) {
    cls = 'open-badge is-closed'; txt = 'Zatvorené · otvárame zajtra 11:00';
  } else {
    cls = 'open-badge is-closed'; txt = 'Zatvorené · otvárame dnes o 11:00';
  }
  badges.forEach(b => { b.className = cls; b.textContent = txt; });

  // Rozvoz „~35 min" sa zobrazí LEN keď je naozaj otvorené.
  // (Nesmie svietiť „Zatvorené" a zároveň „Rozvoz za 35 min".)
  document.querySelectorAll('.hero__delivery-badge').forEach(d => {
    d.style.display = isOpen ? '' : 'none';
  });
})();

// ── Seasonal bar dismiss ──
(function () {
  const bar = document.getElementById('seasonalBar');
  const btn = document.getElementById('seasonalClose');
  if (!bar || !btn) return;
  if (sessionStorage.getItem('seasonalDismissed') === '1') { bar.style.display = 'none'; return; }
  btn.addEventListener('click', () => {
    bar.style.display = 'none';
    sessionStorage.setItem('seasonalDismissed', '1');
  });
})();


// ── Easter egg: klik na logo zaplní header pirohmi 🥟 ──
(function () {
  const logo = document.querySelector('.nav__logo');
  if (!logo) return;
  const isHome = location.pathname === '/' ||
                 location.pathname === '' ||
                 location.pathname.endsWith('/index.html');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let busy = false;
  function burst() {
    if (busy) return; busy = true;
    // logo poskočí
    logo.classList.remove('logo-pop'); void logo.offsetWidth; logo.classList.add('logo-pop');
    const N = 52;
    for (let i = 0; i < N; i++) {
      const s = document.createElement('span');
      s.className = 'egg-pirog';
      s.textContent = '🥟';
      s.style.left = (Math.random() * 100) + 'vw';
      s.style.fontSize = (0.9 + Math.random() * 2.1) + 'rem';
      s.style.setProperty('--dx', (Math.random() * 90 - 45) + 'px');
      s.style.setProperty('--rot', (Math.random() * 900 - 450) + 'deg');
      s.style.animationDelay = (Math.random() * 0.45) + 's';
      s.style.animationDuration = (1.7 + Math.random() * 1.5) + 's';
      document.body.appendChild(s);
      s.addEventListener('animationend', () => s.remove());
    }
    setTimeout(() => { busy = false; }, 600);
  }

  logo.addEventListener('click', (e) => {
    if (isHome) { e.preventDefault(); burst(); }   // domov: easter egg miesto reloadu
  });
})();

// ── Plávajúce pirohy v hlavičke (nav lišta) — driftujú naprieč ──
(function () {
  const layer = document.getElementById('navPirohy');
  if (!layer) return;
  const N = window.matchMedia('(max-width: 768px)').matches ? 5 : 9;
  for (let i = 0; i < N; i++) {
    const s = document.createElement('span');
    s.className = 'nav__piroh';
    s.textContent = '🥟';
    s.style.top = (8 + Math.random() * 58) + '%';
    s.style.fontSize = (0.7 + Math.random() * 0.7) + 'rem';
    s.style.setProperty('--op', (0.22 + Math.random() * 0.3).toFixed(2));
    s.style.setProperty('--dur', (12 + Math.random() * 10).toFixed(1) + 's');
    s.style.setProperty('--delay', (-Math.random() * 22).toFixed(1) + 's');
    s.style.setProperty('--rot', (Math.random() * 320 - 160).toFixed(0) + 'deg');
    layer.appendChild(s);
  }
})();
