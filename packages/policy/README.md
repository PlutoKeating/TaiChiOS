# Policy

Capability grants, operating modes, approval decisions, resource budgets and explicit override semantics.

`PolicyEngine.authorize()` is the current public seam. It resolves identity and resource-scoped capability grants before evaluating confirmation. Guarded mode requires confirmation; Creator and YOLO may suppress it only after authorization succeeds. No mode grants a missing capability.
