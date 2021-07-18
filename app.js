const express = require("express");
// const path = require("path");
const cors = require("cors");
const sequelize = require("./utils/database");
const checkRoutes = require("./routes/checklist");
const authRoutes = require("./routes/auth");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 3001;

const corsOptions = {
  origin: "http://127.0.0.1:1337",
  optionsSuccessStatus: 200,
};

// app.use(express.static(path.join(__dirname, "public")));
app.use(session({
  secret: `some secret value`,
  resave: false,
  saveUninitialized: false,
}))
app.use(express.json());
app.use("/api/cards", cors(corsOptions), checkRoutes);
app.use("/api/auth", cors(corsOptions), authRoutes);

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
