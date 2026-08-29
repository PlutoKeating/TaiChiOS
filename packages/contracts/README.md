# Contracts

Shared TypeScript contracts and generated bindings for stable TaiChiOS capability schemas. Wire-format source schemas remain in `/schemas`.

The current 0.2 reference surface defines organizations, Human Users, Working Agents, service principals, delegated capability grants, owned workspaces/goals, operating modes, Provider invocation/results, scoped Secret grants and audit records. `schemas/control-plane.schema.json` remains authoritative for serialized payloads; `check:contracts` prevents vocabulary drift.
