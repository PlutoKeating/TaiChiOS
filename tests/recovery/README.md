# Recovery tests

Failed-update, broken-profile, crashed-Harness and rollback acceptance scenarios.

`tools/test-guardian-recovery.sh` executes the shipped commands against an isolated system root and injects stale/missing/crashed Harness heartbeat, inactive tty1, a broken Profile with quarantine selection and a tampered Recovery trusted file. Failed atomic deployment-pointer update and rollback/rollback-failed behavior is exercised by `tools/test-change-manager.sh`. `tools/test-installed-system.sh` separately proves that both BIOS and UEFI installed disks can enter the independent getty-based Recovery Profile without the Live ISO or network.
