export const principalKinds = ['human-user', 'working-agent', 'service-principal'] as const
export type PrincipalKind = typeof principalKinds[number]

export const operatingModes = ['guarded', 'creator', 'yolo'] as const
export type OperatingMode = typeof operatingModes[number]

export const changeStates = [
  'proposed',
  'resolved',
  'authorized',
  'dry-run',
  'staged',
  'activated',
  'verified',
  'committed',
  'failed',
  'rolled-back',
  'rollback-failed',
] as const
export type ChangeState = typeof changeStates[number]

export interface Organization {
  id: string
  ownerId: string
}

interface PrincipalBase {
  id: string
}

export type Principal =
  | PrincipalBase & { kind: 'human-user', ownerId?: string }
  | PrincipalBase & { kind: Exclude<PrincipalKind, 'human-user'>, ownerId: string }

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
  organizationId: string
  principalId: string
  secretId: string
  audience: string
  expiresAt: string
}

export interface SecretGrantRequest {
  organizationId: string
  principalId: string
  secretId: string
  audience: string
  mode: OperatingMode
  confirmed?: boolean
  ttlSeconds?: number
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
  organizationId: string
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

interface ChangeSetBase {
  id: string
  kind: 'managed-file' | 'profile' | 'plugin' | 'system-update'
  organizationId: string
  actorId: string
  mode: OperatingMode
  source: {
    identity: string
    sha256: string
  }
  effects: Array<{
    operation: 'create' | 'replace' | 'remove'
    path: string
    sha256?: string
  }>
  verification: string[]
}

interface ChangeSetRollback {
  rollback: {
    kind: 'file-snapshot' | 'profile-link' | 'deployment'
    reference: string
  }
}

export type ChangeSet = ChangeSetBase & (
  | { state: Exclude<ChangeState, 'committed' | 'failed' | 'rollback-failed'>, rollback?: ChangeSetRollback['rollback'], failureReason?: never }
  | { state: 'committed', verification: [string, ...string[]], rollback: ChangeSetRollback['rollback'], failureReason?: never }
  | { state: 'failed' | 'rollback-failed', rollback?: ChangeSetRollback['rollback'], failureReason: string }
)
