import { fileURLToPath } from "node:url";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Get directory name using ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Determine backend URL - default to production URL
const useLocalBackend = true; // Set to true to use local backend
const backendUrl = useLocalBackend
  ? "http://localhost:3030"
  : "https://coding-club-backend-ten.vercel.app";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: backendUrl,
        changeOrigin: true,
        secure: false,
        withCredentials: true, // Enable sending cookies with requests
        rewrite: (path) => path,
        configure: (proxy, _) => {
          proxy.on("error", (err, _req, _res) => {
            console.log("proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req, _) => {
            console.log("Sending Request to the Target:", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes, req, _) => {
            console.log(
              "Received Response from the Target:",
              proxyRes.statusCode,
              req.url
            );
          });
        },
      },
      "/.well-known": {
        target: backendUrl,
        changeOrigin: true,
        secure: false,
        withCredentials: true, // Enable sending cookies with requests
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
        drop_console: false, // Set to false for debugging
      },
    },
    sourcemap: true, // Add sourcemaps for better debugging
  },
  // Add env variables for frontend access
  define: {
    "import.meta.env.BACKEND_URL": JSON.stringify(backendUrl),
  },
});
