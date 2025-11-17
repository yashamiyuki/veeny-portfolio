const CACHE_NAME = "veeny-portfolio-v1.2";
const urlsToCache = [
  "/",
  "/css/style.css",
  "/js/script.js",
  "profile picture - bautista.jpg",
  "MOS Associate - Bautista.png",
  "MOS Word-Bautista.png",
  "MOS Powerpoint-Bautista.png",
  "MOS Excel-Bautista.png",
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});
