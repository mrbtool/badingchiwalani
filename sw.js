const CACHE_NAME = 'bading-chiwalani-v2';
const ASSETS_TO_CACHE = [
    './', 
    './index.html', // Assumes your main file is named index.html
    'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://raw.githubusercontent.com/mrbtool/badingchiwalani/main/badingchiwalani.png'
];

// 1. Install Event: Cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Caching all: app shell and content');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// 2. Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('[Service Worker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

// 3. Fetch Event: Serve from Cache, fall back to Network
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests (like Firebase APIs) to ensure real-time data
    if (!event.request.url.startsWith(self.location.origin) && !event.request.url.includes('fonts') && !event.request.url.includes('cdnjs')) {
        return; 
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            // Return cache if found, otherwise fetch from network
            return response || fetch(event.request).then((networkResponse) => {
                return caches.open(CACHE_NAME).then((cache) => {
                    // Cache the new resource for next time
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            });
        }).catch(() => {
            // Optional: Return an offline.html if network fails and cache missing
            // return caches.match('./offline.html');
        })
    );
});
