# Base Image Dependency Breakdown

A field reference for the container base images a DevOps engineer touches
day-to-day: what OS each one actually descends from, what C library and
package manager it uses, and where things live inside the filesystem once
you're in the container. Use this when deciding `FROM` and when writing
`COPY --from=builder <path>` lines.

> Paths below are the conventional/default locations for each image family as
> published on Docker Hub at the time of writing. Always verify against the
> specific tag you pin, since maintainers occasionally relocate things across
> major versions.

---

## 1. Root Operating System Bases

### `ubuntu` (e.g. `ubuntu:22.04`, `ubuntu:24.04`)
- **Lineage**: Canonical's Ubuntu, itself derived from Debian.
- **libc**: glibc
- **Package manager**: `apt` / `apt-get` (dpkg underneath)
- **Shell**: `/bin/bash` (also `/bin/sh` → dash)
- **Key paths**: `/etc/apt/sources.list`, `/var/lib/apt/lists`, `/usr/bin`, `/usr/local/bin` (for manually installed binaries)
- **Typical size**: ~78 MB compressed
- **When to use**: when you need broad package availability or specific Ubuntu-only tooling (e.g. `ppa`s). Otherwise usually oversized for a runtime image.

### `debian` (e.g. `debian:12-slim`, `debian:bookworm-slim`)
- **Lineage**: Debian stable directly (Ubuntu itself is downstream of this).
- **libc**: glibc
- **Package manager**: `apt` / `apt-get`
- **Key paths**: same layout as Ubuntu (`/etc/apt`, `/usr/bin`, `/usr/local/bin`)
- **Typical size**: `slim` variant ~74 MB; full ~124 MB
- **When to use**: the most common "just works with glibc" base for language runtime images (`node`, `python`, `golang`, `ruby` all publish Debian-based variants). Prefer `-slim` tags for smaller footprint while keeping `apt`.

### `alpine` (e.g. `alpine:3.19`)
- **Lineage**: Alpine Linux — independent, security-oriented, NOT Debian-derived.
- **libc**: **musl** (not glibc — this matters: some compiled binaries/wheels
  built against glibc will silently fail or need `gcompat`/rebuild on Alpine)
- **Package manager**: `apk`
- **Shell**: `/bin/sh` (BusyBox ash — no bash by default, `apk add bash` if needed)
- **Key paths**: `/etc/apk/repositories`, `/usr/local/bin`
- **Typical size**: ~5-7 MB
- **When to use**: default choice for minimal runtime images across almost
  every language family (`node:alpine`, `python:alpine`, `golang:alpine` as a
  builder, etc.) — just watch for musl-related native-module compatibility
  issues (common with Python/Node native addons).

### `scratch`
- **Lineage**: literally empty — zero OS, zero filesystem, zero shell, zero libc.
- **Package manager**: none
- **Key paths**: whatever you `COPY` into it — nothing exists by default, not even `/tmp` or `ca-certificates`.
- **When to use**: final stage for **statically linked** binaries only (Go with
  `CGO_ENABLED=0`, Rust with `musl` target, C with static linking). You must
  manually `COPY --from=builder /etc/ssl/certs/ca-certificates.crt` if your
  binary makes HTTPS calls.

