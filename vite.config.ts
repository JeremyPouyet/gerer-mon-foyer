import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default {
  build: {
    minify: false
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // vite-ssg option. Because of that, defineConfig() from vite does not work
  // See https://github.com/antfu-collective/vite-ssg/blob/main/src/types.ts for more options
  ssgOptions: {
    mock: true // Mock browser global variables (window, document, etc...) for SSG
  }
}
