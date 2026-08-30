import type { AuditRecord } from '@taichios/contracts'

export class AuditLog {
  #records: AuditRecord[] = []

  append(record: Omit<AuditRecord, 'timestamp'>) {
    this.#records.push({ ...structuredClone(record), timestamp: new Date().toISOString() })
  }

  list() {
    return structuredClone(this.#records)
  }
}
