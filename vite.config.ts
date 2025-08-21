import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Use '/' for custom domain (homeheroes.help)
  build: {
    outDir: 'docs', // Output to docs folder for GitHub Pages
    assetsDir: 'assets',
  }
})