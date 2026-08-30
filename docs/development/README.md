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
yarn test:change
yarn test:recovery
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

`check:contracts` validates the control-plane and Change Set JSON Schemas with real accepted and rejected payloads and checks that their vocabulary matches the TypeScript contracts. `test:control-plane` exercises organization ownership, delegation, Provider routing, confirmation semantics, scoped Secret grants and audit attribution through public package interfaces. These are repository-level 0.2 reference contracts; they are not yet installed into the 0.1 Live image.

`test:change` executes the same managed-file Change Set command shipped in the Live image against an isolated temporary system root. It proves Dry Run, non-interactive confirmation, staged activation, verification, commit, rollback, rollback-failed and acting-principal behavior. `compat:live` invokes this behavior gate before accepting the image definition.

`test:recovery` adds the shipped Guardian and Recovery commands. It injects crashed-Harness, stale-heartbeat, lost-interface, broken-Profile, recovery-control and trusted-file-tampering scenarios into an isolated system root. BIOS/UEFI reachability still requires the real-image `test:install` gate.

The GitHub Actions build also installs the host tools required by the runtime and Live-image gates. Its apt operations use bounded retries and connection timeouts so an unavailable runner mirror fails promptly instead of occupying the pipeline indefinitely.
