import {
  Blocks,
  BookOpen,
  Bot,
  Boxes,
  Braces,
  CircleGauge,
  CloudCog,
  Code2,
  Cpu,
  Download,
  Fingerprint,
  GitBranch,
  Globe2,
  HardDriveDownload,
  HeartHandshake,
  KeyRound,
  Layers3,
  LifeBuoy,
  LockKeyhole,
  Network,
  PackageCheck,
  RefreshCcw,
  Route,
  ScrollText,
  ShieldCheck,
  TerminalSquare,
  UsersRound,
  Waypoints,
  Wrench,
  type LucideIcon,
} from 'lucide-react'

export const site = {
  name: 'TaiChiOS',
  origin: 'https://taichios.arr2018.dpdns.org',
  repo: 'https://github.com/PlutoKeating/TaiChiOS',
  slogan: 'AI-Native OS of future | 2019.2.25, start all.',
  description:
    'A bootable, agent-native Debian derivative built around a composable userspace microkernel.',
}

export type NavItem = {
  label: string
  href: string
}

export const primaryNavigation: NavItem[] = [
  { label: '特性', href: '/features' },
  { label: '下载', href: '/download' },
  { label: '架构', href: '/architecture' },
  { label: '文档', href: '/docs' },
  { label: '社区', href: '/community' },
]

export const secondaryNavigation: NavItem[] = [
  { label: '安全', href: '/security' },
  { label: '关于', href: '/about' },
]

export type Feature = {
  title: string
  description: string
  icon: LucideIcon
}

export type PageSection = {
  eyebrow?: string
  title: string
  body: string
  features?: Feature[]
  bullets?: string[]
  link?: { label: string; href: string }
}

export type ContentPage = {
  slug: string
  eyebrow: string
  title: string
  lead: string
  accent: string
  sections: PageSection[]
}

export const corePrinciples: Feature[] = [
  {
    title: '可组合，而非不可拆分',
    description: '网络、界面、模型与工具以 Profile 和插件组合；纯字符入口始终是有效系统形态。',
    icon: Blocks,
  },
  {
    title: '默认有护栏，权力可显式授予',
    description: 'Guarded Mode 是默认路径；Creator 与 YOLO 是经过身份确认、受既有权限边界约束的显式覆盖。',
    icon: ShieldCheck,
  },
  {
    title: '每次改变都留下退路',
    description: 'Change Set 面向预演、验证与回滚设计；Recovery Environment 不依赖普通 Agent 栈正常工作。',
    icon: RefreshCcw,
  },
]

