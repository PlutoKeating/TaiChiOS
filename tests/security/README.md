# Security tests

Capability, sandbox, provenance, secret-handling, prompt-injection and explicit-override scenarios.

The first executable security cases live with the public control-plane and Secret Service interfaces. They verify that YOLO does not acquire authority, audit payloads reject credential fields, and Secret grants are audience-scoped and single-use. Host sandbox, prompt-injection and persistent-store cases remain future gates.
