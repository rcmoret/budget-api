import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'
import ReactPlugin from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    RubyPlugin(),
    ReactPlugin(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@frontend': path.resolve(__dirname, './app/frontend'),
      '@': path.resolve(__dirname, './app/frontend'),
    },
  },
  server: {
    host: '0.0.0.0',
    hmr: {
      clientPort: 3736,
      port: 3736,
      host: '10.0.0.42',  // your machine's LAN IP
    },
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  },
})
