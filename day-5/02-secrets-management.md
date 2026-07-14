# Handling Secrets Safely in Docker

**The core problem:** traditional `ARG` and `ENV` parameters leak raw secrets
permanently into the immutable history layers of your built images — anyone with
`docker history` or access to the image can extract them, even after a later layer
"deletes" the file.

## BuildKit Secrets — `--mount=type=secret`

Exposes a temporary, in-memory file (an `.npmrc`, a private key, an API token) to a
single `RUN` command. It never touches a layer on disk.

```dockerfile
# syntax=docker/dockerfile:1
RUN --mount=type=secret,id=npm_token \
    NPM_TOKEN=$(cat /run/secrets/npm_token) npm publish
```
```bash
docker build --secret id=npm_token,src=./npm_token.txt .
```

## BuildKit SSH Forwarding — `--mount=type=ssh`

Forwards your local host's SSH agent directly into the builder so it can clone
private Git repos without ever copying a raw private key into the image.

```dockerfile
# syntax=docker/dockerfile:1
RUN --mount=type=ssh git clone git@github.com:you/private-repo.git
```
```bash
docker build --ssh default .
```

## Runtime vs. build-time secrets

- **Build-time**: only needed while compiling / installing dependencies (e.g. a
  private package registry token). Use `--mount=type=secret`.
- **Runtime**: needed by the running application (DB passwords, API keys). These
  should **never** be baked into the image at all — inject them at container start
  via your orchestrator: Kubernetes `Secret` objects mounted as files or env vars,
  AWS Secrets Manager / Parameter Store, Docker Swarm secrets, or `docker run -e`
  sourced from a secure vault, never a plaintext `.env` committed to git.

## Anti-patterns to avoid

```dockerfile
# NEVER do this - baked permanently into image history
ENV DB_PASSWORD=hunter2
ARG API_KEY=sk-abc123
COPY .env .
```
Even if a later `RUN rm .env` "deletes" the file, it's still recoverable from the
earlier layer.
