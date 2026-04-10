import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import pkg from './package.json';

export default defineConfig({
  base: '/ZoidsSleeper/',
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  plugins: [solid()],
});
