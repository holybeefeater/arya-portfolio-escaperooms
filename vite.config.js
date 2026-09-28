import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' lets the built site run from any folder or sub-path (Vercel, Netlify, GitHub Pages).
export default defineConfig({
  plugins: [react()],
  base: './',
  server: { host: true, port: 5173, open: true },
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: { three: ['three'], gsap: ['gsap'] },
      },
    },
  },
})
