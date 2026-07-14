# Advanced Cache Management (`--cache-to` / `--cache-from`)

**The core problem:** cloud CI/CD environments (GitHub Actions, GitLab CI) spawn
entirely fresh, blank virtual runners for every commit. Local layer caching from
your laptop is completely lost, which blows up build times.

## Registry cache backend

Ship build layers directly to your container registry as a dedicated cache
artifact, so any clean CI worker can pull it down before building:
```bash
docker buildx build \
  --cache-to=type=registry,ref=myrepo/myapp:cache,mode=max \
  --cache-from=type=registry,ref=myrepo/myapp:cache \
  -t myrepo/myapp:latest --push .
```

## GitHub Actions cache backend (`type=gha`)

Uses GitHub's high-speed internal runner cache storage instead of a registry:
```bash
docker buildx build \
  --cache-to=type=gha,mode=max \
  --cache-from=type=gha \
  -t myapp:1.0 --push .
```
See `.github/workflows/docker-build.yml` in this repo for a working example.

## Cache modes: `min` vs `max`

| Mode | What gets cached |
|---|---|
| `min` | Only the layers that end up in the **final** exported stage |
| `max` | Every intermediate layer across **all** stages in a multi-stage build |

`mode=max` is almost always what you want for multi-stage Dockerfiles — otherwise
your `builder` stage's dependency-install layer won't be cached, and every CI run
re-downloads and re-compiles everything.
