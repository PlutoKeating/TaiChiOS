# Boot contract

TaiChiOS 0.1 Live ISO 使用 GRUB PC + GRUB EFI。GRUB 同时绑定本地与 115200 波特串口，并在 10 秒后自动启动默认 Live 项。内核命令行必须包含 `boot=live components`、本地控制台和 `ttyS0,115200n8`。systemd 到达 `multi-user.target` 后输出 `TAICHIOS_BOOT_READY`，这是自动化启动测试的唯一成功信号。

安装后的 GRUB 提供默认 Debian/TaiChiOS、`TaiChiOS Previous (known-good)` 和 `TaiChiOS Recovery`。Recovery 进入独立 systemd target，不启动普通 Harness/Profile 树；Previous 在进入多用户目标前回滚最后一次 TaiChiOS 托管变更。QEMU 门禁分别验证 BIOS 与 UEFI 的 Live 启动、安装后磁盘启动及 Recovery 标记。
