import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // 👈 1. Import 'path' module

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // 👈 2. Add the resolve block to map the path alias
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})