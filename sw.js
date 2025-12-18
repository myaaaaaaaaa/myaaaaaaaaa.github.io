// Minimal pass-through service worker required for PWA installability
// self.addEventListener('fetch', (event) => {
// 	event.respondWith(fetch(event.request));
// });

// https://jakearchibald.com/2014/offline-cookbook/#stale-while-revalidate
// POST, PUT: bypass cache
// GET, all others : stale while revalidate
// activate: clear cache

self.addEventListener('fetch', (event) => {
	if (event.request.method !== 'GET')
		return;

	event.respondWith(
		(async function () {
			const cache = await caches.open('mysite-dynamic');
			const cachedResponse = await cache.match(event.request);
			const networkResponsePromise = fetch(event.request);

			event.waitUntil(
				(async function () {
					const networkResponse = await networkResponsePromise;
					await cache.put(event.request, networkResponse.clone());
				})(),
			);

			// Returned the cached response if we have one, otherwise return the network response.
			return cachedResponse || networkResponsePromise;
		})(),
	);
});
self.addEventListener('activate', (event) => {
	event.waitUntil(
		(async function () {
			const cacheNames = await caches.keys();
			for (const cacheName of cacheNames)
				await caches.delete(cacheName);

			console.log('deleted');
			console.log(cacheNames);
			console.log(await caches.keys());
		})(),
	);
});
