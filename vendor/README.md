# Vendored upstreams

Vendoring is exceptional. Every vendored source tree records its immutable upstream identity, license, local patch set, update procedure and exit strategy in a colocated manifest.

`cordis/` preserves the repository's inherited Cordis snapshot during the TaiChiOS 0.1 migration. It is a test/audit boundary, not the TaiChiOS system runtime; see `cordis/README.md` and `cordis/upstream.json`.
