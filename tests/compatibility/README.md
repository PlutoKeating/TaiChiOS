# Compatibility tests

Pinned Cordis, DeepSeek Harness, Node.js, dsh-TUI and community plugin contract checks.
本目录存放 Cordis、DeepSeek Harness、Node.js、dsh-TUI 与社区插件契约的固定版本验收。

Run the current runtime gate from the repository root:

```sh
corepack yarn install:runtime
corepack yarn compat:runtime
corepack yarn compat:cordis
```

The smoke gate verifies immutable inputs and licenses, official Cordis isolation, the DSH bundle patch contract, CLI startup, offline profile composition, and a real dsh-TUI boot in a pseudo-terminal. The TUI must remain alive until the test timeout without a Provider credential or network access.
该门槛检查不可变输入与许可证、官方 Cordis 隔离、DSH Bundle patch 契约、CLI 启动、离线 Profile 组合，以及真实 dsh-TUI 在伪终端和断网命名空间中的启动。没有 Provider 凭据和网络时，TUI 必须保持运行直到测试超时。

The smoke first proves that Bubblewrap can create the offline namespace. On locked-down CI hosts that deny unprivileged user namespaces, passwordless `sudo` creates only the network namespace through `unshare`, which drops back to the runner UID/GID before the runtime starts. Failures include the captured pseudo-terminal transcript.
Smoke 会先验证 Bubblewrap 确实能够创建断网命名空间。若 CI 宿主禁止非特权 user namespace，则由免密 `sudo` 仅通过 `unshare` 创建网络命名空间，并在运行时启动前降回 runner 的 UID/GID。失败信息会附带捕获的伪终端记录。

The timeout is accepted only after the full smoke interval; GNU timeout's status `124`, a propagated `SIGINT`, or the configured two-second `SIGKILL` fallback represent the expected controlled shutdown at their respective deadlines.
只有经过完整 smoke 时长后才接受超时结果；GNU timeout 的状态 `124`、传播的 `SIGINT`，或在额外两秒期限触发的 `SIGKILL` 回退，才表示各自截止时间上的预期受控关闭。

`compat:cordis` 逐文件对比历史快照与固定的 Cordis 上游提交，只允许 `upstream.json` 中列出的迁移补丁，并校验包身份和 MIT 许可证摘要。
