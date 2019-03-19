self.addEventListener('install', e => {
    e.waitUntil(
        // after the service worker is installed,
        // open a new cache
        caches.open('my-pwa-cache').then(cache => {
            // add all URLs of resources we want to cache
            return cache.addAll([
                '/static/resources/img/icons/android-chrome-192x192.png',
                '/static/resources/img/icons/android-chrome-512x512.png',
                '/static/resources/img/icons/apple-touch-icon.png',
                '/static/resources/img/icons/browserconfig.xml',
                '/static/resources/img/icons/favicon.ico',
                '/static/resources/img/icons/favicon-16x16.png',
                '/static/resources/img/icons/favicon-32x32.png',
                '/static/resources/img/icons/mstile-70x70.png',
                '/static/resources/img/icons/mstile-144x144.png',
                '/static/resources/img/icons/mstile-150x150.png',
                '/static/resources/img/icons/mstile-310x150.png',
                '/static/resources/img/icons/mstile-310x310.png',
                '/static/resources/img/icons/safari-pinned-tab.svg',
                '/static/resources/img/icons/site.webmanifest',
                '/static/resources/img/favicon.ico',
                '/static/resources/img/index_img.jpg',
                '/static/resources/img/login_img.jpg',
                '/static/resources/img/logo.png',
                '/static/resources/css/style.min.css',
                '/static/resources/css/queries.min.css',
                '/static/resources/css/mobile.min.css',
                '/static/resources/js/script.min.js',
            ]);
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});
