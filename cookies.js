/* ░░ Cookie consent — config shim pre pirohovo.eu ░░
   Zdieľané jadro CMP je v consent-core.js (kanonický zdroj: LAB/001projects/cookie-consent/).
   Tu nastavíme len Google Consent Mode v2 default + konfiguráciu nástrojov,
   a potom dotiahneme jadro. */
(function () {
  "use strict";

  // ── Google Consent Mode v2 — default „denied" (pred akýmkoľvek tagom) ──
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;
  gtag("consent", "default", {
    ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
    analytics_storage: "denied", personalization_storage: "denied",
    functionality_storage: "granted", security_storage: "granted",
    wait_for_update: 500
  });
  gtag("js", new Date());

  // ── Konfigurácia ──
  window.__consentConfig = {
    version: 1,
    expiryDays: 180,
    theme: "dark",
    policyUrl: "gdpr.html",
    text: {
      intro:
        "Táto stránka používa cookies, aby fungovala správne, a — s tvojím súhlasom — aj " +
        "na meranie návštevnosti a marketing, vďaka ktorým ti vieme zlepšovať obsah a " +
        "ukazovať relevantnejšie reklamy. Súhlas vieš kedykoľvek zmeniť alebo odvolať."
    },
    tools: {
      ga4:       { id: "",                 category: "analytics" },   /* doplniť G-XXXXXXXXXX */
      googleAds: {
        id: "AW-18272862336",              // Google Ads (účet 950-659-3315)
        category: "marketing",
        advancedConsent: true,             // Advanced Consent Mode: tag sa načíta hneď (consent default denied)
        conversions: {
          /* doplniť Pirohovo konverzný label po vytvorení akcie v Google Ads */
          lead_call:     "",
          lead_whatsapp: ""
        }
      }
    }
  };

  // ── Dotiahni zdieľané jadro ──
  var s = document.createElement("script");
  s.src = "consent-core.js?v=5";
  s.async = true;
  document.head.appendChild(s);
})();
