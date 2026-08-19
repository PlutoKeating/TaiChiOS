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

`compat:cordis` 逐文件对比历史快照与固定的 Cordis 上游提交，只允许 `upstream.json` 中列出的迁移补丁，并校验包身份和 MIT 许可证摘要。
