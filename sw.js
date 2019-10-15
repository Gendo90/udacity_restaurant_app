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
        // '../../css',
        '/css/styles.css',
        // '../../js',
        'js/dbhelper.js',
        'js/main.js',
        'js/restaurant_info.js',
        // '../../img',
        // '../../img/1.jpg',
        // '../../img/2.jpg',
        // '../../img/3.jpg',
        // '../../img/4.jpg',
        // '../../img/5.jpg',
        // '../../img/6.jpg',
        // '../../img/7.jpg',
        // '../../img/8.jpg',
        // '../../img/9.jpg',
        // '../../img/10.jpg',
        // '../../data',
        '/data/restaurants.json',
        // '../../index.html',
        // '../../restaurant.html'
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

// self.addEventListener('fetch', function(event) {
//   if(event.request.url===homeDomain+"/" || event.request.url===homeDomain) {
//       event.respondWith(caches.match("/skeleton").then(function(response) {
//           return response || fetch("/skeleton");
//       }))
//   }
//   else {
//       event.respondWith(
//           caches.match(event.request).then(function(response) {
//               return response || fetch(event.request);
//           })
//       );
//   }
// });

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

// TODO: listen for the "message" event, and call
// skipWaiting if you get the appropriate message
// self.addEventListener('message', function(event) {
//     if(event.data['refresh']===true){
//         self.skipWaiting()
//     }
// })
//
