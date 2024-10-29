/// <reference types="vite/types/importMeta.d.ts" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from "vite-tsconfig-paths"
import path from "path";
import 'dotenv/config';

// console.log(__dirname)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    proxy: {
      "/api": process.env.SERVER_URL!
    }
  },
  define: {
    "process.env": process.env
  },
  resolve: {
    alias: {
      "containers": path.resolve(__dirname, "src", "containers"),
      "components": path.resolve(__dirname, "src", "components"),
      "@": __dirname
    }
  }
})
