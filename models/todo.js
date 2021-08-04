const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const todo = sequelize.define(`todo`, {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: Sequelize.INTEGER,
  },
  text: {
    type: Sequelize.STRING(1234),
    allowNull: false,
  },
  cathegory: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  isComplite: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
});

module.exports = todo;
