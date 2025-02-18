import {fileURLToPath, URL} from 'node:url';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';
import lightningcss from 'vite-plugin-lightningcss';
// @ts-expect-error
import viteJoinMediaQueries from 'vite-join-media-queries';
import svgr from 'vite-plugin-svgr';
import { VitePWA } from 'vite-plugin-pwa';

const metaUrl = import.meta.url;
// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: false,
    assetsDir: '',
    minify: 'terser',
    cssMinify: 'lightningcss',
    terserOptions: {
      compress: {
        drop_console: ['log', 'time', 'timeEnd'],
      },
      mangle: {
        properties: {
          regex: /_$/,
        },
      },
    },
  },
  plugins: [
    react(),
    viteJoinMediaQueries({
      paths2css: ['./dist'],
    }),
    lightningcss(),
    svgr(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        short_name: '臺灣縣市天氣',
        name: '臺灣即時縣市天氣資訊',
        icons: [
          {
            src: 'icon@192.png',
            type: 'image/png',
            sizes: '192x192'
          },
          {
            src: 'icon@512.png',
            type: 'image/png',
            sizes: '512x512'
          }
        ],
        scope: '/',
        start_url: '.',
        display: 'standalone',
        orientation: 'portrait-primary',
        theme_color: '#1f2022',
        background_color: '#1f2022'
      },
      workbox: {
        clientsClaim: true,
        skipWaiting: true
      },
      devOptions: {
        enabled: true,
        type: 'module',
        navigateFallback: 'index.html',
        suppressWarnings: true
      },
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', metaUrl)),
      'images': fileURLToPath(new URL('./src/images', metaUrl)),
    },
  },
  css: {
    postcss: {
      plugins: [
        autoprefixer(),
      ],
    },
  },
});

