import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc';
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": process.env.SERVER_URL!
    }
  },
  resolve: {
    alias: {
      "containers": path.resolve(__dirname, "src", "containers"),
      "components": path.resolve(__dirname, "src", "components"),
      "@": __dirname
    }
  }
})
