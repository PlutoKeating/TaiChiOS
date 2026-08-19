# Boot contract

TaiChiOS 0.1 Live ISO 使用 GRUB PC + GRUB EFI。GRUB 同时绑定本地与 115200 波特串口，并在 1 秒后自动启动默认项。内核命令行必须包含 `boot=live components`、本地控制台和 `ttyS0,115200n8`。systemd 到达 `multi-user.target` 后输出 `TAICHIOS_BOOT_READY`，这是自动化启动测试的唯一成功信号。

后续安装镜像的 GRUB 必须至少提供：默认系统、上一已知可用部署和 recovery 三个入口。当前 Live 切片尚未实现安装后磁盘菜单，因此不能把 Live 启动验收等同于安装验收。
