import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    // Garante que o servidor seja acessível de fora do contentor
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        // Aponte para o nome do serviço do backend, como definido no docker-compose.yml
        target: 'http://backend:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
