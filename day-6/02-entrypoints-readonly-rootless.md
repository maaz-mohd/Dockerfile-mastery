# Advanced Entrypoints, Read-Only Filesystems, and Rootless Docker

Three "real-time" production hardening topics worth having on your radar once
you're deploying at scale.

## Advanced entrypoint patterns (dynamic wrappers)

Write a shell script as your `ENTRYPOINT` that reads environment variables at
boot, renders/modifies config files on the fly, then hands off to your real
app using `exec` — critical so your app becomes PID 1 and can receive signals
directly, instead of the wrapper script swallowing them.

```dockerfile
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
```
```bash
#!/bin/sh
# entrypoint.sh
set -e
envsubst < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf
exec nginx -g "daemon off;"
```
The `exec` at the end is the important part — without it, `nginx` runs as a
child process of the shell, and the shell (not nginx) receives `SIGTERM`.

## Read-only root filesystems

Run containers with an immutable root filesystem so a compromised app can
never write files to disk (blocking a whole class of script-injection /
persistence attacks):
```bash
docker run --read-only --tmpfs /tmp --tmpfs /var/run myapp:1.0
```
Anything your app genuinely needs to write (temp files, sockets, PID files)
gets an explicit `--tmpfs` mount or a named volume — never the whole
filesystem writable by default.

## Rootless Docker

Runs the Docker **daemon itself** inside an unprivileged user account rather
than as root on the host. This is different from `USER` in a Dockerfile
(which only affects the process *inside* the container) — rootless mode adds
a defense-in-depth barrier so that even a full container-engine compromise
doesn't hand an attacker root on the host.
```bash
dockerd-rootless-setuptool.sh install
```
Trade-offs: some networking modes and low-numbered port binding (`<1024`)
need extra configuration under rootless mode.
