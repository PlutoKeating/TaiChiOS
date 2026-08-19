# 产品愿景

## 愿景

今天的操作系统围绕应用和文件组织计算，AI 助手通常只是其中另一个应用。TaiChiOS 反转这一关系：目标、主体、能力和可恢复的变化成为系统的一等对象，界面和模型只是可替换的入口与执行者。

TaiChiOS 面向开发者和普通用户，也从第一天把组织与服务器视为正常场景。一个组织可以拥有多台机器、多位 Human User、长期运行的 Working Agent、共享 Provider、受控插件和统一策略。普通用户获得开箱即用的护栏；系统所有者在明确选择后仍保有完整控制。

## 产品支柱

### Agent-native

Agent 不只是聊天会话，而是可以拥有身份、工作区、长期目标、预算、权限和审计记录的系统主体。

### Composable

模型、工具、界面、网络、存储与策略通过能力接口组合。系统根据任务创建适当作用域，在任务结束或依赖变化时可靠释放资源。

### Reversible

安装、升级和自修改从 Change Set 开始，以 Dry Run、验证和 Rollback 结束。系统的智能程度不以牺牲可恢复性为代价。

### Sovereign

护栏是默认产品能力，不是剥夺所有权的借口。被授权用户可以显式选择更高自主和更高风险的操作模式，并得到诚实的后果说明。

### Ecosystem-compatible

TaiChiOS 复用 Debian、Cordis、DeepSeek Harness 和 DSH 插件生态，通过兼容与治理增强形成发行版，而不是复制一个封闭平行世界。

## 首个产品故事

用户从 Live 介质启动 TaiChiOS，使用安装器完成磁盘、用户、网络和 Provider 初始配置。重启后，TaiChi Shell 通过 dsh-TUI 提供系统入口。用户可以直接工作，也可以要求 Agent 查找缺失能力；系统展示来源、权限、兼容性和 Dry Run，应用后自动验证并建立回滚点。若界面或插件失败，Guardian 与 Recovery Environment 仍允许恢复。

