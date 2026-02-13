/* MDT ERP - Service Worker for PWA */
const CACHE_NAME = 'mdt-erp-v6';
const STATIC_ASSETS = [
    './',
    'index.html',
    'css/app.css?v=6',
    'js/app.js?v=6',
    'js/pages/dashboard.js?v=6',
    'js/pages/attendance.js?v=6',
    'js/pages/sales.js?v=6',
    'js/pages/workflows.js?v=6',
    'js/pages/problems.js?v=6',
    'js/pages/branches.js?v=6',
    'js/pages/communications.js?v=6',
    'js/pages/hr.js?v=6',
    'js/pages/import.js?v=6',
    'js/pages/ai.js?v=6',
    'js/pages/products.js?v=6',
    'js/pages/users.js?v=6',
    'js/pages/settings.js?v=6',
    'manifest.json',
];

// External CDNs to cache
const CDN_ASSETS = [
    'https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
];

// Install: cache static assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('[SW] Caching static assets');
            // Cache local assets
            cache.addAll(STATIC_ASSETS).catch(err => console.log('[SW] Some static assets failed to cache:', err));
            // Try to cache CDN assets (non-blocking)
            CDN_ASSETS.forEach(url => {
                fetch(url, { mode: 'cors' })
                    .then(response => { if (response.ok) cache.put(url, response); })
                    .catch(() => {});
            });
        })
    );
    self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys
                .filter(key => key !== CACHE_NAME)
                .map(key => caches.delete(key))
            )
        )
    );
    self.clients.claim();
});

// Fetch: Network-first for API calls, Cache-first for static assets
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // API calls (Gemini, Grok, etc.) - always network
    if (url.hostname.includes('googleapis.com') ||
        url.hostname.includes('x.ai') ||
        url.pathname.includes('/api/')) {
        event.respondWith(fetch(event.request));
        return;
    }

    // Static assets - stale-while-revalidate
    event.respondWith(
        caches.match(event.request).then(cached => {
            const fetchPromise = fetch(event.request).then(response => {
                // Update cache with fresh version
                if (response.ok) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            }).catch(() => {
                // Network failed, return cached or offline page
                return cached || new Response('ออฟไลน์ - กรุณาเชื่อมต่ออินเทอร์เน็ต', {
                    status: 503,
                    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
                });
            });

            // Return cached immediately, update in background
            return cached || fetchPromise;
        })
    );
});

// Listen for skip waiting message
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
