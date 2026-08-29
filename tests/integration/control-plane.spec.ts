import { describe, expect, it } from 'vitest'

import { AuditLog } from '@taichios/audit'
import { IdentityRegistry } from '@taichios/identity'
import { PolicyEngine } from '@taichios/policy'
import { ProviderRegistry } from '@taichios/provider-registry'
import { SecretService } from '@taichios/secret-service'

describe('TaiChiOS control plane', () => {
  it('limits a delegated Working Agent even when YOLO suppresses confirmation', () => {
    const identities = new IdentityRegistry()
    const organization = identities.createOrganization({ id: 'org:taichios', ownerId: 'human:owner' })
    identities.addPrincipal(organization.id, { id: 'human:owner', kind: 'human-user' })
    identities.addPrincipal(organization.id, {
      id: 'agent:builder',
      kind: 'working-agent',
      ownerId: 'human:owner',
    })
    identities.delegate({
      organizationId: organization.id,
      grantorId: 'human:owner',
      granteeId: 'agent:builder',
      capabilities: ['provider.invoke'],
    })

    const policy = new PolicyEngine(identities)

    expect(policy.authorize({
      organizationId: organization.id,
      principalId: 'agent:builder',
      capability: 'provider.invoke',
      mode: 'yolo',
    })).toMatchObject({ allowed: true, confirmationRequired: false })

    expect(policy.authorize({
      organizationId: organization.id,
      principalId: 'agent:builder',
      capability: 'system.modify',
      mode: 'yolo',
    })).toMatchObject({ allowed: false, reason: 'capability-not-granted' })
  })

  it('invokes a model-neutral Provider with a scoped secret and secret-free audit record', async () => {
    const identities = new IdentityRegistry()
    const organization = identities.createOrganization({ id: 'org:taichios', ownerId: 'human:owner' })
    identities.addPrincipal(organization.id, { id: 'human:owner', kind: 'human-user' })
    identities.addPrincipal(organization.id, {
      id: 'agent:operator',
      kind: 'working-agent',
      ownerId: 'human:owner',
    })
    identities.delegate({
      organizationId: organization.id,
      grantorId: 'human:owner',
      granteeId: 'agent:operator',
      capabilities: ['provider.invoke'],
      resource: 'provider:local',
    })

    const secrets = new SecretService()
    secrets.store({ id: 'secret:local', value: 'credential-must-not-leak' })
    const audit = new AuditLog()
    const providers = new ProviderRegistry(new PolicyEngine(identities), secrets, audit)
    providers.register({
      id: 'local',
      models: ['taichi-test'],
      secretId: 'secret:local',
      adapter: {
        async invoke(request, credential) {
          expect(credential).toBe('credential-must-not-leak')
          return { output: `echo:${request.input}`, usage: { inputUnits: 1, outputUnits: 1 } }
        },
      },
    })

    await expect(providers.invoke({
      organizationId: organization.id,
      principalId: 'agent:operator',
      model: 'taichi-test',
      input: 'hello',
      mode: 'yolo',
    })).resolves.toMatchObject({ providerId: 'local', output: 'echo:hello' })

    expect(JSON.stringify(audit.list())).not.toContain('credential-must-not-leak')
    expect(audit.list()).toEqual([
      expect.objectContaining({
        organizationId: organization.id,
        principalId: 'agent:operator',
        action: 'provider.invoke',
        resource: 'provider:local',
        outcome: 'allowed',
      }),
    ])
  })

  it('attributes autonomous workspaces and long-running goals to a Working Agent', () => {
    const identities = new IdentityRegistry()
    const organization = identities.createOrganization({ id: 'org:taichios', ownerId: 'human:owner' })
    identities.addPrincipal(organization.id, { id: 'human:owner', kind: 'human-user' })
    identities.addPrincipal(organization.id, {
      id: 'agent:researcher',
      kind: 'working-agent',
      ownerId: 'human:owner',
    })
    identities.addPrincipal(organization.id, {
      id: 'service:indexer',
      kind: 'service-principal',
      ownerId: 'human:owner',
    })

    identities.assignResource({
      id: 'workspace:research',
      kind: 'workspace',
      organizationId: organization.id,
      ownerId: 'agent:researcher',
    }, 'human:owner')
    identities.assignResource({
      id: 'goal:survey-providers',
      kind: 'long-running-goal',
      organizationId: organization.id,
      ownerId: 'agent:researcher',
    }, 'human:owner')

    expect(identities.ownerOf('workspace:research')).toBe('agent:researcher')
    expect(identities.ownerOf('goal:survey-providers')).toBe('agent:researcher')
    expect(() => identities.transferResource(
      'goal:survey-providers',
      'service:indexer',
      'service:indexer',
    )).toThrow('principal is not authorized to transfer resource')
  })

  it('routes by model without privileging one Provider and preserves guarded confirmation', async () => {
    const identities = new IdentityRegistry()
    const organization = identities.createOrganization({ id: 'org:taichios', ownerId: 'human:owner' })
    identities.addPrincipal(organization.id, { id: 'human:owner', kind: 'human-user' })
    const audit = new AuditLog()
    const providers = new ProviderRegistry(new PolicyEngine(identities), new SecretService(), audit)
    providers.register({
      id: 'provider-a',
      models: ['model-a'],
      adapter: { async invoke() { return { output: 'from-a' } } },
    })
    providers.register({
      id: 'provider-b',
      models: ['model-b'],
      adapter: { async invoke() { return { output: 'from-b' } } },
    })
    const invocation = {
      organizationId: organization.id,
      principalId: 'human:owner',
      model: 'model-b',
      input: 'hello',
      mode: 'guarded' as const,
    }

    await expect(providers.invoke(invocation)).rejects.toThrow('requires confirmation')
    await expect(providers.invoke({ ...invocation, confirmed: true })).resolves.toMatchObject({
      providerId: 'provider-b',
      output: 'from-b',
    })
    expect(audit.list().map(record => record.outcome)).toEqual(['denied', 'allowed'])
  })
})
