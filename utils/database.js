const Sequelize = require("sequelize");
const {
  sql: {DB_NAME, USER_NAME, PASSWORD},
} = require("./security");

const sequelize = new Sequelize(DB_NAME, USER_NAME, PASSWORD, {
  host: `localhost`,
  dialect: `mysql`,
});

module.exports = sequelize;
