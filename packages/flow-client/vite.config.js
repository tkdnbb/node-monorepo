import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        presets: [
          ['@babel/preset-react', { runtime: 'automatic' }],
          '@babel/preset-typescript',
        ],
        plugins: [
          ['babel-plugin-transform-flow-strip-types', { requireDirective: true }]
        ],
        include: [/\.(jsx|tsx|ts|mjs|js)?$/],
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
