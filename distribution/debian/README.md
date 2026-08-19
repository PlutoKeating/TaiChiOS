# TaiChiOS Debian base

TaiChiOS 0.1 基于 Debian 13 `trixie` 的 amd64 快照。`snapshot.json` 是机器可读的供应链入口：它固定 Debian 快照时间、Release 文件摘要及构建工具 `.deb` 的版本和摘要。

当前 QEMU MVP 只启用 Debian `main`，不包含硬件固件。真实设备支持必须先增加固件许可证与再分发审查，不能通过临时增加 `non-free-firmware` 绕过。

TaiChiOS 自有 Debian 包及仓库元数据也归此目录管理；Debian 源码不复制进仓库。发布二进制镜像时必须同时保留由 live-build 生成的包清单，并另行生成对应源码镜像以履行相关许可证义务。

English summary: `snapshot.json` pins the immutable Debian amd64 package universe and the exact `live-build` tool. The MVP is deliberately `main`-only and firmware-free.
