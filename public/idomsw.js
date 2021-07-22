(() => {
  // src/idomsw.js
  console.log("ServiceWorker started.");
  self.addEventListener("install", function(e) {
    console.log("ServiceWorker install.");
    e.waitUntil(caches.open("idom").then(function(cache) {
      return cache.addAll([]);
    }));
  });
  self.addEventListener("fetch", function(event) {
    console.log("fetch:", event.request);
    event.respondWith(caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    }));
  });
  self.addEventListener("activate", function(event) {
    return self.clients.claim();
  });
})();
