/* eslint-disable no-undef */
// eslint-disable-next-line no-restricted-globals
self.importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js'
);

// eslint-disable-next-line no-console
// console.log('Hello from sw.js');

if (workbox) {
  //   console.log(`Yay! Workbox is loaded 🎉`);

  workbox.routing.registerRoute(
    /\.(?:html|js|css|json)$/,
    new workbox.strategies.NetworkFirst({
      cacheName: 'site-conf'
    })
  );

  // Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
  workbox.routing.registerRoute(
    /^https:\/\/www\.snowforce\.io\/api\/.*/,
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'data'
    })
  );

  // Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
  workbox.routing.registerRoute(
    /^https:\/\/fonts\.googleapis\.com/,
    new workbox.strategies.CacheFirst({
      cacheName: 'google-fonts-stylesheets'
    })
  );

  // Cache the underlying font files with a cache-first strategy for 1 year.
  workbox.routing.registerRoute(
    /^https:\/\/fonts\.gstatic\.com/,
    new workbox.strategies.CacheFirst({
      cacheName: 'google-fonts-webfonts',
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200]
        }),
        new workbox.expiration.Plugin({
          maxAgeSeconds: 60 * 60 * 24 * 365,
          maxEntries: 30
        })
      ]
    })
  );

  workbox.routing.registerRoute(
    // Match common image extensions.
    new RegExp('\\.(?:png|gif|jpg|jpeg|webp|svg)$'),
    // Use a cache-first strategy with the following config:
    new workbox.strategies.CacheFirst({
      // You need to provide a cache name when using expiration.
      cacheName: 'images',
      plugins: [
        new workbox.expiration.Plugin({
          // Keep at most 50 entries.
          maxEntries: 50,
          // Don't keep any entries for more than 14 days.
          maxAgeSeconds: 14 * 24 * 60 * 60,
          // Automatically cleanup if quota is exceeded.
          purgeOnQuotaError: true
        })
      ]
    })
  );

  workbox.precaching.precacheAndRoute([]);

  workbox.googleAnalytics.initialize();
} else {
  //   console.log(`Boo! Workbox didn't load 😬`);
}
