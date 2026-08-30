import Ajv from 'ajv'
import { describe, expect, it } from 'vitest'

import schema from '../../../schemas/control-plane.schema.json'
import changeSetSchema from '../../../schemas/change-set.schema.json'
import { changeStates, operatingModes, principalKinds } from '../src/index.ts'

describe('control-plane wire contract', () => {
  const ajv = new Ajv({ allErrors: true })
  ajv.addSchema(schema)

  it('keeps schema vocabulary synchronized with TypeScript contracts', () => {
    expect(schema.definitions.Principal.properties.kind.enum).toEqual(principalKinds)
    expect(schema.definitions.ProviderInvocation.properties.mode.enum).toEqual(operatingModes)
  })

  it('accepts a model-neutral Provider invocation and rejects unknown modes', () => {
    const validate = ajv.getSchema(`${schema.$id}#/definitions/ProviderInvocation`)!
    const invocation = {
      organizationId: 'org:taichios',
      principalId: 'agent:operator',
      model: 'taichi-test',
      input: 'hello',
      mode: 'guarded',
    }
    expect(validate(invocation)).toBe(true)
    expect(validate({ ...invocation, mode: 'implicit-root' })).toBe(false)
  })

  it('requires ownership attribution for non-human principals', () => {
    const validate = ajv.getSchema(`${schema.$id}#/definitions/Principal`)!
    expect(validate({ id: 'human:owner', kind: 'human-user' })).toBe(true)
    expect(validate({ id: 'agent:worker', kind: 'working-agent' })).toBe(false)
    expect(validate({ id: 'agent:worker', kind: 'working-agent', ownerId: 'human:owner' })).toBe(true)
  })

  it('rejects secrets in audit records', () => {
    const validate = ajv.getSchema(`${schema.$id}#/definitions/AuditRecord`)!
    expect(validate({
      organizationId: 'org:taichios',
      principalId: 'agent:operator',
      action: 'provider.invoke',
      resource: 'provider:local',
      outcome: 'allowed',
      mode: 'yolo',
      timestamp: '2026-08-30T00:00:00.000Z',
      credential: 'must-not-be-accepted',
    })).toBe(false)
  })

  it('requires Secret grants to carry principal, organization, audience and expiry scope', () => {
    const validate = ajv.getSchema(`${schema.$id}#/definitions/SecretGrant`)!
    const grant = {
      token: 'opaque-token',
      organizationId: 'org:taichios',
      principalId: 'agent:operator',
      secretId: 'secret:provider',
      audience: 'provider:local:agent:operator',
      expiresAt: '2026-08-30T00:01:00.000Z',
    }
    expect(validate(grant)).toBe(true)
    expect(validate({ ...grant, principalId: undefined })).toBe(false)
    expect(validate({ ...grant, expiresAt: undefined })).toBe(false)
  })

  it('requires committed Change Sets to declare verification and rollback', () => {
    expect(changeSetSchema.properties.state.enum).toEqual(changeStates)
    const validate = ajv.compile(changeSetSchema)
    const changeSet = {
      id: 'change:profile-update',
      kind: 'profile',
      organizationId: 'org:taichios',
      actorId: 'agent:operator',
      mode: 'guarded',
      state: 'committed',
      source: { identity: 'npm:example@1.0.0', sha256: 'a'.repeat(64) },
      effects: [{ operation: 'replace', path: '/etc/taichios/example.conf' }],
      verification: ['profile-smoke'],
      rollback: { kind: 'file-snapshot', reference: 'change:profile-update/before' },
    }
    expect(validate(changeSet)).toBe(true)
    expect(validate({ ...changeSet, verification: [], rollback: undefined })).toBe(false)
    expect(validate({ ...changeSet, state: 'failed', failureReason: undefined })).toBe(false)
    expect(validate({ ...changeSet, state: 'failed', failureReason: 'verification-failed', rollback: undefined })).toBe(true)
    expect(validate({ ...changeSet, state: 'rolled-back', failureReason: 'not-truthful' })).toBe(false)
  })
})
