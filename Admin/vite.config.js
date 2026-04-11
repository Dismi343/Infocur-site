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
        target: 'http://161.118.188.194',
        changeOrigin: true,
        secure: true
      },
      '/auth': {
        target: 'http://161.118.188.194',
        changeOrigin: true,
        secure: true
      }
    }
  }
})
