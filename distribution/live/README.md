# Debian Live build

这里是标准 Debian `live-build` 工程。镜像契约是：amd64、Debian 13 `trixie` 固定快照、BIOS + UEFI、systemd、多用户文本终端，以及串口验收标记 `TAICHIOS_BOOT_READY`。

## 构建与验收

主机需要 `live-build 1:20250505+deb13u1`；其下载地址与 SHA-256 记录在 `../debian/snapshot.json`。在仓库根目录运行：

```sh
corepack yarn build:live
corepack yarn test:live
```

构建需要 root 权限和访问固定 Debian 快照。产物复制到 `artifacts/live/`：ISO、ISO SHA-256、二进制包清单和 chroot 包清单。工作缓存留在本目录且不进入 Git。`corepack yarn clean:live` 只清除此工程的 live-build 状态及上述已知产物。

`tools/test-live-boot.sh` 分别以 SeaBIOS 和 OVMF 启动 ISO。只有两种模式都从 guest 串口输出验收标记，才可称为“可启动”。这不是安装器验收，也不代表真实硬件固件兼容。

发布版本还必须先执行 `sudo distribution/live/auto/config --source true --apt-source-archives true`，再运行构建并归档源码 ISO；日常启动测试关闭源码索引与源码镜像以控制时长和体积。

English summary: the executable live-build project emits an amd64 hybrid ISO and package manifests. BIOS and UEFI QEMU tests gate the bootable claim.
