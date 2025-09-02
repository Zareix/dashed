console.log("Service worker script loaded!");

const installEvent = () => {
	self.addEventListener("install", () => {
		console.log("service worker installed");
	});
};
installEvent();

const activateEvent = () => {
	self.addEventListener("activate", () => {
		console.log("service worker activated");
	});
};
activateEvent();

const cacheName = "v3";

const handleFetch = async (e) => {
	const res = await fetch(e.request, {
		signal: AbortSignal.timeout(2000),
	});
	if (res.ok) {
		const cache = await caches.open(cacheName);
		await cache.put(e.request, res.clone());
		return res;
	}
	throw new Error("Network response was not ok");
};

const fetchEvent = () => {
	self.addEventListener("fetch", (e) => {
		const url = new URL(e.request.url);
		console.log("Service Worker intercepting:", url.href);

		// Special test endpoint
		if (url.pathname === "/sw-test") {
			console.log("Service Worker: Handling test request!");
			e.respondWith(
				new Response("Service Worker is working!", {
					headers: { "Content-Type": "text/plain" },
				}),
			);
			return;
		}

		// Skip certain requests
		if (
			e.request.url.includes("/api/trpc") ||
			e.request.url.includes("/admin") ||
			e.request.url.startsWith("chrome-extension") ||
			url.origin !== self.location.origin
		) {
			console.log("Skipping request:", url.href);
			return;
		}

		e.respondWith(
			handleFetch(e)
				.catch(() => caches.match(e.request))
				.then((res) => res || fetch(e.request)),
		);
	});
};
fetchEvent();
