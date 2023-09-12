import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    "process.env.npm_package_version": JSON.stringify(
      process.env.npm_package_version,
    ),
    "process.env.JEST_WORKER_ID": JSON.stringify(false),
  },
  plugins: [react()],
  server: {
    port: 1234,
    proxy: {
      "/.netlify/functions/auth": "http://localhost:9999",
    },
  },
  optimizeDeps: {
    // disabled: false,
  },
  test: {
    globals: true,
    globalSetup: ["global-test-setup.ts"],
    environment: "jsdom",
  },
});
