var cachename = 'static-cache'
var urlstocache = [
  'index.html',
  'page2.html',
  'style.css',
  './images/'
];

// install/cache page assets
self.addEventListener('install', function (event) {
  console.log("install")
  event.waitUntil(
    caches.open(cachename)
      .then(function (cache) {
        console.log('cache opened')
        return cache.addAll(urlstocache)
      })
  )
})

self.addEventListener('fetch', function(event) {
  console.log("fetch")
  event.respondWith(
    caches.open(cachename).then(function(cache) {
      return cache.match(event.request).then(function (response) {
        return response || fetch(event.request).then(function(response) {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});

self.addEventListener('activate', event => {
  console.log("activate")
    var cacheKeeplist = [cachename];
    event.waitUntil(
        caches.keys().then( keyList => {
            return Promise.all(keyList.map( key => {
                if (cacheKeeplist.indexOf(key) === -1) {
                    return caches.delete(key);
                }
            }));
        })
.then(self.clients.claim())); //this line is important in some contexts
});
