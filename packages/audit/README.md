# Audit

Append-oriented records for acting principal, authorization, plugin lifecycle, external access and high-impact system change.

The current `AuditLog` captures organization, acting principal, action, resource, operating mode, outcome and failure reason for Provider invocation. Its interface deliberately has no credential field, and the JSON Schema rejects additional secret-bearing properties. Durable append storage and tamper evidence remain installed-system work.
