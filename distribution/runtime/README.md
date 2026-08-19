# TaiChiOS Harness 运行时

本目录是 TaiChiOS 0.1 隔离且可复现的用户态运行时装配边界。它使用 pnpm，因为官方 DSH Profile 管理器委托 pnpm 安装插件，而 dsh-TUI 发布包包含 Yarn 无法作为普通工作区依赖解析的 bundled `workspace:*` 包。这里的私有 package manifest 不是公开能力包，也不得承载 TaiChiOS 业务逻辑。

## 安装与验收

在仓库根目录运行：

```sh
corepack yarn install:runtime
corepack yarn compat:runtime
```

Smoke 需要 Bubblewrap（`bwrap`），真实 TUI 会在没有网络接口的命名空间内启动。Debian/Ubuntu 构建宿主可安装 `bubblewrap` 包。

`package.json` 固定直接依赖，`pnpm-lock.yaml` 固定完整依赖图及完整性摘要，`../debian/runtime.lock.json` 记录发布提交、许可证与 Node 归档摘要。`pnpm-workspace.yaml` 只允许运行当前已审核的原生/安装脚本；任何新增项都必须重新进行威胁与权限审查。

`profiles/dsh-tui` 是工厂 Profile。镜像构建和新用户创建必须执行 `tools/prepare-dsh-profile.mjs --home <DSH_HOME>`，在不覆盖已有 Profile 的前提下，把系统固定的 dsh-TUI 链接到用户 Profile 的模块解析根。

## 威胁与权限影响

- `node-pty`、`koffi` 与 `dsh-subprocess-local` 含原生代码或安装脚本，是高风险构建能力；它们只在独立运行时安装阶段执行，不进入继承的 Cordis 构建路径。
- `@google/genai` 与 `protobufjs` 的已允许脚本也被精确 lockfile 约束。允许列表之外的脚本由 pnpm 拒绝。
- 工厂 Profile 不写入凭据、不扩大调用主体权限，也不启用 YOLO。缺少 Provider 或网络不会阻止 Shell 启动。
- dsh-TUI 与 DSH Web 的 React 主版本不同；`dsh-working-activity>react` 的 React 19 peer 例外只覆盖这个呈现插件，并由真实启动 smoke 约束。

## 迁移与回滚

- 已有用户 Profile 永不被初始化工具覆盖；版本迁移必须生成 Change Set，并在替换系统运行时链接前保存旧的 runtime 目录与 lockfile 作为 Rollback Point。
- 若新运行时 smoke 失败，镜像构建立即失败。已安装系统应将链接切回上一版本运行时；若 TUI 单独损坏，删除/禁用 `dsh-tui` Profile 后回退到纯 TTY。
- 当前仓库内 `cordis@4.0.0-rc.8` 是非运行时历史快照，不能作为失败时的隐式 fallback。
- 独立 Recovery Environment 与事务 Change Set 尚未实现；因此此候选只可进入 `next`，不能晋升为完整 MVP。

## 更新流程

1. 选择不可变上游发布与提交，不使用 npm dist-tag 或分支名。
2. 更新 `package.json` 的精确版本，以及 `../debian/runtime.lock.json` 的来源、摘要和许可证记录。
3. 在本目录运行 `corepack pnpm install`，逐项审查 lockfile、peer、原生构建和供应链策略变化。
4. 若版权或条款变化，同步更新许可证记录、保留文本和 `NOTICE`。
5. 依赖就绪后断网运行 `corepack yarn compat:runtime`。
6. 只有全部通过后，才可更新 `docs/releases/compatibility.md` 的候选状态。

## English summary

This is the private, pinned Cordis/DSH/dsh-TUI assembly boundary for TaiChiOS 0.1. Exact artifacts, allowed install scripts, licenses, migration, and rollback rules are recorded above. `yarn compat:runtime` boots the real TUI without network or Provider credentials. Existing user profiles are preserved; failed upgrades must return their system-runtime link to the previous lockfile-backed runtime, while a broken TUI falls back to plain TTY.
