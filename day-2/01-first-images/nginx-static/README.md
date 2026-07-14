# Example: Static site with nginx

```bash
docker build -t my-site .
docker run -p 8080:80 my-site
```
Visit http://localhost:8080
