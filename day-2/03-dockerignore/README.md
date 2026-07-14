# 5. `.dockerignore`

Same idea as `.gitignore`. Without it you'll accidentally copy `node_modules`, `.git`, secrets, and logs into your image — this bloats size and busts your build cache.

Copy the `.dockerignore` in this folder into the root of any project you containerize, then tailor it to the language/framework (see the language-specific extras below).

| Stack | Extra entries worth adding |
|---|---|
| Node.js | `node_modules`, `npm-debug.log*`, `.npm` |
| Python | `__pycache__`, `*.pyc`, `.venv`, `*.egg-info` |
| Java/Maven | `target/`, `*.class` |
| Go | (usually minimal — `bin/`, `vendor/` if not committed) |
| React/frontend | `build/`, `dist/`, `.cache` |
