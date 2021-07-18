const express = require("express");
const path = require("path");
const cors = require("cors");
const sequelize = require("./utils/database");
const session = require("express-session");
const SeqStore = require("connect-session-sequelize")(session.Store);
const checkRoutes = require("./routes/checklist");
const authRoutes = require("./routes/auth");

const corsOptions = {
  origin: "http://127.0.0.1:1337",
  optionsSuccessStatus: 200,
};
const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(session({
  secret: `some secret value`,
  store: new SeqStore({
    db: sequelize,
  }),
  resave: false,
  saveUninitialized: false,
}))
app.use(express.json());
app.use("/api/cards", cors(corsOptions), checkRoutes);
app.use("/api/auth", cors(corsOptions), authRoutes);

app.use((req, res, next) => {
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
