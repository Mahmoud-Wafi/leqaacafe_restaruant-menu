(function () {
  var A = window.LeqaaAPI;
  var C = window.LEQAA_CONFIG || {};
  var LIFETIME = 1800;          // an order disappears 30 minutes after it was sent
  var POLL_MS = 4000;

  var S = { orders: [], fetchedAt: 0, seen: null, fresh: {}, muted: false, ctx: null, polling: false, timer: null,
            installEvt: null, wake: null, flash: null };

  function $(s) { return document.querySelector(s); }
  function h(tag, props) {
    var e = document.createElement(tag);
    for (var k in (props || {})) {
      var v = props[k];
      if (v == null || v === false) continue;
      if (k === 'class') e.className = v;
      else if (k === 'on') for (var ev in v) e.addEventListener(ev, v[ev]);
      else e.setAttribute(k, v === true ? '' : v);
    }
    for (var i = 2; i < arguments.length; i++) {
      var c = arguments[i];
      if (c == null || c === false) continue;
      e.append(c.nodeType ? c : document.createTextNode(c));
    }
    return e;
  }
  function toast(msg) {
    var el = h('div', { class: 'toast', role: 'status' }, msg);
    document.body.append(el);
    setTimeout(function () { el.remove(); }, 3500);
  }

  // ---------- sound ----------
  function audio() {
    if (!S.ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (AC) { try { S.ctx = new AC(); } catch (e) {} }
    }
    if (S.ctx && S.ctx.state === 'suspended') S.ctx.resume();
    return S.ctx;
  }
  function beep() {
    if (S.muted) return;
    var ctx = audio();
    if (!ctx || ctx.state !== 'running') return;
    [0, 0.28, 0.56].forEach(function (d, i) {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = i === 2 ? 1175 : 880;
      g.gain.setValueAtTime(0.0001, ctx.currentTime + d);
      g.gain.exponentialRampToValueAtTime(0.5, ctx.currentTime + d + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + d + 0.22);
      o.connect(g); g.connect(ctx.destination);
      o.start(ctx.currentTime + d); o.stop(ctx.currentTime + d + 0.25);
    });
  }
  function soundLabel() { $('#sound').textContent = S.muted ? 'الصوت: متوقف' : 'الصوت: يعمل'; }
  document.addEventListener('pointerdown', function () { audio(); }, { passive: true });
  $('#sound').addEventListener('click', function () {
    S.muted = !S.muted;
    try { localStorage.setItem('leqaa.captain.muted', S.muted ? '1' : '0'); } catch (e) {}
    soundLabel(); if (!S.muted) beep();
  });
  try { S.muted = localStorage.getItem('leqaa.captain.muted') === '1'; } catch (e) {}
  soundLabel();

  // ---------- keep the screen on while the page is open ----------
  function keepAwake() {
    if (!('wakeLock' in navigator) || S.wake || document.hidden) return;
    navigator.wakeLock.request('screen').then(function (l) {
      S.wake = l; l.addEventListener('release', function () { S.wake = null; });
    }).catch(function () {});
  }

  // ---------- orders ----------
  function remaining(o) { return LIFETIME - (o.age + (Date.now() - S.fetchedAt) / 1000); }
  function ageMin(o) { return Math.max(0, Math.floor((o.age + (Date.now() - S.fetchedAt) / 1000) / 60)); }
  function mins(n) { return n <= 0 ? 'أقل من دقيقة' : n === 1 ? 'دقيقة' : n === 2 ? 'دقيقتان' : n <= 10 ? n + ' دقائق' : n + ' دقيقة'; }
  var STATUS = { new: 'جديد', preparing: 'جاري التحضير', done: 'تم التسليم' };

  function sorted() {
    var rank = { new: 0, preparing: 1, done: 2 };
    return S.orders.slice().sort(function (a, b) { return rank[a.status] - rank[b.status] || a.age - b.age; });
  }

  function setStatus(o, st) {
    var prev = o.status; o.status = st; render();
    A.setOrderStatus(o.id, st).catch(function (e) {
      o.status = prev; render();
      if (e.status === 401) return logout('انتهت الجلسة. سجل الدخول من جديد.');
      toast('تعذر تغيير الحالة. حاول مرة أخرى.');
    });
  }

  function card(o) {
    var items = h('div', { class: 'oi-wrap' });
    var groups = [], byKey = {};
    (o.items || []).forEach(function (i) {
      var key = (i.sec || '') + '|' + (i.cat || '');
      if (!byKey[key]) { byKey[key] = { sec: i.sec, cat: i.cat, list: [] }; groups.push(byKey[key]); }
      byKey[key].list.push(i);
    });
    groups.forEach(function (g) {
      if (g.cat || g.sec) {
        items.append(h('div', { class: 'grp ' + (g.sec === 'cafe' ? 'cafe' : 'rest') },
          h('b', null, g.sec === 'cafe' ? 'الكافيه' : 'المطعم'), g.cat ? h('span', null, g.cat) : null));
      }
      var ul = h('ul', { class: 'oi' });
      g.list.forEach(function (i) {
        ul.append(h('li', null, h('span', { class: 'q' }, i.qty + '×'),
          h('span', { class: 'n' }, i.name, i.label ? h('small', null, i.label) : null)));
      });
      items.append(ul);
    });
    var hasNotes = !!(o.notes && o.notes.trim());
    var acts = h('div', { class: 'acts' });
    if (o.status === 'new') acts.append(h('button', { type: 'button', class: 'btn', on: { click: function () { setStatus(o, 'preparing'); } } }, 'بدء التحضير'));
    if (o.status !== 'done') acts.append(h('button', { type: 'button', class: 'btn go', on: { click: function () { setStatus(o, 'done'); } } }, 'تم التسليم'));
    var left = h('span', { 'data-left': o.id });
    var bar = h('i', { 'data-bar': o.id });
    return h('article', { class: 'order ' + o.status + (S.fresh[o.id] ? ' fresh' : ''), 'data-id': o.id },
      h('div', { class: 'oh' },
        h('div', { class: 'tbl' }, 'طاولة ' + o.table_no),
        h('div', { class: 'meta' }, h('b', null, '#' + o.code), h('br'),
          o.status === 'new' ? h('span', { class: 'pill' }, 'جديد') : h('span', null, STATUS[o.status]),
          ' ', h('span', { 'data-age': o.id }, ''))),
      h('div', { class: 'ob' }, items, h('div', { class: 'tot' }, h('span', null, 'الإجمالي'), h('span', null, Number(o.total) + ' ج'))),
      h('div', { class: hasNotes ? 'notes' : 'notes none' },
        h('span', { class: 'lbl' }, 'ملاحظات'),
        h('p', null, hasNotes ? o.notes : 'بدون ملاحظات')),
      h('div', { class: 'of' },
        h('div', { class: 'left' }, h('span', null, 'تختفي بعد'), left),
        h('div', { class: 'bar-t' }, bar), acts));
  }

  function tick() {
    var gone = false;
    S.orders.forEach(function (o) {
      var r = remaining(o);
      if (r <= 0) { gone = true; return; }
      var l = document.querySelector('[data-left="' + o.id + '"]');
      var b = document.querySelector('[data-bar="' + o.id + '"]');
      var a = document.querySelector('[data-age="' + o.id + '"]');
      if (l) l.textContent = mins(Math.ceil(r / 60));
      if (b) { b.style.width = Math.max(0, Math.min(100, r / LIFETIME * 100)) + '%'; b.classList.toggle('low', r < 300); }
      if (a) a.textContent = 'منذ ' + mins(ageMin(o));
    });
    if (gone) { S.orders = S.orders.filter(function (o) { return remaining(o) > 0; }); render(); }
  }

  function render() {
    var list = $('#orders'); list.textContent = '';
    var os = sorted();
    os.forEach(function (o) { list.append(card(o)); });
    $('#empty').hidden = os.length > 0;
    var n = os.filter(function (o) { return o.status === 'new'; }).length;
    $('#count').textContent = os.length ? (n ? n + ' طلب جديد' + ' من ' : '') + os.length + ' طلب' : '';
    if (!n) $('#count').textContent = os.length ? os.length + ' طلب، لا توجد طلبات جديدة' : '';
    document.title = (n ? '(' + n + ') ' : '') + 'شاشة الكابتن | لقاء';
    tick();
  }

  function alertNew(list) {
    var o = list[0];
    var msg = list.length === 1 ? 'طلب جديد - طاولة ' + o.table_no : list.length + ' طلبات جديدة';
    var b = $('#banner'); b.hidden = false; b.textContent = msg;
    setTimeout(function () { b.hidden = true; }, 12000);
    beep();
    if (navigator.vibrate) navigator.vibrate([250, 120, 250, 120, 500]);
    var on = true, n = 0;
    clearInterval(S.flash);
    S.flash = setInterval(function () {
      document.title = (on ? '🔔 ' + msg : 'شاشة الكابتن | لقاء'); on = !on;
      if (++n > 9) { clearInterval(S.flash); render(); }
    }, 700);
  }

  function setConn(ok) {
    var c = $('#conn');
    c.textContent = ok ? 'متصل - يتم التحديث تلقائياً' : 'لا يوجد اتصال - جاري المحاولة';
    c.className = ok ? 'conn' : 'conn off';
  }

  function poll() {
    if (S.polling || !A.hasSession()) return;
    S.polling = true;
    A.getOrders().then(function (rows) {
      S.polling = false;
      setConn(true);
      S.fetchedAt = Date.now();
      var fresh = [];
      S.orders = (rows || []).map(function (r) {
        if (S.seen && !S.seen[r.id] && r.status === 'new') fresh.push(r);
        return { id: r.id, code: r.code, table_no: r.table_no, items: r.items, notes: r.notes, total: r.total, status: r.status, age: r.age_seconds };
      });
      if (!S.seen) S.seen = {};
      S.orders.forEach(function (o) { S.seen[o.id] = true; });
      fresh.forEach(function (o) { S.fresh[o.id] = true; });
      render();
      if (fresh.length) alertNew(fresh);
    }).catch(function (e) {
      S.polling = false;
      if (e.status === 401) return logout('انتهت الجلسة. سجل الدخول من جديد.');
      setConn(false);
    });
  }
  function startPolling() {
    clearInterval(S.timer);
    S.timer = setInterval(function () { if (!document.hidden) poll(); }, POLL_MS);
    setInterval(tick, 15000);
    poll();
  }
  setInterval(function () { if (A.hasSession()) A.purgeOrders().catch(function () {}); }, 60000);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) { keepAwake(); poll(); } });

  // ---------- phone notifications ----------
  var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var standalone = (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
  var pushOK = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  var swReg = null;

  function b64ToBytes(s) {
    s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '=';
    var r = atob(s), a = new Uint8Array(r.length);
    for (var i = 0; i < r.length; i++) a[i] = r.charCodeAt(i);
    return a;
  }
  function pushMsg(t) { $('#push-msg').textContent = t || ''; }

  function pushUI(state) {
    var b = $('#push'); b.disabled = false;
    $('#push-test').hidden = state !== 'on';
    if (state === 'on') { b.textContent = 'إشعارات الهاتف مفعلة ✓'; b.disabled = true; pushMsg('ستصلك إشعارات الطلبات الجديدة حتى والشاشة مغلقة.'); }
    else if (state === 'denied') { b.textContent = 'الإشعارات محظورة'; b.disabled = true; pushMsg('فعّل الإشعارات لهذا الموقع من إعدادات الهاتف ثم أعد فتح الصفحة.'); }
    else if (state === 'ios') { b.textContent = 'تفعيل إشعارات الهاتف'; b.disabled = true; pushMsg('على الآيفون: أضف الصفحة إلى الشاشة الرئيسية أولاً (الخطوات بالأعلى).'); }
    else if (state === 'unsupported') { b.textContent = 'الإشعارات غير مدعومة'; b.disabled = true; pushMsg('هذا المتصفح لا يدعم إشعارات الهاتف. استخدم Chrome على أندرويد، أو Safari على آيفون بعد إضافته للشاشة الرئيسية.'); }
    else if (state === 'off') { b.textContent = 'إشعارات الهاتف غير مفعلة من الإدارة'; b.disabled = true; pushMsg(''); }
    else { b.textContent = 'تفعيل إشعارات الهاتف'; pushMsg('اضغط الزر ثم اختر "السماح".'); }
  }

  function subscribe(ask) {
    return swReg.pushManager.getSubscription().then(function (sub) {
      if (sub) return sub;
      return swReg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToBytes(C.VAPID_PUBLIC_KEY) });
    }).then(function (sub) {
      return A.saveSubscription(sub, A.email()).then(function () { return sub; });
    });
  }

  function setupPush() {
    $('#setup').hidden = false;
    $('#ios-help').hidden = !(isIOS && !standalone);
    if (!C.VAPID_PUBLIC_KEY) return pushUI('off');
    if (isIOS && !standalone) return pushUI('ios');
    if (!pushOK) return pushUI('unsupported');
    navigator.serviceWorker.register('/captain/sw.js', { scope: '/captain/' }).then(function () {
      return navigator.serviceWorker.ready;
    }).then(function (reg) {
      swReg = reg;
      if (Notification.permission === 'denied') return pushUI('denied');
      if (Notification.permission === 'granted') {
        return subscribe().then(function () { pushUI('on'); }).catch(function () { pushUI('ready'); });
      }
      pushUI('ready');
    }).catch(function () { pushUI('unsupported'); });
  }

  $('#push').addEventListener('click', function () {
    if (!swReg) return;
    $('#push').disabled = true; pushMsg('...');
    Notification.requestPermission().then(function (p) {
      if (p !== 'granted') return pushUI(p === 'denied' ? 'denied' : 'ready');
      return subscribe().then(function () { pushUI('on'); toast('تم تفعيل إشعارات الهاتف'); });
    }).catch(function (e) {
      pushUI('ready'); pushMsg('تعذر التفعيل: ' + (e && e.message ? e.message : 'حاول مرة أخرى.'));
    });
  });
  $('#push-test').addEventListener('click', function () {
    if (!swReg) return;
    swReg.showNotification('تجربة الإشعار', { body: 'هكذا ستظهر إشعارات الطلبات الجديدة', icon: '/icon-192.png', tag: 'test', dir: 'rtl', lang: 'ar' });
  });
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault(); S.installEvt = e; $('#install').hidden = false;
  });
  $('#install').addEventListener('click', function () {
    if (!S.installEvt) return;
    S.installEvt.prompt(); S.installEvt = null; $('#install').hidden = true;
  });

  // ---------- login ----------
  function showApp() {
    $('#login').hidden = true; $('#app').hidden = false;
    S.seen = null; S.orders = []; S.fresh = {};
    setConn(true); render(); keepAwake(); setupPush(); startPolling();
  }
  function logout(msg) {
    clearInterval(S.timer);
    A.logout(); $('#app').hidden = true; $('#login').hidden = false;
    $('#login-err').textContent = typeof msg === 'string' ? msg : '';
  }
  $('#login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    audio();
    $('#login-err').textContent = '';
    if (!A.configured()) { $('#setup-warn').hidden = false; return; }
    var email = $('#em').value.trim();
    A.login(email, $('#pw').value).then(function () {
      try { localStorage.setItem('leqaa.captain.email', email); } catch (x) {}
      $('#pw').value = '';
      showApp();
    }).catch(function (err) {
      $('#login-err').textContent = (err.status === 400 || err.status === 401) ? 'البريد أو كلمة المرور غير صحيحة' : 'تعذر الاتصال. حاول مرة أخرى.';
    });
  });
  $('#logout').addEventListener('click', function () { logout(); });

  try { $('#em').value = localStorage.getItem('leqaa.captain.email') || ''; } catch (e) {}
  if (!A.configured()) $('#setup-warn').hidden = false;
  else if (A.hasSession()) showApp();
})();
