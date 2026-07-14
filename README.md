# 🐳 Docker Mastery — 7-Day Sprint (Beginner → Expert)

A hands-on, ready-to-clone repository that takes you from **Docker beginner →
production-grade Dockerfile author** across seven focused, incrementally
harder days. Every concept has a runnable example. Every example builds and
runs.

Use this repo as a personal workshop: fork/clone it, `cd` into any example
folder, and actually run `docker build` / `docker run`. Muscle memory beats
theory.

## 📁 Repository Structure

```
docker-mastery/
├── day-1/   Foundations              — mental model, core instructions
├── day-2/   First images & caching   — 3 runnable starter apps, layer caching, .dockerignore
├── day-3/   Multi-stage builds I     — Go, Node.js
├── day-4/   Multi-stage builds II    — React, Java/Spring Boot, BuildKit power features
├── day-5/   Security hardening       — non-root, secrets management, distroless/Chainguard
├── day-6/   Production readiness     — healthchecks, entrypoints, read-only/rootless, CVE scanning, capstone Dockerfile
├── day-7/   Scale & CI/CD            — multi-platform builds, remote build cache, final expert checklist
├── reference/
│   └── BASE_IMAGES_DEPENDENCY_BREAKDOWN.md   # ⭐ full OS lineage + asset path map for every common base image
├── .github/workflows/docker-build.yml        # CI that builds every example
├── .dockerignore
└── LICENSE
```

## 🚀 Quick Start

```bash
git clone https://github.com/<your-username>/docker-mastery.git
cd docker-mastery

# Day 1, first runnable example — static site with nginx
cd day-2/01-first-images/nginx-static
docker build -t my-site .
docker run -p 8080:80 my-site
```

## 🗓️ The 7 Days

| Day | Focus | What you'll be able to do by end of day |
|---|---|---|
| **1** | Foundations | Explain image vs container vs layer; know every core Dockerfile instruction; know `CMD` vs `ENTRYPOINT` cold |
| **2** | First images & caching | Build & run 3 real apps (nginx, Flask, Node); order instructions for cache-friendly builds; write a correct `.dockerignore` |
| **3** | Multi-stage I | Write a multi-stage Dockerfile for a compiled Go binary and a built Node.js app |
| **4** | Multi-stage II | Write a multi-stage Dockerfile for a React SPA (served by nginx) and a Java/Spring Boot app; use BuildKit cache mounts |
| **5** | Security hardening | Run as non-root; keep secrets out of image layers with `--mount=type=secret`; choose distroless/Chainguard bases |
| **6** | Production readiness | Add `HEALTHCHECK`s, write signal-safe entrypoints, run read-only/rootless, scan images for CVEs, assemble a full production Dockerfile |
| **7** | Scale & CI/CD | Build multi-platform images with `buildx`, wire up registry/GitHub Actions build caching, self-review with the expert checklist |

Each `day-N/` folder has its own topic files (numbered `01-`, `02-`, ...) plus
runnable example folders where relevant. Read in order — later days assume
you've done the earlier ones.

## 🧭 Where to look depending on what you need right now

| I want to... | Go to |
|---|---|
| Understand what an image/container/layer actually is | `day-1/01-mental-model.md` |
| Know when to use `COPY` vs `ADD`, `CMD` vs `ENTRYPOINT` | `day-1/02-core-instructions.md` |
| See why instruction order affects the build cache | `day-2/02-layer-caching.md` |
| Build a container for Go or Node.js | `day-3/` |
| Build a container for React or Java/Spring Boot | `day-4/` |
| Stop secrets from leaking into image layers | `day-5/02-secrets-management.md` |
| Ship the smallest, most locked-down possible image | `day-5/03-distroless-chainguard.md` |
| Add graceful shutdown / healthchecks to a service | `day-6/01-healthchecks.md` |
| Scan an image for CVEs before shipping | `day-6/03-vulnerability-scanning.md` |
| Build one image for both Apple Silicon and cloud x86 | `day-7/01-multi-platform-builds.md` |
| Speed up CI builds with remote caching | `day-7/02-cache-management.md` |
| Know exactly which base image to `FROM` and where files land inside it | `reference/BASE_IMAGES_DEPENDENCY_BREAKDOWN.md` |

## 🏁 The real test of mastery

Pick a side project (or a toy app) in a language you know, and write its
Dockerfile from scratch using `day-7/03-expert-checklist.md` — without
looking at these examples. That's the actual test of "expert level."

## License
MIT — see `LICENSE`. Use this freely for learning, teaching, or as an internal team onboarding doc.
