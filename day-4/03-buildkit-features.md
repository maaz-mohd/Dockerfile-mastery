# 9. BuildKit Power Features

Enable BuildKit (default in modern Docker, but be explicit):
```bash
DOCKER_BUILDKIT=1 docker build .
```

## Cache mounts

Persist package manager caches across builds without baking them into layers:
```dockerfile
RUN --mount=type=cache,target=/root/.npm \
    npm install
```
This is different from layer caching — the cache mount survives even when the layer
itself gets invalidated (e.g. because source files changed), so repeated installs
after a dependency bump are still fast.

## Multi-platform builds

Build for ARM + x86 from one machine — needed for Apple Silicon dev machines / ARM
cloud instances:
```bash
docker buildx build --platform linux/amd64,linux/arm64 -t myapp:1.0 --push .
```
Full deep-dive: `day-7/01-multi-platform-builds.md`.

## Remote build caching (CI/CD)

```bash
docker buildx build \
  --cache-to=type=registry,ref=myrepo/myapp:cache,mode=max \
  --cache-from=type=registry,ref=myrepo/myapp:cache \
  -t myapp:1.0 --push .
```
Full deep-dive: `day-7/02-cache-management.md`.
