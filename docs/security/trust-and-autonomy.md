# Trust and autonomy

## Operating modes

| Mode | Intended behavior |
|---|---|
| Observe | Explain and propose; do not mutate without a new grant. |
| Assist | Automatically perform low-impact work under default policy. |
| Operate | Execute delegated tasks within declared capabilities and budgets. |
| Autonomize | Manage long-running goals and user-level extensions within policy. |
| Developer | Load local development artifacts and expose engineering controls. |
| Creator | Permit deliberate system construction and self-modification workflows. |
| YOLO | Suppress interactive approvals for the explicitly authorized command or session. |

Modes are policy presets, not identities. A Working Agent in YOLO mode still acts as that Working Agent and remains bounded by the authority granted to it. An organization owner may intentionally delegate system-owner authority.

## Command-line contract

TaiChiOS command surfaces should converge on shared flags:

```text
--dry-run          resolve and report effects without committing
--non-interactive  fail instead of opening an interactive prompt
--yes              accept ordinary confirmations
--yolo             accept high-impact confirmations in the authorized scope
--as <principal>   select an authenticated acting principal
```

Individual tools must not invent contradictory meanings. `--yolo` must be visible in audit output and must never claim a Dry Run when persistent effects occurred.

The installed managed-file implementation enforces this contract: `--non-interactive` without `--yes` or `--yolo` fails, Dry Run rejects apply confirmation and writes no target or per-change state, and an unprivileged Unix caller cannot select a different `--as` principal. Dry Run remains the `dry-run` state under guarded mode, and confirmation rejection appends a truthful event to the global Change Set audit. This 0.1 adapter accepts only `unix:ACCOUNT` acting principals and verifies explicitly selected accounts against the live or offline root password database. When root deliberately acts on behalf of another existing account, every per-change and global audit record preserves both `executor=unix:root` and `delegatedBy=unix:root`; selection does not itself create a control-plane capability grant.

## Plugin trust tiers

| Tier | Provenance | Default execution |
|---|---|---|
| System | TaiChiOS release set | Trusted system process or dedicated service |
| Certified | Signed and reviewed against a declared version | Worker/service with declared grants |
| Community | Pinned third-party source | Sandboxed or isolated process |
| Local development | Local, mutable source | Developer/Creator policy only |
| Quarantined | Unknown, failed or revoked provenance | Inspect only; no activation |

## Autonomous extension

An Agent may discover plugins through DSH community sources, compare candidates, inspect source and propose installation. Policy determines whether it may proceed automatically. Installation always produces a Change Set containing source identity, version, permissions, dependency changes, scripts/native code, expected filesystem changes, verification and rollback information.
