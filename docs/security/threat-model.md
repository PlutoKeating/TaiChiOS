# Threat model

## Protected assets

- Human User and organization data
- Provider credentials and other secrets
- System integrity and bootability
- Agent identity, delegation, goals and budgets
- Plugin provenance and update channels
- Audit history and Rollback Points
- Compute, network, storage and financial resources

## Principal threats

### Malicious or compromised plugins

A DSH-compatible plugin can execute third-party JavaScript with the host user's permissions. Tool approval alone does not sandbox plugin initialization. TaiChiOS therefore treats discovery, trust, authorization and isolation as separate stages.

### Prompt injection and confused deputies

Untrusted content can persuade an Agent to invoke legitimate capabilities for an attacker's purpose. Capability grants attach to principals, resources and scopes; high-impact tools preserve provenance through the request chain.

### Accidental destructive operation

An authorized user or Agent may issue a valid but unintended destructive command. Guarded Mode requires approval and creates recovery information where possible. Explicit YOLO or Creator operation can suppress those protections after truthful risk disclosure.

### Credential disclosure

Plugins, logs, process environments and model prompts can leak secrets. Secret Service provides scoped grants instead of writing credentials into ordinary YAML or Session state.

### Supply-chain substitution

Package names, repositories, tags or maintainers can be impersonated. Installations pin immutable identities, verify signatures when available, preserve hashes, and never infer trust solely from popularity.

### Resource and cost exhaustion

Autonomous work can consume unbounded tokens, money, CPU, storage or subprocesses. Policy supports budgets and audit; authorized owners may explicitly raise or remove them.

### Failed update or self-modification

A valid update can break boot, identity, Provider access or interfaces. Managed changes stage candidates, run acceptance checks and retain Rollback Points. Recovery must remain reachable without the ordinary plugin tree.

## Security boundaries

- Cordis Context isolation controls visibility and lifecycle; it is not a hostile-code boundary.
- Unix users, process separation, broker APIs and sandboxes enforce host boundaries.
- System plugins in the main process are part of the trusted computing base.
- Native addons and install scripts require an elevated trust tier.
- A community catalog entry is discovery metadata, not a security attestation.

## Explicit override

TaiChiOS distinguishes authorization from confirmation. `--yolo` suppresses interactive confirmation for the requested operation; it does not silently impersonate an organization owner. An authorized owner can deliberately grant broader authority, including destructive system modification. Such operation remains attributed and truthfully reported even when it is not blocked.

## Out of initial scope

- Enterprise compliance certification
- Formal verification
- Mandatory full-disk encryption
- Protection against a malicious physical owner
- Security guarantees after an authorized owner deliberately removes the security components

