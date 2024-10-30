import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default {
  build: {
    minify: true // set to false to analyse the generated js
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
    formatting: 'minify', // set to 'prettify' to analyse the generated html
    mock: true, // Mock browser global variables (window, document, etc...) for SSG
    script: 'async'
  }
}
