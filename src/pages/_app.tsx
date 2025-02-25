import type { AppType } from "next/app";
import Head from "next/head";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { api } from "~/utils/api";
import { GeistSans } from "geist/font/sans";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
	useEffect(() => {
		if ("serviceWorker" in navigator) {
			navigator.serviceWorker
				.register("/service-worker.js")
				.then((registration) => console.log("scope is: ", registration.scope));
		}
	}, []);

	return (
		<>
			<style jsx global>{`
        :root {
          --font-sans: ${GeistSans.variable};
        }
        html {
          font-family: ${GeistSans.style.fontFamily};
        }
      `}</style>
			<Head>
				<title>Dashed</title>
				<meta name="description" content="Dashed" />
			</Head>
			<main className="flex min-h-screen flex-col items-center p-2 pb-16">
				<Component {...pageProps} />
			</main>
			<Toaster
				toastOptions={{
					className:
						"bg-background/80 backdrop-blur-sm border-border text-foreground",
				}}
			/>
		</>
	);
};

export default api.withTRPC(MyApp);
