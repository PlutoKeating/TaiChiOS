# 仓库布局

TaiChiOS 使用 Monorepo 管理发行版配置、系统控制面、协议、界面入口和端到端验收。边界依据“所有权与发布单元”划分，而不是按编程语言划分。

```text
.
├── apps/                   # 可直接运行的系统入口
│   ├── installer/          # 安装器集成与首启流程
│   ├── shell/              # TaiChi Shell 入口和界面选择
│   ├── supervisor/         # 用户态 Guardian/Supervisor
│   └── webview-host/       # 可选 Chromium/WebView 宿主
├── bundles/                # 可分发 DSH/Cordis 配置组合
│   ├── system/
│   ├── tui/
│   └── webview/
├── profiles/               # 可启动系统人格
│   ├── base/
│   ├── desktop/
│   ├── headless/
│   └── recovery/
├── packages/               # TaiChiOS 能力包
│   ├── contracts/
│   ├── identity/
│   ├── policy/
│   ├── provider-registry/
│   ├── secret-service/
│   ├── plugin-store/
│   ├── update-manager/
│   ├── recovery/
│   ├── audit/
│   └── network-manager/
├── distribution/           # Debian 衍生发行版工程
│   ├── live/               # Debian live-build 项目
│   │   ├── auto/
│   │   └── config/
│   ├── installer/          # Calamares/安装流程配置
│   ├── boot/               # GRUB、启动菜单、恢复入口
│   ├── debian/             # TaiChiOS 自有 Debian 包与仓库元数据
│   └── runtime/            # 固定的 Cordis/DSH/界面运行时装配与工厂 Profile
├── schemas/                # 跨包稳定协议
├── tests/                  # 从外部观察系统的验收套件
│   ├── boot/
│   ├── install/
│   ├── integration/
│   ├── recovery/
│   ├── security/
│   └── compatibility/
├── tools/                  # 构建、发布、检查和开发者工具
├── docs/                   # 产品、架构、ADR、安全与发布文档
└── vendor/                 # 必须固定源码时的显式上游边界
```

## Cordis 上游边界

仓库前身 Cordis fork 的 `core`、`loader`、`include` 等源码已迁入 `vendor/cordis/packages`。选择 vendoring 是为了在 TaiChiOS 0.1 迁移期保留原测试、Git 历史与审计基线；发行运行时仍消费 `@deepseek-ai/cordis`，不会加载此快照。

不可变来源、MIT 许可证、包版本和本地补丁队列记录在 `vendor/cordis/upstream.json`。当前唯一补丁是迁移后 TypeScript 配置对仓库根目录的相对路径调整，不修改 Cordis 行为。`corepack yarn compat:cordis` 会逐文件比对固定上游提交并运行在 CI 中。

TaiChiOS 自有包只进入根 `packages/` 中的明确边界，不得加入 `vendor/cordis`。待 TaiChiOS 自有测试不再依赖旧快照后，退出策略是删除 vendored 工作区并继续通过运行时 lockfile 消费发布包；历史仍由本仓库 Git 父提交与 `upstream` 远端保全。

`distribution/runtime` 中的私有 package manifest 仅是发行版装配边界，不是新的公开 TaiChiOS 能力包；它必须通过 lockfile 固定上游制品，不能承载 TaiChiOS 业务逻辑。

## 为什么 Debian 不进入 vendor

Debian 不是一个适合整体 vendor 的单仓库产品。TaiChiOS 通过 Debian Archive/Snapshot、APT 源、源码包和 `live-build` 配置记录来源；自身改动形成独立 Debian 包。这样可以继续接收安全更新、生成对应源代码清单，并避免维护无法同步的 Debian 巨型 fork。
