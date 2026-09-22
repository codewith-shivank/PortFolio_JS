import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

function mockApiPlugin() {
  return {
    name: 'mock-api-endpoints',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && (req.url === '/health' || req.url.startsWith('/api/'))) {
          res.setHeader('Content-Type', 'application/json');
          if (req.url === '/health' || req.url.startsWith('/api/health')) {
            return res.end(JSON.stringify({ status: 'OK', uptime: Math.floor(process.uptime()) }));
          }
          if (req.url.startsWith('/api/contact')) {
            return res.end(JSON.stringify({ success: true, message: 'Message sent! Thank you for reaching out.' }));
          }
          if (req.url.startsWith('/api/resume/download')) {
            return res.end(JSON.stringify({ success: true }));
          }
          if (req.url.startsWith('/api/auth/me')) {
            res.statusCode = 401;
            return res.end(JSON.stringify({ success: false, message: 'Unauthenticated' }));
          }
          return res.end(JSON.stringify({ success: true, data: [] }));
        }
        next();
      });
    },
  };
}

export default defineConfig({
  base: process.env.GITHUB_ACTIONS === 'true' ? '/PortFolio_JS/' : '/',
  plugins: [
    react(),
    tailwindcss(),
    mockApiPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@sections': path.resolve(__dirname, 'src/sections'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@lib': path.resolve(__dirname, 'src/lib'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@context': path.resolve(__dirname, 'src/context'),
      '@pages': path.resolve(__dirname, 'src/pages'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: false,
    allowedHosts: true,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'axios'],
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: false,
    // Warn if any individual chunk exceeds 500kb gzipped
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // Do NOT split react — it's small and better inlined
          router: ['react-router-dom'],
          framer: ['framer-motion'],
          vendor: ['axios', 'react-hot-toast'],
        },
      },
    },
  },
});

