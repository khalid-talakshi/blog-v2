import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    description: z.string(),
    published: z.boolean(),
    date: z.string(),
    tags: z.array(z.string()).optional(),
  }),
});

const experience = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/experience" }),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    description: z.string(),
    technologies: z.array(z.string()).optional(),
  }),
});

const education = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/education" }),
  schema: z.object({
    school: z.string(),
    degree: z.string(),
    field: z.string(),
    graduationDate: z.string(),
    description: z.string().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    image: z.string().optional(),
    link: z.string().optional(),
    technologies: z.array(z.string()).optional(),
    featured: z.boolean().optional().default(false),
  }),
});

// Expose your defined collection to Astro
// with the `collections` export
export const collections = { blog, experience, education, projects };
