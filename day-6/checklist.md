# End of Day 6 Checklist

- [ ] Every service Dockerfile I write has a `HEALTHCHECK`
- [ ] I use exec-form `CMD`/`ENTRYPOINT` everywhere for correct signal handling
- [ ] I've tried running a container with `--read-only --tmpfs /tmp`
- [ ] I've scanned an image with Trivy (or Grype/Docker Scout) at least once
- [ ] I've built and run the full production-example Dockerfile in `04-production-example/`
