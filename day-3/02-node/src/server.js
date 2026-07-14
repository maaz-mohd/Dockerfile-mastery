const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Hello from a multi-stage Node.js build!"));
app.get("/health", (req, res) => res.json({ status: "ok" }));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on ${port}`));
