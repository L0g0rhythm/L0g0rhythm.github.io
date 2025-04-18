// sw.js - Basic Offline Cache Service Worker

const CACHE_NAME = "l0g0rhythm-profile-cache-v1";
const urlsToCache = [
  "/", // Represents index.html at root
  "index.html",
  "404.html",
  "manifest.json",
  "css/style.css",
  "css/base.css",
  "css/card.css",
  "css/tabs.css",
  "css/buttons.css",
  "css/projects.css",
  "css/services.css",
  "css/404.css",
  "css/responsive.css",
  "css/synthwave-background.css",
  "js/script.js",
  "images/profile.webp",
  "images/favicon.ico",
  "images/favicon-16x16.png",
  "images/favicon-32x32.png",
  "images/apple-touch-icon.png",
  "data/about.json",
  "data/projects.json",
  "data/services.json",
  "data/socials.json",
  // Note: External resources (Google Fonts, Font Awesome) are typically not cached here
  // as browser caching handles them effectively.
];

// Install event: cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        return self.skipWaiting(); // Activate new SW immediately
      })
      .catch((error) => {
        console.error("SW install failed:", error);
      })
  );
});

// Activate event: clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim(); // Take control of pages immediately
      })
  );
});

// Fetch event: Cache-first strategy
self.addEventListener("fetch", (event) => {
  // Ignore non-GET requests
  if (event.request.method !== "GET") {
    return;
  }
  // Ignore external resources for this basic cache strategy
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Cache hit - return response
      if (cachedResponse) {
        return cachedResponse;
      }

      // Not in cache - fetch from network, cache it, then return
      return fetch(event.request)
        .then((networkResponse) => {
          // Check if we received a valid response
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type !== "basic"
          ) {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        })
        .catch((error) => {
          // Network request failed (offline?)
          console.error("SW fetch failed:", error);
          // Optional: return a fallback offline page if needed
          // For now, just let the browser handle the failed fetch
        });
    })
  );
});
