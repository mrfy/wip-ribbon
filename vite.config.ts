import icons, { ViteIconsResolver } from "vite-plugin-icons";

import components from "vite-plugin-components";
import { defineConfig } from "vite";
import dts from "vite-dts";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  build: {
    lib: {
      entry: "src/main.ts",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format}.js`,
    },
    sourcemap: true,
    // Reduce bloat from legacy polyfills.
    target: "esnext",
    // Leave minification up to applications.
    minify: false,
  },
  plugins: [
    dts(),
    components({
      customComponentResolvers: ViteIconsResolver({ componentPrefix: "" }),
    }),
    icons(),
    vue({
      script: {
        refSugar: true,
      },
    }),
  ],
});
