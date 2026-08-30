# Provider Registry

Model-neutral LLM Provider catalog, health, routing, quota and invocation boundary used by Agents, plugins and system processes.

`ProviderRegistry.invoke()` is the 0.2 reference seam. Callers submit a model-neutral request with organization, acting principal, model and operating mode. The registry routes only among Providers registered to that organization, authorizes `provider.invoke` for that Provider resource, obtains a separately authorized single-use Secret grant, invokes the adapter and emits a secret-free audit record. Routing, authorization, credential and adapter failures are attributed without exposing credentials. Health persistence, quota accounting and production network adapters remain follow-up work and are not claimed by this slice.
