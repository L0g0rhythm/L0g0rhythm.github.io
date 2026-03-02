/* FILE: sw.js */
const CACHE_NAME = "l0g0rhythm-sys-v17-apex";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./404.html",
  "./manifest.json",
  "./css/base/variables.css",
  "./css/base/reset.css",
  "./css/base/base.css",
  "./css/base/typography.css",
  "./css/layout/structure.css",
  "./css/layout/background.css",
  "./css/components/navbar.css",
  "./css/components/hero.css",
  "./css/components/glass.css",
  "./css/components/about.css",
  "./css/components/cards.css",
  "./css/components/footer.css",
  "./css/components/loader.css",
  "./css/components/cmd.css",
  "./css/components/context-menu.css",
  "./css/utilities/animations.css",
  "./css/responsive.css",
  "./js/main.js",
  "./js/core/dataLoader.js",
  "./js/core/audioSynth.js",
  "./js/core/dictionary.js",
  "./js/components/renderer.js",
  "./js/components/tilt.js",
  "./js/components/matrix.js",
  "./js/components/hackerText.js",
  "./js/components/cmd.js",
  "./js/components/contextMenu.js",
  "./js/components/particles.js",
  "./js/components/magnetic.js",
  "./data/profile.json",
  "./data/about.json",
  "./data/projects.json",
  "./data/services.json",
  "./data/socials.json",
  "./data/tools.json",
  "./images/profile.webp",
  "./images/favicon.ico",
  "./images/favicon-32x32.png",
  "./images/favicon-16x16.png",
  "./images/android-chrome-192x192.png",
  "./images/android-chrome-512x512.png",
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches
        .keys()
        .then((keys) =>
          Promise.all(
            keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null))
          )
        ),
    ])
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // JSON data: always attempt fresh network fetch first
  if (url.pathname.endsWith(".json")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Network First strategy for all other assets
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        const clone = networkResponse.clone();
        caches
          .open(CACHE_NAME)
          .then((cache) => cache.put(event.request, clone));
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});
