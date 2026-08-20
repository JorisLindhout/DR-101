import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  server: {
    port: 5173,
    host: true,
    open: false,
    allowedHosts: ['.trycloudflare.com', '.loca.lt', 'localhost']
  },
  preview: {
    port: 4173,
    host: true
  },
  plugins: []
});
