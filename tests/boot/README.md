# Boot tests

QEMU boot, systemd readiness, console availability and profile-selection acceptance tests.

Installed readiness now also requires the independent Guardian to be active and both Harness supervisor instances to have reported readiness. Login availability remains a separate requirement so a Harness or Provider failure cannot remove the tty1 recovery path.
