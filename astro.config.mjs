// @ts-check

import react from "@astrojs/react";
import bun from "@nurodev/astro-bun";
import tailwindcss from "@tailwindcss/vite";
import {
    defineConfig,
    fontProviders,
    passthroughImageService,
} from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],

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

  experimental: {
      fonts: [
          {
              provider: fontProviders.google(),
              name: "Geist",
              cssVariable: "--font-sans",
          },
      ],
	},

  security: {
      checkOrigin: false,
	},

  output: "server",

  adapter: bun()
});
