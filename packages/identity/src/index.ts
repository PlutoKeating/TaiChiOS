import type { CapabilityGrant, Organization, OwnedResource, Principal } from '@taichios/contracts'

export class IdentityRegistry {
  #organizations = new Map<string, Organization>()
  #principals = new Map<string, Map<string, Principal>>()
  #grants: CapabilityGrant[] = []
  #resources = new Map<string, OwnedResource>()

  createOrganization(organization: Organization) {
    if (this.#organizations.has(organization.id)) throw new Error(`organization already exists: ${organization.id}`)
    this.#organizations.set(organization.id, structuredClone(organization))
    this.#principals.set(organization.id, new Map())
    return structuredClone(organization)
  }

  addPrincipal(organizationId: string, principal: Principal) {
    const organization = this.#organizations.get(organizationId)
    const principals = this.#principals.get(organizationId)
    if (!organization || !principals) throw new Error(`organization not found: ${organizationId}`)
    if (principals.has(principal.id)) throw new Error(`principal already exists: ${principal.id}`)
    if (principal.id === organization.ownerId && principal.kind !== 'human-user') {
      throw new Error('organization owner must be a human user')
    }
    if (principal.kind !== 'human-user' && !principals.has(principal.ownerId)) {
      throw new Error('non-human principal owner not found')
    }
    principals.set(principal.id, structuredClone(principal))
    return structuredClone(principal)
  }

  delegate(grant: CapabilityGrant) {
    const organization = this.#organizations.get(grant.organizationId)
    const principals = this.#principals.get(grant.organizationId)
    if (!organization || !principals?.has(grant.grantorId) || !principals.has(grant.granteeId)) {
      throw new Error('organization, grantor or grantee not found')
    }
    if (!grant.capabilities.length) throw new Error('delegation requires at least one capability')
    if (grant.grantorId !== organization.ownerId) {
      if (!this.hasCapability(grant.organizationId, grant.grantorId, 'authority.delegate', grant.resource)) {
        throw new Error('grantor is not authorized to delegate')
      }
      for (const capability of grant.capabilities) {
        if (!this.hasCapability(grant.organizationId, grant.grantorId, capability, grant.resource)) {
          throw new Error(`grantor cannot delegate capability outside its authority: ${capability}`)
        }
      }
    }
    this.#grants.push(structuredClone(grant))
  }

  hasPrincipal(organizationId: string, principalId: string) {
    return this.#principals.get(organizationId)?.has(principalId) ?? false
  }

  hasCapability(organizationId: string, principalId: string, capability: string, resource?: string) {
    const organization = this.#organizations.get(organizationId)
    if (!organization || !this.hasPrincipal(organizationId, principalId)) return false
    if (organization.ownerId === principalId) return true
    return this.#grants.some((grant) => {
      return grant.organizationId === organizationId
        && grant.granteeId === principalId
        && grant.capabilities.includes(capability)
        && (grant.resource === undefined || grant.resource === resource)
    })
  }

  assignResource(resource: OwnedResource, actingPrincipalId: string) {
    const organization = this.#organizations.get(resource.organizationId)
    if (!organization || !this.hasPrincipal(resource.organizationId, resource.ownerId)) {
      throw new Error('organization or resource owner not found')
    }
    if (organization.ownerId !== actingPrincipalId && resource.ownerId !== actingPrincipalId) {
      throw new Error('principal is not authorized to assign resource')
    }
    if (this.#resources.has(resource.id)) throw new Error(`resource already exists: ${resource.id}`)
    this.#resources.set(resource.id, structuredClone(resource))
  }

  transferResource(resourceId: string, newOwnerId: string, actingPrincipalId: string) {
    const resource = this.#resources.get(resourceId)
    if (!resource) throw new Error(`resource not found: ${resourceId}`)
    const organization = this.#organizations.get(resource.organizationId)!
    if (organization.ownerId !== actingPrincipalId && resource.ownerId !== actingPrincipalId) {
      throw new Error('principal is not authorized to transfer resource')
    }
    if (!this.hasPrincipal(resource.organizationId, newOwnerId)) throw new Error(`principal not found: ${newOwnerId}`)
    resource.ownerId = newOwnerId
  }

  ownerOf(resourceId: string) {
    return this.#resources.get(resourceId)?.ownerId
  }
}
