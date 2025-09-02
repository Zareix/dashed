console.log("Service worker script loaded!");

const cacheName = "v4"; // Updated version to force cache refresh
const urlsToCache = ["/", "/favicon.ico"];

const installEvent = () => {
	self.addEventListener("install", (event) => {
		console.log("service worker installed");

		// Pre-cache essential resources
		event.waitUntil(
			caches
				.open(cacheName)
				.then((cache) => {
					console.log("Opened cache");
					return cache.addAll(urlsToCache);
				})
				.then(() => {
					// Force the waiting service worker to become the active service worker
					return self.skipWaiting();
				}),
		);
	});
};
installEvent();

const activateEvent = () => {
	self.addEventListener("activate", (event) => {
		console.log("service worker activated");

		// Clean up old caches
		event.waitUntil(
			caches
				.keys()
				.then((cacheNames) => {
					return Promise.all(
						cacheNames
							.map((cache) => {
								if (cache !== cacheName) {
									console.log("Deleting old cache:", cache);
									return caches.delete(cache);
								}
								return null;
							})
							.filter(Boolean),
					);
				})
				.then(() => {
					// Take control of all pages immediately
					return self.clients.claim();
				}),
		);
	});
};
activateEvent();

const handleFetch = async (e) => {
	const url = new URL(e.request.url);

	// For navigation requests (HTML pages), use network-first strategy
	// This ensures fresh content is always fetched when online
	if (
		e.request.mode === "navigate" ||
		(e.request.method === "GET" &&
			e.request.headers.get("accept") &&
			e.request.headers.get("accept").includes("text/html"))
	) {
		try {
			// Try network first to get fresh content
			console.log("Trying network first for:", url.href);
			const res = await fetch(e.request, {
				signal: AbortSignal.timeout(3000),
			});

			if (res.ok) {
				// Cache the fresh content
				const responseToCache = res.clone();
				caches.open(cacheName).then((cache) => {
					console.log("Caching fresh content:", url.href);
					cache.put(e.request, responseToCache);
				});
				return res;
			}
			throw new Error("Network response was not ok");
		} catch (error) {
			// Network failed, try cache as fallback
			console.log("Network failed, trying cache for:", url.href, error.message);
			const cachedResponse = await caches.match(e.request);
			if (cachedResponse) {
				console.log("Serving stale content from cache:", url.href);
				return cachedResponse;
			}
			throw error;
		}
	}

	// For other resources (CSS, JS, images), try network first but cache aggressively
	try {
		const res = await fetch(e.request, {
			signal: AbortSignal.timeout(5000),
		});

		if (res.ok) {
			// Cache successful responses
			const responseToCache = res.clone();
			caches.open(cacheName).then((cache) => {
				cache.put(e.request, responseToCache);
			});
			return res;
		}
		throw new Error("Network response was not ok");
	} catch (error) {
		console.log("Network fetch failed, trying cache:", error.message);
		const cachedResponse = await caches.match(e.request);
		if (cachedResponse) {
			console.log("Serving from cache:", url.href);
			return cachedResponse;
		}
		throw error;
	}
};

const fetchEvent = () => {
	self.addEventListener("fetch", (e) => {
		const url = new URL(e.request.url);
		console.log("Service Worker intercepting:", url.href);

		// Skip certain requests
		if (
			e.request.url.includes("/api/trpc") ||
			e.request.url.includes("/admin") ||
			e.request.url.startsWith("chrome-extension") ||
			url.origin !== self.location.origin ||
			e.request.method !== "GET"
		) {
			console.log("Skipping request:", url.href);
			return;
		}

		e.respondWith(
			handleFetch(e).catch((error) => {
				console.error("Fetch failed completely:", error);
				// For navigation requests, return a basic offline page or cached index
				if (e.request.mode === "navigate") {
					return (
						caches.match("/") ||
						new Response("Offline", {
							status: 503,
							statusText: "Service Unavailable",
							headers: { "Content-Type": "text/plain" },
						})
					);
				}
				// For other requests, just fail
				return new Response("Network Error", {
					status: 408,
					statusText: "Request Timeout",
				});
			}),
		);
	});
};
fetchEvent();
