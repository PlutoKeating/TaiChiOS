import { describe, expect, it } from 'vitest'

import { SecretService } from '@taichios/secret-service'

describe('Secret Service grants', () => {
  it('issues an audience-scoped grant that can be redeemed only once', () => {
    const secrets = new SecretService()
    secrets.store({ id: 'secret:provider', value: 'credential' })
    const grant = secrets.issueGrant('secret:provider', 'provider:local:agent:operator')

    expect(grant).toMatchObject({
      secretId: 'secret:provider',
      audience: 'provider:local:agent:operator',
    })
    expect(() => secrets.redeem(grant, 'provider:other:agent:operator')).toThrow('invalid secret grant')
    expect(secrets.redeem(grant, 'provider:local:agent:operator')).toBe('credential')
    expect(() => secrets.redeem(grant, 'provider:local:agent:operator')).toThrow('invalid secret grant')
  })
})
