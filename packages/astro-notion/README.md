# Astro-Notion

Astro-Notion provides components to build static websites using [Astro](https://astro.build/) and lets you use [Notion](https://www.notion.so/) as your main CMS tool.

---

## Getting Started

# Installation

To install @jcha0713/astro-notion package, run the following command:

```bash
npm install @jcha0713/astro-notion @notionhq/client
```

or you can use yarn instead.

## Basic Setup

### Notion

1. Log in to Notion.
2. go to [my-integrations](https://www.notion.so/my-integrations) and press **New integration.**
3. Create new integration for your website in desired workspace. Only the permission to **Read content** is needed.
4. Go to [https://heliotrope-lavender-f03.notion.site/Example-Database-a845c6d59ead4034be1b637c6381073d](https://www.notion.so/Example-Database-a845c6d59ead4034be1b637c6381073d) and click **duplicate** on the upper right corner to use it as a template.
5. You could also create and use your own database(inline table). Make sure it has **title**, **date**, **draft**, and **slug** columns.
6. Click share button on the upper right side and add the integration you created in step 3.
7. Lastly, you need the **database id**. To find this, click share button again and click copy link on the bottom. Paste it in any text box and copy the **32 characters** after your workspace name or `[notion.so](http://notion.so)` and the slash and before the question mark(`?`).

For more detailed work-through, see [_this tutorial_](https://developers.notion.com/docs/getting-started) provided by Notion.

### Astro

1. Copy the **Internal Integration Token** and create a variable in `.env` and name it `NOTION_API_KEY`.
2. Copy the database id and create another variable in `.env`. Name it `NOTION_DATABASE_ID`.
3. Astro-notion uses `astro-imagetools` package to display images. Here is an example config code you can copy and use it.

```javascript
// astro.config.mjs

import { defineConfig } from 'astro/config';
import { astroImageTools } from 'astro-imagetools';

// https://astro.build/config
export default defineConfig({
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
});
```

```javascript
// astro-imagetools.config.mjs

// create astro-imagetools.config.mjs
// in your project root folder

import { defineConfig } from 'astro-imagetools/config';

export default defineConfig({
  fallbackFormat: 'png',
});
```
