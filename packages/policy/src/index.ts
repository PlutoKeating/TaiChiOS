import type { AuthorizationDecision, AuthorizationRequest } from '@taichios/contracts'
import type { IdentityRegistry } from '@taichios/identity'

export class PolicyEngine {
  constructor(private readonly identities: IdentityRegistry) {}

  authorize(request: AuthorizationRequest): AuthorizationDecision {
    if (!this.identities.hasPrincipal(request.organizationId, request.principalId)) {
      return { allowed: false, confirmationRequired: false, reason: 'principal-not-found' }
    }
    if (!this.identities.hasCapability(
      request.organizationId,
      request.principalId,
      request.capability,
      request.resource,
    )) return { allowed: false, confirmationRequired: false, reason: 'capability-not-granted' }
    return { allowed: true, confirmationRequired: request.mode === 'guarded' }
  }
}
