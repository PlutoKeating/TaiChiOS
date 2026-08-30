import { describe, expect, it } from 'vitest'

import { IdentityRegistry } from '@taichios/identity'
import { PolicyEngine } from '@taichios/policy'
import { SecretService } from '@taichios/secret-service'

describe('Secret Service grants', () => {
  it('issues an audience-scoped grant that can be redeemed only once', () => {
    let now = Date.parse('2026-08-30T00:00:00.000Z')
    const identities = new IdentityRegistry()
    const organization = identities.createOrganization({ id: 'org:taichios', ownerId: 'human:owner' })
    identities.addPrincipal(organization.id, { id: 'human:owner', kind: 'human-user' })
    identities.addPrincipal(organization.id, { id: 'agent:operator', kind: 'working-agent', ownerId: 'human:owner' })
    identities.addPrincipal(organization.id, { id: 'agent:untrusted', kind: 'working-agent', ownerId: 'human:owner' })
    identities.delegate({
      organizationId: organization.id,
      grantorId: 'human:owner',
      granteeId: 'agent:operator',
      capabilities: ['secret.use'],
      resource: 'secret:secret:provider',
    })
    const secrets = new SecretService(new PolicyEngine(identities), () => now)
    secrets.store({ organizationId: organization.id, id: 'secret:provider', value: 'credential' })
    const request = {
      organizationId: organization.id,
      principalId: 'agent:operator',
      secretId: 'secret:provider',
      audience: 'provider:local:agent:operator',
      mode: 'yolo' as const,
    }
    const grant = secrets.issueGrant(request)

    expect(() => secrets.issueGrant({ ...request, principalId: 'agent:untrusted' })).toThrow('secret grant denied')

    expect(grant).toMatchObject({
      secretId: 'secret:provider',
      audience: 'provider:local:agent:operator',
    })
    expect(() => secrets.redeem(grant, { ...request, audience: 'provider:other:agent:operator' })).toThrow('invalid secret grant')
    expect(secrets.redeem(grant, request)).toBe('credential')
    expect(() => secrets.redeem(grant, request)).toThrow('invalid secret grant')

    const expired = secrets.issueGrant({ ...request, ttlSeconds: 1 })
    now += 1001
    expect(() => secrets.redeem(expired, request)).toThrow('invalid secret grant')
  })
})
