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
  // SPA i�in doru ayar:
  appType: 'spa',
  publicDir: 'public',
  // Vercel i�in base path:
  base: '/',
  // Build optimizasyonu:
  optimizeDeps: {
    include: ['vue', 'pinia']
  }
})
