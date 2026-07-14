# 4. Layer Caching — the concept that separates beginners from everyone else

Docker caches each layer. If a layer's instruction plus its inputs haven't changed, Docker reuses the cached layer instead of re-running it.

```dockerfile
# BAD - any code change invalidates the cache, forcing a full npm install every build
COPY . .
RUN npm install

# GOOD - dependency install only re-runs when package.json actually changes
COPY package*.json ./
RUN npm install
COPY . .
```

**Rule: order instructions from least-frequently-changed to most-frequently-changed.**

```
base image  →  system deps  →  dependency manifests  →  dependency install  →  app code
```

Every example under `day-2/01-first-images/` and `day-3/ and day-4/` follows this ordering — go check.

## Quick way to prove it to yourself

```bash
cd day-2/01-first-images/node-api
docker build -t cache-demo .        # first build - everything runs
touch index.js                       # change only app code, not package.json
docker build -t cache-demo .        # second build - "npm install" layer is CACHED
```
You'll see `CACHED` next to the `RUN npm install` step in the build output on the second run.
