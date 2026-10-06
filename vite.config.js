import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalized = id.replace(/\\/g, '/');
          if (normalized.includes('/node_modules/')) {
            // Three.js core math & webgl runtime
            if (normalized.includes('/node_modules/three/')) {
              return 'vendor-three';
            }
            // React Three Fiber & Drei helpers
            if (
              normalized.includes('/node_modules/@react-three/') ||
              normalized.includes('/node_modules/r3f-')
            ) {
              return 'vendor-r3f';
            }
            // Framer Motion animation engine
            if (normalized.includes('/node_modules/framer-motion/')) {
              return 'vendor-motion';
            }
            // React Core runtime
            if (
              normalized.includes('/node_modules/react/') ||
              normalized.includes('/node_modules/react-dom/')
            ) {
              return 'vendor-react';
            }
            // Lucide Icons
            if (normalized.includes('/node_modules/lucide-react/')) {
              return 'vendor-icons';
            }
          }
        },
      },
    },
  },
});
