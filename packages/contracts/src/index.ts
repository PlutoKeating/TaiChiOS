export const principalKinds = ['human-user', 'working-agent', 'service-principal'] as const
export type PrincipalKind = typeof principalKinds[number]

export const operatingModes = ['guarded', 'creator', 'yolo'] as const
export type OperatingMode = typeof operatingModes[number]

export interface Organization {
  id: string
  ownerId: string
}

export interface Principal {
  id: string
  kind: PrincipalKind
  ownerId?: string
}

export interface CapabilityGrant {
  organizationId: string
  grantorId: string
  granteeId: string
  capabilities: string[]
  resource?: string
}

export interface OwnedResource {
  id: string
  kind: 'workspace' | 'long-running-goal'
  organizationId: string
  ownerId: string
}

export interface SecretGrant {
  token: string
  secretId: string
  audience: string
}

export interface AuthorizationRequest {
  organizationId: string
  principalId: string
  capability: string
  resource?: string
  mode: OperatingMode
}

export type AuthorizationDecision =
  | { allowed: true, confirmationRequired: boolean }
  | { allowed: false, confirmationRequired: false, reason: 'capability-not-granted' | 'principal-not-found' }

export interface ProviderInvocation {
  organizationId: string
  principalId: string
  providerId?: string
  model: string
  input: string
  mode: OperatingMode
  confirmed?: boolean
}

export interface ProviderResult {
  providerId: string
  model: string
  output: string
  usage?: {
    inputUnits: number
    outputUnits: number
  }
}

export interface ProviderAdapterResult {
  output: string
  usage?: ProviderResult['usage']
}

export interface ProviderAdapter {
  invoke(request: ProviderInvocation, credential?: string): Promise<ProviderAdapterResult>
}

export interface ProviderRegistration {
  id: string
  models: string[]
  secretId?: string
  adapter: ProviderAdapter
}

export interface AuditRecord {
  organizationId: string
  principalId: string
  action: string
  resource: string
  outcome: 'allowed' | 'denied' | 'failed'
  mode: OperatingMode
  reason?: string
  timestamp: string
}
