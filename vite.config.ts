import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Serve the app from src/mong so Vite picks up src/mong/index.html
  root: 'src/mong',
  server: {
    port: 5173
  }
})


