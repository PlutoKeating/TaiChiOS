# live-build automation

- `config` 只从固定 Debian 快照生成 live-build 配置。
- `build` 构建镜像并复制已知发布产物到 `artifacts/live/`。
- `clean` 清除本工程状态与这些已知产物。

这些入口采用 live-build 的 `noauto` 调用约定，避免递归执行自身。
