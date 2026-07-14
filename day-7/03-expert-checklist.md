# Expert-Level Checklist — review every Dockerfile you write against this

- [ ] Multi-stage build separating build tools from runtime
- [ ] Smallest sensible base image (alpine/slim/distroless), version pinned
- [ ] Dependency install layered before app code copy (cache-friendly order)
- [ ] `.dockerignore` present and correct
- [ ] Runs as non-root `USER`
- [ ] No secrets in `ARG`/`ENV`/layers — use `--mount=type=secret`
- [ ] Exec-form `CMD`/`ENTRYPOINT` for proper signal handling
- [ ] `HEALTHCHECK` defined for services
- [ ] Image scanned for CVEs before shipping
- [ ] Final image size checked (`docker images`) — should be minimal
