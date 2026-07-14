# 11. Real-World "Put It All Together" Example

A production-grade Node.js API Dockerfile combining every technique from Day 2:
multi-stage build, BuildKit cache mounts, non-root user, exec-form entrypoint,
and a `HEALTHCHECK`.

```bash
DOCKER_BUILDKIT=1 docker build -t prod-demo .
docker run -p 3000:3000 prod-demo
```
