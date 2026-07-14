# Example: Python Flask app

```bash
docker build -t my-flask-app .
docker run -p 5000:5000 my-flask-app
```
Visit http://localhost:5000

Notice the pattern: copy `requirements.txt` first, install, THEN copy the rest of the source.
This is deliberate — see `day-2/02-layer-caching.md`.
