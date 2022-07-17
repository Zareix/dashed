import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  build: {
    assetsDir: "misc",
  },
  plugins: [
    react(),
    tsconfigPaths(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["robots.txt", "assets/**/*"],
      workbox: {
        maximumFileSizeToCacheInBytes: 5000000, // 20 MB
      },
      manifest: {
        name: "Dashed",
        short_name: "Dashed",
        description: "A dashboard for your Homelab",
        theme_color: "#3d99f5",
        background_color: "#3d99f5",
        display: "minimal-ui",
        icons: [
          {
            src: "/assets/app/icons/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/assets/app/icons/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/assets/app/icons/icon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
});
