// Service worker mínimo de Morochos OS EC.
// Hace que el navegador permita "Instalar aplicación" y deja abrir la app aunque se caiga el internet un momento.
// Siempre intenta primero la versión nueva de internet, así las actualizaciones llegan solas.
const CACHE = 'morochos-os-ec-v1';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || !req.url.startsWith(self.location.origin)) return;   // Firebase y otros sitios no se tocan
  e.respondWith(
    fetch(req).then(res => {
      if (res && res.ok) { const copia = res.clone(); caches.open(CACHE).then(c => c.put(req, copia)).catch(() => {}); }
      return res;
    }).catch(() => caches.match(req).then(r => r || caches.match('./') ))
  );
});
