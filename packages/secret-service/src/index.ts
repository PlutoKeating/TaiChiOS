import { randomUUID } from 'node:crypto'

import type { SecretGrant } from '@taichios/contracts'

export class SecretService {
  #secrets = new Map<string, string>()
  #grants = new Map<string, SecretGrant>()

  store(secret: { id: string, value: string }) {
    if (this.#secrets.has(secret.id)) throw new Error(`secret already exists: ${secret.id}`)
    this.#secrets.set(secret.id, secret.value)
  }

  issueGrant(secretId: string, audience: string) {
    if (!this.#secrets.has(secretId)) throw new Error(`secret not found: ${secretId}`)
    const token = randomUUID()
    const grant = { token, secretId, audience }
    this.#grants.set(token, grant)
    return structuredClone(grant)
  }

  redeem(presentedGrant: SecretGrant, audience: string) {
    const grant = this.#grants.get(presentedGrant.token)
    if (!grant
      || grant.secretId !== presentedGrant.secretId
      || grant.audience !== presentedGrant.audience
      || grant.audience !== audience) throw new Error('invalid secret grant')
    this.#grants.delete(presentedGrant.token)
    return this.#secrets.get(presentedGrant.secretId)
  }
}
