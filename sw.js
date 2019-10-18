var staticCacheName = 'rest-v1';
let homeDomain = 'http://localhost:8000'


function regServiceWorker() {

  var indexController = this;

  navigator.serviceWorker.register('./sw.js').then(function(reg) {
    console.log(reg)
    return;
}).then(console.log(navigator.serviceWorker.controller))
}

if(!navigator.serviceWorker) {}
else {
    console.log(navigator.serviceWorker)
    if (navigator.serviceWorker.controller === null) {
          regServiceWorker();
        }
}


self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
        '/css/styles.css',
        'js/dbhelper.js',
        'js/main.js',
        'js/restaurant_info.js',
        '/data/restaurants.json'
      ]);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('rest-') &&
                 cacheName != staticCacheName;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((resp) => {
      return resp || fetch(event.request).then((response) => {
          console.log("Adding: " + resp)
        return caches.open('rest-v1').then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});
