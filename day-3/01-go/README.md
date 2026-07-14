# Go — multi-stage build

```bash
docker build -t go-demo .
docker run -p 8080:8080 go-demo
```
Final image: a few MB. No Go toolchain, no source code shipped — just the compiled static binary.
