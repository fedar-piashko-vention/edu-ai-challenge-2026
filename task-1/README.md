# Task 1 — Leaderboard (vibe coding)

## Objective

Clone the company leaderboard experience as a standalone web app (no SharePoint chrome): filters, podium for top three, full ranked list with expandable XP activity tables, responsive desktop and mobile layouts. Deploy to **GitHub Pages** with synthetic data only — see [`report.md`](report.md).

## Stack

- Node.js **24** (see [`.nvmrc`](.nvmrc))
- React 19 + TypeScript + Vite 7
- React Bootstrap + Bootstrap 5
- Font Awesome (React)

## Setup

```bash
cd task-1
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173/`).

## Production build

```bash
cd task-1
npm run build
```

Requires **zero errors** — same command as CI.

### Base path (GitHub Pages)

For a project site at `https://<user>.github.io/<repository>/`, the production `base` must be `/<repository>/`. In CI this is inferred from `GITHUB_REPOSITORY`. For a **local** production check with the same base:

```bash
cd task-1
GITHUB_REPOSITORY=owner/repo-name npm run build
npx vite preview
```

Optional: set `VITE_BASE` in `.env.production` (see [`.env.example`](.env.example)).

## GitHub Pages

1. Repository **Settings → Pages**: set **Source** to **GitHub Actions** (after the first successful workflow run).
2. Push to `main`: [`.github/workflows/task-1-deploy-pages.yml`](../.github/workflows/task-1-deploy-pages.yml) builds `task-1` and deploys `task-1/dist`.

### Submission URL

After deployment, the public URL is shown in the workflow summary and under **Settings → Pages**. Paste the live link here when submitting:

- **GitHub Pages:** _(add after first deploy)_

## Local references (optional)

Design references live under `references/` for side-by-side comparison. That folder is **gitignored** — keep copies locally; do not rely on them being in the remote repo.

## Verification checklist

- [ ] `npm run build` succeeds with no errors in `task-1/`
- [ ] Filters: year / quarter / category (desktop), team / country / region (mobile), plus search — all combinations behave sensibly
- [ ] Podium shows top three of the **filtered** list; list below matches order (by total XP, descending)
- [ ] Row expand/collapse shows activity table with XP summing consistently
- [ ] Responsive: wide layout ≈ desktop reference; narrow layout ≈ mobile reference
- [ ] No real corporate PII in repo or UI
- [ ] [`report.md`](report.md) present and accurate
- [ ] GitHub Pages URL loads after enabling Actions-based Pages

## Assumptions

- “Sorting” in the task brief is satisfied by default **rank order by total XP (descending)** after filters; there is no separate column-sort UI unless added to match a visible control in references.
- Avatar images are loaded from DiceBear’s public API; if blocked offline, images may fail to load without breaking the app shell.
