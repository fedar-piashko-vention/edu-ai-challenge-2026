# Task 1 — Leaderboard (vibe coding)

## Objective (challenge)

Recreate the internal company **leaderboard** experience: **all UI elements, filters, sorting, and functionality** from the reference, **no extra features**. **No real corporate data** in the app (names, titles, departments, photos). **Deploy to GitHub Pages** and include this repo’s **source code** plus **`report.md`**.

**Scope:** Leaderboard web part only — **no** SharePoint / M365 shell (suite nav, waffle, site chrome).

## What’s implemented

| Area | Details |
|------|---------|
| **Layout** | Outer **darker** page background; **white inner shell** (`lb-inner-shell`) for filters, podium, and list. |
| **Title** | **`Company Leader Board {year}`** above the shell; **`{year}`** = selected **Year** filter, or **current calendar year** when **All Years** is selected. |
| **Filters** | **Desktop / tablet:** Year, Quarter, Category + search. **Mobile:** Team, Country, Region + search. All dimensions apply together. |
| **Sorting / rank** | Leaders sorted by **total XP descending** after filters; podium = top 3 of that list. |
| **Podium** | Desktop: 2nd–1st–3rd; mobile: stacked. Flat solid stands, flat bottom. |
| **List** | Row with rank, avatar, stats (non-zero buckets only), total, expand. Expanded: **Recent activity** table (Activity, Category, Date, Points). |
| **Data** | Fully **mock / synthetic** — [`src/data/mockEmployees.ts`](src/data/mockEmployees.ts). |
| **CI / Pages** | Build + deploy via GitHub Actions (see below). |

## Stack

- Node.js **24** — [`.nvmrc`](.nvmrc)
- React 19 + TypeScript + Vite 7
- React Bootstrap + Bootstrap 5
- Font Awesome (`@fortawesome/react-fontawesome`)

## Setup

```bash
cd task-1
npm install
npm run dev
```

Open the printed local URL (default `http://localhost:5173/`).

## Production build (required to pass)

```bash
cd task-1
npm run build
```

Must finish with **no errors** (`tsc -b && vite build`). Same command runs in CI.

### Base path (GitHub Pages)

Project URL shape: `https://<user>.github.io/<repository>/`

CI sets `GITHUB_REPOSITORY` so Vite `base` becomes `/<repo>/`. Local check:

```bash
cd task-1
GITHUB_REPOSITORY=owner/repo-name npm run build
npx vite preview
```

Optional: `VITE_BASE` in `.env.production` — see [`.env.example`](.env.example).

## GitHub Actions

| Workflow | Purpose |
|----------|---------|
| [`.github/workflows/task-1-ci.yml`](../.github/workflows/task-1-ci.yml) | `npm ci` + `npm run build` on changes under `task-1/`. |
| [`.github/workflows/task-1-deploy-pages.yml`](../.github/workflows/task-1-deploy-pages.yml) | Build and deploy **`task-1/dist`** to **GitHub Pages** on push to **`main`** (and manual dispatch). |

**Pages:** You must turn Pages on **once** before deploy will succeed (see below).

### Fix: deploy fails with `404` / “Creating Pages deployment failed”

That response almost always means **GitHub Pages is not enabled** for this repository (the API returns “Not Found” until Pages exists).

Do this **in order**:

1. Open **`https://github.com/<owner>/<repo>/settings/pages`** (replace with your repo).
2. Under **Build and deployment → Source**, choose **GitHub Actions** (not “Deploy from a branch”).
3. Save if prompted. Wait a few seconds.
4. Re-run the failed workflow: **Actions → Task 1 — Build and deploy → Re-run all jobs**, or push an empty commit to `main`.

Also check:

- **Private repo:** GitHub Free org/user accounts may need **GitHub Pro** (or make the repo **public**) for Pages from Actions — see [GitHub Pages docs](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).
- **Organization:** An org admin may need to allow **GitHub Pages** for the org or this repo.

### Submission — live URL

Replace with your deployed site after the first successful deploy:

- **GitHub Pages:** `https://<user>.github.io/<repository>/`

Also copy the URL from the **deploy workflow run** or **Settings → Pages**.

## Deliverables checklist (challenge)

- [x] Application **source code** in repo under [`task-1/`](.)
- [x] **[`report.md`](report.md)** — approach, tooling, data replacement
- [ ] **Working GitHub Pages link** — add URL above after deploy
- [x] **No corporate PII** in shipped UI or committed source
- [x] **`npm run build`** succeeds

## Local references (optional, not in git)

Design PNGs / snapshots may live in **`task-1/references/`** — that path is **gitignored** (see root [`.gitignore`](../.gitignore)). Keep copies locally for comparison; do not commit.

## Verification checklist (pre-submit)

- [ ] `npm run build` — zero errors
- [ ] **All Years** shows **current year** in **Company Leader Board {year}**; choosing a year updates the title
- [ ] Filters + search narrow the list; podium matches top 3 of filtered results
- [ ] Expand/collapse and activity table behave correctly on desktop and mobile widths
- [ ] Deployed Pages URL loads assets (no broken CSS/JS paths)
- [ ] [`report.md`](report.md) matches your final process

## Assumptions / limits

- **Sorting:** Primary order is **total XP descending**; no extra column-sort UI unless required by a visible control in references.
- **Avatars:** Loaded from **DiceBear** over HTTPS; blocked networks may show empty image slots without breaking the layout.
- **DiceBear** and **Bootstrap CDN** are not used for CSS — Bootstrap is bundled; only DiceBear URLs are external for avatars.

## Key paths

| Path | Role |
|------|------|
| [`src/components/LeaderboardPage.tsx`](src/components/LeaderboardPage.tsx) | Page layout, filters state, title year |
| [`src/components/FilterBar.tsx`](src/components/FilterBar.tsx) | Responsive filter UI |
| [`src/components/Podium.tsx`](src/components/Podium.tsx) | Top 3 podium |
| [`src/components/LeaderRow.tsx`](src/components/LeaderRow.tsx) | List row + expanded activity |
| [`src/logic/filterLeaders.ts`](src/logic/filterLeaders.ts) | Filter + sort pipeline |
| [`src/data/mockEmployees.ts`](src/data/mockEmployees.ts) | Synthetic dataset |
| [`vite.config.ts`](vite.config.ts) | `base` for Pages |
