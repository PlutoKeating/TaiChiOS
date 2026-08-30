import type { AuditLog } from '@taichios/audit'
import type {
  ProviderInvocation,
  ProviderRegistration,
  ProviderResult,
} from '@taichios/contracts'
import type { PolicyEngine } from '@taichios/policy'
import type { SecretService } from '@taichios/secret-service'

export class ProviderRegistry {
  #providers = new Map<string, ProviderRegistration>()

  constructor(
    private readonly policy: PolicyEngine,
    private readonly secrets: SecretService,
    private readonly audit: AuditLog,
  ) {}

  register(provider: ProviderRegistration) {
    const key = `${provider.organizationId}:${provider.id}`
    if (this.#providers.has(key)) throw new Error(`provider already exists: ${provider.id}`)
    if (!provider.models.length) throw new Error('provider must declare at least one model')
    this.#providers.set(key, provider)
  }

  async invoke(request: ProviderInvocation): Promise<ProviderResult> {
    let provider: ProviderRegistration
    let resource = request.providerId ? `provider:${request.providerId}` : `provider:model:${request.model}`
    try {
      provider = this.#selectProvider(request)
      resource = `provider:${provider.id}`
    } catch {
      this.#record(request, resource, 'failed', 'provider-not-found')
      throw new Error(`provider not found for model: ${request.model}`)
    }
    const decision = this.policy.authorize({
      organizationId: request.organizationId,
      principalId: request.principalId,
      capability: 'provider.invoke',
      resource,
      mode: request.mode,
    })
    if (!decision.allowed) {
      this.#record(request, resource, 'denied', decision.reason)
      throw new Error(`provider invocation denied: ${decision.reason}`)
    }
    if (decision.confirmationRequired && !request.confirmed) {
      this.#record(request, resource, 'denied', 'confirmation-required')
      throw new Error('provider invocation requires confirmation')
    }

    const audience = `${resource}:${request.principalId}`
    let credential: string | undefined
    if (provider.secretId) {
      try {
        const grant = this.secrets.issueGrant({
          organizationId: request.organizationId,
          principalId: request.principalId,
          secretId: provider.secretId,
          audience,
          mode: request.mode,
          confirmed: request.confirmed,
        })
        credential = this.secrets.redeem(grant, {
          organizationId: request.organizationId,
          principalId: request.principalId,
          audience,
        })
      } catch {
        this.#record(request, resource, 'failed', 'secret-grant-failed')
        throw new Error('provider credential grant failed')
      }
    }
    try {
      const result = await provider.adapter.invoke(structuredClone(request), credential)
      this.#record(request, resource, 'allowed')
      return { providerId: provider.id, model: request.model, ...result }
    } catch {
      this.#record(request, resource, 'failed', 'provider-adapter-failed')
      throw new Error('provider invocation failed')
    }
  }

  #selectProvider(request: ProviderInvocation) {
    const provider = request.providerId
      ? this.#providers.get(`${request.organizationId}:${request.providerId}`)
      : [...this.#providers.values()].find(candidate => candidate.organizationId === request.organizationId
        && candidate.models.includes(request.model))
    if (!provider || !provider.models.includes(request.model)) throw new Error(`provider not found for model: ${request.model}`)
    return provider
  }

  #record(
    request: ProviderInvocation,
    resource: string,
    outcome: 'allowed' | 'denied' | 'failed',
    reason?: string,
  ) {
    this.audit.append({
      organizationId: request.organizationId,
      principalId: request.principalId,
      action: 'provider.invoke',
      resource,
      outcome,
      mode: request.mode,
      reason,
    })
  }
}
