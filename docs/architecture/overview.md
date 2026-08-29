# TaiChiOS 架构总览

## 分层

```text
┌─────────────────────────────────────────────────────────┐
│ Interfaces: plain console · dsh-TUI · WebView · remote │
├─────────────────────────────────────────────────────────┤
│ Agent runtimes: DeepSeek Harness · future runtimes     │
├─────────────────────────────────────────────────────────┤
│ Control plane                                           │
│ identity · policy · provider · secrets · store · update│
├─────────────────────────────────────────────────────────┤
│ Cordis userspace composition kernel                     │
│ Context · Service · Fiber · Effect · Events · Loader    │
├─────────────────────────────────────────────────────────┤
│ Execution plane                                         │
│ broker · worker process · sandbox · audit · guardian    │
├─────────────────────────────────────────────────────────┤
│ Debian userspace · systemd · Linux kernel · hardware    │
└─────────────────────────────────────────────────────────┘
```

Linux 是强制边界；Cordis 是组合边界。Context 隔离用于能力可见性和生命周期，不能替代 Unix 用户、进程、Landlock、namespace、容器或其他强隔离机制。

## 启动链

```text
UEFI/BIOS
  → GRUB
  → Linux + initramfs
  → systemd
  → taichios-guardian
  → TaiChiOS base profile
  → identity and policy
  → Provider Registry and Secret Service
  → DeepSeek Harness bundle
  → selected interface plugins
```

Guardian 位于普通插件树之外或拥有独立监督路径，因此 Harness/TUI 崩溃不等于系统不可恢复。其设计将参考成熟的心跳、safe profile 与进程重建模式，但不会直接复制其他项目实现。

## 控制面与执行面

控制面决定“谁可以请求什么、使用哪个 Provider、安装哪个插件、产生什么 Change Set”。执行面负责“在哪个 Unix 主体、进程或沙箱中实际执行”。二者通过明确协议连接，避免第三方插件因加载到主进程而绕过工具审批。

## 多用户模型

Organization 是机器与策略的管理边界。Human User、Working Agent 和 Service Principal 都映射到可审计身份；需要主机隔离的主体还应映射到 Unix 用户、服务账户或隔离执行环境。

Agent 权限来自委托，不来自模型品牌。一个 Working Agent 可以拥有长期目标和工作区，也可以被配置为仅能调用特定 Provider、工具、目录和网络目标。

## 模型访问

所有模型调用通过 Provider Registry：

```text
consumer → standard LLM contract → Provider Registry
         → policy / quota / routing → provider adapter
         → Secret Service grant     → remote or local endpoint
```

Provider Registry 必须支持增删改查、能力发现、模型元数据、健康状态、路由与预算。Secret Service 只向一次调用或受控执行环境提供必要凭证。

仓库当前提供 0.2 的内存型参考闭环：`ProviderRegistry.invoke()` 在同一深模块接口内完成主体授权、确认判断、模型路由、单次 Secret Grant 兑换和审计归属。该闭环用于固定跨包契约和安全语义，尚未进入 0.1 Live 镜像；持久身份、加密 Secret 存储、健康/配额以及生产 Provider adapter 仍需后续安装系统集成。

## 变化事务

```text
propose
  → resolve dependencies
  → authorize
  → dry-run
  → stage
  → snapshot / rollback point
  → activate candidate
  → health and acceptance checks
  → commit or rollback
```

用户显式覆盖可以减少审批或允许高风险影响，但 Change Set 仍应诚实记录发生了什么。可记录性与是否阻止执行是两件不同的事。

`schemas/change-set.schema.json` 固定所有变更通道共享的 envelope 与状态词汇。0.1 镜像中的 `taichios-change` 已将这个契约落到受管文件：候选文件先进入独立 stage，激活后核对摘要，只有验证成功才 committed；回滚点缺失或恢复失败会进入 `rollback-failed`，不会伪装成成功。Profile、插件和系统更新 adapter 后续必须复用同一语义。

## 上游边界

- Debian：操作系统基础、软件包和安全更新来源。
- Cordis：用户态组合内核。
- DeepSeek Harness：默认 Agent 系统插件集与 DSH 生态协议。
- dsh-TUI：默认可替换的终端界面。
- DSH community：插件发现与兼容生态。

具体固定方式和补丁政策见[上游依赖](../upstreams.md)。
