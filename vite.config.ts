/// <reference types="vite/types/importMeta.d.ts" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from "vite-tsconfig-paths"
import svgr from "vite-plugin-svgr";
import path from "path";
import 'dotenv/config';

// console.log(__dirname);
console.log("SERVER_URL: ", process.env.SERVER_URL!)
const VITE_NGROK_URL = process.env.VITE_URL!;
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
        target: "http://localhost:3000",
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
