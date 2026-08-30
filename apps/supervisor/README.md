# Supervisor

The MVP supervision path uses systemd template units `taichios-harness@.service`. Each instance composes and validates one user's real Harness/dsh-TUI profile against an offline mock Provider, writing readiness state under `/run/taichios/harness`. Provider and Harness units are `Wants`, not login requirements, so either may fail without taking down getty or the fallback shell.

The independent `taichios-recovery.target` and `taichios-recovery` command remain available outside the ordinary Harness plugin tree.
