# me.frankie.wang

The independent source repository for Frankie's personal website at
[`me.frankie.wang`](https://me.frankie.wang).

This repository is intentionally separate from the sibling academic site. The
approved visual and interaction contract lives in [`DESIGN.md`](./DESIGN.md),
and the staged implementation plan lives in [`plan.md`](./plan.md).

## Requirements

- Node.js 22.12.0 or newer
- npm 9.6.5 or newer

## Local development

```sh
npm ci
npm run dev
```

The development server prints its local URL when it starts.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Astro's local development server. |
| `npm test` | Run the localization and content-helper regression tests. |
| `npm run check` | Run Astro and TypeScript diagnostics. |
| `npm run build` | Create the static production build in `dist/`. |
| `npm run preview` | Serve the production build locally. |

Task 2 establishes only the strict Astro foundation. Routes, content,
localization, and visual components are added by later tasks in `plan.md`.
