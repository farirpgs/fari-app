importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js"
);
workbox.googleAnalytics.initialize();

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

// Cache root html
const routesToCache = [
  // website
  "/",
  // manifest.webmanifest
  "/?utm_source=homescreen",
  "/games",
  "/dice",
  "/scenes",
  "/about"
];

routesToCache.forEach(route => {
  workbox.routing.registerRoute(
    route,
    new workbox.strategies.NetworkFirst({ cacheName: "fari-routes" })
  );
});

// Cache JS
workbox.routing.registerRoute(
  /\.js$/,
  new workbox.strategies.NetworkFirst({
    cacheName: "fari-js"
  })
);
// Cache CSS
workbox.routing.registerRoute(
  /\.css$/,
  new workbox.strategies.NetworkFirst({ cacheName: "fari-css" })
);
// Cache manifest
workbox.routing.registerRoute(
  /\.webmanifest$/,
  new workbox.strategies.NetworkFirst({ cacheName: "fari-manifest" })
);
// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "fari-google-fonts-stylesheet"
  })
);
// Cache the underlying font files with a cache-first strategy for 1 year.
workbox.routing.registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  new workbox.strategies.CacheFirst({
    cacheName: "fari-google-fonts-webfonts",
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
// Cache images
workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|webp|svg)$/,
  new workbox.strategies.CacheFirst({
    cacheName: "fari-images",
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
      })
    ]
  })
);
