# LaTeX in Astro Markdown Guide

This guide explains how to write math in this repo's blog/docs content using KaTeX rendering.

## Overview

LaTeX support is enabled through:

- `remark-math` for parsing math syntax in Markdown/MDX
- `rehype-katex` for rendering equations
- `katex/dist/katex.min.css` for equation styling

Configured in:

- `astro.config.mjs`
- `src/styles/global.css`

## Inline Math

Use single dollar signs:

```md
Euler identity: $e^{i\pi} + 1 = 0$
```

## Block Math

Use double dollar signs on separate lines:

```md
$$
\int_0^1 x^2\,dx = \frac{1}{3}
$$
```

## Common Patterns

### Fractions and exponents

```md
$\frac{a}{b}$, $x^2$, $x_i$
```

### Matrices

```md
$$
\begin{bmatrix}
1 & 2 \\
3 & 4
\end{bmatrix}
$$
```

### Greek letters

```md
$\alpha, \beta, \gamma, \sigma$
```

## Where to Add Math Content

- Blog/example content: `src/content/blog/*.md` or `*.mdx`
- General docs: `docs/guides/` and `docs/references/`

## Troubleshooting

### Equations show raw `$...$` text

Check:

1. `remark-math` and `rehype-katex` are present in `astro.config.mjs`
2. `@import "katex/dist/katex.min.css";` exists in `src/styles/global.css`
3. The file extension is `.md` or `.mdx` inside the configured content collections

### Build passes but equation formatting looks broken

- Verify matching delimiters (`$...$`, `$$...$$`)
- Use block math for multi-line expressions
- Avoid mixing markdown table syntax directly with complex formulas

## Example in This Repo

See:

- `src/content/blog/latex-math-in-astro.md`

---

**Last Updated:** April 28, 2026  
**Category:** guides  
**Related Docs:** `docs/README.md`, `src/content/blog/latex-math-in-astro.md`
