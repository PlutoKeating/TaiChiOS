# Installer distribution integration

TaiChiOS 0.1 使用可审计的文本整盘安装器。Live GRUB 菜单中的 `Install TaiChiOS 0.1 (ERASE DISK)` 会显式擦除 `/dev/vda`；命令行入口必须同时提供 `--disk DEVICE --yes`，缺少确认时拒绝执行。它创建 GPT、BIOS boot 分区、ESP 和 ext4 根分区，从同一离线 ISO 展开系统，并安装 BIOS 与 UEFI GRUB。

1. 从同一离线 ISO 向空白 GPT 磁盘安装，不访问网络。
2. UEFI 创建 ESP，BIOS 创建 BIOS boot 分区；两者安装 GRUB。
3. 首次硬盘启动进入 TaiChiOS 多用户 Harness shell，并留下可机读的 first-boot 状态。
4. GRUB 提供默认、上一已知可用版本、recovery 三个入口。
5. 安装失败不得破坏已存在分区；升级失败可回退到上一部署。

`tools/test-installed-system.sh` 在 QEMU 中对 BIOS 与 UEFI 分别执行安装、移除 ISO、硬盘启动和 recovery 启动。工厂验收账号是 `taichi/taichi` 与 `creator/creator`，只适用于 0.1 开发镜像；面向真实用户发布前必须用首次启动凭据创建流程替代。

Calamares 仍是未来图形安装器候选，但不属于本次已验证的文本 MVP。
