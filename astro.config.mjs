import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

import cloudflare from "@astrojs/cloudflare";

const SITE_URL = 'https://gameinfos.org';

export default defineConfig({
  site: SITE_URL,

  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
  ],

  build: {
    inlineStylesheets: 'auto',
  },

  compressHTML: true,
  output: "hybrid",
  adapter: cloudflare()
});