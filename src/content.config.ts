import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    description: z.string(),
    published: z.boolean(),
    date: z.string()
  }),
});

// Expose your defined collection to Astro
// with the `collections` export
export const collections = { blog };
