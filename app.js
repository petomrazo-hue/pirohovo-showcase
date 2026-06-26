// ── Nav scroll ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── Mobile burger ──
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  burger.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', open);
});
navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
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
}, { threshold: 0.06 });
reveals.forEach(el => revealObs.observe(el));

// ── Menu filter (restaurant list) ──
const tabs = document.querySelectorAll('.tab');
const menuCats = document.querySelectorAll('.menu-cat');
const mItems = document.querySelectorAll('.mitem');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    const f = tab.dataset.filter;
    if (f === 'all') {
      menuCats.forEach(c => c.classList.remove('hidden'));
      mItems.forEach(i => i.style.display = '');
    } else {
      menuCats.forEach(cat => {
        const groupItems = cat.querySelectorAll('.mitem');
        const match = [...groupItems].some(i => i.dataset.cat === f);
        cat.classList.toggle('hidden', !match);
        groupItems.forEach(i => {
          i.style.display = i.dataset.cat === f ? '' : 'none';
        });
      });
    }
  });
});

// ── Cursor pirohy — brand logo štýl (biely outline dumpling) ──
(function () {
  const PIROG_SVG = `<svg viewBox="0 0 64 46" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Telo pirohu -->
    <path d="M4 38 C4 38 2 36 4 30 C8 14 18 4 32 4 C46 4 56 14 60 30 C62 36 60 38 60 38 Z"
          fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.95)" stroke-width="2.2" stroke-linejoin="round"/>
    <!-- Vrúbkovaný okraj (crimp) — logo štýl -->
    <path d="M6 33 C8 27 7 24 10 22 C13 20 15 24 18 22 C21 20 22 17 25 15 C28 13 29 17 32 16 C35 15 36 19 39 17 C42 15 43 19 46 18 C49 17 50 21 53 20 C56 19 57 24 58 28"
          fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Lesk -->
    <path d="M16 18 Q24 9 32 8 Q40 7 48 12" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="2" stroke-linecap="round"/>
  </svg>`;
  var last = 0;
  var count = 0;

  function emitPirog(x, y, burst) {
    const el = document.createElement('span');
    el.className = 'cursor-pirog';
    el.innerHTML = PIROG_SVG;
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
    emitPirog(e.clientX, e.clientY, false);
    if (count % 5 === 0) emitPirog(e.clientX + (Math.random()-0.5)*20, e.clientY + (Math.random()-0.5)*20, false);
  }, { passive: true });

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

// ── Floating flour particles ──
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
      position: absolute; border-radius: 50%;
      animation: flourRise var(--dur) var(--delay) ease-in-out infinite;
      will-change: transform, opacity; pointer-events: none;
    }
  `;
  document.head.appendChild(style);

  for (let i = 0; i < 28; i++) {
    const dot = document.createElement('span');
    dot.className = 'flour-dot';
    const size = 1.2 + Math.random() * 3.5;
    const x = Math.random() * 100;
    const dur = 12 + Math.random() * 18;
    const delay = -(Math.random() * dur);
    const isGold = Math.random() > 0.55;
    const op = (.08 + Math.random() * .22).toFixed(2);
    const drift = ((Math.random() - 0.5) * 120).toFixed(0) + 'px';
    const spin = ((Math.random() - 0.5) * 360).toFixed(0) + 'deg';
    dot.style.cssText = `left:${x}%;bottom:${-size}px;width:${size}px;height:${size}px;
      background:${isGold ? `rgba(212,168,67,${op})` : `rgba(255,252,235,${op})`};
      --dur:${dur}s;--delay:${delay}s;--op:${op};--drift:${drift};--spin:${spin};`;
    container.appendChild(dot);
  }
})();

// ── Hero logo ring parallax ──
(function () {
  const ring = document.getElementById('heroRing');
  if (!ring) return;
  window.addEventListener('mousemove', function (e) {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx * 8;
    const dy = (e.clientY - cy) / cy * 8;
    ring.style.transform = `translate(${dx}px, ${dy}px)`;
  }, { passive: true });
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
  const badge = document.getElementById('openBadge');
  const heroBadge = document.getElementById('heroOpenBadge');
  if (!badge && !heroBadge) return;
  const now = new Date();
  const day = now.getDay();
  const time = now.getHours() * 60 + now.getMinutes();
  const isMonday = day === 1;
  const inHours = time >= 11 * 60 && time < 20 * 60;
  let cls, txt;
  if (!isMonday && inHours) {
    cls = 'open-badge is-open'; txt = 'Dnes otvorené · do 20:00';
  } else if (isMonday) {
    cls = 'open-badge is-closed'; txt = 'Dnes zatvorené';
  } else if (time >= 20 * 60) {
    cls = 'open-badge is-closed'; txt = 'Dnes zatvorené · otvárame zajtra 11:00';
  } else {
    cls = 'open-badge is-open'; txt = 'Dnes otvárame o 11:00';
  }
  if (badge) { badge.className = cls; badge.textContent = txt; }
  if (heroBadge) { heroBadge.className = cls; heroBadge.textContent = txt; }
})();

// ── Seasonal bar dismiss ──
(function () {
  const bar = document.getElementById('seasonalBar');
  const btn = document.getElementById('seasonalClose');
  if (!bar || !btn) return;
  if (localStorage.getItem('seasonalDismissed') === '1') {
    bar.style.display = 'none'; return;
  }
  btn.addEventListener('click', () => {
    bar.style.display = 'none';
    localStorage.setItem('seasonalDismissed', '1');
  });
})();

// ── Cookie banner + Google Consent Mode v2 ──
(function () {
  const banner = document.getElementById('cookieBanner');
  const accept  = document.getElementById('cookieAccept');
  const decline = document.getElementById('cookieDecline');
  if (!banner) return;

  function gtag() { if (window.dataLayer) window.dataLayer.push(arguments); }

  function grantAll() {
    if (typeof gtag === 'function') {
      gtag('consent','update',{
        'ad_storage':         'granted',
        'ad_user_data':       'granted',
        'ad_personalization': 'granted',
        'analytics_storage':  'granted'
      });
    }
  }

  function grantEssential() {
    // Keep defaults (denied) — nothing extra to grant
  }

  // Apply saved consent on page load
  const saved = localStorage.getItem('pirohovoCookies');
  if (saved === 'all') { grantAll(); }
  else if (!saved) {
    setTimeout(() => { banner.style.display = 'block'; }, 1500);
  }

  function closeBanner() {
    banner.style.transition = 'transform .35s ease, opacity .35s';
    banner.style.opacity = '0';
    banner.style.transform = 'translateY(100%)';
    setTimeout(() => { banner.style.display = 'none'; }, 380);
  }

  accept.addEventListener('click', () => {
    localStorage.setItem('pirohovoCookies', 'all');
    grantAll();
    closeBanner();
  });
  decline.addEventListener('click', () => {
    localStorage.setItem('pirohovoCookies', 'essential');
    grantEssential();
    closeBanner();
  });
})();
