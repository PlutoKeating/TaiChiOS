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

## 当前迁移状态

仓库前身是 Cordis fork，因此当前 `packages/core`、`packages/loader`、`packages/include` 等仍是 Cordis 源码。它们暂时保持原位以保护可运行性和 Git 历史。后续以单独迁移提交完成以下选择之一：

1. 若 TaiChiOS 只消费发布包，移除本地快照并通过 lockfile 固定；
2. 若必须长期维护补丁，将快照历史保全迁入 `vendor/cordis`；
3. 可上游化的改动提交给 Cordis，TaiChiOS 只保留短期 patch queue。

迁移完成前，新增 TaiChiOS 包只使用上表中的明确名称，不把新业务混入现有 Cordis 包。
`distribution/runtime` 中的私有 package manifest 仅是发行版装配边界，不是新的公开 TaiChiOS 能力包；它必须通过 lockfile 固定上游制品，不能承载 TaiChiOS 业务逻辑。

## 为什么 Debian 不进入 vendor

Debian 不是一个适合整体 vendor 的单仓库产品。TaiChiOS 通过 Debian Archive/Snapshot、APT 源、源码包和 `live-build` 配置记录来源；自身改动形成独立 Debian 包。这样可以继续接收安全更新、生成对应源代码清单，并避免维护无法同步的 Debian 巨型 fork。
