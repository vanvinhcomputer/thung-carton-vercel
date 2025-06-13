// Aggressive caching service worker for PageSpeed optimization
const CACHE_NAME = 'carton-v2';
const STATIC_ASSETS = [
  '/',
  '/images/hero-optimized.webp',
  '/images/hero-optimized.jpg',
  '/hero-video-optimized.mp4',
  '/robots.txt'
];

// Install - cache critical resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate - cleanup old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch - stale-while-revalidate for images, cache-first for everything else
self.addEventListener('fetch', event => {
  const { request } = event;
  
  if (request.method !== 'GET') return;
  
  // Images - stale-while-revalidate
  if (request.destination === 'image') {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(request).then(cachedResponse => {
          const fetchPromise = fetch(request).then(networkResponse => {
            if (networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          });
          
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }
  
  // Other resources - cache first
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      return cachedResponse || fetch(request).then(response => {
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseClone);
          });
        }
        return response;
      });
    })
  );
});