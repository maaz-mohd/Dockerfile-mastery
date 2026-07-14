# Google "Distroless" and Chainguard/Wolfi Images

**The core problem:** traditional OS base images (Ubuntu, Debian) or even minimal
distros (Alpine) ship interactive shells, package managers, and text editors. If
your app is ever breached, an attacker inherits a ready-made hacking environment
inside your own container.

## The philosophy of "no shell"

A distroless image contains **only** your runtime application and its immediate
system library dependencies — no `/bin/sh`, no `/bin/bash`, no `apt`/`apk`.

```dockerfile
FROM gcr.io/distroless/nodejs20-debian12
COPY --from=builder /app /app
WORKDIR /app
CMD ["server.js"]
```
Common distroless variants: `gcr.io/distroless/static` (for Go/Rust static
binaries), `gcr.io/distroless/base`, `gcr.io/distroless/nodejsNN-debian12`,
`gcr.io/distroless/python3-debian12`, `gcr.io/distroless/java21-debian12`.

## Debugging a shell-less production container

You can't `docker exec -it mycontainer sh` — there's no shell to exec into. Instead:
- **Kubernetes**: `kubectl debug` to attach an ephemeral debug container with a
  full toolset, sharing the target's process namespace.
- **Plain Docker**: attach a separate debug/sidecar container that shares the
  target container's network and/or PID namespace (`docker run --pid=container:<id> --network=container:<id> busybox`).
- Distroless images tagged `:debug` (where available) include BusyBox for
  one-off local debugging — never ship the `:debug` tag to production.

## Wolfi / Chainguard ecosystem

Chainguard builds a parallel set of minimal, security-hardened images on the
**Wolfi** Linux distro (`apk`-based like Alpine, but glibc instead of musl,
and built specifically for supply-chain security). Chainguard markets a
"Zero-CVE" baseline: images are rebuilt continuously to stay ahead of newly
disclosed CVEs, and each ships a signed SBOM by default.

```dockerfile
FROM cgr.dev/chainguard/node:latest AS runner
```
Trade-off versus classic distroless: Chainguard images update very
frequently, so pin digests (`@sha256:...`) rather than floating tags if you
need build reproducibility.
