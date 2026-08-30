# live-build configuration

原生 Debian live-build 配置：包清单定义最小文本系统，`includes.chroot` 提供 TaiChiOS 身份与启动标记服务，hook 启用该服务和串口 getty。

生成的镜像和包缓存不属于这里，也不能提交到 Git。
