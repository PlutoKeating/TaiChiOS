<div align="center">

# TaiChiOS

### AI-Native OS of future | 2019.2.25, start all.

**A bootable, agent-native Debian derivative built around a composable userspace microkernel.**

[简体中文](#太极生万象系统由意图而生) · [English](./README.en.md) · [愿景](./docs/product/vision.md) · [架构](./docs/architecture/overview.md) · [路线图](./docs/roadmap.md)

![Status](https://img.shields.io/badge/status-foundation-6c5ce7)
![Platform](https://img.shields.io/badge/platform-x86__64-0984e3)
![Base](https://img.shields.io/badge/base-Debian-A81D33?logo=debian&logoColor=white)
![License](https://img.shields.io/badge/license-Apache--2.0-2d3436)

</div>

## 太极生万象，系统由意图而生

TaiChiOS 是一个面向个人、团队与自治 Agent 的 AI 原生操作系统项目。它以 Debian 为发行版基础，以 Linux 承担硬件、进程、内存和驱动职责，以 [Cordis](https://github.com/cordiverse/cordis) 作为用户态组合微内核，并将 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)、TUI、模型接入、插件发现、权限、安全恢复与系统更新组织为可替换的系统插件。

它不是一个把聊天窗口贴到 Linux 上的发行版。TaiChiOS 希望让系统本身成为一个可以理解目标、组合能力、持续工作、安装新能力并从失败中恢复的运行环境。

> [!IMPORTANT]
> TaiChiOS 正处于创始脚手架阶段，尚未发布可安装镜像。当前仓库首先固定项目宪法、信任边界、发行版结构和验证路径，再以螺旋模型逐层实现可启动系统。

## 核心主张

- **最小核心，最大扩展。** 网络、界面、模型、工具和 Agent 都是可替换能力；默认系统可以删减到纯字符入口和最小运行时。
- **默认安全，选择自由。** 开箱即用模式提供稳定护栏；经过身份确认的用户也可以显式进入 Developer、Creator 或 YOLO 模式，承担风险并取得其权限范围内的完全控制。
- **模型中立。** 系统不绑定 DeepSeek 或任何单一模型。统一的 Provider Registry 和 Secret Service 为 Agent、插件和系统进程提供标准 LLM API。
- **原生多用户。** Human User、Working Agent 与服务主体都拥有身份、权限、资源预算和审计归属。
- **每次改变都可预演、可验证、可回滚。** 插件安装、Profile 修改和系统升级采用事务式工作流；恢复环境不依赖主 Agent 正常运行。
- **兼容社区，而非圈地重造。** 优先兼容 DSH 的 Bundle、`cordis.patch.yml` 与 `dsh plugin add`，并接入 dsh-find 和 awesome-dsh-plugin 等社区发现机制。

## 系统轮廓

```text
Human / Working Agent / Service Principal
                    │
        TaiChi Shell · TUI · WebView
                    │
        DeepSeek Harness agent runtime
                    │
     TaiChiOS control-plane system plugins
  identity · policy · providers · store · update
                    │
       Cordis userspace composition kernel
  Context · Service · Fiber · Effect · Events
                    │
      broker · sandbox · systemd supervision
                    │
          Debian userspace · Linux kernel
```

Cordis 的 Context、Service、Fiber 和 Effect 负责能力组合与可逆生命周期；Linux 与安全 Broker 负责真正的进程、用户、文件和设备边界。完整说明见[架构总览](./docs/architecture/overview.md)。

## 首个可验证目标

TaiChiOS `0.1` 将交付一个 x86_64 Live 系统：它可以从 USB/虚拟机启动，运行图形化安装器，将系统安装到磁盘并配置引导，然后进入预装 [dsh-TUI](https://github.com/ccch1mneyyy/dsh-TUI) 的 TaiChi Shell。用户可以移除 TUI、选择纯字符/headless 环境，或安装可选 WebView 与其他界面插件。

首轮验收不以截图为准，而以以下闭环为准：

```text
boot live media
  → install to disk
  → boot installed system
  → create users and agent principals
  → configure any supported LLM provider
  → run a task through dsh-TUI
  → dry-run and install a community plugin
  → roll back the change
  → enter recovery mode after a simulated failure
```

## 仓库地图

```text
apps/           系统入口、安装器、Shell 与监督进程
bundles/        可分发的 TaiChiOS/DSH 插件组合
profiles/       base、desktop、headless、recovery 等启动组合
packages/       TaiChiOS 系统能力与当前 Cordis 上游快照
distribution/   Debian Live、安装器、引导与 Debian 包构建
schemas/        插件、权限、Provider 与更新协议
tests/          启动、安装、恢复、安全和兼容性验收
docs/           宪法、ADR、架构、安全、发布和开发文档
vendor/         显式固定且保留许可证的上游源码/补丁
```

本仓库前身 Cordis fork 的源码已按原提交身份归入 `vendor/cordis`，不属于 TaiChiOS 自有能力包，也不进入官方 Harness 运行时；详见[仓库布局](./docs/architecture/repository-layout.md)。

## 参与这项事业

当前最有价值的贡献不是快速堆叠功能，而是帮助验证基础边界：可启动性、安装、身份模型、能力权限、事务回滚、DSH 兼容和恢复路径。

- 阅读[项目宪法](./docs/constitution.md)
- 查看[路线图](./docs/roadmap.md)
- 了解[贡献要求](./CONTRIBUTING.md)
- 报告漏洞时遵循[安全策略](./SECURITY.md)

> [!WARNING]
> DSH 社区插件是以用户权限运行的第三方代码。被社区索引收录不等于通过安全审核。TaiChiOS 将保持生态兼容，但不会把热度、Stars 或列表收录当作信任证明。
