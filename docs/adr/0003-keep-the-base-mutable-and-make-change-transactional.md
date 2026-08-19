---
status: accepted
---

# Keep the installed base mutable and make managed change transactional

TaiChiOS does not impose an immutable root filesystem because explicit owner control and system experimentation are product requirements. Managed installation, upgrade, and profile changes instead use inspectable Change Sets with Dry Run, candidate activation, verification, Rollback Points, and an independent recovery path; authorized Creator or YOLO operation may deliberately bypass safeguards without disguising the risk.

