import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { person } from './src/content.js'

// Share cards need absolute URLs: SITE_URL if set when building, otherwise person.site
// in content.js, otherwise relative paths (which some apps still resolve).
const raw = process.env.SITE_URL || person.site || ''
const site = raw ? raw.replace(/\/?$/, '/') : './'
const siteUrl = () => ({
  name: 'site-url',
  transformIndexHtml: html => html.replaceAll('%SITE_URL%', site),
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
