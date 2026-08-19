# Security policy

TaiChiOS is pre-release software and currently provides no production security SLA. Please do not publish a suspected vulnerability before maintainers have had a reasonable opportunity to assess it.

Report vulnerabilities privately through GitHub Security Advisories for `PlutoKeating/TaiChiOS`. Include the affected commit, reproduction, impact, whether untrusted plugin or prompt input is involved, and any suggested mitigation.

Particularly sensitive areas include plugin installation, signature/provenance handling, capability grants, `--yolo` authorization, Secret Service, Provider credentials, sandbox escape, Guardian/recovery bypass, and update rollback.

The working threat model is maintained in [docs/security/threat-model.md](./docs/security/threat-model.md). Community plugin listings are discovery services and are not TaiChiOS security endorsements.

