import Ajv from 'ajv'
import { describe, expect, it } from 'vitest'

import schema from '../../../schemas/control-plane.schema.json'
import { operatingModes, principalKinds } from '../src/index.ts'

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
})
