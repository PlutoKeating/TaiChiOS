# Debian Live build

这里是标准 Debian `live-build` 工程。镜像契约是：amd64、Debian 13 `trixie` 固定快照、BIOS + UEFI、systemd、多用户文本终端，以及串口验收标记 `TAICHIOS_BOOT_READY`。

## 构建与验收

主机需要 `live-build 1:20250505+deb13u1`；其下载地址与 SHA-256 记录在 `../debian/snapshot.json`。在仓库根目录运行：

```sh
corepack yarn build:live
corepack yarn test:live
corepack yarn test:install
```

构建需要 root 权限和访问固定 Debian 快照。产物复制到 `artifacts/live/`：ISO、ISO SHA-256、二进制包清单和 chroot 包清单。工作缓存留在本目录且不进入 Git。`corepack yarn clean:live` 只清除此工程的 live-build 状态及上述已知产物。

构建前必须已有 `corepack yarn install:runtime` 的固定依赖图。`auto/stage-runtime` 校验并缓存固定 Node 归档，再把 Node、Harness 与 dsh-TUI 装入镜像；chroot hook 会在产出 ISO 前再次运行真实 `dsh --version`。构建入口把 `SOURCE_DATE_EPOCH` 固定为 Debian 快照时刻，并通过 live-build 的 rootfs exclude 规则排除可再生但不稳定的 APT 二进制缓存，避免 ISO 内容随构建时刻漂移。

这里的 Yarn 命令只是仓库级构建入口：Debian 包由 `apt` 安装，DSH 插件能力保留 pnpm 兼容，根 Yarn 工作区和开发依赖不会进入 ISO。

`tools/test-live-boot.sh` 分别以 SeaBIOS 和 OVMF 启动 ISO。`tools/test-installed-system.sh` 还会向空盘安装、移除 ISO、从磁盘启动，再进入独立 Recovery target。所有 QEMU 都不配置网卡。

发布版本还必须先执行 `sudo distribution/live/auto/config --source true --apt-source-archives true`，再运行构建并归档源码 ISO；日常启动测试关闭源码索引与源码镜像以控制时长和体积。

English summary: the executable live-build project emits an amd64 hybrid ISO and package manifests. BIOS and UEFI QEMU tests gate the bootable claim.
