# Identity

Organizations, Human Users, Working Agents, service principals, delegation and audit attribution.

`IdentityRegistry` is the in-memory 0.2 reference implementation. It creates organization scopes, registers all three principal kinds, restricts delegation to an organization owner or a principal holding `authority.delegate`, and records ownership of Agent workspaces and long-running goals. It intentionally does not authenticate Unix logins or persist identities yet; those adapters belong to the installed-system integration increment.
