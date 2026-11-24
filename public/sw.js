self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => networkResponse)
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html') || caches.match('/');
          }
          return new Response('Network error or offline', {
            status: 408,
            headers: { 'Content-Type': 'text/plain' },
          });
        });
      })
  );
});

const parsePushPayload = (event) => {
  if (!event.data) return {};
  try {
    return event.data.json();
  } catch {
    return { body: event.data.text() };
  }
};

self.addEventListener('push', (event) => {
  const data = parsePushPayload(event);
  const title = data.title || 'HABITRA Alarm';
  const body = data.body || 'Time for your scheduled commitment!';
  const rawUrl = data.url || '/dashboard';
  const targetUrl = rawUrl.includes('alarm=')
    ? rawUrl
    : `${rawUrl}${rawUrl.includes('?') ? '&' : '?'}alarm=1`;

  const notificationTag = data.tag || `habitra-${data.type || 'alarm'}-${Date.now()}`;

  const options = {
    body,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    vibrate: [800, 300, 800, 300, 800, 300, 800],
    requireInteraction: true,
    tag: notificationTag,
    renotify: true,
    data: {
      url: targetUrl,
      type: data.type || 'ALARM',
    },
  };

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(title, options),
      self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'HABITRA_ALARM',
            title,
            body,
            url: targetUrl,
            eventType: data.type || 'ALARM',
          });
        });
      }),
    ])
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const baseUrl = event.notification.data?.url || '/dashboard';
  const alarmUrl = baseUrl.includes('alarm=')
    ? baseUrl
    : `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}alarm=1`;

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if ('focus' in client) {
          client.postMessage({
            type: 'HABITRA_ALARM',
            title: event.notification.title,
            body: event.notification.body,
            url: alarmUrl,
            eventType: event.notification.data?.type || 'ALARM',
          });
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(alarmUrl);
      }
    })
  );
});