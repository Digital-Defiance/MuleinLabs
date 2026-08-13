import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Custom domain: https://muleinlabs.com
export default defineConfig({
  plugins: [react()],
  base: '/',
})
