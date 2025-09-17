import { resolve } from 'node:path'

import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [viteReact(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['vitest-localstorage-mock'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  base: "https://jktjia.github.io/empty-games",
})
