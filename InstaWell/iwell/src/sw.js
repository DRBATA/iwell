const CACHE_NAME = 'instawell-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/style.css',
  '/src/main.js',
  '/src/medicalGraph.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});