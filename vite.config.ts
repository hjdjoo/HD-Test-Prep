/// <reference types="vite/types/importMeta.d.ts" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from "vite-tsconfig-paths"
import svgr from "vite-plugin-svgr";
import path from "path";
import 'dotenv/config';

// console.log(__dirname);
console.log("SERVER_URL: ", process.env.SERVER_URL!)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    svgr({
      include: '**/*.svg',
    })],
  server: {
    proxy: {
      "/api": {
        target: process.env.SERVER_URL!,
        changeOrigin: true,
        rewrite: (path) => {
          return path.replace(/^\/api/, "")
        },
      }
    }
  },
  define: {
    "process.env": process.env
  },
  resolve: {
    alias: {
      "containers": path.resolve(__dirname, "src", "containers"),
      "components": path.resolve(__dirname, "src", "components"),
      "@": __dirname,
    }
  }
})
