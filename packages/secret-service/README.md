# Secret Service

Credential storage and scoped grant delivery. Secrets must not be persisted in ordinary Profile configuration, Session logs or audit payloads.

The reference `SecretService` keeps credential material behind opaque, audience-scoped, single-use grants. Redeeming a grant for another Provider/principal audience or redeeming it twice fails. Its in-memory store is suitable for contract and integration verification only; the installed system still needs an encrypted/policy-bound persistence adapter.
