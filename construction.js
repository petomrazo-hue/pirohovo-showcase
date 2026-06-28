/* ░░ PIROHOVO — UNDER CONSTRUCTION overlay (manuálny spínač) ░░
   Zapni:  UC_ON = true  + deploy (git push main)
   Vypni:  UC_ON = false + deploy

   NÁHĽAD PRE KLIENTA (vidí celý web aj keď je overlay zapnutý):
     https://pirohovo.eu/?nahlad=pirohy2026     → odomkne a zapamätá (localStorage)
     https://pirohovo.eu/?nahlad=off            → znova zamkne (zruší náhľad)

   Objednávky na obrazovke: Wolt / Bolt / telefón. */
(function () {
  "use strict";

  var UC_ON = true;                 // ← ZAPNI / VYPNI overlay
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
  var IG   = "https://www.instagram.com/pirohovo";
  var FB   = "https://www.facebook.com/pirohovo";

  function build() {
    if (document.getElementById("uc")) return;
    var o = document.createElement("div");
    o.id = "uc";
    o.setAttribute("role", "status");
    o.setAttribute("aria-label", "Stránka je dočasne v údržbe");
    o.innerHTML =
      '<div class="uc-stage">' +
        '<div class="uc-brand">' +
          '<img class="uc-logo" src="images/logo.jpg" alt="Pirohovo logo" width="88" height="88">' +
          '<img class="uc-wordmark" src="images/wordmark.png" alt="Pirohovo" width="753" height="267">' +
        '</div>' +
        '<span class="uc-kicker">Pracujeme na webe</span>' +
        '<h1 class="uc-title">Chvíľu strpenia 🥟</h1>' +
        '<p class="uc-sub">Stránka je <b>dočasne v údržbe</b>. Pirohy si objednáš stále — cez Wolt, Bolt alebo telefonicky:</p>' +
        '<div class="uc-actions">' +
          '<a class="uc-btn" href="' + WOLT + '" target="_blank" rel="noopener noreferrer"><img src="images/wolt-96.png" alt="">Wolt</a>' +
          '<a class="uc-btn" href="' + BOLT + '" target="_blank" rel="noopener noreferrer"><img src="images/bolt-icon.png" alt="">Bolt</a>' +
          '<a class="uc-btn uc-btn--call" href="' + TEL + '">Zavolať · 0915 671 603</a>' +
        '</div>' +
        '<div class="uc-social">' +
          '<a href="' + IG + '" target="_blank" rel="noopener noreferrer">Instagram</a>' +
          '<a href="' + FB + '" target="_blank" rel="noopener noreferrer">Facebook</a>' +
        '</div>' +
      '</div>';
    document.body.appendChild(o);
  }

  if (document.readyState !== "loading") build();
  else document.addEventListener("DOMContentLoaded", build);
})();
