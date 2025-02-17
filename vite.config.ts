import {fileURLToPath, URL} from 'node:url';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';
import lightningcss from 'vite-plugin-lightningcss';
import svgr from 'vite-plugin-svgr';
// @ts-expect-error
import viteJoinMediaQueries from 'vite-join-media-queries';

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

