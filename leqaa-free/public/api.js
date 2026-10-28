// Data layer: talks to Supabase over plain HTTPS (no libraries needed).
// Without a configured Supabase project it falls back to /seed-menu.json (read-only preview).
(function () {
  var C = window.LEQAA_CONFIG || {};
  var base = String(C.SUPABASE_URL || '').replace(/\/+$/, '');
  var key = String(C.SUPABASE_ANON_KEY || '');
  var SK = window.LEQAA_SESSION_KEY || 'leqaa.session';
  var api = { lastFromSeed: false };

  api.configured = function () {
    return /^https?:\/\//.test(base) && base.indexOf('YOUR-PROJECT') === -1 && key.length > 20 && key.indexOf('PASTE-') === -1;
  };

  function loadSes() { try { return JSON.parse(localStorage.getItem(SK) || 'null'); } catch (e) { return null; } }
  function saveSes(s) {
    try { if (s) localStorage.setItem(SK, JSON.stringify(s)); else localStorage.removeItem(SK); } catch (e) {}
  }
  function hdr(token, extra) {
    var h = { apikey: key };
    if (token) h.Authorization = 'Bearer ' + token;
    for (var k in (extra || {})) h[k] = extra[k];
    return h;
  }
  function authErr() { var e = new Error('Not signed in'); e.status = 401; return e; }
  function request(url, opts) {
    return fetch(url, opts).then(function (r) {
      return r.text().then(function (tx) {
        var j = null;
        try { j = tx ? JSON.parse(tx) : null; } catch (e) {}
        if (!r.ok) {
          var m = (j && (j.msg || j.error_description || j.message || j.error)) || ('HTTP ' + r.status);
          var err = new Error(m); err.status = r.status; throw err;
        }
        return j;
      });
    });
  }
  function fromToken(j, email) {
    var s = {
      access: j.access_token, refresh: j.refresh_token,
      exp: Date.now() + (j.expires_in || 3600) * 1000 - 30000,
      email: email || (j.user && j.user.email) || '',
    };
    saveSes(s);
    return s;
  }
  function token() {
    var s = loadSes();
    if (!s) return Promise.reject(authErr());
    if (Date.now() < s.exp) return Promise.resolve(s.access);
    return request(base + '/auth/v1/token?grant_type=refresh_token', {
      method: 'POST', headers: hdr(null, { 'Content-Type': 'application/json' }),
      body: JSON.stringify({ refresh_token: s.refresh }),
    }).then(function (j) { return fromToken(j, s.email).access; })
      .catch(function () { saveSes(null); throw authErr(); });
  }

  api.hasSession = function () { return !!loadSes(); };
  api.email = function () { var s = loadSes(); return s ? s.email : ''; };
  api.logout = function () { saveSes(null); };

  api.login = function (email, password) {
    return request(base + '/auth/v1/token?grant_type=password', {
      method: 'POST', headers: hdr(null, { 'Content-Type': 'application/json' }),
      body: JSON.stringify({ email: email, password: password }),
    }).then(function (j) { return fromToken(j, email); });
  };

  function seed() {
    return fetch('/seed-menu.json', { cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error('seed');
      return r.json();
    });
  }
  api.getMenu = function () {
    api.lastFromSeed = false;
    if (!api.configured()) { api.lastFromSeed = true; return seed(); }
    return request(base + '/rest/v1/menu?id=eq.1&select=data', { headers: hdr(null), cache: 'no-store' })
      .then(function (rows) {
        if (rows && rows[0] && rows[0].data) return rows[0].data;
        api.lastFromSeed = true;
        return seed();
      });
  };

  api.saveMenu = function (menu) {
    return token().then(function (tk) {
      return request(base + '/rest/v1/menu?on_conflict=id', {
        method: 'POST',
        headers: hdr(tk, { 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' }),
        body: JSON.stringify({ id: 1, data: menu, updated_at: new Date().toISOString() }),
      });
    }).then(function () { api.lastFromSeed = false; });
  };

  api.uploadPhoto = function (blob) {
    var name = Date.now().toString(36) + Math.random().toString(36).slice(2, 8) + '.jpg';
    return token().then(function (tk) {
      return request(base + '/storage/v1/object/menu-photos/' + name, {
        method: 'POST', headers: hdr(tk, { 'Content-Type': 'image/jpeg' }), body: blob,
      });
    }).then(function () { return base + '/storage/v1/object/public/menu-photos/' + name; });
  };

  api.changePassword = function (next) {
    return token().then(function (tk) {
      return request(base + '/auth/v1/user', {
        method: 'PUT', headers: hdr(tk, { 'Content-Type': 'application/json' }),
        body: JSON.stringify({ password: next }),
      });
    });
  };

  // ---------- orders ----------
  // Customers send an order through one database function that checks everything.
  function deviceId() {
    try {
      var d = localStorage.getItem('leqaa.device');
      if (!d) {
        d = Math.random().toString(36).slice(2) + Date.now().toString(36);
        localStorage.setItem('leqaa.device', d);
      }
      return d;
    } catch (e) { return ''; }
  }
  api.placeOrder = function (table, items, notes) {
    if (!api.configured()) { var e = new Error('not_configured'); e.status = 0; return Promise.reject(e); }
    return request(base + '/rest/v1/rpc/place_order', {
      method: 'POST', headers: hdr(null, { 'Content-Type': 'application/json' }),
      body: JSON.stringify({ p_table: String(table), p_items: items, p_notes: notes || '', p_device: deviceId() }),
    });
  };

  // Captain: orders from the last 30 minutes (the database hides older ones).
  api.getOrders = function () {
    return token().then(function (tk) {
      return request(base + '/rest/v1/rpc/captain_orders', {
        method: 'POST', headers: hdr(tk, { 'Content-Type': 'application/json' }), body: '{}', cache: 'no-store',
      });
    });
  };
  api.setOrderStatus = function (id, status) {
    return token().then(function (tk) {
      return request(base + '/rest/v1/orders?id=eq.' + encodeURIComponent(id), {
        method: 'PATCH', headers: hdr(tk, { 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
        body: JSON.stringify({ status: status }),
      });
    });
  };
  api.purgeOrders = function () {
    return token().then(function (tk) {
      return request(base + '/rest/v1/rpc/purge_old_orders', {
        method: 'POST', headers: hdr(tk, { 'Content-Type': 'application/json' }), body: '{}',
      });
    });
  };

  // Captain: phone notification subscription.
  api.saveSubscription = function (sub, email) {
    var j = sub.toJSON ? sub.toJSON() : sub;
    return token().then(function (tk) {
      return request(base + '/rest/v1/push_subscriptions?on_conflict=endpoint', {
        method: 'POST',
        headers: hdr(tk, { 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' }),
        body: JSON.stringify({ endpoint: j.endpoint, p256dh: j.keys.p256dh, auth: j.keys.auth, email: email || '' }),
      });
    });
  };
  api.deleteSubscription = function (endpoint) {
    return token().then(function (tk) {
      return request(base + '/rest/v1/push_subscriptions?endpoint=eq.' + encodeURIComponent(endpoint), {
        method: 'DELETE', headers: hdr(tk, { Prefer: 'return=minimal' }),
      });
    });
  };

  window.LeqaaAPI = api;
})();
