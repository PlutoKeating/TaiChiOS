# TaiChiOS Harness runtime

This directory is the isolated, reproducible userspace runtime boundary for TaiChiOS 0.1. It intentionally uses pnpm because the official DSH profile manager delegates plugin installation to pnpm and dsh-TUI ships bundled `workspace:*` packages that Yarn cannot resolve as an ordinary workspace dependency.

## Install and verify

From the repository root:

```sh
corepack yarn install:runtime
corepack yarn compat:runtime
```

`package.json` contains exact top-level versions, `pnpm-lock.yaml` freezes the full registry graph and its integrity hashes, and `../debian/runtime.lock.json` records release commits, licenses, and the Node archive checksum. `pnpm-workspace.yaml` explicitly allowlists native/install scripts needed by the runtime; additions require review.

The checked-in `profiles/dsh-tui` directory is the factory profile template. `tools/prepare-dsh-profile.mjs --home <DSH_HOME>` copies it without replacing an existing profile and links the pinned system dsh-TUI package into the profile resolution root. Image construction and first-user creation must call this tool before offline boot.

## Update procedure

1. Select immutable upstream releases and commits; do not use npm dist-tags or branch names.
2. Update exact versions in `package.json` and provenance/integrity data in `../debian/runtime.lock.json`.
3. Run `corepack pnpm install` in this directory and review every lockfile, peer, native-build, and supply-chain-policy change.
4. Update preserved license files and `NOTICE` if copyright or terms changed.
5. Run `corepack yarn compat:runtime` with networking disabled after dependencies are present.
6. Only then promote the matrix in `docs/releases/compatibility.md`.

The React 19 allowance is limited to `dsh-working-activity`: dsh-TUI uses React 19 while that small presentation plugin still advertises React 18. The compatibility smoke is the evidence for this temporary allowance; remove it when upstream aligns its peer range.
