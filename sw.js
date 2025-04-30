const CACHE_NAME = 'poliedro-cache-v1';
const assets = [
  './',
  './index.html',
  './style.css',
  './script.js',
  // inclua aqui todas as imagens e CSS/JS necessários
];

self.addEventListener('install', evt => {
  evt.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(assets)));
});

self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(resp => resp || fetch(evt.request))
  );
});
