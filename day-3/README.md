# Day 3 — Multi-Stage Builds I (Go, Node.js)

**Goal:** write a multi-stage Dockerfile that separates build tooling from
the shipped runtime, for both a compiled language (Go) and an interpreted one
with a build step (Node.js).

1. [`00-multi-stage-intro.md`](./00-multi-stage-intro.md) — why multi-stage, and the pattern
2. [`01-go/`](./01-go/) — compiled binary, tiny final image
3. [`02-node/`](./02-node/) — build stage + slim production runtime

End of day: [`checklist.md`](./checklist.md)
