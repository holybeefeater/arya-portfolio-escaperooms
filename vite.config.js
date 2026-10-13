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

// Each collection is a folder: /auxin → /auxin/ (otherwise the address falls back to
// the home page). vercel.json does the same on the live site.
const folders = ['auxin']
const slash = (req, res, next) => {
  const path = (req.url || '').split('?')[0]
  if (folders.some(f => path === '/' + f)) { res.statusCode = 301; res.setHeader('Location', req.url.replace(path, path + '/')); return res.end() }
  next()
}
const trailingSlash = () => ({
  name: 'trailing-slash',
  configureServer: server => { server.middlewares.use(slash) },
  configurePreviewServer: server => { server.middlewares.use(slash) },
})

// base: './' lets the built site run from any folder or sub-path (Vercel, Netlify, GitHub Pages).
export default defineConfig({
  plugins: [react(), siteUrl(), trailingSlash()],
  base: './',
  server: { host: true, port: 5173, open: true },
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      // index.html is Escape Rooms, auxin/index.html is Auxin (one page per collection);
      // print.html is the print kit: keycard business card and hang tags with QR codes
      input: { main: 'index.html', auxin: 'auxin/index.html', print: 'print.html' },
      output: {
        manualChunks: { three: ['three'], gsap: ['gsap'] },
      },
    },
  },
})
