// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'vite';

const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  base: isProd ? '/game-of-life/' : '',
  build: {
    outDir: 'build',
  },
});
