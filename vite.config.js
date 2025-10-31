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
  // SPA i�in doru ayar:
  appType: 'spa',
  publicDir: 'public',
  // Base path i�in (Vercel deploy i�in �nemli):
  base: './'
})
