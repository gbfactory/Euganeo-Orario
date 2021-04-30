const staticEuganeoOrario = "sito-euganeo-orario";
const assets = [
  "/orario/",
  "/orario/index.html",
  "/orario/css/style.css",
  "/orario/js/turni.js",
  "/orario/js/gruppi.js",
  "/orario/js/script.js"
];

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticEuganeoOrario).then(cache => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request);
    })
  );
});