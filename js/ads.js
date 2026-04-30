/**
 * ads.js — Adsterra Ad Loader for VisaCalc
 *
 * Injects Adsterra banner ads into pre-defined .ad-slot containers.
 * Replace the atOptions keys below with your actual Adsterra zone IDs
 * once your site is approved.
 *
 * Slot types used on this site:
 *   Banner (728×90 / 320×50 mobile)  → class="ad-slot"
 *   Rectangle (300×250)               → class="ad-slot ad-slot--rect"
 *
 * How to get your zone keys:
 *   1. Log in to https://publishers.adsterra.com
 *   2. Create a new zone for each placement (Banner, Medium Rectangle)
 *   3. Copy the zone "key" value from the generated code snippet
 *   4. Paste them into ADSTERRA_ZONES below
 */

(function () {
  'use strict';

  // ─── Zone Configuration ────────────────────────────────────────────────────
  // Replace each key value with your real Adsterra zone key.
  // Leave as-is during development — ads won't load but slots will be styled.
  const ADSTERRA_ZONES = {
    banner: {
      key:    'YOUR_BANNER_ZONE_KEY',   // 728×90 desktop / 320×50 mobile
      width:  728,
      height: 90,
    },
    rectangle: {
      key:    'YOUR_RECT_ZONE_KEY',     // 300×250 medium rectangle
      width:  300,
      height: 250,
    },
  };
  // ───────────────────────────────────────────────────────────────────────────

  const IS_PLACEHOLDER = (
    ADSTERRA_ZONES.banner.key    === 'YOUR_BANNER_ZONE_KEY' ||
    ADSTERRA_ZONES.rectangle.key === 'YOUR_RECT_ZONE_KEY'
  );

  /**
   * Injects an Adsterra banner into the given container element.
   * @param {HTMLElement} container
   * @param {'banner'|'rectangle'} type
   */
  function injectAd(container, type) {
    const zone = ADSTERRA_ZONES[type];
    if (!zone) return;

    // Prevent double-injection
    if (container.dataset.adLoaded) return;
    container.dataset.adLoaded = '1';

    if (IS_PLACEHOLDER) {
      // Dev mode: show a labelled placeholder so layout is visible
      container.style.cssText += 'display:flex;align-items:center;justify-content:center;';
      container.textContent = `Ad (${zone.width}×${zone.height}) — Add Adsterra key to js/ads.js`;
      return;
    }

    // Create a wrapper so each ad gets its own atOptions scope
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display:inline-block;overflow:hidden;';
    container.appendChild(wrapper);

    // Adsterra's standard invocation pattern
    const optScript = document.createElement('script');
    optScript.type  = 'text/javascript';
    optScript.text  = `
      atOptions = {
        'key': '${zone.key}',
        'format': 'iframe',
        'height': ${zone.height},
        'width': ${zone.width},
        'params': {}
      };
    `;
    wrapper.appendChild(optScript);

    const invokeScript = document.createElement('script');
    invokeScript.type  = 'text/javascript';
    invokeScript.src   = `//www.highperformanceformat.com/${zone.key}/invoke.js`;
    invokeScript.async = true;
    wrapper.appendChild(invokeScript);
  }

  /**
   * Determines the zone type for a slot element.
   * Rectangles have the .ad-slot--rect modifier class.
   */
  function getZoneType(el) {
    return el.classList.contains('ad-slot--rect') ? 'rectangle' : 'banner';
  }

  /**
   * Initialise all ad slots on the current page.
   * Uses IntersectionObserver for lazy loading — ads only load when
   * the slot scrolls into (or near) the viewport.
   */
  function initAds() {
    const slots = document.querySelectorAll('.ad-slot');
    if (!slots.length) return;

    // Lazy load with a generous rootMargin so ads are ready before visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            injectAd(entry.target, getZoneType(entry.target));
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '200px 0px' }
    );

    slots.forEach((slot) => observer.observe(slot));
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAds);
  } else {
    initAds();
  }
})();
