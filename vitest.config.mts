import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["testing/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": import.meta.dirname,
    },
  },
});
