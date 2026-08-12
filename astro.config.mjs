import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// Replace with your actual domain after deploying to Cloudflare Pages
const SITE_URL = 'https://gta6-hub.yangchuang827.workers.dev';

export default defineConfig({
  site: SITE_URL,
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
});
