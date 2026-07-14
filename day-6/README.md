# Day 6 — Production Readiness

**Goal:** take a Dockerfile from "builds and runs" to "safe to put behind a
load balancer" — graceful shutdown, health checks, minimal write access, and
a clean vulnerability scan — then assemble everything into one capstone
Dockerfile.

1. [`01-healthchecks.md`](./01-healthchecks.md) — `HEALTHCHECK`, exec-form signals, graceful shutdown
2. [`02-entrypoints-readonly-rootless.md`](./02-entrypoints-readonly-rootless.md) — dynamic entrypoint wrappers, `--read-only`, rootless Docker
3. [`03-vulnerability-scanning.md`](./03-vulnerability-scanning.md) — Trivy/Grype, CI quality gates, SBOMs
4. [`04-production-example/`](./04-production-example/) — every Day 1–6 technique combined into one real Dockerfile

End of day: [`checklist.md`](./checklist.md)
