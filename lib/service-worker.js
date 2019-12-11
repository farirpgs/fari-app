importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js"
);

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

workbox.routing.registerRoute(/\.js$/, new workbox.strategies.NetworkFirst());
workbox.routing.registerRoute(/\.css$/, new workbox.strategies.NetworkFirst());
workbox.routing.registerRoute(
  /\.woff2$/,
  new workbox.strategies.NetworkFirst()
);
workbox.routing.registerRoute(/\.png$/, new workbox.strategies.NetworkFirst());
