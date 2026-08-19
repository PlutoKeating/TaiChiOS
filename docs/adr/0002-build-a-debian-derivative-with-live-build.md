---
status: accepted
---

# Build an independent Debian derivative with Live installation media

TaiChiOS is built directly from Debian packages and sources as an independent derivative. It produces x86_64 Live media containing an installer that installs to disk and configures GRUB; Debian itself is referenced through reproducible repositories and source manifests rather than copied into `vendor/` or treated as a monorepo fork.

