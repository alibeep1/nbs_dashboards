import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  base: "./",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    outDir: "dist",
    // assetsDir: "assets",
    assetsInlineLimit: 100000000, // Inline everything
    emptyOutDir: false, // ADD THIS - prevents clearing dist folder

    // rollupOptions: {
    //   output: {
    //     manualChunks: undefined, // Keep everything in one bundle if needed
    //     assetFileNames: "assets/[name]-[hash][extname]",
    //     chunkFileNames: "assets/[name]-[hash].js",
    //     entryFileNames: "assets/[name]-[hash].js",
    //   },
    // },
    // assetsInlineLimit: 4096 * 10, // Increase inline limit
  },
});

// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
