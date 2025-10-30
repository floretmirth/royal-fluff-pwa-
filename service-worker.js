const CACHE_NAME = 'royal-fluff-v1';
const ASSETS = [
  './',
  './Royal_Fluff_Prototype.html',
  './manifest.json',
  './app-icon.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((res) => {
        return caches.open(CACHE_NAME).then((cache) => {
          try { cache.put(event.request, res.clone()); } catch(e){}
          return res;
        });
      }).catch(()=>{
        // If request fails, try to return a fallback page for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('./Royal_Fluff_Prototype.html');
        }
      });
    })
  );
});