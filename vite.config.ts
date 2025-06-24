import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // 👈 Ensures paths are correctly resolved when hosted
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
 