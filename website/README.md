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

Release and commit data is never embedded into the static page bundle. The browser reads GitHub's public REST API directly, follows every 100-item page for Releases, assets, digests, and commits, fixes each commit traversal to the `main` head observed on its first page, and sanitizes the combined snapshot locally. It loads immediately and refreshes after each completed 15-minute interval, keeping GitHub as the only source for the header, landing page, download view, and complete version history without exposing a public authenticated proxy that could leak or exhaust a project token. GitHub explicitly permits these browser requests with CORS. When GitHub is unavailable the UI presents an explicit unavailable state instead of substituting stale hardcoded version data. Cloudflare Pages advanced mode is limited to canonical-host redirects and static asset delivery.

发布与提交数据不会写入静态页面包。浏览器直接读取 GitHub 公共 REST API，自动追踪全部 100 条分页，合并公开 Releases、资产、摘要与提交；提交遍历固定在第一页观察到的 `main` head，并在本地清洗结果。页面打开时立即读取，之后每次完整刷新结束 15 分钟再刷新，因此导航栏、Landing Page、下载页与完整版本记录始终以 GitHub 为唯一来源，同时不暴露可能泄漏或耗尽项目令牌的认证代理。GitHub 通过 CORS 明确允许浏览器访问。GitHub 不可用时，界面会明确显示不可用状态，不会回退到硬编码版本。Cloudflare Pages 高级模式仅负责官方域名跳转和静态资源交付。
