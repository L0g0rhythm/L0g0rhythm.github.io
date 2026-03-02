/* FILE: sw.js */
const CACHE_NAME = "l0g0rhythm-sys-v20-no-social-dock";
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
  "./css/noscript.css",
  "./css/pages/404.css",
  "./js/main.js",
  "./js/core/appConfig.js",
  "./js/core/dataLoader.js",
  "./js/core/dictionary.js",
  "./js/core/navigation.js",
  "./js/core/toast.js",
  "./js/core/themeManager.js",
  "./js/core/languageSwitcher.js",
  "./js/core/footer.js",
  "./js/core/systemMonitor.js",
  "./js/core/scrollObserver.js",
  "./js/core/inputHandler.js",
  "./js/core/windowEvents.js",
  "./js/components/render/renderConfig.js",
  "./js/components/render/profile.js",
  "./js/components/render/profileImage.js",
  "./js/components/render/about.js",
  "./js/components/render/services.js",
  "./js/components/render/projects.js",
  "./js/components/render/socialLinks.js",
  "./js/components/render/typewriter.js",
  "./js/components/tilt.js",
  "./js/components/matrix.js",
  "./js/components/hackerText.js",
  "./js/components/cmd.js",
  "./js/components/contextMenu.js",
  "./js/components/particles.js",
  "./js/components/magnetic.js",
  "./js/pages/404.js",
  "./data/profile.json",
  "./data/about.json",
  "./data/projects.json",
  "./data/services.json",
  "./data/socials.json",
  "./data/tools.json",
  "./data/schema.json",
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

  // JSON data: network-first for freshness
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

  // Network First for all other assets
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
