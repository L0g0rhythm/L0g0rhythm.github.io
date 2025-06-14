// sw.js - Basic Offline Cache Service Worker

const CACHE_NAME = "l0g0rhythm-profile-cache-v2"; // Versão do cache incrementada
const urlsToCache = [
  "/",
  "index.html",
  "404.html",
  "manifest.json",
  "css/style.css",
  "css/responsive.css",
  "css/base/_reset.css",
  "css/base/_variables.css",
  "css/base/_base.css",
  "css/layout/_background.css",
  "css/components/_card.css",
  "css/components/_sidebar.css",
  "css/components/_main-content.css",
  "css/components/_tabs.css",
  "css/components/_social-icons.css",
  "css/components/_lists.css",
  "css/pages/_404.css",
  "css/utilities/_animations.css",
  "js/main.js", // Arquivo de entrada principal
  "js/core/dataLoader.js", // Módulos
  "js/components/renderer.js",
  "js/components/tabs.js",
  "js/components/card-tilt.js",
  "images/profile.webp",
  "images/favicon.ico",
  "images/favicon-16x16.png",
  "images/favicon-32x32.png",
  "images/apple-touch-icon.png",
  "data/about.json",
  "data/profile.json",
  "data/projects.json",
  "data/services.json",
  "data/socials.json",
  "data/tools.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("SW install failed:", error);
      })
  );
});

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
        return self.clients.claim();
      })
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
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
          console.error("SW fetch failed:", error);
          if (event.request.destination === "document") {
            return caches.match("404.html");
          }
        });
    })
  );
});
