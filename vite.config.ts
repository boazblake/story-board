import {defineConfig} from "vite"
import {flowPlugin, esbuildFlowPlugin} from "@bunchtogether/vite-plugin-flow"
import path from "path"

export default defineConfig({
  optimizeDeps: {esbuildOptions: {plugins: [esbuildFlowPlugin()]}},
  plugins: [flowPlugin(),],
  resolve: {
    alias: {
      stream: "mithril-stream",
      m: "mithril",
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {outDir: "docs"},
  server: {
    port: 3001,
    open: true,
  },
  base: '/identity/'
});
