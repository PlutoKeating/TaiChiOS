# AGENTS.md

TaiChiOS 是一个可启动、可安装、可恢复的 Debian 衍生操作系统，不是单一应用程序。本文件约束 AI Agent 在本仓库内进行设计、实现、构建、验证、文档和交付时的工作方式。

## 1. 开工前必须建立项目上下文

每个需求开始前必须阅读：

- `README.md`
- `CONTRIBUTING.md`
- `docs/constitution.md`
- `docs/architecture/overview.md`
- `docs/architecture/repository-layout.md`
- `docs/roadmap.md`

涉及领域术语、身份、权限、Provider、Change Set 或 Recovery 时，还必须阅读：

- `CONTEXT.md`
- `docs/security/threat-model.md`
- `docs/security/trust-and-autonomy.md`
- 相关 ADR

涉及版本、分支、发布、上游或供应链时，还必须阅读：

- `docs/releases/version-flow.md`
- `docs/releases/compatibility.md`
- `docs/upstreams.md`
- 相关 release notes、lockfile、来源清单和许可证文件

随后按受影响的系统层阅读其 README、入口、配置、测试和构建脚本：

- 启动、镜像、安装、GRUB、Recovery：`distribution/**`、`tests/boot`、`tests/install`、`tests/recovery`
- Harness、Cordis、Bundle、Profile：`distribution/runtime`、`vendor/cordis`、`bundles/**`、`profiles/**`、`tests/compatibility`
- 系统入口与监督：`apps/**` 及对应 systemd unit、镜像 hook 和验收脚本
- 身份、策略、Provider、Secret、审计、更新：`packages/**`、`schemas/**`、`tests/security`、`tests/integration`
- 网站：`website/README.md`、`website/docs/RESPONSIVE_STANDARD.md`、`website/design-system/taichios/MASTER.md`

仓库文档可能滞后于源码。出现冲突时必须先说明冲突，以当前源码、配置、可执行测试和用户最新要求为准，并同步修正文档。不得凭通用 Web 应用经验替代本项目的操作系统约束。

## 2. 把变更视为操作系统变更

开始实现前必须明确本次改动影响哪些边界：

- Debian 软件包、固定快照和可复现构建输入
- BIOS/UEFI、GRUB、内核参数、initramfs、systemd 和控制台
- Live 环境、安装器、已安装系统、首次启动和升级迁移
- Human User、Working Agent、Service Principal、Unix 用户和进程隔离
- Cordis 组合边界、Harness、Bundle、Profile 和 DSH 插件兼容性
- Provider、凭证、权限、审计、资源预算和外部网络
- Change Set、Rollback Point、Previous 启动项和独立 Recovery Environment
- 发布镜像、源码对应物、包清单、摘要、attestation 和许可证

任何系统级改动都必须说明成功路径、失败路径和恢复路径。能在仓库测试中运行不代表能在 Live 镜像、安装后系统或 Recovery 中运行；逻辑 Context 隔离也不代表 Unix 或沙箱安全隔离。

## 3. 实现原则

- 只修改与任务直接相关的边界，不做无关重构。
- 优先实现可验收的纵向闭环，不添加只会报告成功的占位命令。
- 优先使用 TaiChiOS 插件、Bundle、Profile 或适配器；修改 Cordis、Harness 或 Debian 上游必须说明必要性、来源、补丁和退出策略。
- 稳定 wire format 以 `schemas/` 为源，TypeScript 契约位于 `packages/contracts/`；实现不得让两者无声分叉。
- 模型调用必须经过模型中立的 Provider 契约；凭证不得进入普通 Profile、环境示例、日志、Session、审计载荷或镜像。
- `--yolo`、`--yes` 和非交互模式只能改变确认行为，不能伪造身份或取得调用主体没有的权限。
- 社区插件是第三方代码。发现来源、信任分级、授权和执行隔离是不同阶段，不能用 Stars、下载量或目录收录代替安全判断。
- 不把真实密钥、私有地址、个人路径、构建缓存、依赖目录、虚拟磁盘、ISO 或本地数据库提交到仓库。

## 4. 构建与依赖边界

包管理器必须遵循现有所有权边界：

- Debian 系统包由 `apt` 和 live-build 配置管理。
- `distribution/runtime` 使用 pnpm，保持 DSH Profile/插件生态兼容。
- 根 Yarn 4 工作区只用于 TaiChiOS/Cordis 源码构建、Yakumo 和仓库测试。
- `website` 是独立 npm 工程。

