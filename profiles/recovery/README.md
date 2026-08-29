# Recovery Profile

The installed GRUB recovery entry boots `taichios-recovery.target`, which excludes ordinary Harness and third-party profile services while retaining local filesystems and serial login. `sudo taichios-recovery disable-profile ACCOUNT PROFILE` disables a broken profile; `sudo taichios-recovery rollback-last` restores the last file managed by `taichios-change`.

Managed-file rollback preserves the complete Change Set history. A missing or unusable Rollback Point is recorded as `rollback-failed` instead of being reported as success, leaving the independent Recovery shell available for manual repair.
