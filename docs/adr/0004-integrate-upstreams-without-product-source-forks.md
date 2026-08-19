---
status: accepted
---

# Integrate upstream products without making them the repository base

TaiChiOS is its own Monorepo and consumes Debian, Cordis, DeepSeek Harness, dsh-TUI, and community plugins as versioned upstreams. Source is vendored only when offline reproducibility, auditability, or a necessary patch queue requires it; otherwise lockfiles, Debian source manifests, compatibility matrices, and layered Bundles preserve traceability with lower long-term fork cost.

