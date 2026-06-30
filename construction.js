/* ░░ PIROHOVO — UNDER CONSTRUCTION overlay (manuálny spínač) v2 ░░
   Zapni:  UC_ON = true  + deploy (git push main)
   Vypni:  UC_ON = false + deploy

   NÁHĽAD PRE KLIENTA (vidí celý web aj keď je overlay zapnutý):
     https://pirohovo.eu/?nahlad=pirohy2026     → odomkne a zapamätá (localStorage)
     https://pirohovo.eu/?nahlad=off            → znova zamkne (zruší náhľad)

   Objednávky na obrazovke: Wolt / Bolt / telefón. */
(function () {
  "use strict";

  var UC_ON = false;                // ← ZAPNI / VYPNI overlay
  var PREVIEW_KEY = "pirohy2026";   // tajný token pre klientsky náhľad

  if (!UC_ON) return;

  // ── klientsky náhľad: ?nahlad=pirohy2026 odomkne (a zapamätá), ?nahlad=off zamkne
  try {
    var q = new URLSearchParams(location.search).get("nahlad");
    if (q === "off") { localStorage.removeItem("uc_preview"); }
    else if (q === PREVIEW_KEY) { localStorage.setItem("uc_preview", "1"); }
    if (localStorage.getItem("uc_preview") === "1") return;   // náhľad → normálny web
  } catch (e) {}

  // bypass na lokále / LAN (vývoj bez čakacej obrazovky)
  var H = location.hostname;
  if (H === "" || /^(localhost$|127\.|10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[01])\.)/.test(H) || /\.local$/.test(H)) return;

  window.__UC__ = true;             // poistka pre app.js (nespúšťať splash/easter-egg)
  document.documentElement.classList.add("uc-on");

  var WOLT = "https://wolt.com/sk/svk/bratislava/restaurant/pirohovo";
  var BOLT = "https://food.bolt.eu/sk-sk/326-bratislava/p/168875-pirohovo/";
  var TEL  = "tel:+421915671603";
  var MAPS = "https://maps.app.goo.gl/NEu2ToTrzShk7BaFA";
  var IG   = "https://www.instagram.com/pirohovo";
  var FB   = "https://www.facebook.com/pirohovo";

  var IG_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 1.44c-3.14 0-3.51.01-4.75.07-.99.04-1.53.21-1.89.35-.47.18-.81.4-1.17.76-.36.36-.58.7-.76 1.17-.14.36-.31.9-.35 1.89-.06 1.24-.07 1.61-.07 4.75s.01 3.51.07 4.75c.04.99.21 1.53.35 1.89.18.47.4.81.76 1.17.36.36.7.58 1.17.76.36.14.9.31 1.89.35 1.24.06 1.61.07 4.75.07s3.51-.01 4.75-.07c.99-.04 1.53-.21 1.89-.35.47-.18.81-.4 1.17-.76.36-.36.58-.7.76-1.17.14-.36.31-.9.35-1.89.06-1.24.07-1.61.07-4.75s-.01-3.51-.07-4.75c-.04-.99-.21-1.53-.35-1.89-.18-.47-.4-.81-.76-1.17-.36-.36-.7-.58-1.17-.76-.36-.14-.9-.31-1.89-.35-1.24-.06-1.61-.07-4.75-.07zm0 2.45a5.95 5.95 0 110 11.9 5.95 5.95 0 010-11.9zm0 9.81a3.86 3.86 0 100-7.72 3.86 3.86 0 000 7.72zm7.58-10.01a1.39 1.39 0 11-2.78 0 1.39 1.39 0 012.78 0z"/></svg>';
  var FB_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.02 4.39 11.01 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.88v2.26h3.32l-.53 3.49h-2.79v8.44C19.61 23.08 24 18.09 24 12.07z"/></svg>';
  var PIN_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';
  var PHONE_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 9.37 19.79 19.79 0 0 1 1.61.73 2 2 0 0 1 3.59 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';

  function isOpenNow() {
    var d = new Date(), day = d.getDay(), t = d.getHours() * 60 + d.getMinutes();
    return day !== 1 && t >= 11 * 60 && t < 20 * 60;
  }

  function statusHTML() {
    var open = isOpenNow();
    return '<span class="uc-status ' + (open ? 'is-open' : 'is-closed') + '">' +
             '<span class="uc-dot"></span>' +
             (open ? 'Otvorené teraz' : 'Teraz zatvorené') +
             ' · Ut–Ne 11–20' +
           '</span>';
  }

  function build() {
    if (document.getElementById("uc")) return;
    var o = document.createElement("div");
    o.id = "uc";
    o.setAttribute("role", "status");
    o.setAttribute("aria-label", "Stránka je dočasne v údržbe");
    o.innerHTML =
      '<div class="uc-pirohy" aria-hidden="true"></div>' +
      '<div class="uc-stage">' +
        '<div class="uc-brand">' +
          '<span class="uc-logo-wrap"><img class="uc-logo" src="images/logo.jpg" alt="Pirohovo logo" width="92" height="92"></span>' +
          '<img class="uc-wordmark" src="images/wordmark.png" alt="Pirohovo" width="753" height="267">' +
        '</div>' +
        '<div class="uc-piroh-hero" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 46" width="1em" height="0.72em" fill="none"><path d="M4 38 C4 38 2 36 4 30 C8 14 18 4 32 4 C46 4 56 14 60 30 C62 36 60 38 60 38 Z" fill="rgba(255,255,255,0.2)" stroke="white" stroke-width="2.2" stroke-linejoin="round"/><path d="M6 33 C8 27 7 24 10 22 C13 20 15 24 18 22 C21 20 22 17 25 15 C28 13 29 17 32 16 C35 15 36 19 39 17 C42 15 43 19 46 18 C49 17 50 21 53 20 C56 19 57 24 58 28" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1.5" stroke-linecap="round"/></svg></div>' +
        '<h1 class="uc-title">Chvíľu strpenia</h1>' +
        '<div class="uc-clock" id="uc-clock" aria-label="Aktuálny čas"></div>' +
        '<p class="uc-sub">Stránka je <b>dočasne v údržbe</b>. Čerstvé domáce pirohy si objednáš stále:</p>' +
        '<div class="uc-actions">' +
          '<a class="uc-btn uc-btn--wolt" href="' + WOLT + '" target="_blank" rel="noopener noreferrer"><img src="images/wolt-96.png" alt="">Wolt</a>' +
          '<a class="uc-btn uc-btn--bolt" href="' + BOLT + '" target="_blank" rel="noopener noreferrer"><img src="images/bolt-icon.png" alt="">Bolt</a>' +
          '<a class="uc-btn uc-btn--call" href="' + TEL + '">' + PHONE_SVG + 'Zavolať</a>' +
        '</div>' +
        '<div class="uc-meta">' +
          statusHTML() +
          '<a class="uc-addr" href="' + MAPS + '" target="_blank" rel="noopener noreferrer">' + PIN_SVG + 'Prešovská 349/38B, Bratislava</a>' +
        '</div>' +
        '<div class="uc-rating" aria-label="Hodnotenie 5,0 z 5 na Google, 59 recenzií">' +
          '<span class="uc-stars" aria-hidden="true">★★★★★</span> <b>5,0</b> · 59 recenzií Google' +
        '</div>' +
        '<div class="uc-social">' +
          '<a class="uc-soc" href="' + IG + '" target="_blank" rel="noopener noreferrer" aria-label="Instagram Pirohovo">' + IG_SVG + '</a>' +
          '<a class="uc-soc" href="' + FB + '" target="_blank" rel="noopener noreferrer" aria-label="Facebook Pirohovo">' + FB_SVG + '</a>' +
        '</div>' +
      '</div>';
    document.body.appendChild(o);

    // živé hodiny
    function tick() {
      var el = document.getElementById('uc-clock');
      if (!el) return;
      var d = new Date();
      var hh = String(d.getHours()).padStart(2, '0');
      var mm = String(d.getMinutes()).padStart(2, '0');
      var ss = String(d.getSeconds()).padStart(2, '0');
      el.textContent = hh + ':' + mm + ':' + ss;
      // Refresh open/closed status every minute (on second=0)
      if (d.getSeconds() === 0) {
        var statusEl = document.querySelector('#uc .uc-status');
        if (statusEl) {
          var open2 = isOpenNow();
          statusEl.className = 'uc-status ' + (open2 ? 'is-open' : 'is-closed');
          var textNode = statusEl.lastChild;
          if (textNode && textNode.nodeType === 3) {
            textNode.textContent = (open2 ? 'Otvorené teraz' : 'Teraz zatvorené') + ' · Ut–Ne 11–20';
          }
        }
      }
    }
    tick();
    setInterval(tick, 1000);

    // ambientné plávajúce pirohy na pozadí
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      var layer = o.querySelector('.uc-pirohy');
      var N = window.matchMedia('(max-width: 600px)').matches ? 12 : 22;
      for (var i = 0; i < N; i++) {
        var s = document.createElement('span');
        s.className = 'uc-piroh';
        s.setAttribute('aria-hidden', 'true');
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 64 46');
        svg.setAttribute('width', '1.4em');
        svg.setAttribute('height', '1em');
        svg.setAttribute('fill', 'none');
        svg.style.display = 'inline-block';
        svg.style.verticalAlign = 'middle';
        var path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path1.setAttribute('d', 'M4 38 C4 38 2 36 4 30 C8 14 18 4 32 4 C46 4 56 14 60 30 C62 36 60 38 60 38 Z');
        path1.setAttribute('fill', 'rgba(255,255,255,0.25)');
        path1.setAttribute('stroke', 'white');
        path1.setAttribute('stroke-width', '2');
        path1.setAttribute('stroke-linejoin', 'round');
        var path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path2.setAttribute('d', 'M6 33 C8 27 7 24 10 22 C13 20 15 24 18 22 C21 20 22 17 25 15 C28 13 29 17 32 16 C35 15 36 19 39 17 C42 15 43 19 46 18 C49 17 50 21 53 20 C56 19 57 24 58 28');
        path2.setAttribute('fill', 'none');
        path2.setAttribute('stroke', 'rgba(255,255,255,0.6)');
        path2.setAttribute('stroke-width', '1.5');
        path2.setAttribute('stroke-linecap', 'round');
        svg.appendChild(path1);
        svg.appendChild(path2);
        s.appendChild(svg);
        s.style.left = (Math.random() * 95 + 1) + '%';
        s.style.fontSize = (0.9 + Math.random() * 1.8) + 'rem';
        s.style.opacity = (0.10 + Math.random() * 0.18).toFixed(2);
        var dur = (14 + Math.random() * 16).toFixed(1);
        s.style.setProperty('--dur', dur + 's');
        s.style.setProperty('--delay', (-Math.random() * parseFloat(dur)).toFixed(1) + 's');
        s.style.setProperty('--r0', (Math.random() * 40 - 20).toFixed(0) + 'deg');
        s.style.setProperty('--r1', (Math.random() * 360 - 180).toFixed(0) + 'deg');
        layer.appendChild(s);
      }
    }
  }

  if (document.readyState !== "loading") build();
  else document.addEventListener("DOMContentLoaded", build);
})();
