import { defineConfig } from 'vitest/config';
import solid from 'vite-plugin-solid';
import pkg from './package.json';

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  plugins: [solid()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
