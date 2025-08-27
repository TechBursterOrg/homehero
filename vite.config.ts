import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    base: '/', // Use '/' for custom domain (homeheroes.help)
    build: {
      outDir: 'docs', // Output to docs folder for GitHub Pages
      assetsDir: 'assets',
    },
    server: {
      port: 5173,
      proxy: mode === 'development' ? {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
        }
      } : undefined,
    },
    define: {
      // Expose env variables to client
      'process.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL || ''),
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
  }
})