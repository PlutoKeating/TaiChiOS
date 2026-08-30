# Schemas

Language-neutral source schemas for plugin manifests, capability grants, Provider configuration, Change Sets, update metadata and compatibility matrices.

`control-plane.schema.json` is the executable 0.2 wire-contract source for organizations, principals, capability grants, owned workspaces/goals, model-neutral Provider invocation, opaque Secret grants and secret-free audit records. Run `corepack yarn check:contracts` after changing it or the matching TypeScript vocabulary in `packages/contracts`.

`change-set.schema.json` defines the shared transaction envelope and durable lifecycle for managed files, Profiles, plugins and system updates. A committed Change Set must contain both verification evidence and a Rollback Point; failed and rollback-failed states must carry a reason.
