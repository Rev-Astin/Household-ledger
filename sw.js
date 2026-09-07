/* VanSchalkwyk Ledger offline cache. Bump CACHE when index.html changes. */
const CACHE = 'vanschalkwyk-ledger-v6';
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

/* Clone before anything reads the body. caches.open() is asynchronous, so cloning
   inside its callback happens after the response has been handed to the page and
   consumed — which throws "Response body is already used" and fails the request. */
function stash(request, response) {
  if (!response || !response.ok) return;
  const copy = response.clone();
  caches.open(CACHE).then(c => c.put(request, copy)).catch(() => {});
}

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  /* Only ever touch our own files. The shared sync talks to script.google.com, and a
     service worker that intercepts those requests breaks them — it has no business
     caching another origin's replies. Returning without respondWith lets the browser
     handle it natively. */
  let url;
  try { url = new URL(e.request.url); } catch (err) { return; }
  if (url.origin !== self.location.origin) return;

  e.respondWith(
    caches.match(e.request).then(hit => {
      if (hit) {
        // refresh the cached copy quietly in the background
        fetch(e.request).then(r => stash(e.request, r)).catch(() => {});
        return hit;
      }
      return fetch(e.request).then(r => {
        stash(e.request, r);
        return r;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
