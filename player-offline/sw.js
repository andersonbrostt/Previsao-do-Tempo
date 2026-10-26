'use strict';
const CACHE = 'brostt-player-shell-v2';
const PAGE = new URL('./index.html', self.location).href;
const ROOT = new URL('./', self.location).href;
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll([PAGE])).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('brostt-player-shell-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  // Somente o HTML deste projeto; a API deve informar falhas ao aplicativo.
  if (request.method !== 'GET' || url.origin !== self.location.origin || ![PAGE, ROOT].includes(url.origin + url.pathname)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const response = await fetch(request, {cache: 'no-store', signal: AbortSignal.timeout(8000)});
      if (!response.ok) throw new Error('HTTP ' + response.status);
      await cache.put(PAGE, response.clone());
      return response;
    } catch (error) {
      const saved = await cache.match(PAGE);
      return saved || new Response('Abra a previsão com internet uma vez para preparar o cache.', {status: 503, headers: {'Content-Type': 'text/plain; charset=utf-8'}});
    }
  })());
});
