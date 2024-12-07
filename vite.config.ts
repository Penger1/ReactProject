import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/mojang': {
        target: 'https://api.mojang.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/mojang/, ''),
      },
      '/manacube': {
        target: 'https://api.manacube.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/manacube/, ''),
      },
    },
  },
});
