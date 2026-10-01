/* Rare Kid sign-up forms -> Formspree (form xgavbbvg)
   Sends in the background so visitors stay on the page.
   If JavaScript is off, the form still posts normally to Formspree. */
(function () {
  var forms = document.querySelectorAll('form[data-formspree]');
  Array.prototype.forEach.call(forms, function (form) {
    var status = form.querySelector('.form-status');
    var btn = form.querySelector('button[type="submit"]');
    var label = btn ? btn.textContent : '';
    function show(msg, ok) {
      if (!status) return;
      status.textContent = msg;
      status.className = 'form-status ' + (ok ? 'ok' : 'err');
      status.hidden = false;
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      if (status) status.hidden = true;
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, d: d }; }); })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            show("You're on the list. When the next drop lands, you'll hear first.", true);
          } else {
            var msg = (res.d && res.d.errors && res.d.errors.length) ? res.d.errors.map(function (x) { return x.message; }).join('. ') : '';
            show((msg ? msg + '. ' : '') + "That didn't go through. Check your email address and try again, or message us on WhatsApp.", false);
          }
        })
        .catch(function () {
          show("No connection right now. Try again in a moment, or message us on WhatsApp.", false);
        })
        .then(function () { if (btn) { btn.disabled = false; btn.textContent = label; } });
    });
  });
})();
