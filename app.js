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

// ── Cursor pirohy — autentický tvar pierogi/varenyky (polmesiac, zubatý šev) ──
(function () {
  const PIROG_SVG = `<svg viewBox="0 0 58 42" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Telo: klasický polmesiacový tvar складеного cesta -->
    <path d="M5 32 C3 32 2 30 3 27 C6 14 16 4 29 4 C42 4 52 14 55 27 C56 30 55 32 53 32 Z"
          fill="rgba(212,168,67,.38)" stroke="rgba(212,168,67,.92)" stroke-width="2" stroke-linejoin="round"/>
    <!-- Šev (crimp) — typický znak piroha/pierogu, séria záhybov po okraji -->
    <path d="M7 28 C9 21 8 19 11 18 C14 17 15 21 18 20 C21 19 21 16 24 14 C27 12 28 16 31 15 C34 14 34 18 37 17 C40 16 40 20 43 19 C46 18 46 22 49 21 C51 20 52 24 53 27"
          fill="none" stroke="rgba(212,168,67,.55)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Lesk (dough sheen) -->
    <path d="M14 17 Q21 9 29 8 Q37 7 44 11" fill="none" stroke="rgba(255,252,235,.28)" stroke-width="2.2" stroke-linecap="round"/>
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
  if (!badge) return;
  const now = new Date();
  const day = now.getDay(); // 0=Sun,1=Mon,...,6=Sat
  const hour = now.getHours();
  const min = now.getMinutes();
  const time = hour * 60 + min;
  const isMonday = day === 1;
  const inHours = time >= 11 * 60 && time < 20 * 60;
  if (!isMonday && inHours) {
    badge.className = 'open-badge is-open';
    badge.textContent = 'Dnes otvorené · do 20:00';
  } else if (isMonday) {
    badge.className = 'open-badge is-closed';
    badge.textContent = 'Dnes zatvorené';
  } else if (time >= 20 * 60) {
    badge.className = 'open-badge is-closed';
    badge.textContent = 'Dnes zatvorené · otvárame zajtra 11:00';
  } else {
    badge.className = 'open-badge is-open';
    badge.textContent = 'Dnes otvárame o 11:00';
  }
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
