import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';

const PORT = Number(process.env.PORT) || 5173;
// ビルドごとに変わるバージョン識別子（自動リロード用）
const BUILD_VERSION = String(Date.now());

function emitVersionPlugin(version: string): Plugin {
  return {
    name: 'emit-version',
    apply: 'build',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'version.json',
        source: JSON.stringify({ version }, null, 2),
      });
    },
  };
}

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(BUILD_VERSION),
  },
  plugins: [react(), emitVersionPlugin(BUILD_VERSION)],
  resolve: {
    alias: {
      '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          chakra: ['@chakra-ui/react', '@emotion/react', '@emotion/styled'],
          motion: ['framer-motion'],
          swiper: ['swiper'],
        },
      },
    },
  },
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