### `busybox`
- **Lineage**: independent minimal userland (single multi-call binary providing `ls`, `cp`, `sh`, etc.)
- **libc**: musl
- **Package manager**: none (it's not really a distro, just a toolbox)
- **When to use**: debug sidecars, or as a tiny base when you need a shell but not a package manager.

---

## 2. "Distroless" and Hardened Bases

### `gcr.io/distroless/*` (e.g. `gcr.io/distroless/base-debian12`, `.../nodejs20-debian12`, `.../python3-debian12`, `.../java21-debian12`, `.../static-debian12`)
- **Lineage**: built from a **Debian 12 (bookworm)** package snapshot, but with
  the shell, package manager, and everything except the runtime + its direct
  library dependencies stripped out.
- **libc**: glibc (except `distroless/static`, which has none — for fully static binaries)
- **Package manager**: none at runtime (images are assembled by Google's `distroless` build tooling, not `apt`, at build time)
- **Key paths**: language runtimes are typically pre-installed at conventional
  locations mirroring their upstream Debian packages, e.g. Node under
  `/nodejs/bin/node`, Python under `/usr/bin/python3.x`; your app code is
  whatever you `COPY --from=builder` in — commonly `/app`.
- **When to use**: production runtime stage for any compiled or interpreted
  app where you want minimum attack surface and don't need in-container
  debugging via shell.

### `cgr.dev/chainguard/*` (Chainguard Images, built on Wolfi)
- **Lineage**: **Wolfi** — an independent, Alpine-like (`apk`-based) Linux
  *designed for containers*, but using **glibc** (unlike Alpine's musl).
- **libc**: glibc
- **Package manager**: `apk` (build-time only; most runtime images ship without it)
- **Key paths**: convention-dependent per image, generally `/usr/bin`, app copied to `/app` or `/work`
- **When to use**: same use case as distroless, with continuous rebuild
  against a "Zero-CVE" baseline and signed SBOMs. Pin by digest for reproducibility since tags move fast.

---

## 3. Language / Runtime Images

### `node` (Node.js) — Docker Hub official image
- **Variant lineage**:
  - `node:20` → Debian (bookworm) + glibc
  - `node:20-slim` → Debian slim + glibc
  - `node:20-alpine` → Alpine + musl
- **Binary location**: `/usr/local/bin/node`, `/usr/local/bin/npm`
- **Global modules**: `/usr/local/lib/node_modules`
- **Convention for your app**: `WORKDIR /app`, app code and `node_modules` under `/app`
- **Non-root user shipped**: `node` (uid 1000) — usable via `USER node`

### `python` — Docker Hub official image
- **Variant lineage**:
  - `python:3.12` → Debian (bookworm) + glibc
  - `python:3.12-slim` → Debian slim + glibc
  - `python:3.12-alpine` → Alpine + musl (⚠️ many compiled wheels — numpy, psycopg2, cryptography — need a rebuild or `gcc`/`musl-dev` here; `-slim` is often less painful)
- **Binary location**: `/usr/local/bin/python3`, `/usr/local/bin/pip`
- **Site packages**: `/usr/local/lib/python3.x/site-packages`
- **Convention for your app**: `WORKDIR /app`

### `golang` (build-time image only — never ship this to production)
- **Lineage**: `golang:1.22` → Debian (bookworm) + glibc; `golang:1.22-alpine` → Alpine + musl
- **Toolchain location**: `/usr/local/go/bin/go`
- **GOPATH/module cache**: `/go` (`GOPATH=/go` by default in the image)
- **Convention**: build in this image, `COPY --from=builder /app-binary` into `alpine`, `distroless/static`, or `scratch` for the runtime stage (see `day-3/01-go/Dockerfile`)

### `eclipse-temurin` (OpenJDK — successor to the deprecated `openjdk` official image)
- **Variant lineage**:
  - `eclipse-temurin:21` → Ubuntu-based + glibc
  - `eclipse-temurin:21-jre` → JRE-only variant, still Ubuntu-based
  - `eclipse-temurin:21-jre-alpine` → Alpine + musl
- **Install location**: `/opt/java/openjdk` (`JAVA_HOME` points here)
- **Binary**: `/opt/java/openjdk/bin/java`
- **Convention for your app**: `WORKDIR /app`, jar copied to `/app/app.jar`

### `maven` (build-time image only)
- **Lineage**: `maven:3.9-eclipse-temurin-21` → layers Maven on top of the corresponding `eclipse-temurin` JDK image (same OS lineage as above)
- **Local repo cache**: `/root/.m2/repository` (mount this as a BuildKit cache: `--mount=type=cache,target=/root/.m2`)
- **Convention**: build the fat jar here, then `COPY --from=builder /app/target/*.jar` into a `-jre` runtime stage

### `nginx` — Docker Hub official image
- **Variant lineage**: `nginx:1.27` → Debian + glibc; `nginx:1.27-alpine` → Alpine + musl
- **Main config**: `/etc/nginx/nginx.conf`
- **Site/server configs**: `/etc/nginx/conf.d/default.conf` (Debian variant), `/etc/nginx/conf.d/` (Alpine)
- **Static content root**: `/usr/share/nginx/html`
- **Logs**: `/var/log/nginx/access.log`, `/var/log/nginx/error.log` (symlinked to stdout/stderr by default in the official image)

### `postgres` — Docker Hub official image
- **Variant lineage**: `postgres:16` → Debian + glibc; `postgres:16-alpine` → Alpine + musl
- **Data directory**: `/var/lib/postgresql/data` (mount your persistent volume here — `PGDATA` env var controls this)
- **Config files**: generated into the data directory on first init (`postgresql.conf`, `pg_hba.conf` live inside `/var/lib/postgresql/data` unless overridden)
- **Binaries**: `/usr/lib/postgresql/<version>/bin`
- **Init scripts hook**: drop `.sh`/`.sql` files into `/docker-entrypoint-initdb.d/` to run on first container start

### `redis` — Docker Hub official image
- **Variant lineage**: `redis:7` → Debian + glibc; `redis:7-alpine` → Alpine + musl
- **Data directory**: `/data` (mount your persistent volume here)
- **Config**: `/usr/local/etc/redis/redis.conf` (not present by default — you supply it and pass `redis-server /usr/local/etc/redis/redis.conf`)
- **Binary**: `/usr/local/bin/redis-server`

### `mysql` / `mariadb` — Docker Hub official images
- **Lineage**: Debian-based (Oracle Linux variants also published for `mysql`) + glibc
- **Data directory**: `/var/lib/mysql`
- **Config**: `/etc/mysql/my.cnf` and `/etc/mysql/conf.d/*.cnf`
- **Init scripts hook**: `/docker-entrypoint-initdb.d/`

### `ruby` — Docker Hub official image
- **Variant lineage**: `ruby:3.3` → Debian + glibc; `ruby:3.3-alpine` → Alpine + musl
- **Gem install path**: `/usr/local/bundle` (when using Bundler with `BUNDLE_PATH` set this way) or `/usr/local/lib/ruby/gems/<version>`
- **Binary**: `/usr/local/bin/ruby`, `/usr/local/bin/bundle`

### `.NET` (`mcr.microsoft.com/dotnet/sdk`, `.../aspnet`, `.../runtime`)
- **Lineage**: Debian-based (also Alpine and Ubuntu Chiseled variants published)
- **SDK vs runtime split** mirrors the Java Maven/JRE pattern: build with `dotnet/sdk:8.0`, ship with `dotnet/aspnet:8.0` (ASP.NET runtime only) or `dotnet/runtime:8.0` (console apps)
- **Install location**: `/usr/share/dotnet`
- **Convention for your app**: `WORKDIR /app`, published output copied to `/app` via `dotnet publish -o /app`

---

## 4. Quick-Reference Comparison Table

| Image | OS Lineage | libc | Pkg Manager | Typical App Path | Approx. Base Size |
|---|---|---|---|---|---|
| `ubuntu` | Ubuntu (from Debian) | glibc | apt | `/usr/local/bin` | ~78 MB |
| `debian:*-slim` | Debian | glibc | apt | `/usr/local/bin` | ~74 MB |
| `alpine` | Alpine Linux | musl | apk | `/usr/local/bin` | ~5-7 MB |
| `scratch` | none | none | none | wherever you `COPY` to | 0 MB |
| `busybox` | independent | musl | none | `/bin` | ~1-5 MB |
| `distroless/*` | Debian 12 snapshot, stripped | glibc (or none for `static`) | none | `/app` (convention) | ~2-20 MB |
| `chainguard/*` (Wolfi) | Wolfi | glibc | apk (build-time) | image-specific | ~5-15 MB |
| `node:*` | Debian or Alpine | glibc/musl | apt/apk | `/app` (convention) | 40-180 MB |
| `python:*` | Debian or Alpine | glibc/musl | apt/apk | `/app` (convention) | 45-950 MB (full `python:3.12` is large; use `-slim`) |
| `golang:*` (builder only) | Debian or Alpine | glibc/musl | apt/apk | `/go`, `/src` | 300-800 MB (never ship) |
| `eclipse-temurin:*-jre` | Ubuntu or Alpine | glibc/musl | apt/apk | `/app` (convention) | 80-200 MB |
| `nginx:*` | Debian or Alpine | glibc/musl | apt/apk | `/usr/share/nginx/html` | 20-140 MB |
| `postgres:*` | Debian or Alpine | glibc/musl | apt/apk | `/var/lib/postgresql/data` | 80-230 MB |
| `redis:*` | Debian or Alpine | glibc/musl | apt/apk | `/data` | 30-115 MB |

---

## 5. Practical decision guide

1. **Building/compiling?** Use the full (non-slim, non-alpine) or `-slim` Debian
   variant of your language's official image as the `builder` stage — best
   compatibility with native compiled dependencies.
2. **Shipping an interpreted-language runtime** (Node/Python/Ruby)? Prefer
   `-slim` (glibc, smaller than full) unless every dependency is confirmed
   musl-compatible, in which case `-alpine` is smaller still.
3. **Shipping a statically compiled binary** (Go, Rust)? Go straight to
   `scratch` or `distroless/static` — you don't need an OS at all, just
   `ca-certificates` if you make HTTPS calls.
4. **Need absolute minimum CVE surface and don't need in-container shell
   debugging?** Use `distroless` or Chainguard/Wolfi images.
5. **Need `apt`/`apk` for install-time flexibility but small final size?**
   `-slim` (Debian) or `-alpine`, keeping in mind the musl compatibility caveat.
