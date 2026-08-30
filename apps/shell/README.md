# TaiChi Shell

The replaceable interface selector and session entry point. `/usr/local/bin/taichios-shell` launches the pinned dsh-TUI for an interactive login and falls back to a plain login shell if the TUI exits or is broken. Each Unix account owns a separate `$HOME/.dsh` profile tree; the system runtime is read-only under `/opt/taichios`.
