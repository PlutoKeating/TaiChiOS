# Development guide

The implementation toolchain is intentionally introduced one verified layer at a time. The current root scripts still build the inherited Cordis snapshot while the TaiChiOS workspace boundary is established.

## Current checks

```sh
yarn install
yarn lint
yarn build
yarn test
```

## Planned system checks

```text
check:contracts       schema and generated-binding compatibility
check:upstreams       pinned upstream identity and license inventory
test:boot             QEMU Live boot acceptance
test:install          unattended fixture installation and first boot
test:recovery         failed candidate and rollback scenarios
test:security         capability and isolation cases
build:live            reproducible x86_64 Live/install image
```

Do not add placeholder commands that report success without performing their named check. A script enters the root task surface only when its contract is executable.

