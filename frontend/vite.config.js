import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': 'http://localhost:8081',
      '/users': 'http://localhost:8081',
      '/jobs': 'http://localhost:8081',
      '/applications': 'http://localhost:8081',
      '/interviews': 'http://localhost:8081',
      '/evaluations': 'http://localhost:8081',
      '/dashboard': 'http://localhost:8081',
    }
  }
})
