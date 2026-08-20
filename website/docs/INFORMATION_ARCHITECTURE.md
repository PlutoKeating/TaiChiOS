# Website information architecture

TaiChiOS follows the proven public information shape used by mature Linux distributions: a concise project landing page, a truthful download path, task-oriented documentation, an architectural explanation, community entry points, and explicit security/release status.

## Audiences

- Prospective users deciding whether the project is usable today
- Contributors evaluating architecture, scope, and open work
- Operators looking for build, installation, security, and recovery material
- Ecosystem developers interested in Cordis and DeepSeek Harness compatibility

## Content rules

- The website must distinguish implemented behavior from planned architecture.
- Global release labels must come from the same-origin GitHub repository endpoint; no page may embed a concrete current tag.
- Download calls to action and version history must reflect public GitHub Releases and their actual assets, or display an explicit unavailable state.
- Canonical technical detail stays in repository documentation; the website curates and explains it instead of forking specifications.
- The sole production origin is `https://taichios.arr2018.dpdns.org`.

## Navigation hierarchy

Primary: Home, Features, Download, Architecture, Docs, Community.

Secondary: Security and About, kept in mobile navigation and the global footer. GitHub is the external collaboration destination.
