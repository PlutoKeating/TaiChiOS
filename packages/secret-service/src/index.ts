import { randomUUID } from 'node:crypto'

import type {
  AuthorizationDecision,
  AuthorizationRequest,
  SecretGrant,
  SecretGrantRequest,
} from '@taichios/contracts'

export interface SecretGrantAuthorizer {
  authorize(request: AuthorizationRequest): AuthorizationDecision
}

export class SecretService {
  #secrets = new Map<string, { organizationId: string, value: string }>()
  #grants = new Map<string, SecretGrant>()

  constructor(
    private readonly authorizer: SecretGrantAuthorizer,
    private readonly now: () => number = Date.now,
  ) {}

  store(secret: { organizationId: string, id: string, value: string }) {
    if (this.#secrets.has(secret.id)) throw new Error(`secret already exists: ${secret.id}`)
    this.#secrets.set(secret.id, { organizationId: secret.organizationId, value: secret.value })
  }

  issueGrant(request: SecretGrantRequest) {
    const secret = this.#secrets.get(request.secretId)
    if (!secret || secret.organizationId !== request.organizationId) throw new Error(`secret not found: ${request.secretId}`)
    const decision = this.authorizer.authorize({
      organizationId: request.organizationId,
      principalId: request.principalId,
      capability: 'secret.use',
      resource: `secret:${request.secretId}`,
      mode: request.mode,
    })
    if (!decision.allowed) throw new Error(`secret grant denied: ${decision.reason}`)
    if (decision.confirmationRequired && !request.confirmed) throw new Error('secret grant requires confirmation')
    const ttlSeconds = request.ttlSeconds ?? 60
    if (!Number.isInteger(ttlSeconds) || ttlSeconds < 1 || ttlSeconds > 300) {
      throw new Error('secret grant TTL must be between 1 and 300 seconds')
    }
    const token = randomUUID()
    const grant = {
      token,
      organizationId: request.organizationId,
      principalId: request.principalId,
      secretId: request.secretId,
      audience: request.audience,
      expiresAt: new Date(this.now() + ttlSeconds * 1000).toISOString(),
    }
    this.#grants.set(token, grant)
    return structuredClone(grant)
  }

  redeem(presentedGrant: SecretGrant, scope: { organizationId: string, principalId: string, audience: string }) {
    const grant = this.#grants.get(presentedGrant.token)
    if (!grant
      || grant.organizationId !== presentedGrant.organizationId
      || grant.principalId !== presentedGrant.principalId
      || grant.secretId !== presentedGrant.secretId
      || grant.audience !== presentedGrant.audience
      || grant.organizationId !== scope.organizationId
      || grant.principalId !== scope.principalId
      || grant.audience !== scope.audience
      || Date.parse(grant.expiresAt) <= this.now()) throw new Error('invalid secret grant')
    this.#grants.delete(presentedGrant.token)
    return this.#secrets.get(presentedGrant.secretId)?.value
  }
}
