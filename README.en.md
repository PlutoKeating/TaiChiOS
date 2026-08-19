<div align="center">

# TaiChiOS

### AI-Native OS of future | 2019.2.25, start all.

**A bootable, agent-native Debian derivative built around a composable userspace microkernel.**

[简体中文](./README.md) · [Vision](./docs/product/vision.md) · [Architecture](./docs/architecture/overview.md) · [Roadmap](./docs/roadmap.md)

</div>

TaiChiOS is an AI-native operating-system project for people, teams, and autonomous agents. Debian and Linux own the hardware and process boundary; Cordis acts as a composable userspace microkernel; DeepSeek Harness, interfaces, model providers, plugin discovery, policy, recovery, and updates are replaceable system plugins.

The project is model-neutral, multi-user by design, safe by default, explicit about user sovereignty, and committed to dry-runnable and reversible system change. Its first target is an installable x86_64 Debian Live system with dsh-TUI as the replaceable default shell.

> [!IMPORTANT]
> TaiChiOS now has a reproducible 0.1 MVP candidate that passes QEMU BIOS/UEFI live boot, installation, disk-first-boot, and recovery checks. No stable image has been released, and the factory credentials are for development acceptance only.

Package management follows ecosystem boundaries: `apt` owns Debian system packages, pnpm remains the native DSH profile/plugin manager, and Yarn 4 is limited to the Cordis-derived source workspace, Yakumo builds, and repository tests. Yarn is not a Debian system package manager, and the root workspace is not copied into the system image.

Start with the [project constitution](./docs/constitution.md), [architecture overview](./docs/architecture/overview.md), and [roadmap](./docs/roadmap.md). The canonical product and architecture documents are currently written in Chinese; stable documents will gain English counterparts as they mature.
