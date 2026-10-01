/* Rare Kid shop: cart + order by WhatsApp
   - Customers pick black or white (+ size). It goes straight into the cart.
   - Checkout builds an order message with a unique order number and opens WhatsApp to you.
   - The cart empties once the order is sent to WhatsApp.
   EDIT HERE: */
var RK_SHOP = {
  whatsapp: '353899721947',          // your WhatsApp number, international format, no + or spaces
  price: 34.99,                      // price per tee in euro
  size: 'One size (oversized)',      // the only size
  // Garment measurements in cm, laid flat. Fill these in and a fit table appears on the site automatically.
  measurements: { chest: '', length: '', sleeve: '' },
  products: {
    black: { name: 'Black heavyweight oversized tee' },
    white: { name: 'White heavyweight oversized tee' }
  }
};

(function () {
  var KEY = 'rk_cart';
  var cart = load();

  function load() {
    try { var c = JSON.parse(localStorage.getItem(KEY)); if (Array.isArray(c)) return c; } catch (e) {}
    return [];
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} }
  function euro(n) { return '€' + n.toFixed(2); }
  function count() { return cart.reduce(function (s, i) { return s + i.qty; }, 0); }
  function subtotal() { return Math.round(count() * RK_SHOP.price * 100) / 100; }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  function add(colour, size) {
    var hit = cart.filter(function (i) { return i.colour === colour && i.size === size; })[0];
    if (hit) hit.qty += 1; else cart.push({ colour: colour, size: size, qty: 1 });
    save(); render();
    toast(RK_SHOP.products[colour].name.split(' ')[0] + ' tee added to your cart');
  }
  function change(idx, d) {
    cart[idx].qty += d;
    if (cart[idx].qty < 1) cart.splice(idx, 1);
    save(); render();
  }

  function render() {
    $$('[data-cart-count]').forEach(function (el) { el.textContent = count(); });
    var list = $('#cart-items'); if (!list) return;
    var empty = $('#cart-empty'), sum = $('#cart-summary'), form = $('#checkout');
    list.innerHTML = '';
    cart.forEach(function (it, i) {
      var li = document.createElement('li');
      li.className = 'cart-item';
      li.innerHTML =
        '<span class="swatch swatch-' + it.colour + '" aria-hidden="true"></span>' +
        '<div class="ci-main"><strong>' + RK_SHOP.products[it.colour].name + '</strong><span>One size, oversized · ' + euro(RK_SHOP.price) + ' each</span></div>' +
        '<div class="qty"><button type="button" aria-label="One less" data-q="' + i + '" data-d="-1">−</button><span>' + it.qty + '</span><button type="button" aria-label="One more" data-q="' + i + '" data-d="1">+</button></div>' +
        '<span class="ci-total">' + euro(it.qty * RK_SHOP.price) + '</span>';
      list.appendChild(li);
    });
    var has = cart.length > 0;
    empty.hidden = has; sum.hidden = !has; form.hidden = !has;
    $('#cart-sub').textContent = euro(subtotal());
    $('#cart-n').textContent = count() + (count() === 1 ? ' tee' : ' tees');
  }

  function orderNumber() {
    var d = new Date();
    var ymd = String(d.getFullYear()).slice(2) + ('0' + (d.getMonth() + 1)).slice(-2) + ('0' + d.getDate()).slice(-2);
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', r = '';
    var rnd = (window.crypto && crypto.getRandomValues) ? crypto.getRandomValues(new Uint32Array(5)) : [1,2,3,4,5].map(function(){return Math.floor(Math.random()*1e9);});
    for (var i = 0; i < 5; i++) r += chars[rnd[i] % chars.length];
    return 'RK-' + ymd + '-' + r;
  }

  function buildMessage(no, f) {
    var d = new Date();
    var when = ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear() + ' ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
    var lines = [
      '*NEW ORDER · RARE KID DROP 01*',
      'Order number: *' + no + '*',
      'Date: ' + when,
      '',
      '*ITEMS*'
    ];
    cart.forEach(function (it) {
      lines.push(it.qty + '× ' + RK_SHOP.products[it.colour].name + ', one size: ' + euro(it.qty * RK_SHOP.price));
    });
    lines.push('Each tee includes a hand-numbered card + 5 official Drop 01 stickers');
    lines.push('');
    lines.push('Subtotal: *' + euro(subtotal()) + '*');
    lines.push('Shipping: An Post, please confirm the cost for my location');
    lines.push('Payment method: *' + f.payment + '*');
    lines.push('');
    lines.push('*CUSTOMER*');
    lines.push('First name: ' + f.first);
    lines.push('Last name: ' + f.last);
    lines.push('Phone: ' + f.phone);
    lines.push('Email: ' + f.email);
    lines.push('Address: ' + [f.address, f.town, f.county, f.eircode].filter(Boolean).join(', '));
    lines.push('Notes: ' + (f.notes || 'None'));
    return lines.join('\n');
  }

  var toastEl, toastT;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl); }
    toastEl.innerHTML = msg + ' <a href="' + (document.getElementById('cart') ? '#cart' : '') + '">View cart</a>';
    toastEl.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('show'); }, 3200);
  }

  function boot() {
    // size pickers
    $$('[data-add]').forEach(function (b) {
      b.addEventListener('click', function () { add(b.getAttribute('data-add'), RK_SHOP.size); });
    });
    var m = RK_SHOP.measurements, mt = $('#fit-measure');
    if (mt && m.chest && m.length && m.sleeve) {
      $('#m-chest').textContent = m.chest + ' cm'; $('#m-length').textContent = m.length + ' cm'; $('#m-sleeve').textContent = m.sleeve + ' cm';
      mt.hidden = false;
    }
    var list = $('#cart-items');
    if (list) list.addEventListener('click', function (e) {
      var b = e.target.closest('[data-q]');
      if (b) change(+b.getAttribute('data-q'), +b.getAttribute('data-d'));
    });

    var form = $('#checkout');
    if (form) form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!cart.length) return;
      var v = function (n) { return (form.elements[n].value || '').trim(); };
      var f = { first: v('first'), last: v('last'), phone: v('phone'), email: v('email'), address: v('address'), town: v('town'), county: v('county'), eircode: v('eircode').toUpperCase(), notes: v('notes'), payment: (form.querySelector('input[name="payment"]:checked') || {}).value || 'Not chosen' };
      var no = orderNumber();
      var url = 'https://wa.me/' + RK_SHOP.whatsapp + '?text=' + encodeURIComponent(buildMessage(no, f));
      var w = null;
      try { w = window.open(url, '_blank'); } catch (err) {}
      if (w) { try { w.opener = null; } catch (err) {} }
      else { window.location.href = url; }
      // empty the cart once the order has been handed to WhatsApp
      cart = []; save(); render(); form.reset();
      var done = $('#order-done');
      $('#order-no').textContent = no;
      $('#order-link').href = url;
      done.hidden = false;
      done.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    render();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
