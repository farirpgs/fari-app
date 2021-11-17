import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    "process.env.npm_package_version": JSON.stringify(
      process.env.npm_package_version
    ),
    "process.env.JEST_WORKER_ID": JSON.stringify(false),
  },
  plugins: [
    react(),
    legacy({
      targets: ["defaults", "not IE 11"],
    }),
  ],
  server: {
    port: 1234,
  },
});
