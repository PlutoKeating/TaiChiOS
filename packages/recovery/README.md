# Recovery

Rollback Point inventory, safe-profile control, repair plans and communication with the independent Recovery Environment.

The installed 0.1 recovery plane now has three independent entry/control paths: the GRUB Recovery item, `taichios-guardianctl enter-recovery` from a running system and direct `taichios-recovery enter --yes`. Recovery readiness is emitted only after the sealed trusted-file manifest verifies. Managed-file rollback and broken-Profile quarantine remain available without loading Harness or third-party Profiles; interactive control is the independent getty-based Recovery Profile, not a placeholder Harness.
