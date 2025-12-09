import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// FULL WORKING VITE CONFIG
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://infocuor-backend-latest.onrender.com',
        changeOrigin: true,
        secure: true
      },
      '/auth': {
        target: 'https://infocuor-backend-latest.onrender.com',
        changeOrigin: true,
        secure: true
      }
    }
  }
})
