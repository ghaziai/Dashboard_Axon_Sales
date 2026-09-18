import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";

// Data-quality checks hit the real Supabase project (anon key, read-only --
// RLS is open for anon so no service-role secret is needed). Loads
// .env.local for local runs; CI supplies the same two env vars directly.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    test: {
      environment: "node",
      include: ["testing/validation/**/*.test.ts"],
      env: {
        NEXT_PUBLIC_SUPABASE_URL: env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
      },
    },
  };
});
