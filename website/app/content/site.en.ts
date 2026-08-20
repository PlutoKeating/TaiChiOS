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
} from 'lucide-react'
import { site, type ContentPage, type Feature } from './site'

export const corePrinciplesEn: Feature[] = [
  {
    title: 'Composable, not inseparable',
    description: 'Networking, interfaces, models, and tools compose through Profiles and plugins. A plain console remains a valid system shape.',
    icon: Blocks,
  },
  {
    title: 'Guardrails by default, authority by consent',
    description: 'Guarded Mode is the default. Creator and YOLO are authenticated overrides bounded by authority the principal already holds.',
    icon: ShieldCheck,
  },
  {
    title: 'Every change keeps a way back',
    description: 'Change Sets target simulation, verification, and rollback. Recovery does not depend on the ordinary agent stack being healthy.',
    icon: RefreshCcw,
  },
]

export const pagesEn: Record<string, ContentPage> = {
  features: {
    slug: 'features',
    eyebrow: 'SYSTEM PRINCIPLES',
    title: 'More than a chat window attached to Linux',
    lead: 'TaiChiOS organizes agents, authority, models, plugins, and recovery as operating-system capabilities while preserving the mature boundaries of Debian and Linux.',
    accent: 'Replaceable capability. Traceable responsibility. Reversible change.',
    sections: [
      {
        eyebrow: 'COMPOSITION',
        title: 'Minimal core, maximum extension',
        body: 'Cordis owns userspace capability composition and lifecycle. Linux owns hardware, processes, memory, and strong isolation. The responsibilities stay explicit.',
        features: [
          { title: 'Profile', description: 'A named layered composition that defines a bootable system personality.', icon: Layers3 },
          { title: 'Bundle', description: 'An auditable distributable group of plugin configuration and code.', icon: PackageCheck },
          { title: 'System Plugin', description: 'A system capability that can be upgraded, disabled, and recovered independently.', icon: Boxes },
        ],
      },
      {
        eyebrow: 'AGENT NATIVE',
        title: 'Humans and Working Agents are first-class principals',
        body: 'Identity, authority, resource budgets, and audit ownership are modeled around Principals. Agent authority comes from delegation, never from a model brand.',
        features: [
          { title: 'Native multi-user', description: 'Humans, Working Agents, and services hold isolated state and authority.', icon: UsersRound },
          { title: 'Model neutral', description: 'A Provider Registry routes both remote and local models.', icon: Bot },
          { title: 'Minimum secret disclosure', description: 'Secret Service grants only the credential required for a controlled call.', icon: KeyRound },
        ],
      },
      {
        eyebrow: 'OFFLINE & RECOVERY',
        title: 'Losing the network or interface does not mean losing the system',
        body: 'The 0.1 candidate has verified offline Live boot, whole-disk BIOS/UEFI installation, first boot, and independent recovery. A broken TUI falls back to a plain shell.',
        features: [
          { title: 'Offline boot', description: 'Base login and recovery do not require a remote Provider.', icon: HardDriveDownload },
          { title: 'Dual firmware path', description: 'One hybrid image supports BIOS and UEFI.', icon: Cpu },
          { title: 'Independent recovery', description: 'Disable a broken Profile and roll back the latest file Change Set.', icon: LifeBuoy },
        ],
      },
    ],
  },
  download: {
    slug: 'download',
    eyebrow: '0.1 MVP PRERELEASE',
    title: 'Download the first bootable installer',
    lead: 'v0.1.0-mvp.2 is the first public bootable, installable, runnable TaiChiOS image. The release pipeline verifies the same binary ISO before delivering it.',
    accent: 'It is not stable: use an isolated virtual machine and disposable storage, never a production device.',
    sections: [
      {
        eyebrow: 'CURRENT STATUS',
        title: 'The implemented 0.1 vertical slice',
        body: 'The candidate is pinned to a Debian 13.6 snapshot with fixed Node, DeepSeek Harness, Cordis, and dsh-TUI versions. Offline boot, installation, first boot, and recovery have passed on x86_64 QEMU.',
        bullets: [
          'Hybrid Live ISO booting under BIOS and UEFI',
          'Text whole-disk installer with GPT, ESP, ext4, and GRUB',
          'Isolated state for taichi and creator users',
          'Mock Provider, supervised Harness, and shell fallback',
          'Default, previous-known-good, and Recovery boot paths',
        ],
      },
      {
        eyebrow: 'BUILD FROM SOURCE',
        title: 'Build in a controlled environment',
        body: 'The build uses Debian Snapshot and pinned runtime lockfiles. Read the Live documentation, check disk capacity, and run whole-disk installation tests only against disposable storage.',
        features: [
          { title: 'Read the build guide', description: 'Understand dependencies, snapshot inputs, and artifact paths.', icon: BookOpen },
          { title: 'Verify the runtime', description: 'Run compatibility gates before building the image.', icon: CircleGauge },
          { title: 'Use a disposable disk', description: 'The current installer erases its target and is not for daily devices.', icon: ShieldCheck },
        ],
        link: { label: 'Open the Live build guide', href: `${site.repo}/blob/main/distribution/live/README.md` },
      },
      {
        eyebrow: 'RELEASES',
        title: 'Get the v0.1.0-mvp.2 prerelease',
        body: 'The Release includes the hybrid binary ISO, corresponding-source ISO, source/package manifests, SHA-256 checksums, machine-readable release metadata, and GitHub build provenance. Real-hardware coverage and production credential enrollment are not complete.',
        link: { label: 'Open the prerelease download', href: `${site.repo}/releases/tag/v0.1.0-mvp.2` },
      },
    ],
  },
  architecture: {
    slug: 'architecture',
    eyebrow: 'ARCHITECTURE',
    title: 'Linux is the execution boundary. Cordis is the composition boundary.',
    lead: 'TaiChiOS does not invent another hardware kernel. It builds a composable, supervised, recoverable agent-native userspace on Debian and Linux.',
    accent: 'Every layer owns only the responsibility it can truly enforce.',
    sections: [
      {
        eyebrow: 'LAYERS',
        title: 'Six layers from interface to foundation',
        body: 'Interfaces and agent runtimes are replaceable. The control plane decides who may request what. The execution plane realizes that decision through Unix principals, processes, and sandboxes.',
        features: [
          { title: 'Interfaces', description: 'Plain console, dsh-TUI, optional WebView, and remote access.', icon: TerminalSquare },
          { title: 'Agent runtimes', description: 'DeepSeek Harness is the default replaceable agent plugin set.', icon: Bot },
          { title: 'Control plane', description: 'Identity, policy, providers, secrets, store, and update.', icon: Route },
          { title: 'Cordis', description: 'Context, Service, Fiber, Effect, Events, and Loader.', icon: Waypoints },
          { title: 'Execution plane', description: 'Broker, worker, sandbox, audit, and guardian.', icon: Fingerprint },
          { title: 'Debian + Linux', description: 'systemd, users, files, drivers, processes, and hardware.', icon: Cpu },
        ],
      },
      {
        eyebrow: 'CHANGE LIFECYCLE',
        title: 'Change is an auditable state machine',
        body: 'The target flow is propose → resolve → authorize → dry-run → stage → rollback point → activate → verify → commit or rollback. The 0.1 candidate implements only a minimal file Change Set.',
        link: { label: 'Read the compatibility and rollback model', href: `${site.repo}/blob/main/docs/releases/compatibility.md` },
      },
      {
        eyebrow: 'TRUST BOUNDARY',
        title: 'Composition isolation is not a security sandbox',
        body: 'Cordis Context controls capability visibility and lifecycle, but does not replace Unix users, processes, namespaces, Landlock, or containers. Community popularity is not a security review.',
        link: { label: 'Read the threat model', href: `${site.repo}/blob/main/docs/security/threat-model.md` },
      },
    ],
  },
  docs: {
    slug: 'docs',
    eyebrow: 'DOCUMENTATION',
    title: 'Follow one chain of truth from intent to implementation',
    lead: 'The website provides orientation; repository documents hold reviewable technical facts. Start from your task without reading the entire project.',
    accent: 'When documentation conflicts with current code, verify the code and repair the documentation.',
    sections: [
      {
        eyebrow: 'START HERE',
        title: 'Understand the product boundary',
        body: 'Use the README, constitution, founding decisions, and roadmap to separate what is implemented now from the long-term architecture.',
        features: [
          { title: 'Project README', description: 'Positioning, status, repository map, and first verifiable goal.', icon: BookOpen },
          { title: 'Constitution', description: 'Model neutrality, multi-user design, rollback, and ecosystem compatibility.', icon: ScrollText },
          { title: 'Roadmap', description: 'See what is implemented, awaiting design, or deliberately deferred.', icon: GitBranch },
        ],
        link: { label: 'Open the documentation index', href: `${site.repo}/tree/main/docs` },
      },
      {
        eyebrow: 'BUILD & OPERATE',
        title: 'Build, install, and recover',
        body: 'Distribution documentation records Debian snapshots, runtime assembly, Live ISO, installer, and recovery entry points. Whole-disk tests must use disposable storage.',
        features: [
          { title: 'Live image', description: 'Build, clean, artifacts, and reproducibility.', icon: CloudCog },
          { title: 'Runtime', description: 'Pinned Harness, Cordis, TUI, and Profile.', icon: Braces },
          { title: 'Recovery', description: 'Disable a Profile or roll back from an independent target.', icon: Wrench },
        ],
        link: { label: 'Open distribution documentation', href: `${site.repo}/tree/main/distribution` },
      },
      {
        eyebrow: 'CONTRIBUTE',
        title: 'Deliver vertical slices',
        body: 'Contributions describe acceptance, failure, recovery, compatibility, and reproducible inputs. Do not stack a plugin store or desktop on top of an incomplete foundation.',
        link: { label: 'Read the contribution guide', href: `${site.repo}/blob/main/CONTRIBUTING.md` },
      },
    ],
  },
  community: {
    slug: 'community',
    eyebrow: 'COMMUNITY',
    title: 'Make the system real through verifiable boundaries',
    lead: 'TaiChiOS is in its foundation phase. Boot, install, identity, authority, compatibility, and recovery evidence matters more than feature count.',
    accent: 'Open discussion. Small slices. Clear evidence.',
    sections: [
      {
        eyebrow: 'WAYS TO CONTRIBUTE',
        title: 'Start where you can verify',
        body: 'Hardware coverage, executable documentation, DSH compatibility, threat modeling, and recovery tests all move this phase forward.',
        features: [
          { title: 'Verify and report', description: 'Reproduce in a named environment with logs and expected behavior.', icon: CircleGauge },
          { title: 'Design and implement', description: 'Take a bounded vertical slice from an issue.', icon: Code2 },
          { title: 'Ecosystem compatibility', description: 'Verify DSH protocol behavior without turning discovery into endorsement.', icon: Network },
        ],
        link: { label: 'Browse open issues', href: `${site.repo}/issues` },
      },
      {
        eyebrow: 'WORKFLOW',
        title: 'feature → next → staging → main',
        body: 'TaiChiOS uses an N+2 release flow. A reviewed commit is promoted forward as the same known state. Security fixes start from the affected support line and merge forward.',
        link: { label: 'Read the version and branch flow', href: `${site.repo}/blob/main/docs/releases/version-flow.md` },
      },
      {
        eyebrow: 'CODE OF PRACTICE',
        title: 'Review intent and evidence',
        body: 'Each commit focuses on one logical change. System changes explain authority, migration, rollback, compatibility, and reproducibility in proportion to risk.',
        link: { label: 'Start contributing', href: `${site.repo}/blob/main/CONTRIBUTING.md` },
      },
    ],
  },
  security: {
    slug: 'security',
    eyebrow: 'SECURITY & RECOVERY',
    title: 'Security is not a mode switch',
    lead: 'TaiChiOS treats authorization, execution isolation, credential grants, audit, and recovery as distinct responsibilities that must still form a closed loop.',
    accent: 'YOLO may remove confirmations. It cannot invent authority for a Principal.',
    sections: [
      {
        eyebrow: 'AUTHORITY',
        title: 'Authority comes from identity and delegation',
        body: 'Human Users, Working Agents, and Service Principals need auditable identities. A model output does not grant permission to execute itself.',
        features: [
          { title: 'Policy', description: 'The control plane evaluates principal, resource, impact, and budget.', icon: ShieldCheck },
          { title: 'Execution', description: 'Strong boundaries live in Unix principals, processes, and sandboxes.', icon: LockKeyhole },
          { title: 'Audit', description: 'Record requests, authorization, effects, and recovery outcomes.', icon: ScrollText },
        ],
      },
      {
        eyebrow: 'SECRETS',
        title: 'Model access does not mean exposing credentials',
        body: 'The target architecture routes calls through Provider Registry and Secret Service. This full control plane remains in design; the 0.1 candidate ships only an offline mock Provider.',
        link: { label: 'Read trust and autonomy principles', href: `${site.repo}/blob/main/docs/security/trust-and-autonomy.md` },
      },
      {
        eyebrow: 'DISCLOSURE',
        title: 'Report vulnerabilities responsibly',
        body: 'Do not publish an unpatched vulnerability, valid credential, or directly exploitable detail in a public issue. Follow the repository security policy.',
        link: { label: 'Open SECURITY.md', href: `${site.repo}/blob/main/SECURITY.md` },
      },
    ],
  },
  about: {
    slug: 'about',
    eyebrow: 'ABOUT TAICHIOS',
    title: 'From Tai Chi, the ten thousand systems. From intent, the operating system.',
    lead: 'TaiChiOS is an independent Apache-2.0 AI-native Debian derivative. Linux is the hardware and process kernel; Cordis is the userspace composition kernel.',
    accent: site.slogan,
    sections: [
      {
        eyebrow: 'MISSION',
        title: 'Let the system understand goals and respect boundaries',
        body: 'We want an operating system that composes capabilities, keeps working, installs new abilities, and recovers from failure—while every action retains a principal, authority, impact, and rollback path.',
        features: [
          { title: 'Independent', description: 'Not an official downstream product of Cordis, Debian, or DeepSeek.', icon: Globe2 },
          { title: 'Open source', description: 'Original TaiChiOS work is published under Apache-2.0.', icon: HeartHandshake },
          { title: 'Upstream aware', description: 'Pinned provenance, retained licenses, explicit patches, and exit strategies.', icon: GitBranch },
        ],
      },
      {
        eyebrow: 'NOW',
        title: '0.1 MVP candidate',
        body: 'The current loop is boot → install → first boot → supervised Harness → fallback → recovery. It proves the direction can run, not that it is production ready.',
        link: { label: 'Read the project roadmap', href: `${site.repo}/blob/main/docs/roadmap.md` },
      },
      {
        eyebrow: 'NEXT',
        title: 'Harden before expanding',
        body: 'The next phase prioritizes production credentials, real hardware, and release packaging before completing identity, Provider, Change Set, and Guardian contracts.',
        link: { label: 'Read the founding decisions', href: `${site.repo}/blob/main/docs/founding-decisions.md` },
      },
    ],
  },
}
