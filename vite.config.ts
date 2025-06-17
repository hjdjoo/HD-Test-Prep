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

  const isProd = mode === "production";

  const VITE_SERVER_URL = env.VITE_SERVER_URL ?? ""
  const VITE_URL = env.VITE_URL ?? "";

  if (!VITE_SERVER_URL || !VITE_URL) {
    console.warn(
      `[vite] missing env vars for mode=${mode}; using defaults`,
    );
  }

  const allowedHost = isProd ?
    VITE_URL.replace(/^https?:\/\//, "") :
    VITE_URL.replace(/^https?:\/\//, "")


  return {
    plugins: [
      react(),
      tsconfigPaths(),
      svgr({
        include: '**/*.svg',
      }),
    ],
    server: {
      allowedHosts: [allowedHost],
      proxy: {
        "/api": {
          target: `${VITE_SERVER_URL}`,
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
    },
    test: {
      globals: true,
      environment: "jsdom",
      coverage: {
        enabled: true,
        provider: "v8",
        reportOnFailure: true,
      },
      reporters: ["html"],
      setupFiles: ["./vitest.setup.ts"],
    }
  }
})
