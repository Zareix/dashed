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

				registration.addEventListener("updatefound", () => {
					console.log("ServiceWorker: Update found");
				});

				navigator.serviceWorker.addEventListener("message", (event) => {
					console.log("ServiceWorker: Message received:", event.data);
				});
			})
			.catch((error) => {
				console.error("ServiceWorker: Registration failed", error);
			});

		// Check if service worker is already registered
		navigator.serviceWorker.getRegistration().then((registration) => {
			if (registration) {
				console.log(
					"ServiceWorker: Already registered with scope:",
					registration.scope,
				);
			}
		});
	}, []);

	return null;
};
