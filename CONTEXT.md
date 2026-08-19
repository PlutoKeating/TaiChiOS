# TaiChiOS Domain Language

TaiChiOS is a multi-user, agent-native operating environment whose capabilities are composed as reversible plugins on a Debian system. This glossary defines its canonical product language independently of implementation details.

## System and composition

**TaiChiOS**:
The complete bootable operating-system distribution, including its base system, userspace composition kernel, system plugins, interfaces, and recovery environment.
_Avoid_: Cordis OS, DeepSeek OS

**Userspace Composition Kernel**:
The trusted capability-composition layer that owns plugin relationships and reversible lifecycles without replacing the hardware kernel.
_Avoid_: JavaScript kernel, hardware kernel

**System Plugin**:
A distribution-owned plugin that supplies a foundational TaiChiOS capability and participates in the supported system lifecycle.
_Avoid_: built-in app, core hack

**User Plugin**:
A plugin installed into a user or organization profile rather than the distribution-owned system set.
_Avoid_: system plugin, random script

**Profile**:
A named, layered composition that describes which bundles and overrides form a bootable TaiChiOS personality.
_Avoid_: installation, image

**Bundle**:
A distributable group of plugin configuration rows and the code they mount.
_Avoid_: profile, package repository

## Identity and authority

**Principal**:
Any authenticated actor to which authority, resource ownership, budgets, and audit records can be assigned.
_Avoid_: account, process

**Human User**:
A principal representing a person who uses or administers TaiChiOS.
_Avoid_: operator, account

**Working Agent**:
An agent principal allowed to own work, maintain state, and act with delegated authority independently of an interactive human session.
_Avoid_: bot user, background script

**Organization**:
The administrative boundary that owns machines, users, policies, shared capabilities, and system-level authority.
_Avoid_: tenant, team account

**Explicit Override**:
An authenticated, intentional decision by an authorized principal to bypass default safeguards for a defined operation or mode.
_Avoid_: accidental consent, implicit permission

**YOLO Mode**:
An explicit override mode in which interactive safety confirmations are suppressed within the authority already held or deliberately granted to the invoking principal.
_Avoid_: insecure default, hidden bypass

## Safety and change

**Guarded Mode**:
The default operating mode that applies approval, policy, isolation, budgeting, and recovery safeguards.
_Avoid_: restricted edition, beginner mode

**Creator Mode**:
An explicit high-authority mode intended for system construction, experimentation, and self-modification while preserving truthful risk disclosure and recovery options.
_Avoid_: root mode, unsafe mode

**Change Set**:
A complete, inspectable proposal for a system or plugin mutation that can be simulated, applied, verified, and reversed as one unit.
_Avoid_: update, command batch

**Dry Run**:
An evaluation of a change set that reports expected effects without committing its persistent mutations.
_Avoid_: preview UI, mock execution

**Rollback Point**:
A known recoverable state to which a failed or rejected change set can return.
_Avoid_: backup, undo button

**Recovery Environment**:
A separately bootable or independently supervised minimal environment that can diagnose and repair TaiChiOS without loading ordinary third-party plugins.
_Avoid_: safe profile, factory reset

## Ecosystem

**Provider Registry**:
The system-wide, model-neutral catalog and access boundary through which principals discover and invoke configured LLM providers.
_Avoid_: DeepSeek SDK, model list

**TaiChi Store**:
The TaiChiOS interface for discovering, evaluating, installing, upgrading, disabling, and removing compatible plugins.
_Avoid_: npm mirror, official approval list

**Trust Tier**:
A declared provenance and execution class for a plugin; it describes how code is handled, not whether its output is correct.
_Avoid_: quality score, popularity rank

