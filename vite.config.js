import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: true,
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
  // Base path için (Vercel deploy için önemli):
  base: './'
})
