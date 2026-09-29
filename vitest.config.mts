import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    // Unit tests only -- pure functions, no network. Data-quality checks
    // against the real Supabase project live in testing/validation/ with
    // their own config (vitest.validation.config.mts, `npm run test:validation`)
    // so `npm test` stays fast and works offline.
    include: ["testing/unit/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": import.meta.dirname,
    },
  },
});
