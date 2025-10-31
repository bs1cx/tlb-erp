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
  // �nemli: HTML dosyasn doru ilemesi i�in
  appType: 'mpa', // Multiple Page Application
  publicDir: 'public'
})
