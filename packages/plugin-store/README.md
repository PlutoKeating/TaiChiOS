# TaiChi Store

DSH-compatible plugin discovery and transactional lifecycle: resolve, inspect, authorize, dry-run, stage, verify, commit and rollback.

Plugin operations consume the shared Change Set envelope and control-plane authorization semantics. `--yes` accepts ordinary confirmation, `--yolo` suppresses high-impact confirmation only inside existing authority, and `--non-interactive` fails when neither explicit confirmation is present. Plugin activation must supply its own verification and Rollback Point before reaching committed.