只有实际改变依赖、构建输入或发布装配时，才更新对应 manifest、lockfile、快照、许可证、Docker/CI 或部署配置。不得为了满足形式要求改动无关依赖文件。

上游版本必须固定到不可变版本、提交或 Debian Snapshot，并记录完整性、许可证、兼容性和更新流程。引入原生扩展、安装脚本或新网络来源时必须重新评估供应链和权限影响。

## 5. 安全执行构建和验收

- 执行前检查当前分支、工作区和 ignored/untracked 状态，不覆盖或删除用户已有改动。
- `taichios-install`、分区、格式化、GRUB 安装等破坏性路径只能在明确创建的空白测试磁盘或隔离虚拟机内执行；不得把宿主磁盘、工作区根目录或不明设备作为目标。
- 需要 root 的 live-build、mount、loop device、namespace 或清理操作必须先确认脚本的精确目标；不得用宽泛路径或未解析变量执行递归删除。
- 测试生成的 ISO、chroot、cache、虚拟磁盘、覆盖率和构建目录必须位于仓库约定位置并保持 ignored；完成后检查是否产生意外文件。
- 网络不可用、镜像源不可用或宿主禁止 user namespace 时，应报告真实失败，不得把跳过测试伪装成通过。

## 6. 分层验证要求

验证必须与风险成比例，并从便宜检查逐步升级：

1. 语法、格式、schema、静态检查和相关单元测试。
2. 相关包的类型检查、构建和集成测试。
3. Cordis/Harness/DSH 变更执行固定来源与离线 compatibility smoke。
4. 镜像或启动链变更执行 live-build 定义检查，并在需要时构建真实 ISO。
5. 启动、安装或 Recovery 变更使用同一候选镜像完成 BIOS 与 UEFI QEMU 验收；安装测试必须移除 ISO 后从磁盘启动。
6. 发布变更验证二进制 ISO、对应源码 ISO、manifest、SHA-256、metadata、attestation 和发布失败行为。
7. 网站变更在 `website/` 执行 `npm run check`，并按响应式规范检查中英文、键盘、缩放和目标视口。

不得用源码文本匹配代替本应执行的系统行为验收。若因权限、硬件、网络或时间无法运行某一级验证，必须明确列出未验证范围及其风险。

## 7. 文档同步

修改后更新所有被改变的公开契约和操作说明，但不机械改动无关文档：

- 架构或模块边界：架构文档、ADR、模块 README
- 命令、环境、构建和验收：开发文档、相关 README、脚本帮助
- 版本、兼容性和发布行为：compatibility、version flow、release notes、machine-readable metadata
- 安全、权限、秘密或恢复行为：threat model、trust/autonomy、Recovery 文档
- 稳定公共契约：按项目成熟度同时维护中文和英文说明

文档不得提前宣称尚未经过对应验收的能力已经完成。

## 8. Git、分支和远程操作

项目分支流以实际版本文档为准：

```text
feature/* → next → staging → main
                N+2      N+1      N
```

- 开发和修复默认在 `feature/*`、`fix/*` 或 `docs/*` 分支完成。
- `next` 是后续开发集成线，`staging` 是候选发布线，`main` 是当前受支持及打标签的发布线。
- 一个逻辑变更一个本地提交；提交信息必须描述真实意图。
- 修改前后运行 `git status` 和 `git diff`，只暂存本任务文件。
- Agent 自己产生的文件必须提交、加入正确的 ignore，或安全清理；不得擅自删除、覆盖或提交用户已有的无关 untracked/modified 文件。若无法区分归属，应停止并询问。
- 只读调查不要求制造提交；任何仓库文件修改都必须形成可审查的本地提交。
- 未经用户当前明确授权，不得 push、创建远程分支、合并 PR、修改 issue/PR、创建 release 或触发部署。
- 即使得到普通 push/merge 授权，也不得自行向 `staging` 或 `main` 推送或合并；必须获得对目标分支的明确授权。
- force push、重写共享历史、替换已发布制品或删除远程引用必须再次单独确认。
- promotion 必须移动已验证的同一提交，不能从无关分支状态重新构造相同版本。

## 9. 完成交付

结束前必须：

- 检查 `git diff --check`、`git status` 和提交边界。
- 确认没有意外未跟踪文件、凭证、缓存、构建产物或真实磁盘镜像进入提交。
- 列出实际修改、验证结果、未执行检查、已知限制、迁移/回滚影响和本地提交。
- 如执行了 GitHub、远程分支、发布或部署操作，逐项说明对象、结果和触发的 CI/CD 范围。

完成意味着交付了与改动层级匹配的证据，而不只是源码已经写完。
