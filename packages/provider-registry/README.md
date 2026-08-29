# Provider Registry

Model-neutral LLM Provider catalog, health, routing, quota and invocation boundary used by Agents, plugins and system processes.

`ProviderRegistry.invoke()` is the 0.2 reference seam. Callers submit a model-neutral request with organization, acting principal, model and operating mode. The registry selects a registered adapter, authorizes `provider.invoke` for that Provider resource, obtains a single-use Secret grant, invokes the adapter and emits a secret-free audit record. Health persistence, quota accounting and production network adapters remain follow-up work and are not claimed by this slice.
