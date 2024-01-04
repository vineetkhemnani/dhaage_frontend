import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // get rid of CORS errors
    proxy: {
      '/api': {
        // uncomment below when in local environment
        target:'http://localhost:5000' ,
        // target: 'https://dhaage-backend.vercel.app/',
        // target: 'https://threads-backend-2lcn.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
