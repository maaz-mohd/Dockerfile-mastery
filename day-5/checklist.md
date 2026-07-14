# End of Day 5 Checklist

- [ ] Every Dockerfile I write from now on sets a non-root `USER`
- [ ] I know why `ARG`/`ENV` must never hold secrets, and I've tried `--mount=type=secret`
- [ ] I can explain the difference between build-time and runtime secrets
- [ ] I know when to reach for a distroless or Chainguard/Wolfi base instead of alpine/slim
