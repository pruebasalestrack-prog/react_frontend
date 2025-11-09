import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // ← AGREGADO para Docker
    port: 5173,
    open: true,
    watch: {
      usePolling: true,  // ← AGREGADO para hot reload en Docker
    },
    hmr: {
      host: 'localhost',  // ← AGREGADO para Hot Module Replacement
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "terser",
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
    extensions: ['.mjs', '.js', '.jsx', '.json', '.ts', '.tsx']
  },
  optimizeDeps: {
    include: ['react-i18next', 'i18next', 'i18next-browser-languagedetector']
  }
})