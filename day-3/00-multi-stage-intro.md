# Multi-Stage Builds — the single most important "expert" technique

**Problem:** build tools (compilers, dev dependencies) bloat your final image and are a security liability in production. Multi-stage builds let you use one stage to *build* and a clean second stage to *ship*.

Each language example (spread across today and tomorrow) is a complete,
runnable multi-stage Dockerfile. You can have as many stages as you want,
name them for reuse (`AS builder`), and selectively copy from any earlier
stage with `COPY --from=<stage>`.

| Where | Stack | Final base |
|---|---|---|
| `day-3/01-go/` | Go compiled binary | `alpine` (a few MB total) |
| `day-3/02-node/` | Node.js API with a build step | `node:20-alpine` (runtime only) |
| `day-4/01-react/` | React SPA | `nginx:alpine` |
| `day-4/02-java-spring/` | Java / Spring Boot | `eclipse-temurin:*-jre-alpine` |

Today (Day 3) covers Go and Node.js. Tomorrow (Day 4) covers React and
Java/Spring Boot, plus BuildKit's power features (cache mounts, etc.) that
make these builds fast in CI too.
