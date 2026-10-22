import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/nara': {
        target: 'https://router.bynara.id/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/nara/, ''),
        secure: false,
      },
      '/api/openrouter': {
        target: 'https://openrouter.ai/api/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/openrouter/, ''),
        secure: false,
      },
      '/api/agentrouter': {
        target: 'https://agentrouter.ai/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/agentrouter/, ''),
        secure: false,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-docx': ['docx', 'file-saver'],
          'vendor-pdf': ['jspdf', 'html2canvas'],
          'vendor-dnd': ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
        },
      },
    },
  },
});
