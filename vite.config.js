import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/xlsx'))            return 'vendor-xlsx'
          if (id.includes('node_modules/framer-motion'))   return 'vendor-motion'
          if (id.includes('node_modules/@supabase'))       return 'vendor-supabase'
          if (id.includes('node_modules/lucide-react'))    return 'vendor-lucide'
          if (
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/react-router') ||
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react\\')
          ) return 'vendor-react'
        },
      },
    },
  },
})
