# Boot contract

TaiChiOS 0.1 Live ISO 使用 GRUB PC + GRUB EFI。GRUB 同时绑定本地与 115200 波特串口，并在 10 秒后自动启动默认 Live 项。内核命令行必须包含 `boot=live components`，并按 `console=ttyS0,115200n8 console=tty0` 的顺序声明控制台：串口保留自动化输出，最后声明的本地图形控制台作为 `/dev/console`，确保 VMM 启动后显示交互式终端。systemd 到达 `multi-user.target` 后输出 `TAICHIOS_BOOT_READY`，这是自动化启动测试的唯一成功信号。

安装后的 GRUB 提供默认 Debian/TaiChiOS、`TaiChiOS Previous (known-good)` 和 `TaiChiOS Recovery`。Recovery 进入独立 systemd target，不启动普通 Harness/Profile 树；Previous 在进入多用户目标前回滚最后一次 TaiChiOS 托管变更。QEMU 门禁分别验证 BIOS 与 UEFI 的 Live 启动、安装后磁盘启动及 Recovery 标记。

控制台权限边界不变：默认 Live 会话仍使用既有的 `taichi` 自动登录，只是将它明确呈现在 tty1；串口仍只提供原有的登录与验收输出，没有新增认证绕过。`Install` 启动项不会重启 tty1，避免与受保护的整盘安装服务竞争。运维人员可在 GRUB 临时编辑 `console=` 顺序，显式覆盖默认控制台；恢复方式是还原该顺序或选择串口/其他虚拟终端。此变更只影响由新源码构建的镜像，不迁移已安装系统的数据。

## English contract summary

The default Live boot keeps serial output for automation while making tty1 the primary interactive console. It does not add an authentication bypass: the existing Live `taichi` autologin is merely exposed on tty1, and installer boots are excluded from the tty1 handoff to avoid racing the guarded whole-disk installer. Operators may explicitly override the console order in GRUB; reverting that order or selecting the serial/another virtual terminal is the rollback path. Existing installed data is not migrated.
