# Contributing to TaiChiOS

TaiChiOS is in its foundation phase. Before implementing a feature, read the [constitution](./docs/constitution.md), [domain language](./CONTEXT.md), [architecture](./docs/architecture/overview.md), and relevant ADRs.

## Development model

Work moves through `feature/* → next → staging → main`. Each spiral increment establishes boundaries, contracts, verification and recovery before filling in implementation.

A system-facing change should include, in proportion to its risk:

- tests and an explicit success criterion;
- threat and permission impact;
- migration behavior;
- rollback or recovery behavior;
- compatibility impact on Cordis, DSH and Debian;
- reproducible build inputs;
- documentation in Chinese and, for stable public contracts, English.

## Design rules

- Prefer a TaiChiOS plugin, Bundle or adapter over an upstream core patch.
- Treat Cordis Context isolation as composition, not hostile-code isolation.
- Keep model-facing consumers dependent on the Provider contract, not a specific vendor.
- Preserve DSH plugin compatibility unless an accepted ADR says otherwise.
- Never commit credentials, generated images, package caches or private user data.
- Preserve every upstream license and NOTICE when importing source.

## Pull requests

Keep changes focused and state which acceptance path proves them. Changes that modify identity, permission, plugin loading, update, recovery or boot behavior must explain both Guarded and explicit-override behavior.

