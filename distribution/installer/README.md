# Installer distribution integration

安装器尚未进入当前 Live 镜像。后续实现必须满足以下可自动化 fixture：

1. 从同一离线 ISO 向空白 GPT 磁盘安装，不访问网络。
2. UEFI 创建 ESP，BIOS 创建 BIOS boot 分区；两者安装 GRUB。
3. 首次硬盘启动进入 TaiChiOS 多用户 Harness shell，并留下可机读的 first-boot 状态。
4. GRUB 提供默认、上一已知可用版本、recovery 三个入口。
5. 安装失败不得破坏已存在分区；升级失败可回退到上一部署。

Calamares 模块、品牌和安装期配置归此目录；面向应用的首次启动流程归 `apps/installer`。在这些 fixture 被 QEMU 验证前，不宣称具备“可安装系统”。
