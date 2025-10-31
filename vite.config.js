import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  server: {
    port: 3000,
    open: true
  },
  // Önemli: HTML dosyasn doru ilemesi için
  appType: 'mpa', // Multiple Page Application
  publicDir: 'public'
})
