const express = require("express");
// const path = require("path");
const cors = require("cors");
const sequelize = require("./utils/database");
const checkRoutes = require("./routes/checklist");

const app = express();
const PORT = process.env.PORT || 3001;

const corsOptions = {
  origin: "http://127.0.0.1:3000",
  optionsSuccessStatus: 200,
};

// app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use("/api/cards", cors(corsOptions), checkRoutes);

// app.use((req, res, next) => {
// res.sendFile(`./index.html`);
// });

const start = async () => {
  try {
    await sequelize.sync();
    app.listen(PORT);
  } catch (error) {
    console.log(error);
  }
};

start();
