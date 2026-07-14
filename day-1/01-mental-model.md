# 1. Mental Model First

Before writing a single Dockerfile line, get these three concepts fixed in your head. Everything else in this repo builds on them.

## Image vs Container vs Layer

- **Image** — a read-only template made of stacked, immutable layers. It's the "class" if containers are "instances."
- **Container** — a running (or stopped) instance of an image: the image's layers plus one thin writable layer on top, plus a running process.
- **Dockerfile** — the recipe used to build an image, instruction by instruction.
- **Layer** — every instruction that changes the filesystem (`RUN`, `COPY`, `ADD`, ...) creates a new layer. Layers are cached and reused across builds. **This caching behavior is the single most important fact for writing efficient Dockerfiles** — see `04-layer-caching.md`.

## The core loop

```bash
docker build  -t myapp:1.0 .          # build image from Dockerfile in current dir
docker run    -p 8080:8080 myapp:1.0  # run a container from that image
docker images                         # list images on this machine
docker ps -a                          # list containers (running + stopped)
docker logs <container>               # see stdout/stderr of a container
docker exec -it <container> sh        # shell into a running container
```

## Mental checklist before you build anything

1. What's the **smallest base image** that can run my app?
2. What changes **often** (my source code) vs **rarely** (my dependencies, my OS packages)? Order instructions accordingly.
3. Do I need build tools in the **final** image, or only during build? (→ multi-stage, Day 2)
4. What should **not** end up in the image? (→ `.dockerignore`, secrets handling)

Keep these four questions in mind for every Dockerfile you write in this repo — and in production.
