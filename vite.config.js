import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        // Force fixed names for embedding
        entryFileNames: `assets/glowere-bot.js`,
        chunkFileNames: `assets/main.js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
})
