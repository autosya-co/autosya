// @ts-check
import { defineConfig } from 'astro/config';
import node from '@apphosting/astro-adapter';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  server: {
    host: '0.0.0.0',
    port: 3000
  },
  image: {
    service: { entrypoint: 'astro/assets/services/noop' }
  },
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ['firebase']
    }
  }
});