# Update Manager

Coordinates Debian system, TaiChiOS system-Bundle and user-plugin update channels without conflating their trust or rollback boundaries.

All channels use the `schemas/change-set.schema.json` lifecycle: proposed, resolved, authorized, dry-run, staged, activated, verified and committed, followed when necessary by rolled-back or rollback-failed. Channel adapters own their actual snapshot/activation mechanism; they must not reinterpret confirmation flags or omit verification and recovery evidence.

The installed 0.1 adapter supports a minimal `system-update` Change Set for an atomic deployment pointer or manifest below `/opt/taichios`; it uses the same digest verification and Rollback Point mechanism as managed files, and `taichios-recovery rollback-last` can restore the prior pointer. Package-manager transactions and multi-file deployments remain future adapters and must not be reported as protected until they provide their own atomic activation and rollback evidence.
