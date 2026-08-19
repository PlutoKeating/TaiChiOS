# 创始决策基线

本文档把 2026-08-19 的创始讨论整理为项目输入。规范性长期原则以[项目宪法](./constitution.md)为准；难以逆转的技术选择以 [ADR](./adr/) 为准。

## 产品与用户

- TaiChiOS 是 Debian 衍生的 AI 原生操作系统，Cordis 是用户态组合微内核。
- 服务对象同时包括开发者与普通用户；首期不承诺企业级 SLA。
- 系统以组织和服务器为重要默认场景，原生支持多 Human User、Working Agent 与服务主体。
- 自组织默认允许；系统可以根据目标选择、挂载和释放已安装能力。
- 自扩展采用“自动发现与提议、策略控制安装”的默认行为；更高模式可显式放宽。
- 自演化输出候选补丁或插件，经过 Dry Run、测试、候选启用与回滚保护后进入稳定系统。

## 自由、安全与自主性

- 默认使用 Guarded Mode，为多数用户提供稳定、开箱即用的护栏。
- 授权用户可明确进入 Developer、Creator 或 YOLO 模式。所有命令行操作应形成统一的非交互显式覆盖约定，使 Working Agent 能在获得授权后无提示执行。
- `--yolo` 表示跳过交互审批，不伪造身份，也不自动取得调用者没有的组织权限；组织所有者可以授予系统级权限。
- 高风险模式可以允许破坏性系统行为。实现必须在执行前准确显示作用域和后果，并尽可能先建立恢复点，但不得把恢复机制变成不可绕过的所有权限制。
- Agent 可以自主决定持续目标与具体执行方式；策略重点约束权限、预算和影响边界，不把某种固定工作流强加给所有 Agent。
- 时间、Token、费用、CPU、内存、磁盘和子任务预算是一等策略对象；授权主体可以明确调整。

## 发行版与体验

- 首发支持 x86_64。
- 产物是可启动 Live 系统，其中包含安装器，可安装到计算机并配置 GRUB；它不是只运行于 Live 环境的一次性 appliance。
- Debian 是发行版父系，TaiChiOS 的定位类似独立 Debian derivative，而不是 Ubuntu/Kali 的再衍生。
- systemd 作为 PID 1，TaiChiOS Supervisor/Guardian 负责用户态服务监护。
- 根系统保持可修改，不采用 immutable-base 产品约束。
- 系统镜像、系统插件集和用户插件升级都必须可回滚。
- dsh-TUI 是默认安装的界面插件；用户可删除、替换或并存其他 TUI、Web UI、纯字符或 headless 界面。
- Chromium/WebView 是可选基座插件，不是最低系统依赖。
- 网络与网络体验具备可插拔服务边界；离线启动和本地管理必须成立。

## 模型、凭证与 Agent

- 禁止绑定具体模型或单一 Provider。
- Provider Registry 是默认护栏下受保护的系统插件，为系统进程、Harness、Agent 和插件提供标准 LLM API。
- Secret Service 负责 Provider 凭证，不把密钥写入普通配置、Session 或日志。
- MVP 提供一个默认主 Agent，同时支持多个 Agent 主体和替代 Agent 运行时。

## 插件生态

- 沿用 DSH 的 Bundle、`cordis.patch.yml` 和 `dsh plugin add` 兼容协议。
- 优先接入 dsh-find、awesome-dsh-plugin 及其社区市场体验，不建设封闭商店。
- npm/GitHub 可以承担代码分发与发现；TaiChiOS 在其上增加来源固定、签名、权限、Dry Run、隔离和回滚语义。
- 插件按系统、认证、社区、本地开发和隔离运行等信任层级处理。
- 未签名插件仅在明确开发/创造授权下进入系统。
- 原生扩展和安装脚本属于高风险能力，不进入主 Cordis 进程。

## 工程与治理

- TaiChiOS 自有代码采用 Apache-2.0；上游代码保留原许可证。
- 早期采用创始维护者最终决策、RFC/ADR 支撑的开放治理。
- 合入系统能力时要求测试、威胁分析、迁移说明、回滚方案、权限变化和可复现构建。
- 当前仓库彻底转型为 TaiChiOS 主仓库；Cordis、DeepSeek Harness 与 Debian 均作为上游依赖。
- 采用 Monorepo 与 `next → staging → main` 的 N+2 发布流。
- 快速发布与螺旋开发并行：先完整铺设边界和验证脚手架，再逐轮实现端到端闭环。
- 中文是产品愿景和设计讨论的第一语言；代码、API、Schema 与提交信息使用英文；稳定文档逐步双语化。

