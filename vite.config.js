import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: false,
    assetsDir: 'assets',
    emptyOutDir: true
  },
  base: './',
  publicDir: 'public',
  appType: 'spa'
})
