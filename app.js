const express = require("express");
const path = require("path");
const cors = require("cors");
const sequelize = require("./utils/database");
const checkRoutes = require("./routes/checklist");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/cards", checkRoutes);

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
