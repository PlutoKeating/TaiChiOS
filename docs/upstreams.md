# 上游依赖政策

## 原则

上游依赖必须具有明确来源、固定版本、许可证、补丁理由和退出路径。TaiChiOS 不把网络主分支作为可复现构建输入。

## Debian

- 使用官方 Debian Archive 或 Snapshot 作为包和源码来源。
- Live 系统由仓库中的 `distribution/live` 配置生成。
- TaiChiOS 修改优先形成独立 Debian 包，而不是直接覆盖基础文件。
- 每个发布版本保存包清单、源仓版本和仓库快照标识。

## Cordis

- 优先消费正式发布版本或固定 commit。
- 核心补丁只接受事务加载、安全加载入口、跨进程代理、稳定生命周期观测等无法由插件实现的变化。
- 所有可复用补丁优先上游贡献。

## DeepSeek Harness

- 作为默认系统插件集和 DSH 兼容协议来源，而不是模型绑定。
- 通过 compatibility matrix 固定 Cordis、Harness、Node.js 与系统 Bundle 组合。
- TaiChiOS Profile 在上游 Bundle 之上叠加，不复制整个 Harness 仓库。

## 社区插件

- dsh-find 与 awesome-dsh-plugin 用于发现。
- npm、GitHub 或 DSH 支持的来源用于取得制品。
- 安装前固定版本/commit，解析 manifest，显示权限并产生 Change Set。
- 社区收录不等于 TaiChiOS 认证；信任由来源、签名、审核和执行层共同决定。

## Vendoring 条件

只有满足至少一个条件才将源码置于 `vendor/`：构建必须离线复现；上游无法发布所需制品；TaiChiOS 必须维护尚未上游化的关键补丁；或安全审计要求冻结完整源码。Vendoring 必须保留原许可证与 NOTICE。

