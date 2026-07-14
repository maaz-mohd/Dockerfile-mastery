# 8. Security Hardening — what "expert" actually means in practice

## Never run as root

```dockerfile
RUN addgroup -S app && adduser -S app -G app
USER app
```
Official images like `node`, `postgres` often already ship a non-root user you can just `USER node`.

## Don't leak secrets into layers

Classic mistake:
```dockerfile
# BAD - secret gets baked into image history, extractable forever
ARG API_KEY
RUN curl -H "Authorization: $API_KEY" https://...
```

Use BuildKit secret mounts instead — the secret is available only during that `RUN`, never persisted in a layer:
```dockerfile
# syntax=docker/dockerfile:1
RUN --mount=type=secret,id=api_key \
    API_KEY=$(cat /run/secrets/api_key) curl -H "Authorization: $API_KEY" https://...
```
```bash
docker build --secret id=api_key,src=./secret.txt .
```
Full deep-dive: `day-5/02-secrets-management.md`.

## Use distroless for maximum minimalism

No shell, no package manager — smallest possible attack surface:
```dockerfile
FROM gcr.io/distroless/nodejs20-debian12
COPY --from=builder /app /app
WORKDIR /app
CMD ["server.js"]
```
Full deep-dive: `day-5/03-distroless-chainguard.md`.

## Pin versions

Never use `latest` in anything meant for production:
```dockerfile
FROM node:20.14.0-alpine3.19   # not `node:latest`
```

## Scan your images

```bash
docker scout cves myapp:1.0
# or:
trivy image myapp:1.0
```
Full deep-dive: `day-6/03-vulnerability-scanning.md`.
