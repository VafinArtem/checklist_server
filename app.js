const express = require("express");
const path = require("path");
const cors = require("cors");
const sequelize = require("./utils/database");
const checkRoutes = require("./routes/checklist");

const app = express();
const PORT = process.env.PORT || 3001;

var corsOptions = {
  origin: "http://127.0.0.1:3000",
  optionsSuccessStatus: 200,
};

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/cards", checkRoutes);

app.use((req, res, next) => {
  const allowedOrigins = [
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8020",
    "http://localhost:8020",
    "http://127.0.0.1:9000",
    "http://localhost:9000",
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  //res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8020');
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", true);
  res.sendFile(`./index.html`);
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
