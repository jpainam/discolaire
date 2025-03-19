// apps/workers/tsup.config.ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/server.ts"], // both worker and dashboard
  outDir: "dist",
  splitting: false,
  clean: true,
  minify: true,
  format: ["esm", "cjs"],
  target: "node22",
  sourcemap: true,
  dts: false, // no type defs needed for a worker
});
