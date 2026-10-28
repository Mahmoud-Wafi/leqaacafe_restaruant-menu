// Service worker for the captain screen: shows a notification when the server sends a push.
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });

self.addEventListener('push', function (event) {
  var d = {};
  try { d = event.data ? event.data.json() : {}; } catch (e) { d = { body: event.data ? event.data.text() : '' }; }
  event.waitUntil(self.registration.showNotification(d.title || 'طلب جديد', {
    body: d.body || '',
    icon: '/icon-192.png',
    badge: '/favicon.png',
    tag: d.tag || 'order',
    renotify: true,
    requireInteraction: true,
    vibrate: [250, 120, 250, 120, 500],
    dir: 'rtl',
    lang: 'ar',
    data: { url: d.url || '/captain/' },
  }));
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  var url = (event.notification.data && event.notification.data.url) || '/captain/';
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].url.indexOf('/captain/') !== -1 && 'focus' in list[i]) return list[i].focus();
    }
    return self.clients.openWindow(url);
  }));
});
