# TaiChiOS official website

This directory owns the source, design rules, deployment configuration, and operating notes for the official TaiChiOS website.

Production URL: **https://taichios.arr2018.dpdns.org**

## Stack

- React Router framework mode with static pre-rendering
- React 19 and TypeScript
- Tailwind CSS 4
- Cloudflare Pages, deployed only by GitHub Actions

The application is intentionally independent from the operating-system root Yarn workspace. Use npm only inside this directory.

## Local development

```sh
cd website
npm ci
npm run dev
```

Run the same quality gate used by CI:

```sh
npm run check
```

The production output is `build/client`. Every public route is pre-rendered and is listed in `react-router.config.ts` and `public/sitemap.xml`.

## Site map

- `/` — landing page and current project status
- `/features` — system principles and capabilities
- `/download` — release status and build-from-source path
- `/architecture` — system layers, lifecycle, and trust boundaries
- `/docs` — curated documentation entry points
- `/community` — contribution and governance entry points
- `/security` — threat model, disclosure, and recovery principles
- `/about` — mission, roadmap, and project identity

## Development policy

All interface changes must follow [the responsive and accessibility standard](./docs/RESPONSIVE_STANDARD.md) and [the design system](./design-system/taichios/MASTER.md). A change that works at only one viewport is incomplete.

Deployments are managed by `.github/workflows/website.yml`; do not deploy from a developer machine except for an explicitly authorized recovery operation. Cloudflare credentials belong in GitHub Actions secrets and must never be committed.

Cloudflare Pages runs `public/_worker.js` in advanced mode. It permanently redirects every generated `*.pages.dev` hostname—including deployment aliases—to the production hostname while preserving the path and query string. Requests already using the production hostname are served from the static asset binding.

Release and commit data is never embedded into the static page bundle. The same Worker exposes `/api/github/repository`, reads public Releases, assets, digests, and `main` commits from the GitHub API, sanitizes the response, and caches it at the edge for 60 seconds. The shared React repository provider refreshes this same-origin endpoint every minute, so the header, landing page, and complete download/version-history view all derive their current release identity from GitHub. When GitHub is unavailable the UI presents an explicit unavailable state instead of substituting stale hardcoded version data. An optional `GITHUB_TOKEN` Cloudflare secret may raise API limits; it must never be committed.
