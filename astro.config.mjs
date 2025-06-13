import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';

export default defineConfig({
  integrations: [tailwind()],
  output: 'static',
  adapter: vercel({
    webAnalytics: { enabled: true },
    speedInsights: { enabled: true }
  }),
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  },
  build: {
    inlineStylesheets: 'auto'
  },
  publicDir: './public',
  compressHTML: true,
  devToolbar: {
    enabled: false
  },
  server: {
    host: '0.0.0.0',
    port: 5000
  },
  vite: {
    server: {
      host: '0.0.0.0',
      port: 5000,
      cors: true,
      allowedHosts: [
        'localhost',
        '127.0.0.1',
        '0.0.0.0',
        '.replit.dev',
        '.worf.replit.dev',
        'ef343b1d-c3f6-420a-a2ce-29166b23b502-00-2e9j1qnagmcxw.worf.replit.dev'
      ]
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['astro']
          }
        }
      }
    }
  }
});