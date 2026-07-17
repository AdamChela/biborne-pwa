// Service worker minimal : uniquement pour les notifications push (pas de mise en cache/offline
// volontairement, pour ne jamais servir une version périmée de l'app après un déploiement).

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (e) {}
  const title = data.title || "Biborne Messagerie";
  const options = {
    body: data.body || "Nouveau message",
    icon: "/icon.png",
    badge: "/icon.png",
    tag: data.conversationId || undefined, // regroupe les notifs d'une même conversation
    renotify: true,
    data: { conversationId: data.conversationId || null },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const convId = event.notification.data?.conversationId;
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientsArr) => {
      for (const c of clientsArr) {
        if ("focus" in c) {
          c.focus();
          if (convId) c.postMessage({ type: "open_conversation", conversationId: convId });
          return;
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow("/");
    })
  );
});
