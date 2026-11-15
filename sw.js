const SHELL = 'stinger-20261115200146-shell';
const DATA = 'stinger-20261115200146-data';
const PRECACHE = ["./","./apple-touch-icon.png","./assets/barlow-condensed-latin-600-normal-DepVgxBB.woff2","./assets/barlow-condensed-latin-700-normal-v1xN8_Wq.woff2","./assets/barlow-condensed-latin-800-normal-BKzMuPgK.woff2","./assets/barlow-condensed-latin-ext-600-normal-18ESti3H.woff2","./assets/barlow-condensed-latin-ext-700-normal-CwuXbfVR.woff2","./assets/barlow-condensed-latin-ext-800-normal-DGNyg4u8.woff2","./assets/barlow-condensed-vietnamese-600-normal-A5AYRdjN.woff2","./assets/barlow-condensed-vietnamese-700-normal-DYeBwlKR.woff2","./assets/barlow-condensed-vietnamese-800-normal-CpjukuLw.woff2","./assets/index-DQ2FYbGv.js","./assets/index-YcC5NT3B.css","./assets/inter-cyrillic-400-normal-obahsSVq.woff2","./assets/inter-cyrillic-500-normal-BasfLYem.woff2","./assets/inter-cyrillic-600-normal-CWCymEST.woff2","./assets/inter-cyrillic-ext-400-normal-BQZuk6qB.woff2","./assets/inter-cyrillic-ext-500-normal-B0yAr1jD.woff2","./assets/inter-cyrillic-ext-600-normal-Dfes3d0z.woff2","./assets/inter-greek-400-normal-B4URO6DV.woff2","./assets/inter-greek-500-normal-BIZE56-Y.woff2","./assets/inter-greek-600-normal-plRanbMR.woff2","./assets/inter-greek-ext-400-normal-DGGRlc-M.woff2","./assets/inter-greek-ext-500-normal-C4iEst2y.woff2","./assets/inter-greek-ext-600-normal-DRtmH8MT.woff2","./assets/inter-latin-400-normal-C38fXH4l.woff2","./assets/inter-latin-500-normal-Cerq10X2.woff2","./assets/inter-latin-600-normal-LgqL8muc.woff2","./assets/inter-latin-ext-400-normal-C1nco2VV.woff2","./assets/inter-latin-ext-500-normal-CV4jyFjo.woff2","./assets/inter-latin-ext-600-normal-D2bJ5OIk.woff2","./assets/inter-vietnamese-400-normal-DMkecbls.woff2","./assets/inter-vietnamese-500-normal-DOriooB6.woff2","./assets/inter-vietnamese-600-normal-Cc8MFFhd.woff2","./icon-192.png","./icon-512-maskable.png","./icon-512.png","./icon.svg","./index.html","./manifest.webmanifest"];
const DATA_FILES = ["listings.json","zips.json"];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(SHELL).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== SHELL && k !== DATA).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  const name = url.pathname.split('/').pop();
  if (DATA_FILES.includes(name)) {
    const key = new URL('./' + name, self.registration.scope).href;
    e.respondWith(fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(DATA).then(c => c.put(key, copy)); }
      return res;
    }).catch(() => caches.match(key).then(r => r || Response.error())));
    return;
  }
  if (req.mode === 'navigate') {
    e.respondWith(caches.match('./', { ignoreSearch: true }).then(r => r || fetch(req)).catch(() => caches.match('./')));
    return;
  }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(r => r || fetch(req).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(SHELL).then(c => c.put(req, copy)); }
    return res;
  })));
});
