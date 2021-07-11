const express = require("express");
const path = require("path");
const checkRoutes = require("./routes/checklist");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/check", checkRoutes);

app.use((req, res, next) => {
  res.sendFile(`./index.html`);
});

app.listen(PORT);
