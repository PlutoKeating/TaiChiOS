# Recovery Profile

The installed GRUB recovery entry is the trusted safe Profile: it boots `taichios-recovery.target`, excludes ordinary Harness and third-party Profile services, and retains local filesystems plus serial getty control. `sudo taichios-recovery disable-profile ACCOUNT PROFILE` disables a broken profile and quarantines that account's Harness supervisor so it cannot enter a restart loop; `sudo taichios-recovery leave-safe-profile ACCOUNT` removes the quarantine marker after repair. `sudo taichios-recovery rollback-last` restores the last file managed by `taichios-change`.

Managed-file rollback preserves the complete Change Set history. A missing or unusable Rollback Point is recorded as `rollback-failed` instead of being reported as success, leaving the independent Recovery shell available for manual repair.

The trusted Recovery set contains only the managed-change/recovery/Guardian commands and their systemd units, sealed into `trusted-files.sha256` during the image build. `taichios-recovery verify` checks that set before the readiness marker is emitted. This detects accidental or unauthorized file replacement; it is not a substitute for Secure Boot or an externally anchored signature.
