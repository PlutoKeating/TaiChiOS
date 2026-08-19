# Roadmap

## 0.0 — Foundation

- Project constitution, domain language and ADR baseline
- Monorepo and Debian derivative scaffold
- Upstream and license boundaries
- N+2 release model
- Boot/install/recovery acceptance-test contracts

## 0.1 — Bootable TaiChi Shell

- Reproducible x86_64 Debian Live build
- Live installer and GRUB installation
- Installed-system first boot
- systemd Supervisor/Guardian
- TaiChiOS base Profile
- DeepSeek Harness and replaceable dsh-TUI shell
- Pure console and headless fallback

## 0.2 — Identity and model-neutral runtime

- Organizations, Human Users, Working Agents and service principals
- Provider Registry with standard LLM contract
- Secret Service and scoped credential grants
- Multiple Provider adapters without a privileged model
- Audit identity propagation

## 0.3 — TaiChi Store and transactional change

- DSH-native plugin discovery and installation
- dsh-find and awesome-dsh-plugin integration
- Plugin manifest, provenance and trust tiers
- Shared `--dry-run`, `--non-interactive`, `--yes` and `--yolo` semantics
- Candidate activation, health checks and rollback

## 0.4 — Recovery and controlled autonomy

- Independent Recovery Environment
- Safe Profile and Guardian control channel
- Agent-driven plugin discovery and installation
- Long-running goals, jobs and resource budgets
- Sandbox and broker enforcement for community plugins

## 0.5 — Interface and device expansion

- Optional WebView host and browser-based interfaces
- Pluggable network management
- ARM64 investigation
- Remote administration and organization fleet foundations

## 1.0 — Stable platform contracts

- Stable plugin/permission/Provider ABI
- Supported upgrade and rollback window
- Published compatibility and security policy
- Reproducible release pipeline
- Installer, recovery and migration acceptance guarantees

