import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const PORT = Number(process.env.PORT) || 5173;

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // LAN 端末からアクセス可能に
    port: PORT,
    open: true,
    // ファイル監視の相性問題（仮想環境/ネットワーク共有上）でHMRが効かない場合の対策
    watch: {
      usePolling: true,
      interval: 150,
    },
    hmr: {
      protocol: 'ws',
      port: PORT,
    },
  },
  preview: {
    host: true,
    port: PORT,
  },
});
