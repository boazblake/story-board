import { defineConfig } from "vite"
import path from "path"

export default defineConfig({
  resolve: {
    alias: {
      stream: "mithril-stream",
      m: "mithril",
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: { outDir: "docs" },
  server: {
    port: 2000,
    open: true,
  },
  base: './'
});
