---
status: accepted
---

# Preserve DSH plugin protocol compatibility

TaiChiOS plugins reuse the DSH convention of an npm/Git source, `package.json#dsh.bundle.patch`, `cordis.patch.yml`, and `dsh plugin add`. TaiChi Store adds provenance pinning, signatures, capability declarations, Dry Run, isolation, verification, and rollback around that protocol rather than creating an incompatible package ecosystem.

