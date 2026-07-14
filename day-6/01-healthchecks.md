# 10. Healthchecks, Signals, and Graceful Shutdown

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
```

Combined with exec-form `CMD`/`ENTRYPOINT`, your app receives `SIGTERM` directly and
can shut down gracefully (close DB connections, finish in-flight requests) instead
of being hard-killed after the default 10-second grace period.

## Why exec form matters here

```dockerfile
# shell form - signals go to the shell, not your app
CMD node server.js

# exec form - signals go directly to your app's PID 1
CMD ["node", "server.js"]
```

For orchestrators (Kubernetes, ECS, Swarm), a working `HEALTHCHECK` / readiness
probe is what tells the platform your container is actually ready to receive
traffic — not just that the process started.
