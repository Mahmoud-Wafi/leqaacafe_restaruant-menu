(function () {
  // ---------- i18n ----------
  var D = {
    ar: {
      loginTitle: 'لوحة تحكم المنيو', email: 'البريد الإلكتروني', password: 'كلمة المرور',
      notConfigured: 'الموقع غير متصل بقاعدة البيانات بعد. افتح ملف config.js وأضف بيانات Supabase (راجع الدليل).',
      backup: 'نسخة احتياطية', backupHint: 'حمّل نسخة من المنيو على جهازك، أو استرجع نسخة قديمة. بعد الاسترجاع اضغط "نشر التغييرات".',
      exportBtn: 'تحميل نسخة', importBtn: 'استرجاع نسخة', importOk: 'تم تحميل النسخة. اضغط "نشر التغييرات" لتطبيقها.', importBad: 'الملف غير صالح.',
      seedLoaded: 'هذا هو المنيو المبدئي. اضغط "نشر التغييرات" لحفظه.', loadFail: 'تعذر تحميل المنيو.', signIn: 'دخول', wrong: 'كلمة المرور غير صحيحة',
      dashboard: 'لوحة التحكم', publish: 'نشر التغييرات', logout: 'تسجيل الخروج', switchTo: 'English',
      tabMenu: 'المنيو', tabSettings: 'المطعم', tabQR: 'أكواد QR', tabAccount: 'الحساب',
      categories: 'الأقسام', addCat: '+ إضافة قسم', newCat: 'قسم جديد',
      catAr: 'اسم القسم (عربي)', catEn: 'اسم القسم (English)', showCat: 'ظاهر للزبائن',
      addItem: 'صنف جديد', edit: 'تعديل', del: 'حذف', up: 'للأعلى', down: 'للأسفل',
      delCat: 'حذف القسم', delItem: 'حذف الصنف',
      confirmDelCat: 'حذف القسم وكل أصنافه؟ لا يمكن التراجع بعد النشر.', confirmDelItem: 'حذف هذا الصنف؟',
      needsPrice: 'بدون سعر', hiddenNoPrice: 'مخفي عن الزبائن حتى تضيف سعراً',
      warnN: function (n) { return n + ' صنف بدون سعر، وهي مخفية عن الزبائن حتى تضيف السعر.'; },
      noItems: 'لا توجد أصناف في هذا القسم بعد.', pickCat: 'اختر قسماً من القائمة.', noCats: 'لا توجد أقسام هنا بعد.',
      noResults: 'لا توجد نتائج.',
      itemAr: 'اسم الصنف', itemEn: 'اسم الصنف (English)', descAr: 'وصف (عربي)', descEn: 'وصف (English)',
      prices: 'الأسعار', addPrice: '+ حجم آخر', priceHint: 'صنف بسعر واحد: اترك اسم الحجم فارغاً. أو اختر أحجاماً جاهزة من الأعلى.',
      sizeName: 'اسم الحجم (اختياري)', priceNum: 'السعر', egp: 'ج', noSizes: 'سعر واحد',
      category: 'القسم', badge: 'شارة', badgeNone: 'بدون', badgeNew: 'جديد', badgePopular: 'الأكثر طلباً', badgeSpicy: 'حار',
      photo: 'الصورة', removePhoto: 'حذف الصورة', uploading: 'جاري رفع الصورة...', uploaded: 'تم رفع الصورة',
      availableNow: 'متاح الآن (أوقفه إذا نفد)', showOnMenu: 'ظاهر في المنيو', cancel: 'إلغاء', saveItem: 'حفظ الصنف', done: 'تم',
      editItem: 'تعديل صنف', newItem: 'صنف جديد', moreInfo: 'الاسم الإنجليزي والوصف',
      availLbl: 'متاح', outLbl: 'نفد', hiddenTag: 'مخفي', itemsN: function (n) { return n + ' صنف'; },
      editCat: 'تعديل القسم', reorder: 'ترتيب الأصناف', reorderDone: 'تم الترتيب', back: 'رجوع',
      searchPh: 'ابحث عن صنف...', restaurant: 'المطعم', cafe: 'الكافيه', sectionLbl: 'القسم الرئيسي',
      basicInfo: 'بيانات المطعم', ordersTitle: 'الطلبات والتوصيل', englishInfo: 'الأسماء بالإنجليزية والعملة',
      nameAr: 'اسم المطعم', nameEn: 'اسم المطعم (English)', taglineAr: 'وصف قصير', taglineEn: 'وصف قصير (English)',
      addressAr: 'العنوان', addressEn: 'العنوان (English)', currencyAr: 'ملاحظة العملة (عربي)', currencyEn: 'ملاحظة العملة (English)',
      phones: 'أرقام الهاتف (رقم في كل سطر)', deliveryBtn: 'إظهار زر "اطلب ديليفري" في المنيو',
      settingsHint: 'اضغط "نشر التغييرات" لتظهر التعديلات للزبائن.',
      complaintsLbl: 'رقم الشكاوى', tablesLbl: 'عدد الطاولات (أرقام الطلب المسموحة)',
      orderingLbl: 'استقبال الطلبات من الزبائن (أوقفه لإخفاء زر الطلب مؤقتاً)',
      mergeTitle: 'المنيو الكامل', mergeHint: 'إذا كان في الموقع أصناف أو أقسام ناقصة عن المنيو المطبوع، اضغط "إضافة الناقص". لا يغيّر أسعارك ولا تعديلاتك الحالية.',
      mergeBtn: 'إضافة الناقص', resetBtn: 'استبدال المنيو بالكامل',
      mergeDone: function (c, i) { return 'تمت إضافة ' + c + ' قسم و ' + i + ' صنف. اضغط "نشر التغييرات".'; },
      mergeNone: 'المنيو كامل، لا يوجد ناقص.', mergeFail: 'تعذر تحميل المنيو الكامل.',
      resetConfirm: 'سيتم استبدال كل الأقسام والأصناف بالمنيو المطبوع، وتُفقد تعديلاتك على الأصناف. متابعة؟',
      resetDone: 'تم تحميل المنيو الكامل. اضغط "نشر التغييرات".',
      qrHelp: 'افتح هذه الصفحة من العنوان الحقيقي لموقع المنيو (بعد رفعه على الإنترنت) ثم أنشئ الأكواد. كل كود يفتح المنيو ويكتب رقم الطاولة.',
      siteAddress: 'عنوان موقع المنيو', tableCount: 'عدد الطاولات', makeQR: 'إنشاء الأكواد', printQR: 'طباعة',
      scan: 'امسح الكود لتصفح المنيو', scanEn: 'Scan to view the menu', tableWord: 'طاولة', general: 'كود عام', download: 'تحميل SVG',
      changePw: 'تغيير كلمة المرور', currentPw: 'كلمة المرور الحالية', newPw: 'كلمة المرور الجديدة', pwHint: '8 أحرف على الأقل.', changePwBtn: 'تغيير',
      pwChanged: 'تم تغيير كلمة المرور.',
      unsaved: 'تغييرات غير منشورة', published: 'تم النشر. المنيو محدّث الآن.',
      saveFail: 'تعذر النشر', sessionEnd: 'انتهت الجلسة. سجل الدخول من جديد.', leave: 'لديك تغييرات غير منشورة.',
      imgBig: 'الصورة غير صالحة', noPrice: 'أضف سعراً واحداً على الأقل لإظهار الصنف للزبائن.',
      needName: 'اكتب اسم القسم.', copyUrl: 'العنوان الحالي', qrNeedUrl: 'اكتب عنوان الموقع أولاً.',
    },
    en: {
      loginTitle: 'Menu dashboard', email: 'Email', password: 'Password',
      notConfigured: 'The site is not connected to the database yet. Open config.js and add your Supabase details (see the guide).',
      backup: 'Backup', backupHint: 'Download a copy of the menu to your device, or restore an older copy. After restoring, press "Publish changes".',
      exportBtn: 'Download backup', importBtn: 'Restore backup', importOk: 'Backup loaded. Press "Publish changes" to apply it.', importBad: 'This file is not valid.',
      seedLoaded: 'This is the starting menu. Press "Publish changes" to save it.', loadFail: 'Could not load the menu.', signIn: 'Sign in', wrong: 'Wrong password',
      dashboard: 'Dashboard', publish: 'Publish changes', logout: 'Sign out', switchTo: 'عربي',
      tabMenu: 'Menu', tabSettings: 'Restaurant', tabQR: 'QR codes', tabAccount: 'Account',
      categories: 'Categories', addCat: '+ Add category', newCat: 'New category',
      catAr: 'Category name (Arabic)', catEn: 'Category name (English)', showCat: 'Visible to customers',
      addItem: 'New item', edit: 'Edit', del: 'Delete', up: 'Move up', down: 'Move down',
      delCat: 'Delete category', delItem: 'Delete item',
      confirmDelCat: 'Delete this category and all its items? This cannot be undone after publishing.', confirmDelItem: 'Delete this item?',
      needsPrice: 'No price', hiddenNoPrice: 'Hidden from customers until you add a price',
      warnN: function (n) { return n + ' items have no price and are hidden from customers until you add one.'; },
      noItems: 'No items in this category yet.', pickCat: 'Pick a category from the list.', noCats: 'No categories here yet.',
      noResults: 'No results.',
      itemAr: 'Item name (Arabic)', itemEn: 'Item name (English)', descAr: 'Description (Arabic)', descEn: 'Description (English)',
      prices: 'Prices', addPrice: '+ Another size', priceHint: 'Single price: leave the size name empty. Or pick ready-made sizes above.',
      sizeName: 'Size name (optional)', priceNum: 'Price', egp: 'EGP', noSizes: 'One price',
      category: 'Category', badge: 'Badge', badgeNone: 'None', badgeNew: 'New', badgePopular: 'Popular', badgeSpicy: 'Spicy',
      photo: 'Photo', removePhoto: 'Remove photo', uploading: 'Uploading photo...', uploaded: 'Photo uploaded',
      availableNow: 'Available now (turn off if sold out)', showOnMenu: 'Show on menu', cancel: 'Cancel', saveItem: 'Save item', done: 'Done',
      editItem: 'Edit item', newItem: 'New item', moreInfo: 'English name and description',
      availLbl: 'Available', outLbl: 'Sold out', hiddenTag: 'Hidden', itemsN: function (n) { return n + (n === 1 ? ' item' : ' items'); },
      editCat: 'Edit category', reorder: 'Reorder items', reorderDone: 'Done ordering', back: 'Back',
      searchPh: 'Search for an item...', restaurant: 'Restaurant', cafe: 'Cafe', sectionLbl: 'Main section',
      basicInfo: 'Restaurant details', ordersTitle: 'Orders and delivery', englishInfo: 'English names and currency',
      nameAr: 'Restaurant name (Arabic)', nameEn: 'Restaurant name (English)', taglineAr: 'Tagline (Arabic)', taglineEn: 'Tagline (English)',
      addressAr: 'Address (Arabic)', addressEn: 'Address (English)', currencyAr: 'Currency note (Arabic)', currencyEn: 'Currency note (English)',
      phones: 'Phone numbers (one per line)', deliveryBtn: 'Show the "Order delivery" button on the menu',
      settingsHint: 'Press "Publish changes" so customers see your edits.',
      complaintsLbl: 'Complaints number', tablesLbl: 'Number of tables (allowed order table numbers)',
      orderingLbl: 'Accept orders from customers (turn off to hide the order button for now)',
      mergeTitle: 'Full menu', mergeHint: 'If the site is missing items or categories from the printed menu, press "Add missing". It does not change your prices or current edits.',
      mergeBtn: 'Add missing', resetBtn: 'Replace the whole menu',
      mergeDone: function (c, i) { return 'Added ' + c + ' categories and ' + i + ' items. Press "Publish changes".'; },
      mergeNone: 'The menu is complete. Nothing is missing.', mergeFail: 'Could not load the full menu.',
      resetConfirm: 'This replaces every category and item with the printed menu and you lose your item edits. Continue?',
      resetDone: 'Full menu loaded. Press "Publish changes".',
      qrHelp: 'Open this page from the live address of your menu site (after it is online), then generate. Each code opens the menu and shows the table number.',
      siteAddress: 'Menu website address', tableCount: 'Number of tables', makeQR: 'Generate codes', printQR: 'Print',
      scan: 'امسح الكود لتصفح المنيو', scanEn: 'Scan to view the menu', tableWord: 'Table', general: 'General code', download: 'Download SVG',
      changePw: 'Change password', currentPw: 'Current password', newPw: 'New password', pwHint: 'At least 8 characters.', changePwBtn: 'Change',
      pwChanged: 'Password changed.',
      unsaved: 'Unpublished changes', published: 'Published. The menu is live.',
      saveFail: 'Could not publish', sessionEnd: 'Session ended. Please sign in again.', leave: 'You have unpublished changes.',
      imgBig: 'Invalid image', noPrice: 'Add at least one price to show this item to customers.',
      needName: 'Enter a category name.', copyUrl: 'Current address', qrNeedUrl: 'Enter the website address first.',
    },
  };

  var EN_SIZE = { 'عادي': 'Regular', 'كونو': 'Cone', 'وسط': 'Medium', 'كبير': 'Large', 'صغير': 'Small', 'سنجل': 'Single', 'دبل': 'Double', 'إسكندراني': 'Alexandrian', 'شرقي': 'Eastern' };
  var PRESETS = [['عادي', 'كونو'], ['وسط', 'كبير'], ['سنجل', 'دبل'], ['صغير', 'كبير']];

  var S = { lang: 'ar', menu: null, dirty: false, cat: null, editing: null, sec: 'restaurant', view: 'cats', q: '', reorder: false };
  try { if (localStorage.getItem('adminLang') === 'en') S.lang = 'en'; } catch (e) {}

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function t(k) { var v = D[S.lang][k]; return v === undefined ? k : v; }
  function uid() { return Math.random().toString(36).slice(2, 9); }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
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
  function svg(path, cls) {
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('aria-hidden', 'true');
    if (cls) s.setAttribute('class', cls);
    var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', path); s.appendChild(p); return s;
  }
  var ICON = {
    chev: 'M9 5l7 7-7 7', plus: 'M12 5v14M5 12h14', pen: 'M4 20h4L19 9l-4-4L4 16zM13 7l4 4',
    up: 'M6 14l6-6 6 6', down: 'M6 10l6 6 6-6', gear: 'M12 8a4 4 0 100 8 4 4 0 000-8zM4 12h2M18 12h2M12 4v2M12 18v2',
    sort: 'M8 5v14M8 5L5 8M8 5l3 3M16 19V5M16 19l-3-3M16 19l3-3', dots: 'M5 12h.01M12 12h.01M19 12h.01',
  };
  function toast(msg, bad) {
    var el = $('#toast');
    el.textContent = msg; el.className = 'on' + (bad ? ' bad' : '');
    clearTimeout(toast.t);
    toast.t = setTimeout(function () { el.className = ''; }, 3400);
  }
  function norm(s) {
    return String(s || '').replace(/[ً-ٰٟـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
      .replace(/\s+/g, ' ').toLowerCase().trim();
  }

  function applyLang() {
    document.documentElement.lang = S.lang;
    document.documentElement.dir = S.lang === 'ar' ? 'rtl' : 'ltr';
    $$('[data-i]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i')); });
    $$('[data-ph]').forEach(function (el) { el.setAttribute('placeholder', t(el.getAttribute('data-ph'))); });
    $$('[data-aria]').forEach(function (el) { el.setAttribute('aria-label', t(el.getAttribute('data-aria'))); });
    $('#lang').textContent = t('switchTo');
    $('#login-lang').textContent = t('switchTo');
    $('#add-cat').textContent = t('addCat');
    $('#c-up').textContent = '↑ ' + t('up'); $('#c-down').textContent = '↓ ' + t('down');
    var sel = $('#cat-sec'); sel.textContent = '';
    sel.append(h('option', { value: 'restaurant' }, t('restaurant')), h('option', { value: 'cafe' }, t('cafe')));
    status();
    if (S.menu) { renderMenu(); fillSettings(); }
  }

  // ---------- auth ----------
  var A = window.LeqaaAPI;
  function authFail(err) {
    if (err && err.status === 401) {
      $$('dialog').forEach(function (d) { if (d.open) d.close(); });
      logout(); $('#login-err').textContent = t('sessionEnd');
      return true;
    }
    return false;
  }
  function showApp() {
    $('#login').hidden = true; $('#app').hidden = false;
    A.getMenu().then(function (m) {
      S.menu = m; S.dirty = A.lastFromSeed;
      S.cat = null; S.view = 'cats'; S.q = '';
      applyLang();
      initQR();
      if (A.lastFromSeed) toast(t('seedLoaded'));
    }).catch(function () { toast(t('loadFail'), true); });
  }
  function logout() {
    A.logout(); S.dirty = false; S.menu = null; status();
    $('#app').hidden = true; $('#login').hidden = false;
  }
  $('#login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    $('#login-err').textContent = '';
    if (!A.configured()) { $('#setup-warn').hidden = false; return; }
    var email = $('#em').value.trim();
    A.login(email, $('#pw').value).then(function () {
      try { localStorage.setItem('adminEmail', email); } catch (e2) {}
      $('#pw').value = '';
      showApp();
    }).catch(function (err) {
      $('#login-err').textContent = (err.status === 400 || err.status === 401) ? t('wrong') : err.message;
    });
  });
  $('#logout').addEventListener('click', logout);
  function toggleLang() {
    S.lang = S.lang === 'ar' ? 'en' : 'ar';
    try { localStorage.setItem('adminLang', S.lang); } catch (e) {}
    applyLang();
  }
  $('#lang').addEventListener('click', toggleLang);
  $('#login-lang').addEventListener('click', toggleLang);

  // ---------- dirty / publish ----------
  function dirty() { S.dirty = true; status(); }
  function status() {
    $('#status').textContent = t('unsaved');
    $('#pubbar').hidden = !S.dirty || !S.menu;
    document.body.classList.toggle('dirty', !!(S.dirty && S.menu));
  }
  $('#publish').addEventListener('click', function () {
    readSettings();
    var btn = $('#publish'); btn.disabled = true;
    A.saveMenu(S.menu).then(function () {
      S.dirty = false; status(); toast(t('published'));
    }).catch(function (e) { if (!authFail(e)) toast(t('saveFail') + ': ' + e.message, true); })
      .then(function () { btn.disabled = false; });
  });
  window.addEventListener('beforeunload', function (e) {
    if (S.dirty) { e.preventDefault(); e.returnValue = ''; }
  });

  // ---------- tabs ----------
  $$('.tabs button').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.tabs button').forEach(function (x) { x.classList.toggle('on', x === b); });
      $$('.tab').forEach(function (p) { p.hidden = p.id !== 'tab-' + b.getAttribute('data-tab'); });
      window.scrollTo(0, 0);
    });
  });

  // ---------- helpers ----------
  function move(arr, i, d) {
    var j = i + d;
    if (j < 0 || j >= arr.length) return false;
    var x = arr[i]; arr[i] = arr[j]; arr[j] = x; return true;
  }
  function secOf(c) { return c.section === 'cafe' ? 'cafe' : 'restaurant'; }
  function curCat() { return S.menu.categories.filter(function (c) { return c.id === S.cat; })[0] || null; }
  function hasPrice(it) { return it.prices.some(function (p) { return p.price !== null && p.price !== '' && p.price !== undefined; }); }
  function nm(o) { return (o && (o[S.lang] || o.ar || o.en)) || ''; }
  function noPriceCount(c) { return c.items.filter(function (i) { return !hasPrice(i); }).length; }

  // ---------- menu tab ----------
  function renderMenu() {
    if (!S.menu) return;
    // section switch
    $$('#sec-seg button').forEach(function (b) {
      var sec = b.getAttribute('data-sec');
      var n = S.menu.categories.filter(function (c) { return secOf(c) === sec; }).length;
      b.textContent = t(sec) + ' (' + n + ')';
      b.classList.toggle('on', sec === S.sec);
      b.setAttribute('aria-selected', sec === S.sec ? 'true' : 'false');
    });
    $('#sec-seg').hidden = !!S.q;
    $('#add-cat').hidden = !!S.q;

    var split = $('#split');
    split.setAttribute('data-view', S.view);

    // left / first pane: categories or search results
    var ul = $('#catlist'); ul.textContent = '';
    if (S.q) {
      ul.className = 'items-list';
      var q = norm(S.q), found = 0;
      S.menu.categories.forEach(function (c) {
        c.items.forEach(function (it, i) {
          if (norm(it.name.ar).indexOf(q) !== -1 || norm(it.name.en).indexOf(q) !== -1) {
            if (found < 60) ul.append(itemRow(c, it, i, { showCat: true }));
            found++;
          }
        });
      });
      if (!found) ul.append(h('li', { class: 'empty' }, t('noResults')));
    } else {
      ul.className = 'catlist';
      var list = S.menu.categories.filter(function (c) { return secOf(c) === S.sec; });
      if (!list.length) ul.append(h('li', { class: 'empty' }, t('noCats')));
      list.forEach(function (c) {
        var np = noPriceCount(c);
        var meta = t('itemsN')(c.items.length) + (np ? ' · ' + np + ' ' + t('needsPrice') : '');
        ul.append(h('li', { class: 'crow' + (c.id === S.cat ? ' on' : '') + (c.visible === false ? ' off' : '') },
          h('button', { class: 'cat', type: 'button', on: { click: function () { openCat(c.id); } } },
            h('span', { class: 'ct' }, h('span', { class: 'cn' }, nm(c.name)),
              h('span', { class: 'cm' }, meta)),
            c.visible === false ? h('span', { class: 'tag' }, t('hiddenTag')) : null,
            svg(ICON.chev, 'chev'))));
      });
    }
    renderWarn();
    renderCatPane();
  }
  function renderWarn() {
    var n = 0;
    S.menu.categories.forEach(function (c) { n += noPriceCount(c); });
    var w = $('#warn'); w.hidden = !n;
    if (n) w.textContent = t('warnN')(n);
  }
  function openCat(id) {
    S.cat = id; S.view = 'cat'; S.reorder = false;
    try { history.pushState({ v: 'cat' }, ''); } catch (e) {}
    renderMenu(); window.scrollTo(0, 0);
  }
  function closeCat() {
    S.view = 'cats'; S.reorder = false; renderMenu();
  }
  window.addEventListener('popstate', function () { if (S.view === 'cat') closeCat(); });

  function renderCatPane() {
    var box = $('#catedit'); box.textContent = '';
    var c = curCat();
    if (!c) { box.append(h('p', { class: 'empty pick' }, t('pickCat'))); return; }

    box.append(h('div', { class: 'chead' },
      h('button', { class: 'icon-btn back', type: 'button', 'aria-label': t('back'), on: { click: function () {
        if (history.state && history.state.v === 'cat') history.back(); else closeCat();
      } } }, svg(ICON.chev, 'chev-back')),
      h('h2', null, nm(c.name)),
      h('button', { class: 'btn small', type: 'button', on: { click: function () { openCatDialog(c); } } }, svg(ICON.pen, 'ic'), t('editCat'))));

    box.append(h('div', { class: 'tools' },
      h('span', { class: 'cm' }, t('itemsN')(c.items.length)),
      c.items.length > 1 ? h('button', { class: 'btn small' + (S.reorder ? ' primary' : ''), type: 'button', on: { click: function () { S.reorder = !S.reorder; renderCatPane(); } } },
        svg(ICON.sort, 'ic'), S.reorder ? t('reorderDone') : t('reorder')) : null));

    var list = h('ul', { class: 'items-list' + (S.reorder ? ' reorder' : '') });
    if (!c.items.length) list.append(h('li', { class: 'empty' }, t('noItems')));
    c.items.forEach(function (it, i) { list.append(itemRow(c, it, i)); });
    box.append(list);
    box.append(h('button', { class: 'fab', type: 'button', on: { click: function () { openItem(null, c); } } }, svg(ICON.plus, 'ic'), t('addItem')));
  }

  function refreshRowState(li, it) {
    var np = !hasPrice(it);
    li.classList.toggle('nop', np);
    li.classList.toggle('out', it.available === false);
    li.classList.toggle('hid', it.visible === false);
    renderWarn();
  }

  function itemRow(c, it, i, o) {
    o = o || {};
    var li = h('li', { class: 'irow' });
    var cat = o.showCat ? h('span', { class: 'incat' }, nm(c.name)) : null;
    var sub = [];
    if (it.visible === false) sub.push(t('hiddenTag'));
    if (!hasPrice(it)) sub.push(t('needsPrice'));
    var top = h('div', { class: 'irow-top' },
      it.image ? h('img', { src: it.image, alt: '', loading: 'lazy' }) : null,
      h('button', { class: 'nm', type: 'button', on: { click: function () { S.cat = c.id; openItem(it, c); } } },
        h('b', null, nm(it.name)), cat, sub.length ? h('small', null, sub.join(' · ')) : null));

    if (S.reorder) {
      top.append(h('div', { class: 'moves' },
        h('button', { class: 'icon-btn', type: 'button', 'aria-label': t('up'), on: { click: function () { if (move(c.items, i, -1)) { dirty(); renderCatPane(); } } } }, svg(ICON.up)),
        h('button', { class: 'icon-btn', type: 'button', 'aria-label': t('down'), on: { click: function () { if (move(c.items, i, 1)) { dirty(); renderCatPane(); } } } }, svg(ICON.down))));
      li.append(top);
      refreshRowState(li, it);
      return li;
    }

    var swText = h('span', null, it.available === false ? t('outLbl') : t('availLbl'));
    top.append(h('label', { class: 'sw' },
      h('input', { type: 'checkbox', checked: it.available !== false ? true : null, 'aria-label': t('availLbl'), on: { change: function (e) {
        it.available = e.target.checked; swText.textContent = it.available ? t('availLbl') : t('outLbl');
        refreshRowState(li, it); dirty();
      } } }), h('i'), swText));
    li.append(top);

    var grid = h('div', { class: 'pgrid' });
    it.prices.forEach(function (p) {
      grid.append(h('label', { class: 'pcell' },
        h('span', null, nm(p.label) || t('priceNum')),
        h('div', { class: 'pin' },
          h('input', { type: 'number', min: '0', step: '1', inputmode: 'numeric', 'aria-label': (nm(p.label) || t('priceNum')) + ' - ' + nm(it.name),
            value: p.price === null || p.price === undefined ? '' : p.price,
            on: { change: function (e) {
              var v = e.target.value;
              p.price = v === '' || isNaN(Number(v)) ? null : Math.max(0, Number(v));
              refreshRowState(li, it); dirty();
            } } }),
          h('em', null, t('egp')))));
    });
    li.append(grid);
    refreshRowState(li, it);
    return li;
  }

  $('#add-cat').addEventListener('click', function () {
    var c = { id: 'c' + uid(), section: S.sec, name: { ar: 'قسم جديد', en: 'New category' }, visible: true, items: [] };
    S.menu.categories.push(c); S.cat = c.id; dirty();
    openCat(c.id); openCatDialog(c, true);
  });
  $$('#sec-seg button').forEach(function (b) {
    b.addEventListener('click', function () { S.sec = b.getAttribute('data-sec'); renderMenu(); });
  });
  $('#q').addEventListener('input', function (e) { S.q = e.target.value; renderMenu(); });

  // ---------- category dialog ----------
  var cdlg = $('#cdlg'), cEditing = null;
  function openCatDialog(c, fresh) {
    cEditing = c;
    $('#cat-ar').value = c.name.ar || ''; $('#cat-en').value = c.name.en || '';
    $('#cat-sec').value = secOf(c);
    $('#cat-vis').checked = c.visible !== false;
    cdlg.showModal();
    if (fresh) { $('#cat-ar').focus(); $('#cat-ar').select(); }
  }
  function closeCatDialog() { cdlg.close(); renderMenu(); }
  $('#cat-ar').addEventListener('input', function (e) { cEditing.name.ar = e.target.value; dirty(); });
  $('#cat-en').addEventListener('input', function (e) { cEditing.name.en = e.target.value; dirty(); });
  $('#cat-sec').addEventListener('change', function (e) { cEditing.section = e.target.value; S.sec = cEditing.section; dirty(); });
  $('#cat-vis').addEventListener('change', function (e) { cEditing.visible = e.target.checked; dirty(); });
  $('#c-up').addEventListener('click', function () { var a = S.menu.categories, i = a.indexOf(cEditing); if (moveInSection(a, i, -1)) { dirty(); renderMenu(); } });
  $('#c-down').addEventListener('click', function () { var a = S.menu.categories, i = a.indexOf(cEditing); if (moveInSection(a, i, 1)) { dirty(); renderMenu(); } });
  function moveInSection(arr, i, d) {
    // swap with the neighbour that is in the same section so the order is visible to the manager
    var sec = secOf(arr[i]), j = i + d;
    while (j >= 0 && j < arr.length && secOf(arr[j]) !== sec) j += d;
    if (j < 0 || j >= arr.length) return false;
    var x = arr[i]; arr[i] = arr[j]; arr[j] = x; return true;
  }
  $('#c-del').addEventListener('click', function () {
    if (!confirm(t('confirmDelCat'))) return;
    var a = S.menu.categories; a.splice(a.indexOf(cEditing), 1);
    S.cat = null; dirty(); cdlg.close(); closeCat();
    if (history.state && history.state.v === 'cat') { try { history.back(); } catch (e) {} }
  });
  $('#c-done').addEventListener('click', closeCatDialog);
  $('#c-x').addEventListener('click', closeCatDialog);
  cdlg.addEventListener('close', function () { renderMenu(); });

  // ---------- item dialog ----------
  var dlg = $('#dlg');
  var draft = null;

  function priceRow(p) {
    return h('div', { class: 'prow' },
      h('input', { dir: 'rtl', class: 'psize', placeholder: t('sizeName'), value: p.label.ar || '', 'aria-label': t('sizeName'),
        on: { input: function (e) { var v = e.target.value.trim(); p.label.ar = v; p.label.en = EN_SIZE[v] || v; } } }),
      h('input', { type: 'number', min: '0', step: '1', inputmode: 'numeric', class: 'pnum', placeholder: t('priceNum'), 'aria-label': t('priceNum'),
        value: p.price === null || p.price === undefined ? '' : p.price,
        on: { input: function (e) { p.price = e.target.value === '' ? null : Number(e.target.value); } } }),
      h('button', { type: 'button', class: 'icon-btn', 'aria-label': t('del'), on: { click: function () {
        if (draft.prices.length > 1) { draft.prices.splice(draft.prices.indexOf(p), 1); drawPrices(); }
        else { p.label = { ar: '', en: '' }; p.price = null; drawPrices(); }
      } } }, svg('M6 6l12 12M18 6L6 18')));
  }
  function drawPrices() {
    var box = $('#f-prices'); box.textContent = '';
    draft.prices.forEach(function (p) { box.append(priceRow(p)); });
    var pre = $('#f-presets'); pre.textContent = '';
    pre.append(h('button', { type: 'button', class: 'chip', on: { click: function () {
      var first = draft.prices[0]; first.label = { ar: '', en: '' };
      draft.prices = [first]; drawPrices();
    } } }, t('noSizes')));
    PRESETS.forEach(function (pr) {
      pre.append(h('button', { type: 'button', class: 'chip', on: { click: function () {
        while (draft.prices.length < pr.length) draft.prices.push({ label: { ar: '', en: '' }, price: null });
        pr.forEach(function (name, i) { draft.prices[i].label = { ar: name, en: EN_SIZE[name] || name }; });
        drawPrices();
      } } }, pr.join(' / ')));
    });
  }
  function drawImg() {
    var img = $('#f-img');
    img.hidden = !draft.image;
    if (draft.image) img.src = draft.image;
    $('#f-rmimg').hidden = !draft.image;
  }

  function openItem(it, cat) {
    var c = cat || curCat();
    S.editing = it; S.cat = c.id;
    draft = it ? clone(it) : {
      id: 'i' + uid(), name: { ar: '', en: '' }, desc: { ar: '', en: '' }, image: '',
      prices: [{ label: { ar: '', en: '' }, price: null }], badge: '', available: true, visible: true,
    };
    draft.desc = draft.desc || { ar: '', en: '' };
    if (!draft.prices || !draft.prices.length) draft.prices = [{ label: { ar: '', en: '' }, price: null }];
    $('#dlg-title').textContent = it ? t('editItem') : t('newItem');
    $('#f-nameAr').value = draft.name.ar; $('#f-nameEn').value = draft.name.en;
    $('#f-descAr').value = draft.desc.ar || ''; $('#f-descEn').value = draft.desc.en || '';
    var sel = $('#f-cat'); sel.textContent = '';
    S.menu.categories.forEach(function (x) {
      sel.append(h('option', { value: x.id, selected: x.id === c.id ? true : null }, t(secOf(x)) + ' - ' + nm(x.name)));
    });
    $('#f-badge').value = draft.badge || '';
    $('#f-avail').checked = draft.available !== false;
    $('#f-vis').checked = draft.visible !== false;
    $('#f-del').hidden = !it;
    $('#f-file').value = ''; $('#f-imgmsg').textContent = '';
    drawPrices(); drawImg();
    dlg.showModal();
    if (!it) $('#f-nameAr').focus();
  }
  $('#f-addprice').addEventListener('click', function () { draft.prices.push({ label: { ar: '', en: '' }, price: null }); drawPrices(); });
  $('#f-cancel').addEventListener('click', function () { dlg.close(); });
  $('#f-x').addEventListener('click', function () { dlg.close(); });
  $('#f-rmimg').addEventListener('click', function () { draft.image = ''; drawImg(); });
  $('#f-del').addEventListener('click', function () {
    if (!confirm(t('confirmDelItem'))) return;
    var c = curCat(), pos = c.items.indexOf(S.editing);
    if (pos > -1) c.items.splice(pos, 1);
    dirty(); dlg.close(); renderMenu();
  });

  function shrink(file, max) {
    return new Promise(function (resolve, reject) {
      var img = new Image(), url = URL.createObjectURL(file);
      img.onload = function () {
        var s = Math.min(1, max / Math.max(img.width, img.height));
        var cv = document.createElement('canvas');
        cv.width = Math.round(img.width * s); cv.height = Math.round(img.height * s);
        cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
        URL.revokeObjectURL(url);
        cv.toBlob(function (b) { b ? resolve(b) : reject(new Error(t('imgBig'))); }, 'image/jpeg', 0.82);
      };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error(t('imgBig'))); };
      img.src = url;
    });
  }
  $('#f-file').addEventListener('change', function (e) {
    var f = e.target.files[0]; if (!f) return;
    var msg = $('#f-imgmsg'); msg.textContent = t('uploading');
    shrink(f, 900).then(function (blob) { return A.uploadPhoto(blob); })
      .then(function (url) { draft.image = url; drawImg(); msg.textContent = t('uploaded'); })
      .catch(function (err) { if (!authFail(err)) msg.textContent = err.message; });
  });

  $('#item-form').addEventListener('submit', function (e) {
    e.preventDefault();
    draft.name = { ar: $('#f-nameAr').value.trim(), en: $('#f-nameEn').value.trim() };
    if (!draft.name.en) draft.name.en = draft.name.ar;
    draft.desc = { ar: $('#f-descAr').value.trim(), en: $('#f-descEn').value.trim() };
    draft.badge = $('#f-badge').value;
    draft.available = $('#f-avail').checked;
    draft.visible = $('#f-vis').checked;
    draft.prices.forEach(function (p) {
      if (p.price !== null && (isNaN(p.price) || p.price < 0)) p.price = null;
      p.label = p.label || { ar: '', en: '' };
      if (p.label.ar && !p.label.en) p.label.en = EN_SIZE[p.label.ar] || p.label.ar;
    });

    var targetId = $('#f-cat').value;
    var from = curCat();
    var target = S.menu.categories.filter(function (c) { return c.id === targetId; })[0] || from;
    if (S.editing) {
      var pos = from.items.indexOf(S.editing);
      if (target === from) from.items[pos] = draft;
      else { from.items.splice(pos, 1); target.items.push(draft); }
    } else target.items.push(draft);
    if (target !== from) { S.cat = target.id; S.sec = secOf(target); }

    dirty(); dlg.close(); renderMenu();
    if (!hasPrice(draft)) toast(t('noPrice'), true);
  });

  // ---------- settings ----------
  function fillSettings() {
    var s = S.menu.settings;
    s.name = s.name || {}; s.tagline = s.tagline || {}; s.address = s.address || {}; s.currencyNote = s.currencyNote || {};
    $('#s-nameAr').value = s.name.ar || ''; $('#s-nameEn').value = s.name.en || '';
    $('#s-taglineAr').value = s.tagline.ar || ''; $('#s-taglineEn').value = s.tagline.en || '';
    $('#s-addressAr').value = s.address.ar || ''; $('#s-addressEn').value = s.address.en || '';
    $('#s-currAr').value = s.currencyNote.ar || ''; $('#s-currEn').value = s.currencyNote.en || '';
    $('#s-phones').value = (s.phones || []).join('\n');
    $('#s-delivery').checked = s.delivery !== false;
    $('#s-complaints').value = s.complaints || '';
    $('#s-tables').value = s.tables || 30;
    $('#s-ordering').checked = s.ordering !== false;
  }
  function readSettings() {
    if (!S.menu) return;
    var s = S.menu.settings;
    s.name = { ar: $('#s-nameAr').value.trim(), en: $('#s-nameEn').value.trim() };
    s.tagline = { ar: $('#s-taglineAr').value.trim(), en: $('#s-taglineEn').value.trim() };
    s.address = { ar: $('#s-addressAr').value.trim(), en: $('#s-addressEn').value.trim() };
    s.currencyNote = { ar: $('#s-currAr').value.trim(), en: $('#s-currEn').value.trim() };
    s.phones = $('#s-phones').value.split('\n').map(function (x) { return x.trim(); }).filter(Boolean);
    s.delivery = $('#s-delivery').checked;
    s.complaints = $('#s-complaints').value.trim();
    var tn = parseInt($('#s-tables').value, 10);
    s.tables = tn > 0 && tn <= 200 ? tn : 30;
    s.ordering = $('#s-ordering').checked;
  }
  $('#settings-form').addEventListener('input', function () { dirty(); });
  $('#settings-form').addEventListener('change', function () { dirty(); });
  $('#settings-form').addEventListener('submit', function (e) { e.preventDefault(); });

  // ---------- QR codes ----------
  function qrSvg(text) {
    var qr = qrcode(0, 'Q'); qr.addData(text); qr.make();
    var n = qr.getModuleCount(), m = 2, d = '';
    for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) if (qr.isDark(r, c)) d += 'M' + (c + m) + ' ' + (r + m) + 'h1v1h-1z';
    var size = n + 2 * m;
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + size + ' ' + size + '" shape-rendering="crispEdges">' +
      '<rect width="100%" height="100%" fill="#fff"/><path d="' + d + '" fill="#1B1512"/></svg>';
  }
  function initQR() {
    var base = $('#qr-base');
    if (!base.value) base.value = location.origin;
    var tn = S.menu && S.menu.settings && parseInt(S.menu.settings.tables, 10);
    if (tn > 0) $('#qr-count').value = tn;
    makeQR(true);
  }
  function makeQR(quiet) {
    var base = $('#qr-base').value.trim().replace(/\/+$/, '');
    var grid = $('#qrgrid'); grid.textContent = '';
    if (!base) { if (!quiet) toast(t('qrNeedUrl'), true); return; }
    if (typeof qrcode === 'undefined') { if (!quiet) toast('QR library not loaded (check internet)', true); return; }
    var count = Math.max(1, Math.min(200, parseInt($('#qr-count').value, 10) || 1));
    var name = S.menu ? nm(S.menu.settings.name) : '';
    var items = [{ label: t('general'), url: base + '/', file: 'menu-general' }];
    for (var i = 1; i <= count; i++) items.push({ label: t('tableWord') + ' ' + i, url: base + '/?table=' + i, file: 'table-' + i });

    items.forEach(function (it) {
      var s = qrSvg(it.url);
      var card = h('div', { class: 'qrcard' });
      var mk = h('div'); mk.innerHTML = window.LEQAA_MARK(44, false); card.append(mk);
      card.append(h('p', { class: 'nm' }, name));
      card.append(h('p', { class: 'scan' }, D.ar.scan + ' · ' + D.ar.scanEn));
      var q = h('div', { class: 'qr' }); q.innerHTML = s; card.append(q);
      card.append(h('div', { class: 'tbl' }, it.label));
      var blob = new Blob([s], { type: 'image/svg+xml' });
      card.append(h('a', { class: 'btn small dl', href: URL.createObjectURL(blob), download: it.file + '.svg' }, t('download')));
      grid.append(card);
    });
  }
  $('#qr-make').addEventListener('click', function () { makeQR(); });
  $('#qr-print').addEventListener('click', function () { makeQR(); window.print(); });

  // ---------- password ----------
  $('#pw-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var next = $('#pw-new').value;
    if (next.length < 8) { toast(t('pwHint'), true); return; }
    A.login(A.email(), $('#pw-cur').value)
      .then(function () { return A.changePassword(next); })
      .then(function () { $('#pw-form').reset(); toast(t('pwChanged')); })
      .catch(function (err) { toast((err.status === 400 || err.status === 401) ? t('wrong') : err.message, true); });
  });

  // ---------- backup + full menu ----------
  $('#exp').addEventListener('click', function () {
    var blob = new Blob([JSON.stringify(S.menu, null, 2)], { type: 'application/json' });
    var a = h('a', { href: URL.createObjectURL(blob), download: 'menu-backup-' + new Date().toISOString().slice(0, 10) + '.json' });
    document.body.append(a); a.click(); a.remove();
  });
  $('#imp').addEventListener('click', function () { $('#imp-file').click(); });
  $('#imp-file').addEventListener('change', function (e) {
    var f = e.target.files[0]; if (!f) return;
    f.text().then(function (tx) {
      var m = JSON.parse(tx);
      var ok = m && m.settings && Array.isArray(m.categories) &&
        m.categories.every(function (c) { return c && c.id && c.name && Array.isArray(c.items); });
      if (!ok) throw new Error('bad');
      S.menu = m; S.cat = null; S.view = 'cats';
      dirty(); renderMenu(); fillSettings(); toast(t('importOk'));
    }).catch(function () { toast(t('importBad'), true); });
    e.target.value = '';
  });

  function loadSeed() {
    return fetch('/seed-menu.json', { cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error('seed');
      return r.json();
    });
  }
  function mergeSeed(seed) {
    var added = { c: 0, i: 0 };
    seed.categories.forEach(function (sc) {
      var key = norm(sc.name.ar);
      var c = S.menu.categories.filter(function (x) { return x.id === sc.id; })[0] ||
        S.menu.categories.filter(function (x) { return norm(x.name && x.name.ar) === key; })[0];
      if (!c) { S.menu.categories.push(clone(sc)); added.c++; added.i += sc.items.length; return; }
      if (!c.section) c.section = sc.section;
      sc.items.forEach(function (si) {
        var sk = norm(si.name.ar);
        var found = c.items.some(function (x) { return x.id === si.id || norm(x.name && x.name.ar) === sk; });
        if (!found) { c.items.push(clone(si)); added.i++; }
      });
    });
    var s = S.menu.settings, ss = seed.settings || {};
    if (s.complaints === undefined && ss.complaints) s.complaints = ss.complaints;
    if (s.tables === undefined && ss.tables) s.tables = ss.tables;
    if (s.ordering === undefined) s.ordering = true;
    if ((!s.phones || !s.phones.length) && ss.phones) s.phones = ss.phones.slice();
    if (s.address && !s.address.ar && ss.address) s.address = clone(ss.address);
    return added;
  }
  $('#merge').addEventListener('click', function () {
    loadSeed().then(function (seed) {
      var r = mergeSeed(seed);
      if (!r.c && !r.i) { toast(t('mergeNone')); return; }
      dirty(); renderMenu(); fillSettings(); toast(t('mergeDone')(r.c, r.i));
    }).catch(function () { toast(t('mergeFail'), true); });
  });
  $('#reset').addEventListener('click', function () {
    if (!confirm(t('resetConfirm'))) return;
    loadSeed().then(function (seed) {
      S.menu.categories = clone(seed.categories);
      S.cat = null; S.view = 'cats';
      dirty(); renderMenu(); toast(t('resetDone'));
    }).catch(function () { toast(t('mergeFail'), true); });
  });

  // ---------- boot ----------
  $('#login-mark').innerHTML = window.LEQAA_MARK(64, false);
  $('#bar-mark').innerHTML = window.LEQAA_MARK(34, false);
  try { $('#em').value = localStorage.getItem('adminEmail') || ''; } catch (e) {}
  applyLang();
  if (!A.configured()) $('#setup-warn').hidden = false;
  else if (A.hasSession()) showApp();
})();
