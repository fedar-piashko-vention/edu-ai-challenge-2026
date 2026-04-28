# Task 1 — Approach and tooling

## Summary

This submission is a static **React + Vite** leaderboard that mirrors the internal reference layout: filters, top-three podium, ranked list with expandable activity breakdown, and responsive desktop/mobile layouts. Data is **fully synthetic** — no corporate names, titles, or photos from the original system.

## Tools and workflow

- **Cursor** as the IDE with agent-assisted edits for scaffolding, components, styles, and CI.
- **Node.js 24**, **TypeScript**, **Vite** for bundling and production builds.
- **React Bootstrap** for layout primitives (forms, collapse, grid) and **Bootstrap 5** CSS.
- **Font Awesome** (React component package) for icons consistent with the reference patterns (search, stats, expand).
- **DiceBear** (Avataaars, SVG via URL) for decorative avatars derived from opaque seeds — no real profile images.

## Data replacement strategy

- Employee records are generated in code ([`src/data/mockEmployees.ts`](src/data/mockEmployees.ts)) using invented first/last names and generic role lines (e.g. department-style labels built from synthetic team/category strings).
- Numeric totals, stat buckets (learning / delivery / community), and per-row activity tables are derived deterministically from each row’s seed so tables stay plausible without importing any production dataset.
- The saved SharePoint HTML export under `references/` was **not** pasted into prompts as a data source and is listed in `.gitignore` so it stays local to developers only.

## Responsible use

- No real employee identifiers or photos appear in source or in the deployed site.
- Reference screenshots were used only for layout and hierarchy; visible text in mocks was rewritten.

## Deployment

- Production builds use Vite `base` resolved from `GITHUB_REPOSITORY` during **GitHub Actions** so asset URLs work under `https://<user>.github.io/<repo>/`.
- GitHub Actions workflows build from [`task-1/`](.) and publish `dist/` via **GitHub Pages**.
