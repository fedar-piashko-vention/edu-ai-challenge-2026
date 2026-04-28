# Task 1 — Approach and tooling

## Summary

This submission is a static **React + Vite** leaderboard that mirrors the reference layout: **no SharePoint chrome** (standalone page only). It includes filters, a top-three podium, a ranked list with expandable activity breakdown **(Recent activity** table: Activity, Category, Date, Points), and responsive desktop/mobile layouts. All **employee data is synthetic** — no corporate names, titles, or photos from the original system.

## Tools and workflow

- **Cursor** as the IDE with AI-assisted edits for scaffolding, components, styles, and CI.
- **Node.js 24**, **TypeScript**, **Vite 7** for bundling and production builds.
- **React Bootstrap** (forms, collapse) and **Bootstrap 5** CSS.
- **Font Awesome** (React) for search, stat, and expand icons.
- **DiceBear** (Avataaars, SVG via URL) for avatars from opaque seeds — no real profile images.

## Data replacement strategy

- Records are generated in [`src/data/mockEmployees.ts`](src/data/mockEmployees.ts): invented names, generic roles built from synthetic **team / category** strings, and deterministic stats and activity rows per seed.
- Activity rows use bracket-style labels (e.g. `[REG]`, `[LAB]`) and category pill variants for the expanded table — no import of production exports or pasted HTML/JSON.
- Local **`references/`** screenshots and snapshots stay **out of git** (see repo `.gitignore`) for optional visual comparison during development.

## UI notes (relative to references)

- **Page chrome:** Darker outer background (`--lb-outer-bg`) with a **lighter inner panel** (`lb-inner-shell`) wrapping filters, podium, and list — aligned with the header reference layout.
- **Title:** **Company Leader Board {year}** — the year reflects the **Year** filter: **All Years** shows the **current calendar year**; a specific year shows that value.
- **Filters:** Desktop shows Year / Quarter / Category + search; narrow viewports show Team / Country / Region + search — same underlying fields, consistent filtering.
- **Podium:** Horizontal 2–1–3 on desktop, vertical 1–2–3 on mobile; stands use flat solid fills, **square bottom edge**, no gradients on blocks.
- **Rows:** Collapsed summary row; expanded section with **Recent activity** and synthetic XP totals.

## Responsible use

- No real employee identifiers or photos in source or on the deployed site.
- Reference screenshots were used only for layout and hierarchy; copy in the app is rewritten.

## Deployment

- Vite **`base`** for GitHub project Pages is set from **`GITHUB_REPOSITORY`** in CI so assets resolve under `https://<user>.github.io/<repo>/`.
- Workflows: [`task-1-ci.yml`](../.github/workflows/task-1-ci.yml) (build on PR/push), [`task-1-deploy-pages.yml`](../.github/workflows/task-1-deploy-pages.yml) (deploy on `main`).
- Enable **Settings → Pages → GitHub Actions** before the first deploy.

## Manual fine-tuning

Spacing, colors, and breakpoints were adjusted incrementally against local PNG references (`references/`, not committed). Any further polish should keep **synthetic data** and **build passing** (`npm run build`).
