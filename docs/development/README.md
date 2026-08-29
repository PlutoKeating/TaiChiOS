# Development guide

The implementation toolchain is intentionally introduced one verified layer at a time. The current root scripts still build the inherited Cordis snapshot while the TaiChiOS workspace boundary is established.

## Current checks

```sh
yarn install
yarn lint
yarn build
yarn test
yarn check:contracts
yarn test:control-plane
```

## Planned system checks

```text
check:upstreams       pinned upstream identity and license inventory
test:boot             QEMU Live boot acceptance
test:install          unattended fixture installation and first boot
test:recovery         failed candidate and rollback scenarios
test:security         capability and isolation cases
build:live            reproducible x86_64 Live/install image
```

Do not add placeholder commands that report success without performing their named check. A script enters the root task surface only when its contract is executable.

`check:contracts` validates the control-plane JSON Schema with real accepted and rejected payloads and checks that its principal/mode vocabulary matches the TypeScript contracts. `test:control-plane` exercises organization ownership, delegation, Provider routing, confirmation semantics, scoped Secret grants and audit attribution through public package interfaces. These are repository-level 0.2 reference contracts; they are not yet installed into the 0.1 Live image.

The GitHub Actions build also installs the host tools required by the runtime and Live-image gates. Its apt operations use bounded retries and connection timeouts so an unavailable runner mirror fails promptly instead of occupying the pipeline indefinitely.
