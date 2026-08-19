# Compatibility matrix

The `next` line has a verified userspace runtime candidate. This does not yet make `next` a bootable TaiChiOS release; Debian image, installer, first-boot, and recovery acceptance remain open.

`next` 已有通过验收的用户态运行时候选，但它还不是可启动的 TaiChiOS 发行版；Debian 镜像、安装器、首启与恢复验收仍未完成。

| TaiChiOS line | Debian snapshot | Node.js | Cordis | DeepSeek Harness | dsh-TUI | Status |
|---|---|---|---|---|---|---|
| `next` | TBD | `24.16.0` | `@deepseek-ai/cordis@4.0.1` | `@deepseek-ai/dsh@0.1.0-rc.7` | `@deepseek-harness-tui/dsh-tui@0.8.3` | Runtime smoke verified |
| `staging` | — | — | — | — | — | Branch initialized; no candidate |
| `main` | — | — | — | — | — | Branch initialized; no TaiChiOS release |

Exact commits and package digests, rather than floating branch names, become build inputs.
构建输入使用精确提交与制品摘要，不使用浮动分支或 dist-tag。

The authoritative machine-readable pins and SHA/integrity values live in [`distribution/debian/runtime.lock.json`](../../distribution/debian/runtime.lock.json). The installed dependency graph is frozen by [`distribution/runtime/pnpm-lock.yaml`](../../distribution/runtime/pnpm-lock.yaml).

The inherited `cordis@4.0.0-rc.8` source under `vendor/cordis` is not part of this runtime candidate. Its immutable upstream identity and relocation-only patch queue are recorded in `vendor/cordis/upstream.json`.
`vendor/cordis` 中继承的 `cordis@4.0.0-rc.8` 不进入此运行时候选；其不可变上游身份与仅用于目录迁移的补丁队列记录在 `vendor/cordis/upstream.json`。
