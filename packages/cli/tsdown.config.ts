import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  // bin-only package: no public API, so no type declarations
  dts: false,
  sourcemap: true,
  clean: true,
  platform: "node",
  // commander 15 requires Node >= 22.12
  target: "node22",
  outDir: "dist",
  outExtensions: () => ({ js: ".js" }),
  deps: {
    neverBundle: ["@cwa-dou/telekit-core", "commander", "zod"],
  },
});
