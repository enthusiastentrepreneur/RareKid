/* Rare Kid cookie consent (Ireland / EU: GDPR + ePrivacy, DPC guidance)
   - Nothing optional runs until the visitor says yes.
   - "Reject all" is exactly as prominent as "Accept all".
   - Choices are remembered for 6 months, then we ask again.
   - Visitors can change their mind any time via "Cookie settings" in the footer.

   ADDING ANALYTICS OR ADS LATER:
   Put the tracking code inside RareKidConsent.onAllow('analytics', function(){ ... })
   (or 'marketing') at the bottom of this file. It will only run after consent. */
(function () {
  var KEY = 'rk_consent';
  var VERSION = 1;
  var MAX_AGE = 1000 * 60 * 60 * 24 * 182; // ~6 months
  var root = (document.currentScript && document.currentScript.getAttribute('data-root')) || '';
  var waiting = { analytics: [], marketing: [] };
  var state = null;

  function read() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY));
      if (s && s.v === VERSION && Date.now() - s.ts < MAX_AGE) return s;
    } catch (e) {}
    return null;
  }
  function save(analytics, marketing) {
    state = { v: VERSION, ts: Date.now(), necessary: true, analytics: !!analytics, marketing: !!marketing };
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
    run();
    close();
  }
  function run() {
    ['analytics', 'marketing'].forEach(function (c) {
      if (state && state[c]) { while (waiting[c].length) { try { waiting[c].shift()(); } catch (e) {} } }
    });
  }

  var box;
  function close() { if (box) { box.remove(); box = null; } }
  function open(showSettings) {
    close();
    var cur = state || { analytics: false, marketing: false };
    box = document.createElement('div');
    box.className = 'cc';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-live', 'polite');
    box.setAttribute('aria-labelledby', 'cc-title');
    box.innerHTML =
      '<h2 id="cc-title">Your privacy, your call</h2>' +
      '<p>We use only what this site needs to work. No tracking or advertising cookies unless you say yes. ' +
      'Read our <a href="' + root + 'privacy.html">Privacy &amp; Cookie Policy</a>.</p>' +
      '<div class="cc-opts"' + (showSettings ? '' : ' hidden') + '>' +
        '<label><input type="checkbox" checked disabled> <span><strong>Strictly necessary</strong>: remembers this choice. Always on.</span></label>' +
        '<label><input type="checkbox" id="cc-analytics"' + (cur.analytics ? ' checked' : '') + '> <span><strong>Analytics</strong>: helps us see which pages people visit. Off unless you turn it on.</span></label>' +
        '<label><input type="checkbox" id="cc-marketing"' + (cur.marketing ? ' checked' : '') + '> <span><strong>Marketing</strong>: lets us measure ads on social media. Off unless you turn it on.</span></label>' +
      '</div>' +
      '<div class="cc-actions">' +
        '<button type="button" class="btn ghost" data-cc="reject">Reject all</button>' +
        '<button type="button" class="btn ghost" data-cc="accept">Accept all</button>' +
      '</div>' +
      '<p style="margin:14px 0 0;text-align:center"><button type="button" class="cc-link" data-cc="settings">' + (showSettings ? 'Save my choices' : 'Choose cookies') + '</button></p>';
    document.body.appendChild(box);
    box.addEventListener('click', function (e) {
      var a = e.target.getAttribute('data-cc');
      if (a === 'reject') save(false, false);
      if (a === 'accept') save(true, true);
      if (a === 'settings') {
        var opts = box.querySelector('.cc-opts');
        if (opts.hidden) { opts.hidden = false; e.target.textContent = 'Save my choices'; }
        else save(box.querySelector('#cc-analytics').checked, box.querySelector('#cc-marketing').checked);
      }
    });
  }

  window.RareKidConsent = {
    get: function () { return state; },
    open: function () { open(true); },
    onAllow: function (category, fn) { waiting[category].push(fn); run(); }
  };

  state = read();
  function boot() {
    document.querySelectorAll('[data-cookie-settings]').forEach(function (b) {
      b.addEventListener('click', function (e) { e.preventDefault(); open(true); });
    });
    if (!state) open(false);
    else run();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();

/* Example (keep commented out until you add a tool):
RareKidConsent.onAllow('analytics', function () {
  // paste your analytics script loader here
});
*/
