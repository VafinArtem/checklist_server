const Sequelize = require("sequelize");
/* eslint-disable */
const {
  sql: {DB_NAME, USER_NAME, PASSWORD},
} = require(`./security`);
/* eslint-enable */

const sequelize = new Sequelize(DB_NAME, USER_NAME, PASSWORD, {
  host: `localhost`,
  dialect: `mysql`,
});

module.exports = sequelize;
