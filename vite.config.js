import { fileURLToPath } from "node:url";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Get directory name using ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Determine backend URL - default to production URL
const useLocalBackend = false; // Set to true to use local backend
const backendUrl = useLocalBackend
  ? "http://localhost:3030"
  : "https://coding-club-backend-ten.vercel.app";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "https://coding-club-backend-ten.vercel.app",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path,
      },
    },
    cors: true, // Enable CORS for development server
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
  // Add env variables for frontend access
  define: {
    "import.meta.env.BACKEND_URL": JSON.stringify(backendUrl),
  },
});
