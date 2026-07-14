# Day 7 — Scale & CI/CD

**Goal:** make your images build correctly for every target architecture and
build fast in CI, then do a full self-review against the expert checklist.

1. [`01-multi-platform-builds.md`](./01-multi-platform-builds.md) — `docker buildx`, manifest lists, QEMU cross-compilation
2. [`02-cache-management.md`](./02-cache-management.md) — `--cache-to`/`--cache-from`, registry cache, GitHub Actions cache
3. [`03-expert-checklist.md`](./03-expert-checklist.md) — the final review checklist for every Dockerfile you write from now on

**Capstone:** pick a real (or toy) project and write its Dockerfile from
scratch using only `03-expert-checklist.md` as your guide — no looking back
at earlier days' examples. That's the actual test of mastery.
