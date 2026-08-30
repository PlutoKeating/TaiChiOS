# Recovery Profile

The installed GRUB recovery entry boots `taichios-recovery.target`, which excludes ordinary Harness and third-party profile services while retaining local filesystems and serial login. `sudo taichios-recovery disable-profile ACCOUNT PROFILE` disables a broken profile; `sudo taichios-recovery rollback-last` restores the last file managed by `taichios-change`.

Managed-file rollback preserves the complete Change Set history. A missing or unusable Rollback Point is recorded as `rollback-failed` instead of being reported as success, leaving the independent Recovery shell available for manual repair.

The trusted Recovery set contains only the managed-change/recovery/Guardian commands and their systemd units, sealed into `trusted-files.sha256` during the image build. `taichios-recovery verify` checks that set before the readiness marker is emitted. This detects accidental or unauthorized file replacement; it is not a substitute for Secure Boot or an externally anchored signature.
