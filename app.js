/* Pirohovo app.js v36 */

// ── Nav pirohy roam (3 independent) ──
(function () {
  const navEl = document.getElementById('nav');
  if (!navEl || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const configs = [
    { id: 'navPirog1', minL: 130, minR: 200, speed: 2800, spread: 2200 },
    { id: 'navPirog2', minL: 190, minR: 260, speed: 3800, spread: 2600 },
    { id: 'navPirog3', minL: 110, minR: 170, speed: 4600, spread: 3200 },
  ];
  configs.forEach(({ id, minL, minR, speed, spread }, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    function roam() {
      const w = navEl.offsetWidth;
      const max = w - minR;
      if (max <= minL) return;
      el.style.left = (minL + Math.random() * (max - minL)) + 'px';
      setTimeout(roam, speed + Math.random() * spread);
    }
    setTimeout(roam, 500 + i * 1100);
  });
})();

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

// ── Reveal on scroll ──
const reveals = document.querySelectorAll('.reveal');
if (reveals.length) {
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 70);
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06 });
  reveals.forEach(el => revealObs.observe(el));
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

// ── Open/closed badge ──
(function () {
  const badges = [document.getElementById('openBadge'), document.getElementById('heroOpenBadge')].filter(Boolean);
  if (!badges.length) return;
  const now = new Date();
  const day = now.getDay();  // 0=Sun, 1=Mon
  const time = now.getHours() * 60 + now.getMinutes();
  const isMonday = day === 1;
  const inHours = time >= 11 * 60 && time < 20 * 60;
  let cls, txt;
  if (!isMonday && inHours) {
    cls = 'open-badge is-open'; txt = 'Teraz otvorené · do 20:00';
  } else if (isMonday) {
    cls = 'open-badge is-closed'; txt = 'Dnes zatvorené (Pondelok)';
  } else if (time >= 20 * 60) {
    cls = 'open-badge is-closed'; txt = 'Zatvorené · otvárame zajtra 11:00';
  } else {
    cls = 'open-badge is-open'; txt = 'Dnes otvárame o 11:00';
  }
  badges.forEach(b => { b.className = cls; b.textContent = txt; });
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

// ── Cookie banner + Google Consent Mode v2 ──
(function () {
  const banner  = document.getElementById('cookieBanner');
  const accept  = document.getElementById('cookieAccept');
  const decline = document.getElementById('cookieDecline');
  if (!banner) return;

  function gtag(...args) { if (window.dataLayer) window.dataLayer.push(args); }

  function grantAll() {
    gtag('consent', 'update', {
      'ad_storage':         'granted',
      'ad_user_data':       'granted',
      'ad_personalization': 'granted',
      'analytics_storage':  'granted'
    });
  }

  const saved = localStorage.getItem('pirohovoCookies');
  if (saved === 'all') { grantAll(); }
  else if (!saved) { setTimeout(() => { banner.style.display = 'block'; }, 1600); }

  function closeBanner() {
    banner.style.transition = 'transform .32s ease, opacity .32s';
    banner.style.opacity = '0';
    banner.style.transform = 'translateY(100%)';
    setTimeout(() => { banner.style.display = 'none'; }, 340);
  }

  if (accept) accept.addEventListener('click', () => {
    localStorage.setItem('pirohovoCookies', 'all');
    grantAll();
    closeBanner();
  });
  if (decline) decline.addEventListener('click', () => {
    localStorage.setItem('pirohovoCookies', 'essential');
    closeBanner();
  });
})();
