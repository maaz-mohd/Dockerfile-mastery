# Node.js — multi-stage build

```bash
docker build -t node-demo .
docker run -p 3000:3000 node-demo
```
The `builder` stage runs `npm ci` (full deps) and a build step. The `runner` stage
reinstalls only production deps and copies just the build output — no dev
dependencies, no source TypeScript/bundler tooling, ships as non-root `node` user.
