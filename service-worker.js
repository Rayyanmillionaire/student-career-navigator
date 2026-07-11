const CACHE_NAME = 'scn-v13';
const ASSETS = [
    './',
    './index.html',
    './offline.html',
    './css/variables.css',
    './css/base.css',
    './css/layout.css',
    './css/components.css',
    './css/animations.css',
    './css/pages.css',
    './js/app.js',
    './js/router.js',
    './js/store.js',
    './js/auth.js',
    './js/theme.js',
    './js/pwa.js',
    './js/utils.js',
    './js/charts.js',
    './js/components.js',
    './data/roadmaps.json',
    'https://unpkg.com/lucide@latest/dist/umd/lucide.js',
    'https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400&display=swap'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                // Try to cache everything, but don't fail if CDNs are slow
                return Promise.allSettled(
                    ASSETS.map(url => {
                        const request = new Request(url, { mode: 'no-cors' });
                        return fetch(request).then(response => cache.put(request, response));
                    })
                );
            })
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request)
                    .then(response => {
                        // Cache new requests for future
                        if (response.status === 200) {
                            const responseClone = response.clone();
                            caches.open(CACHE_NAME).then(cache => {
                                cache.put(event.request, responseClone);
                            });
                        }
                        return response;
                    })
                    .catch(() => {
                        // Offline fallback for navigation requests
                        if (event.request.mode === 'navigate') {
                            return caches.match('./offline.html');
                        }
                        return new Response('', { status: 408, statusText: 'Request Timeout' });
                    });
            })
    );
});
