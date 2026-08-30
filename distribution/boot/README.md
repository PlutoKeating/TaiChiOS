# Boot contract

TaiChiOS 0.1 Live ISO 使用 GRUB PC + GRUB EFI。GRUB 同时绑定本地与 115200 波特串口，并在 10 秒后自动启动默认 Live 项。内核命令行必须包含 `boot=live components`，并按 `console=ttyS0,115200n8 console=tty0` 的顺序声明控制台：串口保留自动化输出，最后声明的本地图形控制台作为 `/dev/console`。systemd 到达 `multi-user.target` 时输出基础标记 `TAICHIOS_BOOT_READY`；只有 tty1 上实际出现 Live 用户会话后才输出验收标记 `TAICHIOS_LIVE_SHELL_READY`，BIOS/UEFI 门禁以后一标记判定成功。

安装后的 GRUB 提供默认 Debian/TaiChiOS、`TaiChiOS Previous (known-good)` 和 `TaiChiOS Recovery`。Recovery 进入独立 systemd target，不启动普通 Harness/Profile 树；Previous 在进入多用户目标前回滚最后一次 TaiChiOS 托管变更。安装后的首次启动只有在 tty1 上实际运行 `agetty` 用户登录页后才输出 `TAICHIOS_INSTALLED_LOGIN_READY`。QEMU 门禁分别验证 BIOS 与 UEFI 的 Live Shell、安装后用户登录页、磁盘启动及 Recovery 标记。

无人值守安装在 2 GiB 最低测试内存内将 SquashFS 解包限制为单工作线程，并通过锁定版本支持的数据/碎片队列参数把缓存合计限制为 256 MiB；严格错误处理禁止部分根文件系统继续进入 bootloader 安装。串口阶段标记和失败标记用于让固件矩阵快速定位安装失败，而非等待整段测试超时。

Recovery marker 只有在构建时封存的可信文件清单验证通过后才会输出。运行中的系统所有者也可通过 `sudo taichios-guardianctl enter-recovery` 请求 Guardian 隔离到同一 target；这条 root-only 控制通道不依赖 Harness 或 TUI。

Guardian 与 Profile quarantine 只随新构建/新安装镜像交付，不会静默迁移已有系统。手工迁移必须把 Guardian/Harness/Recovery 命令、systemd 单元、账户清单及重新封存的 trusted manifest 作为同一个受审查变更；回退时先禁用 Guardian、清除 safe-profile marker，再恢复上一组 supervisor/unit，无法进入普通 target 时使用 GRUB `Previous` 或 getty-based `Recovery` Profile。

控制台权限边界不变：默认 Live 会话仍使用既有的 `taichi` 自动登录，只是将它明确呈现在 tty1；串口仍只提供原有的登录与验收输出，没有新增认证绕过。`Install` 启动项不会重启 tty1，也不会启动普通运行态 Guardian，避免故障监督把有意无终端的安装环境误判为 Harness/tty 故障并停止整盘安装服务。运维人员可在 GRUB 临时编辑 `console=` 顺序，显式覆盖默认控制台；恢复方式是还原该顺序或选择串口/其他虚拟终端。此变更只影响由新源码构建的镜像，不迁移已安装系统的数据。

## English contract summary

The default Live boot keeps serial output for automation while making tty1 the primary interactive console. `TAICHIOS_LIVE_SHELL_READY` is emitted only after a Live user session is attached to tty1. Installed acceptance requires `agetty` on tty1 and emits `TAICHIOS_INSTALLED_LOGIN_READY`; it never treats boot-log progress as a login page. This does not add an authentication bypass: the existing Live `taichi` autologin is merely exposed on tty1. Installer boots are excluded from both the tty1 handoff and normal-runtime Guardian supervision so an intentionally headless install is not isolated as a tty/Harness failure. Unattended extraction uses one worker, 128 MiB data and fragment queues (256 MiB aggregate), and strict errors; serial stage/failure markers make incomplete installation observable. Operators may explicitly override the console order in GRUB; reverting that order or selecting the serial/another virtual terminal is the rollback path. Existing installed data is not migrated.
