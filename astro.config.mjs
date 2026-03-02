// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://take77-port.com',
  integrations: [
    react(),
    sitemap(),
  ],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
});
