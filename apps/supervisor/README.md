# Supervisor

The systemd template unit `taichios-harness@.service` composes and validates one user's real Harness/dsh-TUI profile against an offline mock Provider. After readiness it remains alive, updates `/run/taichios/harness/ACCOUNT.heartbeat`, reports the systemd watchdog and restarts after a crash. Provider and Harness units are `Wants`, not login requirements, so either may fail without taking down getty or the fallback shell.

`taichios-guardian.service` is an independent root-owned watchdog outside the ordinary Harness/Profile tree. It monitors declared Harness accounts and tty1, records incidents under `/var/lib/taichios/guardian`, restarts failed, inactive, missing-heartbeat or stale Harness supervisors and restores a failed or inactive getty. Its root-only runtime request directory is controlled by `taichios-guardianctl`; supported requests restart one Harness, quarantine a broken Profile before restart, or isolate the Recovery target from a running system. Quarantine intentionally does not pretend to provide a working Harness/TUI: interactive owner control remains the independent getty/Recovery Profile.

The independent `taichios-recovery.target` and `taichios-recovery` command remain available when Guardian, Harness or an interface cannot recover automatically.

## Migration and rollback

These units and trusted-file seals are image contents, not an in-place migration for existing 0.1 installations. Existing systems gain Guardian only after booting/installing an image built from this source or after an owner deliberately installs the matching unit, commands, account list and sealed manifest together. To back out before image replacement, an owner disables `taichios-guardian.service`, removes per-account safe-profile markers under `/var/lib/taichios/guardian/safe-profiles`, restores the prior Harness unit/supervisor as one Change Set and verifies direct getty/Recovery access. The installed GRUB `Previous` entry or Recovery shell remains the rollback path when the normal multi-user target cannot be reached.
