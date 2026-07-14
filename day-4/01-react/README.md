# React SPA — build then serve via nginx

```bash
docker build -t react-demo .
docker run -p 8080:80 react-demo
```
`npm run build` output here is a minimal stand-in — swap in your real Create React
App / Vite / Next static export build command. The pattern (build stage → nginx
runner) stays the same.
