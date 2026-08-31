/* VanSchalkwyk Ledger offline cache. Bump CACHE when index.html changes. */
const CACHE = 'vanschalkwyk-ledger-v5';
const ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(hit => {
      if(hit){
        // refresh the cached copy quietly in the background
        fetch(e.request).then(r => { if(r && r.ok) caches.open(CACHE).then(c => c.put(e.request, r.clone())); }).catch(()=>{});
        return hit;
      }
      return fetch(e.request).then(r => {
        if(r && r.ok) caches.open(CACHE).then(c => c.put(e.request, r.clone()));
        return r;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
