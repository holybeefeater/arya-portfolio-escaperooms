import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { site } from './src/content/site.js'

// Sharing tags need absolute URLs: SITE_URL if set when building, otherwise site.url.
const raw = process.env.SITE_URL || site.url || ''
const siteUrl = raw ? raw.replace(/\/?$/, '/') : '/'
const siteUrlPlugin = () => ({
  name: 'site-url',
  transformIndexHtml: html => html.replaceAll('%SITE_URL%', siteUrl),
})

export default defineConfig({
  plugins: [react(), siteUrlPlugin()],
  base: '/',
  server: { host: true, port: 5173 },
  build: {
    target: 'es2020',
    assetsDir: '_app',
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      input: {
        main: 'index.html',                                   // the portfolio
        experience: 'escape-rooms/experience/index.html',     // the interactive Escape Rooms room
        print: 'escape-rooms/print.html',                     // Escape Rooms print kit
      },
      output: { manualChunks: { three: ['three'], gsap: ['gsap'] } },
    },
  },
})
