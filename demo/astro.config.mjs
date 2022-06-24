import { defineConfig } from 'astro/config';
import { astroImageTools } from 'astro-imagetools';

// https://astro.build/config
export default defineConfig({
  site: 'https://astro-notion.vercel.app/',
  publicDir: './public',
  outDir: './dist',
  vite: {
    plugins: [
      {
        name: 'import.meta.url-transformer',
        transform: (code, id) => {
          if (id.endsWith('.astro'))
            return code.replace(/import.meta.url/g, `"${id}"`);
        },
      },
    ],
    ssr: {
      external: ['svgo'],
    },
  },
  experimental: { integrations: true },
  integrations: [astroImageTools],
  server: { port: 3001 },
});
