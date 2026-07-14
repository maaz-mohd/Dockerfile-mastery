# 2. The Core Instructions

Work through these hands-on — don't just read them. Try each one in a scratch Dockerfile.

## `FROM` — base image, always the first instruction
```dockerfile
FROM ubuntu:22.04
```
Pick the smallest base that gets the job done. Common choices: `alpine` (~5MB), `-slim` variants, `distroless` (advanced — see `day-5/03-distroless-chainguard.md`). Full breakdown of every common base image family: `reference/BASE_IMAGES_DEPENDENCY_BREAKDOWN.md`.

## `RUN` — execute a command at build time
```dockerfile
RUN apt-get update && apt-get install -y curl
```
Chain commands with `&&` in one `RUN`. Each separate `RUN` is its own layer — you don't want a layer that just ran `apt-get update` sitting around stale forever.

## `WORKDIR` — sets the working directory (like `cd`, but persists)
```dockerfile
WORKDIR /app
```

## `COPY` — copy files from build context into the image
```dockerfile
COPY package.json .
COPY . .
```

## `ADD` — like `COPY`, plus auto-extracts tarballs and can fetch URLs
```dockerfile
ADD app.tar.gz /app
```
Rule of thumb: prefer `COPY` unless you specifically need `ADD`'s extraction/URL behavior. It's more predictable and auditable.

## `ENV` — environment variable, available at build and runtime
```dockerfile
ENV NODE_ENV=production
```

## `ARG` — build-time-only variable, gone at runtime
```dockerfile
ARG APP_VERSION=1.0
RUN echo "Building version $APP_VERSION"
```

## `EXPOSE` — documentation only
It does not publish the port — that's `-p` on `docker run`.
```dockerfile
EXPOSE 8080
```

## `CMD` vs `ENTRYPOINT` — learn this cold today

| | Purpose | Overridable at `docker run`? |
|---|---|---|
| `CMD` | Default command/args | Yes — fully replaced |
| `ENTRYPOINT` | Fixed command | No — args after it get appended |

```dockerfile
# CMD alone - fully replaceable
CMD ["node", "server.js"]
# docker run myapp         -> runs node server.js
# docker run myapp echo hi -> runs echo hi (CMD ignored)

# ENTRYPOINT + CMD (best pattern) - ENTRYPOINT fixed, CMD = default args
ENTRYPOINT ["node"]
CMD ["server.js"]
# docker run myapp            -> node server.js
# docker run myapp worker.js  -> node worker.js
```

Always use exec form (`["cmd", "arg"]`) not shell form (`CMD node server.js`). Exec form avoids spawning an extra shell and properly forwards signals like `SIGTERM` — critical for graceful shutdown in production.

## `LABEL`, `USER`, `VOLUME`
```dockerfile
LABEL maintainer="you@example.com" version="1.0"
USER node          # don't run as root - see day-5/01-security-hardening.md
VOLUME /data        # marks a mount point for persistent data
```