export const pages: Record<string, ContentPage> = {
  features: {
    slug: 'features',
    eyebrow: 'SYSTEM PRINCIPLES',
    title: '不是把聊天窗口贴到 Linux 上',
    lead:
      'TaiChiOS 把 Agent、权限、模型、插件和恢复机制当作系统能力来组织，同时保留 Debian 与 Linux 的成熟边界。',
    accent: '能力可替换，责任可追溯，变化可逆。',
    sections: [
      {
        eyebrow: 'COMPOSITION',
        title: '最小核心，最大扩展',
        body: 'Cordis 负责用户态能力组合与生命周期，Linux 负责硬件、进程、内存与强隔离。两层职责清晰，不用 JavaScript 抽象假装替代操作系统边界。',
        features: [
          { title: 'Profile', description: '用命名分层组合定义可启动的系统人格。', icon: Layers3 },
          { title: 'Bundle', description: '分发一组可审计的插件配置与代码。', icon: PackageCheck },
          { title: 'System Plugin', description: '系统能力可独立升级、禁用和恢复。', icon: Boxes },
        ],
      },
      {
        eyebrow: 'AGENT NATIVE',
        title: 'Human 与 Working Agent 都是一等主体',
        body: '身份、权限、资源预算与审计归属面向 Principal 建模。Agent 的权力来自委托，不来自模型品牌，也不会因“智能”而绕过系统策略。',
        features: [
          { title: '原生多用户', description: 'Human、Working Agent 与服务主体拥有独立状态与权限。', icon: UsersRound },
          { title: '模型中立', description: 'Provider Registry 统一路由远程与本地模型。', icon: Bot },
          { title: '秘密最小披露', description: 'Secret Service 只向受控调用授予必要凭据。', icon: KeyRound },
        ],
      },
      {
        eyebrow: 'OFFLINE & RECOVERY',
        title: '失去网络或界面，不等于失去系统',
        body: '0.1 MVP 候选已经验证离线 Live 启动、BIOS/UEFI 整盘安装、硬盘首启与独立 Recovery 路径。TUI 异常时仍可回退到普通 Shell。',
        features: [
          { title: '离线可启动', description: '基础登录与恢复不依赖远端 Provider。', icon: HardDriveDownload },
          { title: '双固件路径', description: '同一混合镜像覆盖 BIOS 与 UEFI。', icon: Cpu },
          { title: '独立恢复', description: '禁用损坏 Profile 并回滚最近文件 Change Set。', icon: LifeBuoy },
        ],
      },
    ],
  },
  download: {
    slug: 'download',
    eyebrow: '0.1 MVP PRERELEASE',
    title: '下载首个可启动安装镜像',
    lead:
      'v0.1.0-mvp.3 是 TaiChiOS 首个可启动、可安装、可运行的公开预发布镜像；发布流水线会验证同一份二进制 ISO 后再交付。',
    accent: '它不是稳定版：请只在隔离虚拟机和可丢弃磁盘中试用，切勿安装到生产设备。',
    sections: [
      {
        eyebrow: 'CURRENT STATUS',
        title: '已实现的 0.1 纵向切片',
        body: '候选镜像基于 Debian 13.6 快照，固定 Node、DeepSeek Harness、Cordis 和 dsh-TUI 版本，已在 x86_64 QEMU 中完成离线启动、安装、首启与恢复验收。',
        bullets: [
          '混合 Live ISO：BIOS 与 UEFI 均可启动',
          '文本整盘安装器：GPT、EFI System、ext4 与 GRUB',
          'taichi 与 creator 用户状态隔离',
          'mock Provider、受监督 Harness 与纯 Shell 回退',
          '默认、previous-known-good 与 Recovery 启动路径',
        ],
      },
      {
        eyebrow: 'BUILD FROM SOURCE',
        title: '在受控环境中构建',
        body: '构建会使用 Debian Snapshot 和固定的运行时锁文件。开始前请阅读 Live 构建文档、检查所需磁盘空间，并只在可丢弃的测试环境中运行整盘安装验收。',
        features: [
          { title: '读取构建说明', description: '从 Live README 了解依赖、快照与产物位置。', icon: BookOpen },
          { title: '验证运行时', description: '先运行 compatibility gates，再启动镜像构建。', icon: CircleGauge },
          { title: '只用空测试盘', description: '当前安装器会清空目标磁盘，不适合日常设备。', icon: ShieldCheck },
        ],
        link: {
          label: '查看 Live 构建文档',
          href: `${site.repo}/blob/main/distribution/live/README.md`,
        },
      },
      {
        eyebrow: 'RELEASES',
        title: '获取 v0.1.0-mvp.3 预发布版',
        body: 'Release 同时提供二进制混合 ISO、对应源码 ISO、源码/包清单、SHA-256 校验和、机器可读发布元数据与 GitHub 构建来源证明。真实硬件覆盖和生产凭据注册尚未完成。',
        link: { label: '打开预发布下载页', href: `${site.repo}/releases/tag/v0.1.0-mvp.3` },
      },
    ],
  },
  architecture: {
    slug: 'architecture',
    eyebrow: 'ARCHITECTURE',
    title: 'Linux 执行边界，Cordis 组合边界',
    lead:
      'TaiChiOS 不创造一个新的硬件内核。它在 Debian 与 Linux 之上构建可组合、可监督、可恢复的 Agent 原生用户态。',
    accent: '每一层只承担它能够真正强制执行的责任。',
    sections: [
      {
        eyebrow: 'LAYERS',
        title: '从界面到底层的六层结构',
        body: '界面与 Agent Runtime 可以更换；控制面决定谁能请求什么；执行面把决定落实为 Unix 主体、进程或沙箱中的操作。',
        features: [
          { title: 'Interfaces', description: 'Plain console、dsh-TUI、可选 WebView 与远程入口。', icon: TerminalSquare },
          { title: 'Agent runtimes', description: 'DeepSeek Harness 是默认、可替换的 Agent 系统插件集。', icon: Bot },
          { title: 'Control plane', description: 'Identity、policy、providers、secrets、store 与 update。', icon: Route },
          { title: 'Cordis', description: 'Context、Service、Fiber、Effect、Events 与 Loader。', icon: Waypoints },
          { title: 'Execution plane', description: 'Broker、worker、sandbox、audit 与 guardian。', icon: Fingerprint },
          { title: 'Debian + Linux', description: 'systemd、用户、文件、驱动、进程与硬件边界。', icon: Cpu },
        ],
      },
      {
        eyebrow: 'CHANGE LIFECYCLE',
        title: '变化是一条可审计状态机',
        body: '完整目标流程是 propose → resolve → authorize → dry-run → stage → rollback point → activate → verify → commit or rollback。0.1 候选实现了最小文件 Change Set，完整事务式升级仍在后续设计队列。',
        link: { label: '阅读兼容与回滚模型', href: `${site.repo}/blob/main/docs/releases/compatibility.md` },
      },
      {
        eyebrow: 'TRUST BOUNDARY',
        title: '组合隔离不是安全沙箱',
        body: 'Cordis Context 可以控制能力可见性与生命周期，但不能替代 Unix 用户、进程、namespace、Landlock 或容器。第三方插件的社区热度也不等于安全审查。',
        link: { label: '阅读威胁模型', href: `${site.repo}/blob/main/docs/security/threat-model.md` },
      },
    ],
  },
  docs: {
    slug: 'docs',
    eyebrow: 'DOCUMENTATION',
    title: '从目标到实现，沿同一条事实链阅读',
    lead:
      '官网负责导航，仓库文档负责可审查的技术事实。选择你的任务，不必先读完整个项目。',
    accent: '文档与代码冲突时，以当前源码和可执行验证为准，并修正文档。',
    sections: [
      {
        eyebrow: 'START HERE',
        title: '了解产品边界',
        body: '先从项目 README、宪法、成立决策和路线图建立共同语境。它们区分了当前候选能力与长期架构。',
        features: [
          { title: '项目 README', description: '定位、状态、仓库地图与首个可验证目标。', icon: BookOpen },
          { title: '项目宪法', description: '模型中立、多用户、可回滚和生态兼容原则。', icon: ScrollText },
          { title: '路线图', description: '查看正在实现、等待设计和刻意推迟的范围。', icon: GitBranch },
        ],
        link: { label: '打开文档索引', href: `${site.repo}/tree/main/docs` },
      },
      {
        eyebrow: 'BUILD & OPERATE',
        title: '构建、安装与恢复',
        body: '发行版文档记录 Debian 快照、运行时装配、Live ISO、安装器和恢复入口。所有整盘安装测试都必须使用可丢弃磁盘。',
        features: [
          { title: 'Live image', description: '构建、清理、产物与可复现性说明。', icon: CloudCog },
          { title: 'Runtime', description: '固定 Harness、Cordis、TUI 与 Profile。', icon: Braces },
          { title: 'Recovery', description: '从独立目标禁用 Profile 或执行回滚。', icon: Wrench },
        ],
        link: { label: '进入发行版文档', href: `${site.repo}/tree/main/distribution` },
      },
      {
        eyebrow: 'CONTRIBUTE',
        title: '按纵向切片交付',
        body: '贡献应描述验收路径、失败行为、恢复边界、兼容影响和可复现输入。不要在基础能力尚未闭环时堆叠插件市场或图形桌面。',
        link: { label: '阅读贡献指南', href: `${site.repo}/blob/main/CONTRIBUTING.md` },
      },
    ],
  },
  community: {
    slug: 'community',
    eyebrow: 'COMMUNITY',
    title: '围绕可验证边界，一起把系统做实',
    lead:
      'TaiChiOS 处在 foundation 阶段。最有价值的贡献是验证启动、安装、身份、权限、兼容与恢复，而不是把路线图一次性填满。',
    accent: '公开讨论，最小切片，清晰证据。',
    sections: [
      {
        eyebrow: 'WAYS TO CONTRIBUTE',
        title: '从你能验证的地方开始',
        body: '硬件与固件覆盖、文档可执行性、DSH 兼容、威胁建模和恢复测试都比“功能数量”更能推进当前阶段。',
        features: [
          { title: '验证与报告', description: '在明确环境中复现，并附带日志与预期差异。', icon: CircleGauge },
          { title: '设计与实现', description: '从 Issue 接受边界清晰的纵向切片。', icon: Code2 },
          { title: '生态兼容', description: '验证 DSH 插件协议，不把收录误写成安全背书。', icon: Network },
        ],
        link: { label: '浏览开放 Issues', href: `${site.repo}/issues` },
      },
      {
        eyebrow: 'WORKFLOW',
        title: 'feature → next → staging → main',
        body: 'TaiChiOS 使用 N+2 发布流。变更先在短期分支完成审查，再把同一已知提交向前推进；安全修复从受影响的支持线开始并向更新线路合并。',
        link: { label: '阅读版本与分支流', href: `${site.repo}/blob/main/docs/releases/version-flow.md` },
      },
      {
        eyebrow: 'CODE OF PRACTICE',
        title: '审查意图，也审查证据',
        body: '提交应聚焦一个逻辑变化。系统级改动按风险说明权限、迁移、回滚、兼容和复现方式，并保留所有上游许可证。',
        link: { label: '开始贡献', href: `${site.repo}/blob/main/CONTRIBUTING.md` },
      },
    ],
  },
  security: {
    slug: 'security',
    eyebrow: 'SECURITY & RECOVERY',
    title: '安全不是一个模式开关',
    lead:
      'TaiChiOS 把授权、执行隔离、凭据发放、审计与恢复看作相互独立但必须闭环的系统职责。',
    accent: 'YOLO 可以减少确认，不能凭空扩大 Principal 的权力。',
    sections: [
      {
        eyebrow: 'AUTHORITY',
        title: '权限来自身份与委托',
        body: 'Human User、Working Agent 与 Service Principal 都必须有可审计身份。模型不能因为输出了一个命令，就自动取得执行该命令的权限。',
        features: [
          { title: 'Policy', description: '控制面评估主体、资源、影响与预算。', icon: ShieldCheck },
          { title: 'Execution', description: '强边界落实在 Unix 主体、进程和沙箱。', icon: LockKeyhole },
          { title: 'Audit', description: '记录请求、授权、效果和恢复结果。', icon: ScrollText },
        ],
      },
      {
        eyebrow: 'SECRETS',
        title: '模型接入不等于暴露密钥',
        body: '目标架构通过 Provider Registry 和 Secret Service 路由调用并最小化凭据披露。该完整控制面仍在设计阶段；0.1 候选仅提供离线 mock Provider。',
        link: { label: '阅读信任与自主原则', href: `${site.repo}/blob/main/docs/security/trust-and-autonomy.md` },
      },
      {
        eyebrow: 'DISCLOSURE',
        title: '负责任地报告漏洞',
        body: '不要在公开 Issue 中发布未修复漏洞、有效凭据或可直接利用的细节。请按仓库安全策略选择披露渠道。',
        link: { label: '查看 SECURITY.md', href: `${site.repo}/blob/main/SECURITY.md` },
      },
    ],
  },
  about: {
    slug: 'about',
    eyebrow: 'ABOUT TAICHIOS',
    title: '太极生万象，系统由意图而生',
    lead:
      'TaiChiOS 是一个独立、Apache-2.0、Debian 衍生的 AI 原生操作系统项目。Linux 是硬件与进程内核，Cordis 是用户态组合微内核。',
    accent: site.slogan,
    sections: [
      {
        eyebrow: 'MISSION',
        title: '让系统理解目标，也尊重边界',
        body: '我们希望操作系统可以组合能力、持续工作、安装新能力并从失败中恢复；同时每个动作仍有明确主体、权限、影响和回退路径。',
        features: [
          { title: 'Independent', description: '不是 Cordis、Debian 或 DeepSeek 的官方下游产品。', icon: Globe2 },
          { title: 'Open source', description: 'TaiChiOS 原创工作以 Apache-2.0 发布。', icon: HeartHandshake },
          { title: 'Upstream aware', description: '固定来源、保留许可证、明确补丁与退出策略。', icon: GitBranch },
        ],
      },
      {
        eyebrow: 'NOW',
        title: '0.1 MVP 候选',
        body: '当前闭环是 boot → install → first boot → supervised Harness → fallback → recovery。它证明方向可运行，但还不是面向真实设备的稳定发行版。',
        link: { label: '阅读项目路线图', href: `${site.repo}/blob/main/docs/roadmap.md` },
      },
      {
        eyebrow: 'NEXT',
        title: '先加固，再扩张',
        body: '下一阶段优先处理生产凭据、真实硬件与发布包装，再继续组织身份、Provider、Change Set 与 Guardian 的完整系统合同。',
        link: { label: '查看成立决策', href: `${site.repo}/blob/main/docs/founding-decisions.md` },
      },
    ],
  },
}
