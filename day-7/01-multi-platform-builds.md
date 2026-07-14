# Multi-Platform Architecture (`docker buildx`)

**The core problem:** silently shipping an image built on an Apple Silicon
laptop (ARM64) to an Intel/AMD cloud server (AMD64) results in an instant
deployment crash (`exec format error`).

## The Docker manifest list

A single tag (e.g. `myapp:v1.0`) can point to an array of different
underlying architecture images at once. The Docker/container runtime on the
target machine automatically pulls the correct architecture variant — you
never need `myapp:v1.0-arm64` as a separate tag your deploy tooling has to know about.

## Buildx drivers

`docker buildx` uses pluggable drivers. The `docker-container` driver spins up
a dedicated BuildKit builder container capable of cross-compilation via QEMU
emulation, so you can build ARM images on an x86 CI runner (or vice versa).

```bash
docker buildx create --name multiplatform-builder --use
docker buildx inspect --bootstrap
```

## Building for multiple architectures at once

```bash
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t myrepo/myapp:1.0 \
  --push .
```
`--push` is required for multi-platform builds (you can't `docker load` more
than one platform locally at a time). Buildx builds each platform in
parallel and assembles them into a single manifest list under one tag.

## Practical checklist

- [ ] Base images you depend on actually publish `arm64` variants (most official images do)
- [ ] Native/compiled dependencies (e.g. `node-gyp` packages, Go cgo) are cross-compile-safe or built per-arch
- [ ] CI runner has `docker buildx` and QEMU set up (`docker/setup-qemu-action` + `docker/setup-buildx-action` on GitHub Actions)
