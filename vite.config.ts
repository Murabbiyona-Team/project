import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-404',
      closeBundle() {
        // GitHub Pages SPA routing: 404.html = index.html
        const fs = require('fs')
        const path = require('path')
        const dist = path.resolve(__dirname, 'dist')
        fs.copyFileSync(path.join(dist, 'index.html'), path.join(dist, '404.html'))
      },
    },
  ],
  base: '/project/',
})
