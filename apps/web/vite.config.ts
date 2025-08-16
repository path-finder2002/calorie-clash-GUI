import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // LAN 端末からアクセス可能に
    open: true,
  },
  preview: {
    host: true,
  },
});

