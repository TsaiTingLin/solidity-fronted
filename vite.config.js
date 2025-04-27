import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 允许接收网络请求，这样您可以从其他设备访问
    host: '0.0.0.0',
  },
  define: {
    // 确保 process.env 在客户端代码中可用（适用于 dotenv）
    'process.env': {}
  }
})