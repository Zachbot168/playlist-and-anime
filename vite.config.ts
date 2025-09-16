import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Production optimization
  build: {
    target: 'es2020',
    outDir: 'dist',
    sourcemap: true,
    minify: 'esbuild',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          audio: ['music-metadata'],
          database: ['dexie'],
          utils: ['clsx', '@paralleldrive/cuid2', 'hash-wasm'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },

  // Development optimization
  server: {
    hmr: true,
    host: true,
  },

  // Path resolution
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@components': fileURLToPath(
        new URL('./src/components', import.meta.url)
      ),
      '@db': fileURLToPath(new URL('./src/db', import.meta.url)),
      '@services': fileURLToPath(new URL('./src/services', import.meta.url)),
      '@stores': fileURLToPath(new URL('./src/stores', import.meta.url)),
      '@types': fileURLToPath(new URL('./src/types', import.meta.url)),
      '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
      '@hooks': fileURLToPath(new URL('./src/hooks', import.meta.url)),
      '@styles': fileURLToPath(new URL('./src/styles', import.meta.url)),
      '@workers': fileURLToPath(new URL('./src/workers', import.meta.url)),
    },
  },

  // Environment variables
  define: {
    __DEV__: JSON.stringify(process.env['NODE_ENV'] === 'development'),
  },

  // PWA optimization
  worker: {
    format: 'es',
  },
});
