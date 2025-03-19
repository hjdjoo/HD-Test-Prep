/// <reference types="vite/types/importMeta.d.ts" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from "vite-tsconfig-paths"
import svgr from "vite-plugin-svgr";
import path from "path";
import 'dotenv/config';

// console.log(__dirname);
const VITE_NGROK_URL = process.env.VITE_URL!;
const SERVER_URL = process.env.NODE_ENV === "production" ? process.env.SERVER_URL! : process.env.DEV_SERVER_URL!;
console.log("SERVER_URL: ", SERVER_URL)
console.log("VITE_NGROK_URL", VITE_NGROK_URL);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    svgr({
      include: '**/*.svg',
    })],
  server: {
    allowedHosts: [VITE_NGROK_URL.replace("https://", "")],
    proxy: {
      "/api": {
        target: `${SERVER_URL}`,
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
