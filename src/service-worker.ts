/// <reference lib="webworker" />

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst, NetworkFirst } from 'workbox-strategies';
import { BackgroundSyncPlugin } from 'workbox-background-sync';
import { Queue } from 'workbox-background-sync';

declare const self: ServiceWorkerGlobalScope;

// Take control of all pages immediately
clientsClaim();

// Create a background sync queue for swipe actions
const swipeQueue = new Queue('swipeQueue', {
  maxRetentionTime: 24 * 60 // Retry for up to 24 hours
});

// Create a background sync plugin
const backgroundSyncPlugin = new BackgroundSyncPlugin('swipeQueue', {
  maxRetentionTime: 24 * 60 // Retry for up to 24 hours
});

// Precache all static assets generated by the build process
precacheAndRoute(self.__WB_MANIFEST);

// Handle single-page application routing
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(
  ({ request, url }: { request: Request; url: URL }) => {
    if (request.mode !== 'navigate') {
      return false;
    }
    if (url.pathname.startsWith('/_')) {
      return false;
    }
    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    }
    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
);

// Cache job listings with Network First strategy
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/jobs'),
  new NetworkFirst({
    cacheName: 'jobs-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 60, // 30 minutes
      }),
    ],
  })
);

// Handle swipe actions with background sync
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/swipe'),
  async ({ url, request }) => {
    try {
      const response = await fetch(request.clone());
      return response;
    } catch (error) {
      await swipeQueue.pushRequest({ request });
      return new Response('Offline swipe action queued', {
        status: 202,
        statusText: 'Accepted'
      });
    }
  },
  'POST'
);

// Cache chat messages with Network First strategy
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/chat'),
  new NetworkFirst({
    cacheName: 'chat-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 200,
        maxAgeSeconds: 60 * 60, // 1 hour
      }),
    ],
  })
);

// Cache other API responses with Stale While Revalidate
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new StaleWhileRevalidate({
    cacheName: 'api-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60, // 5 minutes
      }),
    ],
  })
);

// Cache images and static assets
registerRoute(
  ({ request }) => request.destination === 'image' ||
                   request.destination === 'style' ||
                   request.destination === 'script' ||
                   request.destination === 'font',
  new CacheFirst({
    cacheName: 'static-assets',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
      }),
    ],
  })
);

// Handle push notifications
self.addEventListener('push', (event: PushEvent) => {
  if (!event.data) return;

  try {
    const data: PushNotificationData = event.data.json();
    const options: NotificationOptions = {
      body: data.body,
      icon: data.icon || '/logo192.png',
      badge: '/badge.png',
      data: data.data,
      vibrate: [200, 100, 200],
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  } catch (error) {
    console.error('Error showing push notification:', error);
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();

  if (event.notification.data?.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});

// Listen for sync events
self.addEventListener('sync', (event) => {
  if (event.tag === 'swipeQueue') {
    event.waitUntil(swipeQueue.replayRequests());
  }
});

// Notify the client when offline actions are synced
self.addEventListener('backgroundsyncreplay', ((event: SyncEvent) => {
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({
        type: 'BACKGROUND_SYNC_COMPLETED',
        tag: event.tag
      });
    });
  });
}) as EventListener);
