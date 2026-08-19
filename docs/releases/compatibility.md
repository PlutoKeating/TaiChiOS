# Compatibility matrix

The `next` line is a bootable MVP candidate, not a stable release. Its pinned Debian image, installer, first boot, Harness composition, and independent recovery target pass automated QEMU acceptance under BIOS and UEFI.

`next` 已是可启动的 MVP 候选，而不是稳定发行版。固定 Debian 镜像、安装器、首启、Harness 组合及独立恢复目标均已通过 BIOS 与 UEFI 的自动 QEMU 验收。

| TaiChiOS line | Debian snapshot | Node.js | Cordis | DeepSeek Harness | dsh-TUI | Status |
|---|---|---|---|---|---|---|
| `next` | Debian 13.6 snapshot `20260819T000000Z` | `24.16.0` | `@deepseek-ai/cordis@4.0.1` | `@deepseek-ai/dsh@0.1.0-rc.7` | `@deepseek-harness-tui/dsh-tui@0.8.3` | Boot/install/recovery verified |
| `staging` | — | — | — | — | — | Branch initialized; no candidate |
| `main` | — | — | — | — | — | Branch initialized; no TaiChiOS release |

Exact commits and package digests, rather than floating branch names, become build inputs.
构建输入使用精确提交与制品摘要，不使用浮动分支或 dist-tag。

The authoritative machine-readable pins and SHA/integrity values live in [`distribution/debian/runtime.lock.json`](../../distribution/debian/runtime.lock.json). The installed dependency graph is frozen by [`distribution/runtime/pnpm-lock.yaml`](../../distribution/runtime/pnpm-lock.yaml).

The inherited `cordis@4.0.0-rc.8` source under `vendor/cordis` is not part of this runtime candidate. Its immutable upstream identity and relocation-only patch queue are recorded in `vendor/cordis/upstream.json`.
`vendor/cordis` 中继承的 `cordis@4.0.0-rc.8` 不进入此运行时候选；其不可变上游身份与仅用于目录迁移的补丁队列记录在 `vendor/cordis/upstream.json`。
