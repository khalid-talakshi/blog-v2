<!-- Context: project-intelligence/technical | Priority: critical | Version: 1.1 | Updated: 2026-04-07 -->

# Technical Domain

> Document the technical foundation, architecture, and key decisions for the blog site.

## Quick Reference

- **Purpose**: Understand how the project works technically
- **Update When**: New features, refactoring, tech stack changes
- **Audience**: Developers, AI agents, technical stakeholders

## Primary Stack

| Layer         | Technology   | Version   | Rationale                                       |
| ------------- | ------------ | --------- | ----------------------------------------------- |
| Framework     | Astro        | 6.0.6     | Static site generation with dynamic islands     |
| Language      | TypeScript   | Latest    | Type safety and developer experience            |
| Styling       | Tailwind CSS | 4.2.2     | Utility-first CSS framework                     |
| Charting      | Recharts     | 3.8.0     | React-based charting library for visualizations |
| Visualization | D3           | 7.9.0     | Advanced data visualization capabilities        |
| React         | React        | 19.2.4    | Interactive components and state management     |
| Node          | Node.js      | >=22.12.0 | Runtime environment                             |

## Architecture Pattern

```
Type: Static Site Generation (SSG) with Interactive Islands
Pattern: Astro pages + React components for interactivity
Structure: Content-driven with Astro Content Collections
```

### Why This Architecture?

This architecture combines static site generation for performance with React islands for interactivity. Astro handles server-side rendering of pages and content, while React components provide interactive features like graphs and charts. This approach optimizes for:

- **Performance**: Static HTML with minimal JavaScript
- **SEO**: Server-rendered content
- **Interactivity**: React islands for dynamic features
- **Content Management**: Astro Content Collections for blog posts

## Project Structure

```
[Project Root]
├── src/
│   ├── components/          # Reusable components (Astro + React)
│   ├── layouts/             # Page layouts
│   ├── pages/               # Route pages (Astro)
│   ├── hooks/               # React custom hooks
│   ├── types/               # TypeScript type definitions
│   ├── content/             # Content collections (blog posts)
│   ├── styles/              # Global styles
│   └── images/              # Static images
├── public/                  # Static assets
├── astro.config.mjs         # Astro configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies
```

**Key Directories**:

- `src/components/` - Reusable Astro and React components
- `src/pages/` - Route pages using Astro file-based routing
- `src/layouts/` - Layout components for page structure
- `src/hooks/` - React custom hooks for state management
- `src/types/` - TypeScript interfaces and type definitions
- `src/content/` - Content collections (blog posts, etc.)

## Code Patterns

### Astro Page/Layout Pattern

```astro
---
import Navigation from "../components/Navigation.astro";
import { getCollection } from "astro:content";

const blogPosts = await getCollection("blog");
---

<div class="w-full sm:w-[95%] mx-auto">
  <Navigation />
  <slot />
</div>
```

### React Component Pattern

```typescript
export interface Props {
  traces: Trace[];
  offset?: number;
}

export default function LineGraph({ traces, offset }: Props) {
  const { left, right, zoom } = useGraphZoom(traces, offset);

  return (
    <div className="flex flex-col gap-2">
      <LineChart responsive onMouseUp={zoom}>
        {/* Recharts components */}
      </LineChart>
    </div>
  );
}
```

### Content Collection Pattern

```typescript
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    // ... other fields
  }),
});

export const collections = { blog };
```

## Naming Conventions

| Type             | Convention                | Example                                         |
| ---------------- | ------------------------- | ----------------------------------------------- |
| Files            | PascalCase for components | `LineChart.tsx`, `Navigation.astro`             |
| Components       | PascalCase                | `LineGraph`, `CustomTooltip`, `Navigation`      |
| Functions        | camelCase                 | `useGraphZoom`, `getCollection`, `zoomOut`      |
| Interfaces/Types | PascalCase                | `Props`, `Trace`                                |
| Constants        | camelCase or UPPER_SNAKE  | `routes`, `currentPath`                         |
| CSS Classes      | kebab-case (Tailwind)     | `flex`, `gap-2`, `rounded-xl`                   |
| Directories      | lowercase                 | `src/components/`, `src/hooks/`, `src/layouts/` |

## Code Standards

- TypeScript strict mode (extends "astro/tsconfigs/strict")
- React JSX with react-jsx import source
- Functional components (no class components)
- TypeScript interfaces for component Props
- Explicit return types on exported functions
- Tailwind CSS for styling (utility-first)
- Astro frontmatter for server-side logic
- Content Collections for content management
- React hooks for interactive state
- Prettier for code formatting
- Astro components for layouts/pages
- React components for interactive UI
- Recharts for creating graphs and visualizations

## Security Requirements

- Input validation for form submissions
- Content Security Policy (CSP) headers
- HTTPS enforcement
- XSS prevention (React auto-escapes by default)
- No sensitive data in client-side code
- Sanitize user-generated content
- Validate markdown/MDX content
- Protect against CSRF attacks

## Development Environment

```
Setup: yarn install
Requirements: Node.js >=22.12.0, yarn or npm
Local Dev: yarn dev (runs astro dev)
Build: yarn build (runs astro build)
Preview: yarn preview (runs astro preview)
Format: yarn format (runs prettier --write .)
```

## Deployment

```
Platform: Static hosting (Vercel, Netlify, GitHub Pages)
Build Output: dist/ directory
CI/CD: GitHub Actions (recommended)
Monitoring: Built-in Astro analytics
```

## Integration Points

| System                    | Purpose                | Type     | Direction |
| ------------------------- | ---------------------- | -------- | --------- |
| Astro Content Collections | Blog post management   | Internal | Inbound   |
| Recharts                  | Data visualization     | Library  | Internal  |
| React                     | Interactive components | Library  | Internal  |
| Tailwind CSS              | Styling                | Library  | Internal  |

## 📂 Codebase References

**Implementation**:

- `src/components/LineChart.tsx` - Recharts graph component with zoom functionality
- `src/components/Navigation.astro` - Navigation layout component
- `src/pages/blog.astro` - Blog listing page using Content Collections
- `src/hooks/useGraphZoom.tsx` - Custom hook for graph zoom state
- `src/types/index.ts` - TypeScript type definitions

**Config**:

- `astro.config.mjs` - Astro framework configuration
- `tsconfig.json` - TypeScript strict mode configuration
- `package.json` - Dependencies and scripts
- `.prettierrc` - Prettier formatting rules

## Related Files

- `business-domain.md` - Why this technical foundation exists
- `business-tech-bridge.md` - How business needs map to technical solutions
- `decisions-log.md` - Full decision history with context

## Onboarding Checklist

- [ ] Know the primary tech stack (Astro + React + TypeScript)
- [ ] Understand the architecture (SSG with React islands)
- [ ] Know the key project directories and their purpose
- [ ] Understand Astro frontmatter and Content Collections
- [ ] Know how to create Astro pages and React components
- [ ] Understand Recharts for graph creation
- [ ] Be able to set up local development environment
- [ ] Know how to run build and preview
