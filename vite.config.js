import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
      ],

      // ==================================================
      // 📦 WORKBOX
      // ==================================================

      workbox: {
        maximumFileSizeToCacheInBytes:
          5 * 1024 * 1024,
      },

      // ==================================================
      // 📱 PWA
      // ==================================================

      manifest: {
        name: "Konan Shopping",

        short_name: "Konan",

        description:
          "Konan Shopping Cameroun - L'habilleur des stars",

        theme_color: "#2563eb",

        background_color: "#ffffff",

        display: "standalone",

        orientation: "portrait",

        scope: "/",

        start_url: "/",

        icons: [
          {
            src: "pwa-192x192.png",

            sizes: "192x192",

            type: "image/png",
          },

          {
            src: "pwa-512x512.png",

            sizes: "512x512",

            type: "image/png",
          },

          {
            src: "apple-touch-icon.png",

            sizes: "180x180",

            type: "image/png",
          },
        ],
      },
    }),
  ],
});