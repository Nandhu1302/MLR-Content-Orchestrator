// vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // This maps the alias "@" to the "src" directory relative to the config file.
      '@': path.resolve(__dirname, 'src'),
    },
  },
})