// Service Worker for LumiDeck
const CACHE_NAME = 'lumideck-v1';
const STATIC_CACHE_NAME = 'lumideck-static-v1';
const DYNAMIC_CACHE_NAME = 'lumideck-dynamic-v1';

// Files to cache on install
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  // Add other static assets as needed
];

// Install event - cache static files
self.addEventListener('install', event => {
  console.log('[SW] Installing service worker');

  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('[SW] Static files cached');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[SW] Failed to cache static files:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating service worker');

  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (
              cacheName !== STATIC_CACHE_NAME &&
              cacheName !== DYNAMIC_CACHE_NAME
            ) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(request).then(cachedResponse => {
      // Return cached version if available
      if (cachedResponse) {
        console.log('[SW] Serving from cache:', request.url);
        return cachedResponse;
      }

      // Fetch from network and cache the response
      return fetch(request)
        .then(networkResponse => {
          // Don't cache if not successful
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type !== 'basic'
          ) {
            return networkResponse;
          }

          // Clone the response before caching
          const responseClone = networkResponse.clone();

          // Determine which cache to use
          const cacheName = request.url.includes('/api/')
            ? DYNAMIC_CACHE_NAME
            : STATIC_CACHE_NAME;

          caches.open(cacheName).then(cache => {
            console.log('[SW] Caching new resource:', request.url);
            cache.put(request, responseClone);
          });

          return networkResponse;
        })
        .catch(error => {
          console.error('[SW] Fetch failed:', error);

          // Return offline fallback for navigation requests
          if (request.mode === 'navigate') {
            return caches.match('/index.html');
          }

          throw error;
        });
    })
  );
});

// Handle background sync
self.addEventListener('sync', event => {
  console.log('[SW] Background sync event:', event.tag);

  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Handle push notifications (future feature)
self.addEventListener('push', event => {
  console.log('[SW] Push notification received');

  const options = {
    body: 'New music available!',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    data: {
      url: '/',
    },
  };

  event.waitUntil(self.registration.showNotification('LumiDeck', options));
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('[SW] Notification clicked');

  event.notification.close();

  event.waitUntil(clients.openWindow(event.notification.data?.url || '/'));
});

// Helper function for background sync
async function doBackgroundSync() {
  try {
    // Implement background sync logic here
    // For example, sync offline data when back online
    console.log('[SW] Performing background sync');
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Handle messages from the main thread
self.addEventListener('message', event => {
  console.log('[SW] Message received:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});
