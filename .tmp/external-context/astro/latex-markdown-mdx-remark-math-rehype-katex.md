---
source: Context7 API
library: Astro + remark-math + rehype-katex + KaTeX
package: astro
topic: markdown-mdx-latex-support
fetched: 2026-04-28T00:00:00Z
official_docs: https://docs.astro.build/en/guides/markdown-content/
---

## Installation and setup

Install required packages:

```bash
npm install @astrojs/mdx remark-math rehype-katex katex
```

`@astrojs/mdx` is needed for `.mdx` support. `remark-math` parses math syntax in markdown/MDX, and `rehype-katex` renders it to HTML using KaTeX.

## Correct `astro.config.mjs` integration points

Astro docs show two places where remark/rehype plugins can be configured:

1. Global Markdown pipeline: `markdown.remarkPlugins` / `markdown.rehypePlugins`
2. MDX integration pipeline: `mdx({ remarkPlugins, rehypePlugins })`

Use both when your repo contains both `.md` and `.mdx` in blog/docs collections.

```js
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export default defineConfig({
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
  integrations: [
    mdx({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
  ],
});
```

## Include KaTeX CSS in Astro

`rehype-katex` docs explicitly require KaTeX CSS on pages that display math.

Two Astro-friendly options:

1. Import in a global stylesheet/layout:

```js
import "katex/dist/katex.min.css";
```

2. Add stylesheet link in your shared layout `<head>`:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
/>
```

If you use CDN CSS, keep the version aligned with installed `katex` to avoid mismatch.

## SSR/static build caveats

- `rehype-katex` renders math during content processing/build (static HTML output), so client-side KaTeX JS is not required for standard markdown/MDX math rendering.
- CSS is still mandatory; without it, rendered HTML appears unstyled/broken.
- KaTeX fonts are loaded via CSS; ensure your deployment allows font asset loading (especially with strict CSP or self-hosted assets).

## Common pitfalls with MDX/docs collections

- **MDX plugin scope pitfall:** Astro docs note MDX options can override markdown options. If you set plugins only under `markdown`, `.mdx` files may not use them depending on MDX config.
- **Collection loader pitfall:** Content collections mixing markdown and MDX must include both extensions in loader patterns, e.g. `**/*.{md,mdx}`.
- **Order/config pitfall:** Keep `remarkMath` in remark plugins and `rehypeKatex` in rehype plugins (wrong stage means no math rendering).
- **CSS omission pitfall:** Most frequent issue—math HTML exists in output but appears plain because KaTeX CSS was not loaded globally.

## Source links

- Astro Markdown config: https://docs.astro.build/en/guides/markdown-content/
- Astro MDX integration: https://docs.astro.build/en/guides/integrations-guide/mdx/
- remark-math monorepo docs: https://github.com/remarkjs/remark-math
- rehype-katex package docs: https://github.com/remarkjs/remark-math/tree/main/packages/rehype-katex
- KaTeX browser/docs: https://katex.org/docs/browser
