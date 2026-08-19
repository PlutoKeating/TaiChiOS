---
status: accepted
---

# Use a Monorepo and spiral delivery

TaiChiOS keeps distribution configuration, system capabilities, schemas, Profiles, Bundles, tools, and acceptance tests in one repository so a full operating-system change can evolve atomically. Development proceeds in spiral increments: establish the complete boundary, contract, verification, and recovery scaffold for a scope before implementing its smallest end-to-end loop, reducing throwaway integration work while retaining a fast release cadence.

