# Supervisor

The systemd template unit `taichios-harness@.service` composes and validates one user's real Harness/dsh-TUI profile against an offline mock Provider. After readiness it remains alive, updates `/run/taichios/harness/ACCOUNT.heartbeat`, reports the systemd watchdog and restarts after a crash. Provider and Harness units are `Wants`, not login requirements, so either may fail without taking down getty or the fallback shell.

`taichios-guardian.service` is an independent root-owned watchdog outside the ordinary Harness/Profile tree. It monitors declared Harness accounts and tty1, records incidents under `/var/lib/taichios/guardian`, restarts failed, inactive or stale Harness supervisors and restores a failed getty. Its root-only runtime request directory is controlled by `taichios-guardianctl`; supported requests restart one Harness, disable a broken Profile before restart, or isolate the Recovery target from a running system.

The independent `taichios-recovery.target` and `taichios-recovery` command remain available when Guardian, Harness or an interface cannot recover automatically.
