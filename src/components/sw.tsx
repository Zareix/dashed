"use client";

import { useEffect } from "react";

export const ServiceWorkerRegister = () => {
	useEffect(() => {
		if (typeof window === "undefined") {
			console.log("ServiceWorker: Window is undefined");
			return;
		}

		if (!("serviceWorker" in navigator)) {
			console.log("ServiceWorker: Not supported in this browser");
			return;
		}

		console.log("ServiceWorker: Attempting to register...");

		navigator.serviceWorker
			.register("/sw.js")
			.then((registration) => {
				console.log(
					"ServiceWorker: Registration successful with scope: ",
					registration.scope,
				);

				// Handle updates
				registration.addEventListener("updatefound", () => {
					const installingWorker = registration.installing;
					console.log("ServiceWorker: Update found");

					if (installingWorker) {
						installingWorker.addEventListener("statechange", () => {
							if (installingWorker.state === "installed") {
								if (navigator.serviceWorker.controller) {
									// New service worker is available
									console.log(
										"ServiceWorker: New content is available, page will refresh automatically",
									);
									// Auto-refresh to get the latest service worker
									window.location.reload();
								} else {
									// Content is cached for offline use
									console.log(
										"ServiceWorker: Content is cached for offline use",
									);
								}
							}
						});
					}
				});

				// Listen for messages from service worker
				navigator.serviceWorker.addEventListener("message", (event) => {
					console.log("ServiceWorker: Message received:", event.data);
				});

				// Check for updates periodically
				setInterval(() => {
					registration.update();
				}, 60000); // Check every minute
			})
			.catch((error) => {
				console.error("ServiceWorker: Registration failed", error);
			});

		// Check if service worker is already registered and controlling the page
		navigator.serviceWorker.getRegistration().then((registration) => {
			if (registration) {
				console.log(
					"ServiceWorker: Already registered with scope:",
					registration.scope,
				);

				// Check if the service worker is controlling this page
				if (navigator.serviceWorker.controller) {
					console.log("ServiceWorker: Page is controlled by service worker");
				} else {
					console.log(
						"ServiceWorker: Page is not controlled by service worker",
					);
				}
			}
		});

		// Listen for when the service worker starts controlling the page
		navigator.serviceWorker.addEventListener("controllerchange", () => {
			console.log("ServiceWorker: Controller changed - refreshing page");
			// Reload the page to ensure we're using the latest service worker
			window.location.reload();
		});
	}, []);

	return null;
};
