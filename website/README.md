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
