import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      coworkUI: fileURLToPath(new URL('../packages/coworkUI/src/index.js', import.meta.url)),
      'coworkUI/a2ui-runtime': fileURLToPath(new URL('../packages/coworkUI/src/a2ui-runtime/index.js', import.meta.url)),
      mermaid: fileURLToPath(new URL('./src/shims/mermaid.js', import.meta.url)),
    },
  },
  server: {
    port: 3001,
  },
})
