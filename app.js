const express = require("express");
const path = require("path");
const sequelize = require("./utils/database");
const checkRoutes = require("./routes/checklist");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/cards", checkRoutes);

app.use((req, res, next) => {
  res.sendFile(`./index.html`);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "origin, content-type, accept");
});

const start = async () => {
  try {
    await sequelize.sync();
    app.listen(PORT);
  } catch (error) {
    console.log(error);
  }
};

start();
