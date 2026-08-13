import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import cesium from 'vite-plugin-cesium'
import Components from 'unplugin-vue-components/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    (cesium as any)(),
    Components()
  ],
  resolve: {
    alias: {
     '@': path.resolve(__dirname, './src'),
    }
  }
})
