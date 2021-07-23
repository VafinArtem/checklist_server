const express = require("express");
const path = require("path");
const cors = require("cors");
const sequelize = require("./utils/database");
const session = require("express-session");
const SeqStore = require("connect-session-sequelize")(session.Store);
const todoRoutes = require("./routes/todo");
const authRoutes = require("./routes/auth");
// eslint-disable-next-line node/no-unpublished-require
const security = require("./utils/security");

const corsOptions = {
  origin: "http://127.0.0.1:1337",
  optionsSuccessStatus: 200,
};
const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(session({
  secret: security.express.SECRET,
  store: new SeqStore({
    db: sequelize,
  }),
  resave: false,
  saveUninitialized: false,
}))
app.use(express.json());
app.use("/api/todos", cors(corsOptions), todoRoutes);
app.use("/api/auth", cors(corsOptions), authRoutes);


app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
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
