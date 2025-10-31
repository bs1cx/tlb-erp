import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  },
  server: {
    port: 3000,
    open: true
  },
  // SPA için doru ayar:
  appType: 'spa',
  publicDir: 'public',
  // Vercel için base path:
  base: '/',
  // Build optimizasyonu:
  optimizeDeps: {
    include: ['vue', 'pinia']
  }
})
