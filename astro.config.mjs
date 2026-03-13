// @ts-check

import node from "@astrojs/node";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import {
	defineConfig,
	fontProviders,
	passthroughImageService,
} from "astro/config";

// https://astro.build/config
export default defineConfig({
	integrations: [
		react({
			babel: {
				plugins: [["babel-plugin-react-compiler"]],
			},
		}),
	],

	vite: {
		plugins: [tailwindcss()],
	},

	image: {
		service: passthroughImageService(),
		remotePatterns: [
			{
				protocol: "https",
				hostname: "cdn.jsdelivr.net",
				pathname: "/gh/homarr-labs/dashboard-icons/**",
			},
		],
	},

	fonts: [
		{
			provider: fontProviders.fontsource(),
			name: "Geist",
			cssVariable: "--font-sans",
		},
	],

	security: {
		checkOrigin: false,
	},

	// adapter: bun(),
	output: "server",
	adapter: node({
		mode: "standalone",
	}),
});
