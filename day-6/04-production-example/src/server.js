const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Production-grade Dockerized Node.js API"));
app.get("/health", (req, res) => res.json({ status: "ok" }));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on ${port}`));
