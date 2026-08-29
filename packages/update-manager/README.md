# Update Manager

Coordinates Debian system, TaiChiOS system-Bundle and user-plugin update channels without conflating their trust or rollback boundaries.

All channels use the `schemas/change-set.schema.json` lifecycle: proposed, resolved, authorized, staged, activated, verified and committed, followed when necessary by rolled-back or rollback-failed. Channel adapters own their actual snapshot/activation mechanism; they must not reinterpret confirmation flags or omit verification and recovery evidence.
