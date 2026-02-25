// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/lenis')) return 'lenis';
            if (id.includes('node_modules/gsap/ScrollTrigger')) return 'gsap-st';
            if (id.includes('node_modules/gsap')) return 'gsap-core';
          },
        },
      },
    },
  },
});