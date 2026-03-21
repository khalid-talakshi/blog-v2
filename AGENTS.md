Purpose
- This file instructs agentic coding tools how to build, lint, test, and follow repo style.

Quick commands (run from repo root)
- Install deps: `yarn install` (or `npm install`)
- Dev server: `yarn dev` -> runs `astro dev`
- Build for production: `yarn build` -> runs `astro build`
- Preview production build: `yarn preview` -> runs `astro preview`
- Astro CLI: `yarn astro -- <args>` or `npx astro <args>`

Recommended scripts to add to package.json (this repo already includes them)
- `lint`: `eslint . --ext .ts,.tsx,.astro`
- `format`: `prettier --write .`
- `format:check`: `prettier --check .`
- `test`: `vitest`
- `test:watch`: `vitest --watch`
- `test:run`: `vitest run`
- `test:single`: `vitest run -- -t '<name or pattern>'`

Running a single test
- Vitest (single file): `npx vitest run path/to/file.test.ts`
- Vitest (by test name): `npx vitest -t "renders button"`
- Jest (if added): `npx jest path/to/file.test.ts -t "exact name"`

Formatting & linting
- Prettier is configured (repo uses `prettier-plugin-astro`). Run `npx prettier --check .`.
- Add ESLint with `eslint-plugin-astro`, `@typescript-eslint`, and `eslint-plugin-react`. Run `npx eslint . --ext .ts,.tsx,.astro`.

TypeScript & code style rules
- tsconfig extends `astro/tsconfigs/strict` — keep `strict` enabled.
- Prefer explicit return types on exported functions and module-level helpers.
- Avoid `any`; prefer `unknown` for untrusted input and narrow quickly.
- Use `interface` for public exported object shapes; use `type` for unions/mapped types.
- Use `readonly` for arrays/tuples where possible and `as const` for literal tuples.

Imports ordering
1. Node / built-ins
2. External packages (react, astro, tailwind, etc.)
3. Absolute imports from `src/` (if configured)
4. Relative imports (`../` then `./`)
5. Styles & assets last

Naming conventions
- Pages/routes: kebab-case (e.g. `src/pages/about.astro`).
- Components & layouts: PascalCase matching component name (e.g. `Navigation.astro`).
- Stylesheets: `src/styles/*.css` or `component-name.css`.
- Identifiers: camelCase for vars/functions, UPPER_SNAKE for constants, PascalCase for types.

Astro & React specifics
- In `.astro` files put imports and TypeScript frontmatter at top inside frontmatter; type-check frontmatter when possible using `export interface` for Props.
- Keep layout components in `src/layouts/` and use PascalCase.
- React components used inside Astro: place under `src/components/` as `.tsx` and keep `jsx: react-jsx` in `tsconfig`.

CSS & Tailwind
- Tailwind is present. Prefer utility classes for layout and small styles.
- For component-specific CSS use `src/styles/<component>.css` and import explicitly.
- Use CSS variables for central theming values.

Error handling
- Do not swallow errors silently. Use try/catch at boundaries and rethrow with context: `throw new Error(`fetchPosts failed: ${err.message}`)`.

Accessibility
- Add `alt` attributes to images, use semantic HTML, and ensure visible focus styles.

Commits & PRs
- Commit message style: short imperative subject (<=50 chars) and optional body.
- PR: 1–3 bullet points describing changes, testing notes, and relevant issue links.

Onboarding checklist for an agent
1. Run `yarn install`.
2. Run `yarn dev` — confirm site boots locally.
3. Run `npx prettier --check .` and `npx eslint . --ext .ts,.tsx,.astro` (add ESLint if missing).
4. Add Vitest and a sample test if you will use tests; run `npx vitest run`.

Cursor / Copilot rules
- No `.cursor/rules/` or `.github/copilot-instructions.md` were found. If added later, copy their contents here and follow them verbatim.

Next recommended changes (optional, suggested order)
1. Add ESLint config and `lint` script (done in this commit).
2. Add Vitest and sample tests (added `vitest.config.ts`, `src/setupTests.ts`, and one sample test file in `src/components/__tests__/`).
3. Add CI to run `prettier --check`, `eslint`, `build`, and `test` on PRs (added `.github/workflows/ci.yml`).
