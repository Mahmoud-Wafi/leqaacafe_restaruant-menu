(function () {
  var UI = {
    ar: {
      search: 'ابحث في المنيو', table: 'طاولة', call: 'اطلب ديليفري', sold: 'نفد',
      isNew: 'جديد', hot: 'الأكثر طلباً', spicy: 'حار', none: 'لا توجد نتائج مطابقة',
      empty: 'المنيو قيد التحديث، تفضل بسؤال الموظف.', contact: 'تواصل معنا',
      error: 'تعذر تحميل المنيو. تأكد من الاتصال بالإنترنت وحاول مرة أخرى.', switchTo: 'English',
      credit: 'تصميم م. محمود وافي',
      restaurant: 'المطعم', cafe: 'الكافيه', complaints: 'للشكاوى:',
      viewOrder: 'عرض الطلب', cartTitle: 'طلبك', close: 'إغلاق', add: 'إضافة', plus: 'زيادة', minus: 'نقصان',
      tableNo: 'رقم الطاولة', tableHint: 'اكتب رقم طاولتك', notes: 'ملاحظات',
      notesHint: 'اختياري، مثال: بدون بصل', total: 'الإجمالي', send: 'إرسال الطلب', sending: 'جاري الإرسال...',
      sentTitle: 'تم إرسال طلبك', sentBody: 'سيصلك الكابتن قريباً.', code: 'رقم الطلب', newOrder: 'طلب جديد',
      emptyCart: 'السلة فارغة. اضغط على السعر لإضافة صنف.', currency: 'ج',
      e_invalid_table: 'رقم الطاولة غير صحيح.', e_rate_limited: 'تم إرسال عدة طلبات من هذه الطاولة. انتظر بضع دقائق ثم حاول مرة أخرى.',
      e_ordering_paused: 'استقبال الطلبات متوقف مؤقتاً. اطلب من الكابتن.', e_item_unavailable: 'أحد الأصناف غير متاح الآن. حدّث الصفحة وراجع طلبك.',
      e_busy: 'المطعم مشغول الآن، حاول بعد لحظات.', e_invalid_items: 'الطلب غير صالح. راجع الأصناف والكميات.',
      e_notes_too_long: 'الملاحظات طويلة جداً.', e_not_configured: 'الطلب غير متاح الآن.',
      e_network: 'تعذر إرسال الطلب. تأكد من الإنترنت وحاول مرة أخرى.',
    },
    en: {
      search: 'Search the menu', table: 'Table', call: 'Order delivery', sold: 'Sold out',
      isNew: 'New', hot: 'Popular', spicy: 'Spicy', none: 'No matching items',
      empty: 'The menu is being updated. Please ask our staff.', contact: 'Contact us',
      error: 'Could not load the menu. Check your connection and try again.', switchTo: 'عربي',
      credit: 'Designed by Eng: Mahmoud Wafi',
      restaurant: 'Restaurant', cafe: 'Cafe', complaints: 'Complaints:',
      viewOrder: 'View order', cartTitle: 'Your order', close: 'Close', add: 'Add', plus: 'More', minus: 'Less',
      tableNo: 'Table number', tableHint: 'Enter your table number', notes: 'Notes',
      notesHint: 'Optional, for example: no onions', total: 'Total', send: 'Send order', sending: 'Sending...',
      sentTitle: 'Your order was sent', sentBody: 'Your captain will be with you shortly.', code: 'Order number', newOrder: 'New order',
      emptyCart: 'Your order is empty. Tap a price to add an item.', currency: 'EGP',
      e_invalid_table: 'This table number is not valid.', e_rate_limited: 'Several orders were sent from this table. Wait a few minutes and try again.',
      e_ordering_paused: 'Ordering is paused for now. Please ask your captain.', e_item_unavailable: 'An item is not available right now. Refresh the page and check your order.',
      e_busy: 'We are very busy right now. Try again in a moment.', e_invalid_items: 'This order is not valid. Check the items and quantities.',
      e_notes_too_long: 'The notes are too long.', e_not_configured: 'Ordering is not available right now.',
      e_network: 'Could not send the order. Check your connection and try again.',
    },
  };
  var SECTIONS = ['restaurant', 'cafe'];
  var CART_KEY = 'leqaa.cart';

  var state = { menu: null, lang: 'ar', q: '', section: 'restaurant', cart: [], table: '', sending: false, sent: null };
  var params = new URLSearchParams(location.search);
  try { if (localStorage.getItem('lang') === 'en') state.lang = 'en'; } catch (e) {}
  try {
    var sv = localStorage.getItem('leqaa.section'); if (SECTIONS.indexOf(sv) !== -1) state.section = sv;
    var cv = JSON.parse(localStorage.getItem(CART_KEY) || '[]'); if (Array.isArray(cv)) state.cart = cv;
    state.table = localStorage.getItem('leqaa.table') || '';
  } catch (e) {}
  if (SECTIONS.indexOf(params.get('s')) !== -1) state.section = params.get('s');
  var qt = params.get('table');
  if (qt && /^[0-9]{1,3}$/.test(qt)) state.table = String(parseInt(qt, 10));

  function $(s) { return document.querySelector(s); }
  function h(tag, props) {
    var e = document.createElement(tag);
    for (var k in (props || {})) {
      var v = props[k];
      if (v == null || v === false) continue;
      if (k === 'class') e.className = v;
      else if (k === 'on') for (var ev in v) e.addEventListener(ev, v[ev]);
      else if (k === 'value') e.value = v;
      else e.setAttribute(k, v === true ? '' : v);
    }
    for (var i = 2; i < arguments.length; i++) {
      var c = arguments[i];
      if (c == null || c === false) continue;
      e.append(c.nodeType ? c : document.createTextNode(c));
    }
    return e;
  }
  function t(k) { return UI[state.lang][k]; }
  function tx(o) { return (o && (o[state.lang] || o.ar || o.en)) || ''; }
  function ar(o) { return (o && (o.ar || o.en)) || ''; }
  function secOf(c) { return c.section === 'cafe' ? 'cafe' : 'restaurant'; }
  function hasPrice(item) {
    return (item.prices || []).some(function (p) { return p.price !== null && p.price !== '' && p.price !== undefined; });
  }
  function shown(item) { return item.visible !== false && hasPrice(item); }
  function orderingOn() { return state.menu && state.menu.settings.ordering !== false; }
  function maxTables() {
    var n = parseInt(state.menu && state.menu.settings.tables, 10);
    return n > 0 && n <= 999 ? n : 50;
  }

  // ---------- cart ----------
  function saveCart() { try { localStorage.setItem(CART_KEY, JSON.stringify(state.cart)); } catch (e) {} }
  function keyOf(id, v) { return id + ':' + v; }
  function qtyOf(id, v) {
    for (var i = 0; i < state.cart.length; i++) if (state.cart[i].id === id && state.cart[i].v === v) return state.cart[i].q;
    return 0;
  }
  function setQty(id, v, q) {
    state.cart = state.cart.filter(function (l) { return !(l.id === id && l.v === v); });
    if (q > 0) state.cart.push({ id: id, v: v, q: Math.min(q, 20) });
    saveCart();
  }
  function index() {
    var m = {};
    state.menu.categories.forEach(function (c) {
      c.items.forEach(function (i) { m[i.id] = i; });
    });
    return m;
  }
  // Cart lines resolved against the live menu. Items that were removed, hidden or sold out drop out.
  function lines() {
    var idx = index(), out = [];
    state.cart.forEach(function (l) {
      var it = idx[l.id];
      if (!it || !shown(it) || it.available === false) return;
      var p = it.prices[l.v];
      if (!p || p.price === null || p.price === '') return;
      out.push({ item: it, v: l.v, q: l.q, price: Number(p.price), label: p.label });
    });
    return out;
  }
  function totals() {
    var n = 0, sum = 0;
    lines().forEach(function (l) { n += l.q; sum += l.q * l.price; });
    return { n: n, sum: sum };
  }
  function countText(n) {
    if (state.lang === 'en') return n + (n === 1 ? ' item' : ' items');
    return n === 1 ? 'صنف واحد' : n === 2 ? 'صنفان' : n <= 10 ? n + ' أصناف' : n + ' صنف';
  }
  function money(n) { return n + ' ' + t('currency'); }

  function refreshBadges() {
    document.querySelectorAll('.pv[data-id]').forEach(function (b) {
      var q = qtyOf(b.getAttribute('data-id'), Number(b.getAttribute('data-v')));
      var badge = b.querySelector('.qty');
      b.classList.toggle('has', q > 0);
      if (q > 0) {
        if (!badge) { badge = h('span', { class: 'qty', 'aria-hidden': 'true' }); b.append(badge); }
        badge.textContent = String(q);
      } else if (badge) badge.remove();
    });
    renderBar();
  }
  function renderBar() {
    var bar = $('#cartbar'), call = $('#call');
    var tt = totals();
    var on = orderingOn() && tt.n > 0;
    bar.hidden = !on;
    if (on) {
      bar.textContent = '';
      bar.append(h('span', { class: 'n' }, String(tt.n)), h('span', null, t('viewOrder')), h('span', { class: 't' }, money(tt.sum)));
    }
    call.hidden = on || call.getAttribute('data-off') === '1';
  }

  // ---------- header ----------
  function setLang(l) {
    state.lang = l;
    try { localStorage.setItem('lang', l); } catch (e) {}
    render();
  }
  function renderHeader() {
    var s = state.menu.settings;
    document.documentElement.lang = state.lang;
    document.documentElement.dir = state.lang === 'ar' ? 'rtl' : 'ltr';
    document.title = tx(s.name) + ' | Menu';
    $('#name').textContent = tx(s.name);
    $('#logo').alt = tx(s.name);
    $('#tagline').textContent = tx(s.tagline);
    $('#note').textContent = tx(s.currencyNote);
    $('#lang').textContent = t('switchTo');
    $('#q').placeholder = t('search');
    $('#q').setAttribute('aria-label', t('search'));
    var chip = $('#table');
    if (state.table && params.get('table')) { chip.hidden = false; chip.textContent = t('table') + ' ' + state.table; }
    else chip.hidden = true;
  }

  // ---------- menu ----------
  function priceCell(item, p, v) {
    var out = item.available === false;
    var label = tx(p.label);
    var inner = [label ? h('small', null, label) : null, h('b', null, String(p.price))];
    if (!orderingOn()) return h('span', { class: 'pv' }, inner[0], inner[1]);
    var q = qtyOf(item.id, v);
    var b = h('button', {
      type: 'button', class: 'pv' + (q > 0 ? ' has' : ''), 'data-id': item.id, 'data-v': String(v),
      disabled: out ? true : null,
      'aria-label': t('add') + ': ' + tx(item.name) + (label ? ' ' + label : '') + ' ' + p.price,
      on: { click: function () { setQty(item.id, v, qtyOf(item.id, v) + 1); refreshBadges(); } },
    }, inner[0], inner[1]);
    if (q > 0) b.append(h('span', { class: 'qty', 'aria-hidden': 'true' }, String(q)));
    return b;
  }
  function itemRow(item) {
    var out = item.available === false;
    var d = (item.desc && (state.lang === 'ar' ? item.desc.ar : item.desc.en)) || '';
    var name = h('span', { class: 'name' }, tx(item.name));
    if (item.badge === 'new') name.append(h('span', { class: 'badge new' }, t('isNew')));
    if (item.badge === 'popular') name.append(h('span', { class: 'badge hot' }, t('hot')));
    if (item.badge === 'spicy') name.append(h('span', { class: 'badge hot' }, t('spicy')));
    if (out) name.append(h('span', { class: 'badge sold' }, t('sold')));

    var prices = h('span', { class: 'prices' });
    (item.prices || []).forEach(function (p, v) {
      if (p.price === null || p.price === '' || p.price === undefined) return;
      prices.append(priceCell(item, p, v));
    });
    var li = h('li', { class: 'item' + (out ? ' out' : '') });
    if (item.image) li.append(h('img', { src: item.image, alt: '', loading: 'lazy', width: 64, height: 64 }));
    li.append(h('div', { class: 'body' },
      h('div', { class: 'line' }, name, h('span', { class: 'lead', 'aria-hidden': 'true' }), prices),
      d ? h('p', { class: 'desc' }, d) : null));
    return li;
  }
  function matches(item, q) {
    if (!q) return true;
    var hay = [item.name.ar, item.name.en, item.desc && item.desc.ar, item.desc && item.desc.en].join(' ').toLowerCase();
    return hay.indexOf(q) !== -1;
  }

  function visibleCats() {
    return state.menu.categories.filter(function (c) {
      return c.visible !== false && c.items.some(shown);
    });
  }
  function renderTabs() {
    var box = $('#tabs'), q = state.q.trim();
    var present = SECTIONS.filter(function (s) { return visibleCats().some(function (c) { return secOf(c) === s; }); });
    if (present.indexOf(state.section) === -1 && present.length) state.section = present[0];
    box.textContent = '';
    box.hidden = present.length < 2 || !!q;
    present.forEach(function (s) {
      box.append(h('button', {
        type: 'button', role: 'tab', 'aria-selected': s === state.section ? 'true' : 'false',
        on: { click: function () {
          state.section = s;
          try { localStorage.setItem('leqaa.section', s); } catch (e) {}
          renderTabs(); renderMenu();
          var top = $('#menu').getBoundingClientRect().top + window.pageYOffset - ($('#stick').offsetHeight || 112) - 8;
          window.scrollTo({ top: Math.max(0, top), behavior: 'auto' });
        } },
      }, t(s)));
    });
    syncStick();
  }
  function syncStick() {
    var hgt = $('#stick').offsetHeight || 112;
    document.documentElement.style.setProperty('--stick', (hgt + 8) + 'px');
  }

  function renderMenu() {
    var main = $('#menu'), cats = $('#cats');
    main.textContent = ''; cats.textContent = '';
    var q = state.q.trim().toLowerCase();
    var any = false;
    var split = !q && !$('#tabs').hidden;

    state.menu.categories.forEach(function (c) {
      if (c.visible === false) return;
      if (split && secOf(c) !== state.section) return;
      var items = c.items.filter(function (i) { return shown(i) && matches(i, q); });
      if (!items.length) return;
      any = true;
      var sid = 'cat-' + c.id;
      var ul = h('ul', { class: 'items' });
      items.forEach(function (i) { ul.append(itemRow(i)); });
      main.append(h('section', { class: 'panel', id: sid }, h('h2', null, tx(c.name)), ul));
      cats.append(h('a', { href: '#' + sid, 'data-for': sid }, tx(c.name)));
    });
    if (!any) main.append(h('p', { class: 'state' }, q ? t('none') : t('empty')));
    syncStick();
    spy();
    renderBar();
  }

  var io = null;
  function spy() {
    if (io) io.disconnect();
    if (!('IntersectionObserver' in window)) return;
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = en.target.id;
        document.querySelectorAll('.cats a').forEach(function (a) {
          var on = a.getAttribute('data-for') === id;
          a.classList.toggle('on', on);
          if (on) {
            var bar = $('#cats');
            bar.scrollTo({ left: a.offsetLeft - bar.clientWidth / 2 + a.clientWidth / 2, behavior: 'smooth' });
          }
        });
      });
    }, { rootMargin: '-' + (($('#stick').offsetHeight || 112) + 12) + 'px 0px -60% 0px' });
    document.querySelectorAll('.panel').forEach(function (p) { io.observe(p); });
  }

  function renderFooter() {
    var s = state.menu.settings, foot = $('#foot');
    foot.textContent = '';
    foot.append(h('h3', null, t('contact')));
    if (tx(s.address)) foot.append(h('p', null, tx(s.address)));
    var phones = (s.phones || []).filter(Boolean);
    if (phones.length) {
      var box = h('div', { class: 'phones' });
      phones.forEach(function (p) { box.append(h('a', { href: 'tel:' + p.replace(/\s+/g, '') }, p)); });
      foot.append(box);
    }
    if (s.complaints) {
      foot.append(h('p', { class: 'complaints' }, t('complaints') + ' ',
        h('a', { href: 'tel:' + String(s.complaints).replace(/\s+/g, '') }, s.complaints)));
    }
    foot.append(h('p', { class: 'credit' }, h('span', null, t('credit')),
      h('a', { href: 'tel:01127603628' }, '01127603628')));

    var call = $('#call');
    if (s.delivery !== false && phones.length) {
      call.setAttribute('data-off', '0');
      call.href = 'tel:' + phones[0].replace(/\s+/g, '');
      call.textContent = '';
      call.append(t('call'), h('span', null, phones[0]));
    } else { call.setAttribute('data-off', '1'); }
  }

  // ---------- order sheet ----------
  var dlg = $('#cart');
  function openCart() {
    state.sent = null;
    renderCart();
    if (!dlg.open) dlg.showModal();
  }
  function closeCart() { if (dlg.open) dlg.close(); }

  function renderCart() {
    var body = $('#cart-body');
    $('#cart-title').textContent = t('cartTitle');
    var cb = $('#cart-close'); cb.textContent = t('close');
    body.textContent = '';

    if (state.sent) {
      body.append(h('div', { class: 'done' },
        h('div', { class: 'tick', 'aria-hidden': 'true' }, '✓'),
        h('h3', null, t('sentTitle')),
        h('p', null, t('table') + ' ' + state.sent.table),
        h('p', null, t('code')),
        h('div', { class: 'code' }, state.sent.code),
        h('p', null, t('sentBody')),
        h('button', { type: 'button', class: 'ghost', on: { click: function () { state.sent = null; closeCart(); } } }, t('newOrder'))));
      return;
    }

    var ls = lines();
    if (!ls.length) {
      body.append(h('p', { class: 'empty-cart' }, t('emptyCart')),
        h('button', { type: 'button', class: 'ghost', on: { click: closeCart } }, t('close')));
      return;
    }

    var ul = h('ul', { class: 'lines' });
    ls.forEach(function (l) {
      var lab = tx(l.label);
      ul.append(h('li', { class: 'cl' },
        h('div', { class: 'nm' }, tx(l.item.name), lab ? h('small', null, lab) : null),
        h('div', { class: 'step' },
          h('button', { type: 'button', 'aria-label': t('minus'), on: { click: function () { setQty(l.item.id, l.v, l.q - 1); refreshBadges(); renderCart(); } } }, '−'),
          h('output', null, String(l.q)),
          h('button', { type: 'button', 'aria-label': t('plus'), on: { click: function () { setQty(l.item.id, l.v, l.q + 1); refreshBadges(); renderCart(); } } }, '+')),
        h('div', { class: 'pr' }, money(l.q * l.price))));
    });
    body.append(ul, h('div', { class: 'sum' }, h('span', null, t('total')), h('b', null, money(totals().sum))));

    var tableIn = h('input', {
      id: 'c-table', type: 'text', inputmode: 'numeric', pattern: '[0-9]*', maxlength: '3', autocomplete: 'off',
      value: state.table || '', required: true, 'aria-describedby': 'c-table-hint',
    });
    var notesIn = h('textarea', { id: 'c-notes', maxlength: '300', rows: '3', value: state.notesDraft || '', 'aria-describedby': 'c-notes-hint' });
    var err = h('p', { class: 'err', id: 'c-err', role: 'alert' });
    var send = h('button', { type: 'button', class: 'send', id: 'c-send' }, t('send'));
    notesIn.addEventListener('input', function () { state.notesDraft = notesIn.value; });

    send.addEventListener('click', function () {
      err.textContent = '';
      var tb = tableIn.value.trim();
      if (!/^[0-9]{1,3}$/.test(tb) || parseInt(tb, 10) < 1 || parseInt(tb, 10) > maxTables()) {
        err.textContent = t('e_invalid_table'); tableIn.focus(); return;
      }
      tb = String(parseInt(tb, 10));
      state.table = tb;
      try { localStorage.setItem('leqaa.table', tb); } catch (e) {}
      var payload = lines().map(function (l) {
        return { id: l.item.id, name: ar(l.item.name), label: ar(l.label), qty: l.q, price: l.price };
      });
      if (!payload.length || state.sending) return;
      state.sending = true; send.disabled = true; send.textContent = t('sending');
      window.LeqaaAPI.placeOrder(tb, payload, notesIn.value.trim()).then(function (r) {
        state.sending = false;
        state.cart = []; saveCart(); state.notesDraft = '';
        state.sent = { code: (r && r.code) || '', table: tb };
        refreshBadges(); renderCart();
      }).catch(function (e) {
        state.sending = false; send.disabled = false; send.textContent = t('send');
        var k = 'e_' + e.message;
        err.textContent = UI[state.lang][k] || t('e_network');
      });
    });

    body.append(
      h('label', { class: 'f' }, h('span', null, t('tableNo')), tableIn,
        h('small', { class: 'hint', id: 'c-table-hint' }, t('tableHint') + ' (1 - ' + maxTables() + ')')),
      h('label', { class: 'f' }, h('span', null, t('notes')), notesIn,
        h('small', { class: 'hint', id: 'c-notes-hint' }, t('notesHint'))),
      err, send);
  }

  $('#cartbar').addEventListener('click', openCart);
  $('#cart-close').addEventListener('click', closeCart);
  dlg.addEventListener('click', function (e) { if (e.target === dlg) closeCart(); });

  // ---------- main ----------
  function render() {
    renderHeader();
    renderTabs();
    renderMenu();
    renderFooter();
    renderBar();
    if (dlg.open) renderCart();
  }

  function load() {
    window.LeqaaAPI.getMenu()
      .then(function (m) { state.menu = m; render(); })
      .catch(function () {
        var el = $('#loading');
        if (el) el.textContent = UI[state.lang].error;
      });
  }

  $('#lang').addEventListener('click', function () { setLang(state.lang === 'ar' ? 'en' : 'ar'); });
  var timer;
  $('#q').addEventListener('input', function (e) {
    clearTimeout(timer);
    var v = e.target.value;
    timer = setTimeout(function () { state.q = v; if (state.menu) { renderTabs(); renderMenu(); } }, 120);
  });
  window.addEventListener('resize', function () { if (state.menu) syncStick(); });

  document.documentElement.lang = state.lang;
  document.documentElement.dir = state.lang === 'ar' ? 'rtl' : 'ltr';
  load();
})();
