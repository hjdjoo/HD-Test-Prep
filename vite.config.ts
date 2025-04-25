/// <reference types="vite/types/importMeta.d.ts" />

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from "vite-tsconfig-paths"
import svgr from "vite-plugin-svgr";
import path from "path";
import 'dotenv/config';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd(), '');

  const VITE_SERVER_URL_DEV = env.VITE_SERVER_URL_DEV;
  const VITE_SERVER_URL_PROD = env.VITE_SERVER_URL_PROD;

  return {
    plugins: [
      react(),
      tsconfigPaths(),
      svgr({
        include: '**/*.svg',
      }),
    ],
    server: {
      allowedHosts: [VITE_SERVER_URL_DEV.replace("https://", ""),],
      proxy: {
        "/api": {
          target: `${VITE_SERVER_URL_PROD}`,
          changeOrigin: true,
          rewrite: (path) => {
            return path.replace(/^\/api/, "")
          },
        }
      }
    },
    resolve: {
      alias: {
        "containers": path.resolve(__dirname, "src", "containers"),
        "components": path.resolve(__dirname, "src", "components"),
        "@": __dirname,
      }
    }
  }
})
