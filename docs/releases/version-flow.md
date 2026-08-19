# Version and branch flow

TaiChiOS uses an N+2 release flow:

```text
feature/* → next → staging → main
              N+2      N+1       N
```

## Branch roles

- `main`: current supported release line and release tags.
- `staging`: next release candidate; accepts promotion fixes and release hardening.
- `next`: following development line; integrates completed spiral increments.
- `feature/*`, `fix/*`, `docs/*`: short-lived review branches.

Promotion moves a known commit forward; it does not rebuild the same version from unrelated branch state. Critical fixes begin from the affected supported line, then merge forward into every newer line.

## Version artifacts

Every release records:

- Debian base suite and repository snapshot
- package and source manifests
- Cordis, Harness, Node.js and system-plugin compatibility matrix
- Profile and Bundle digests
- Live/install image hashes
- migrations and rollback compatibility
- known security and recovery limitations

## Cadence

The project publishes early foundation releases, but a feature is not promoted merely because its happy path works. Each spiral increment defines its architecture boundary, contract, verification, failure behavior and rollback path before promotion.

