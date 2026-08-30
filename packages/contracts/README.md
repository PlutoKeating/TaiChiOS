# Contracts

Shared TypeScript contracts and generated bindings for stable TaiChiOS capability schemas. Wire-format source schemas remain in `/schemas`.

The current 0.2 reference surface defines organizations, Human Users, owner-attributed Working Agents/service principals, delegated capability grants, owned workspaces/goals, operating modes, organization-scoped Provider invocation/results, expiring Secret grants and audit records. `schemas/control-plane.schema.json` remains authoritative for serialized payloads; discriminated TypeScript unions and negative schema cases prevent structural as well as vocabulary drift.
