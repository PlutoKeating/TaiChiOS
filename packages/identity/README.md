# Identity

Organizations, Human Users, Working Agents, service principals, delegation and audit attribution.

`IdentityRegistry` is the in-memory 0.2 reference implementation. It creates organization scopes, registers all three principal kinds with accountable owner links, and records ownership of Agent workspaces and long-running goals. A non-owner delegate must be a registered principal, hold `authority.delegate`, and may transfer only capabilities it already holds at the same or a narrower resource scope. It intentionally does not authenticate Unix logins or persist identities yet; those adapters belong to the installed-system integration increment.
