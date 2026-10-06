import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Share cards need absolute URLs. Build with SITE_URL=https://your.domain/ to get them;
// without it the tags fall back to relative paths, which some apps still resolve.
const site = (process.env.SITE_URL || '').replace(/\/?$/, '/')
const siteUrl = () => ({
  name: 'site-url',
  transformIndexHtml: html => html.replaceAll('%SITE_URL%', process.env.SITE_URL ? site : './'),
})

// base: './' lets the built site run from any folder or sub-path (Vercel, Netlify, GitHub Pages).
export default defineConfig({
  plugins: [react(), siteUrl()],
  base: './',
  server: { host: true, port: 5173, open: true },
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      // print.html is the print kit: keycard business card and hang tags with QR codes
      input: { main: 'index.html', print: 'print.html' },
      output: {
        manualChunks: { three: ['three'], gsap: ['gsap'] },
      },
    },
  },
})
