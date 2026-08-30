# Recovery tests

Failed-update, broken-profile, crashed-Harness and rollback acceptance scenarios.

`tools/test-guardian-recovery.sh` executes the shipped commands against an isolated system root and injects all four control-plane failures: a stale/crashed Harness heartbeat, failed tty1, a broken Profile and a tampered Recovery trusted file. Failed update and rollback/rollback-failed behavior is exercised by `tools/test-change-manager.sh`. `tools/test-installed-system.sh` separately proves that both BIOS and UEFI installed disks can enter the independent Recovery target without the Live ISO or network.
