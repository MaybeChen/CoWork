import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
const serverAdds = {
  dev: 'http://10.136.125.119:8010',
  prod: 'https://astr-lab.gts.huawei.com/',
};

const devServer = serverAdds.dev;
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    https: false,
    host: '10.136.122.46',
    port: 5173,
    cros: true,
    open: true,
    proxy: {
      '/api/chat/stream': {
        target: devServer,
        changeOrigin: true,
        secure: false,
        headers: {
          Referer: devServer,
        },
      },
    }
  },
  
})
