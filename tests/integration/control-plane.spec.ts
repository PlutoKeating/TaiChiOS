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
    identities.delegate({
      organizationId: organization.id,
      grantorId: 'human:owner',
      granteeId: 'agent:operator',
      capabilities: ['secret.use'],
      resource: 'secret:secret:local',
    })

    const policy = new PolicyEngine(identities)
    const secrets = new SecretService(policy)
    secrets.store({ organizationId: organization.id, id: 'secret:local', value: 'credential-must-not-leak' })
    const audit = new AuditLog()
    const providers = new ProviderRegistry(policy, secrets, audit)
    providers.register({
      organizationId: organization.id,
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
    const policy = new PolicyEngine(identities)
    const providers = new ProviderRegistry(policy, new SecretService(policy), audit)
    providers.register({
      organizationId: organization.id,
      id: 'provider-a',
      models: ['model-a'],
      adapter: { async invoke() { return { output: 'from-a' } } },
    })
    providers.register({
      organizationId: organization.id,
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

  it('rejects delegation by an unknown owner string or beyond delegated authority', () => {
    const identities = new IdentityRegistry()
    const organization = identities.createOrganization({ id: 'org:taichios', ownerId: 'human:owner' })
    identities.addPrincipal(organization.id, { id: 'human:owner', kind: 'human-user' })
    identities.addPrincipal(organization.id, { id: 'human:delegate', kind: 'human-user' })
    identities.addPrincipal(organization.id, {
      id: 'agent:worker',
      kind: 'working-agent',
      ownerId: 'human:owner',
    })

    expect(() => identities.delegate({
      organizationId: organization.id,
      grantorId: 'human:missing',
      granteeId: 'agent:worker',
      capabilities: ['provider.invoke'],
    })).toThrow('grantor')

    identities.delegate({
      organizationId: organization.id,
      grantorId: 'human:owner',
      granteeId: 'human:delegate',
      capabilities: ['authority.delegate'],
    })
    expect(() => identities.delegate({
      organizationId: organization.id,
      grantorId: 'human:delegate',
      granteeId: 'agent:worker',
      capabilities: ['system.modify'],
    })).toThrow('outside its authority')
  })

  it('audits routing and credential failures without crossing organization boundaries', async () => {
    const identities = new IdentityRegistry()
    const first = identities.createOrganization({ id: 'org:first', ownerId: 'human:first' })
    identities.addPrincipal(first.id, { id: 'human:first', kind: 'human-user' })
    const second = identities.createOrganization({ id: 'org:second', ownerId: 'human:second' })
    identities.addPrincipal(second.id, { id: 'human:second', kind: 'human-user' })
    const policy = new PolicyEngine(identities)
    const secrets = new SecretService(policy)
    secrets.store({ organizationId: second.id, id: 'secret:first', value: 'credential' })
    const audit = new AuditLog()
    const providers = new ProviderRegistry(policy, secrets, audit)
    providers.register({
      organizationId: first.id,
      id: 'first',
      models: ['shared-model'],
      secretId: 'secret:first',
      adapter: { async invoke() { return { output: 'first' } } },
    })

    await expect(providers.invoke({
      organizationId: second.id,
      principalId: 'human:second',
      model: 'shared-model',
      input: 'hello',
      mode: 'yolo',
    })).rejects.toThrow('provider not found')
    await expect(providers.invoke({
      organizationId: first.id,
      principalId: 'human:first',
      model: 'shared-model',
      input: 'hello',
      mode: 'guarded',
      confirmed: true,
    })).rejects.toThrow('credential grant failed')
    expect(audit.list().map(record => record.reason)).toEqual(['provider-not-found', 'secret-grant-failed'])
  })
})
