const Sequelize = require("sequelize");

const SCHEMA_NAME = `maffin-checklist`;
const USER_NAME = `root`;
const PASSWORD = `root`;

const sequelize = new Sequelize(SCHEMA_NAME, USER_NAME, PASSWORD, {
  host: `localhost`,
  dialect: `mysql`,
});

module.exports = sequelize;
