# Compatibility tests

Pinned Cordis, DeepSeek Harness, Node.js, dsh-TUI and community plugin contract checks.

Run the current runtime gate from the repository root:

```sh
corepack yarn install:runtime
corepack yarn compat:runtime
```

The smoke gate verifies immutable inputs and licenses, official Cordis isolation, the DSH bundle patch contract, CLI startup, offline profile composition, and a real dsh-TUI boot in a pseudo-terminal. The TUI must remain alive until the test timeout without a Provider credential or network access.
