# Secret Service

Credential storage and scoped grant delivery. Secrets must not be persisted in ordinary Profile configuration, Session logs or audit payloads.

The reference `SecretService` keeps credential material behind opaque, organization/principal/audience-scoped, expiring, single-use grants. Issuance requires `secret.use` authority for that secret resource and guarded issuance preserves confirmation; cross-scope, expired and repeated redemption fail. Its in-memory store is suitable for contract and integration verification only; the installed system still needs encrypted persistence and a privileged provisioning adapter.
