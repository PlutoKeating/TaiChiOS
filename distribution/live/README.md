# Debian Live build

这里是标准 Debian `live-build` 工程。镜像契约是：amd64、Debian 13 `trixie` 固定快照、BIOS + UEFI、systemd 与多用户文本终端。启动参数同时保留串口与本地图形控制台，并把 `tty0` 作为主控制台。Live 只有在 tty1 实际出现用户 Shell 后才输出 `TAICHIOS_LIVE_SHELL_READY`；安装后只有在 tty1 实际运行用户登录页后才输出 `TAICHIOS_INSTALLED_LOGIN_READY`，避免把 boot log 误判为可交互系统。

## 构建与验收

主机需要 `live-build 1:20250505+deb13u1`；其下载地址与 SHA-256 记录在 `../debian/snapshot.json`。在仓库根目录运行：

```sh
corepack yarn build:live
corepack yarn test:live
corepack yarn test:install
```

构建需要 root 权限、访问固定 Debian 快照，以及用于验证快照 Release 签名的 `debian-archive-keyring`。产物复制到 `artifacts/live/`：ISO、ISO SHA-256、二进制包清单和 chroot 包清单。每次构建会先删除这些已知的旧制品，避免误发布残留文件。工作缓存留在本目录且不进入 Git。`corepack yarn clean:live` 只清除此工程的 live-build 状态及上述已知产物。

构建前必须已有 `corepack yarn install:runtime` 的固定依赖图。`auto/stage-runtime` 校验并缓存固定 Node 归档，再把 Node、Harness 与 dsh-TUI 装入镜像；chroot hook 会在产出 ISO 前再次运行真实 `dsh --version`。构建入口把 `SOURCE_DATE_EPOCH` 固定为 Debian 快照时刻，并通过 live-build 的 rootfs exclude 规则排除可再生但不稳定的 APT 二进制缓存，避免 ISO 内容随构建时刻漂移。

这里的 Yarn 命令只是仓库级构建入口：Debian 包由 `apt` 安装，DSH 插件能力保留 pnpm 兼容，根 Yarn 工作区和开发依赖不会进入 ISO。

`tools/test-live-boot.sh` 分别以 SeaBIOS 和 OVMF 启动 ISO，并等待 tty1 Live Shell 行为标记。`tools/test-installed-system.sh` 还会向空盘安装、移除 ISO、从磁盘启动，确认 tty1 用户登录页，再进入独立 Recovery target。所有 QEMU 都不配置网卡。

镜像内的 `taichios-change` 为 `/etc/taichios` 与 `/opt/taichios` 托管文件提供持久 Change Set 状态、候选激活、SHA-256 验证、Rollback Point 和显式 `rollback-failed`。`tools/test-change-manager.sh` 在隔离临时系统根执行同一脚本；`compat:live` 会运行该行为门禁。`--root` 可让 Recovery 操作明确挂载的离线系统根，不放宽逻辑目标目录。

发布版本使用 `corepack yarn build:release`，一次配置并构建二进制 ISO 与对应的 `taichios-0.1-source.iso`，同时生成源码文件清单 `source.contents`；不要在它之后调用 `build:live`，后者会恢复日常构建配置。完成启动与安装验收后，`corepack yarn prepare:release --tag TAG --commit FULL_GIT_SHA` 会验证必需制品并生成 `release-metadata.json` 与覆盖所有发布文件的 `SHA256SUMS`。标签发布工作流自动执行完整路径、保存 CI 制品、生成 GitHub build-provenance attestation，并发布 GitHub Prerelease。

English summary: the executable live-build project emits an amd64 hybrid ISO and package manifests. BIOS and UEFI QEMU tests gate the bootable claim.
