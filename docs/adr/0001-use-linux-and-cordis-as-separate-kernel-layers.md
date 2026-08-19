---
status: accepted
---

# Separate the Linux kernel from the Cordis userspace composition kernel

TaiChiOS uses Linux for hardware, process, memory, driver, and mandatory security boundaries, while Cordis owns userspace capability composition and reversible plugin lifecycles. Replacing Linux with Cordis would require a rewrite, lose mature driver and isolation infrastructure, and confuse logical Context isolation with a hardware security boundary.

