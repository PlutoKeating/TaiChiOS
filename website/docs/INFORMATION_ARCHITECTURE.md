# Website information architecture

TaiChiOS follows the proven public information shape used by mature Linux distributions: a concise project landing page, a truthful download path, task-oriented documentation, an architectural explanation, community entry points, and explicit security/release status.

## Audiences

- Prospective users deciding whether the project is usable today
- Contributors evaluating architecture, scope, and open work
- Operators looking for build, installation, security, and recovery material
- Ecosystem developers interested in Cordis and DeepSeek Harness compatibility

## Content rules

- The website must distinguish implemented behavior from planned architecture.
- Global release labels must come directly from GitHub's public REST API; no page may embed a concrete current tag. The CSP permits only `api.github.com` for this external data, and Cloudflare must not expose an authenticated GitHub token proxy.
- Download calls to action and version history must reflect public GitHub Releases and their actual assets, or display an explicit unavailable state.
- Canonical technical detail stays in repository documentation; the website curates and explains it instead of forking specifications.
- The sole production origin is `https://taichios.arr2018.dpdns.org`.

## 中文合同摘要

- 网站必须区分已经实现的行为与规划中的架构。
- 全站发布标签必须直接来自 GitHub 公共 REST API；任何页面都不得嵌入具体的当前标签。CSP 仅允许通过 `api.github.com` 获取这类外部数据，Cloudflare 禁止暴露带认证 GitHub 令牌的代理。
- 下载入口与版本记录必须反映 GitHub 的全部公开 Releases 及其真实资产；数据不可用时必须明确显示错误状态。
- 权威技术细节保留在仓库文档中，网站只做解释与导航，不复制出另一份规范。
- 唯一生产来源是 `https://taichios.arr2018.dpdns.org`。

## Navigation hierarchy

Primary: Home, Features, Download, Architecture, Docs, Community.

Secondary: Security and About, kept in mobile navigation and the global footer. GitHub is the external collaboration destination.
