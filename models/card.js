const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const card = sequelize.define(`card`, {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: Sequelize.INTEGER,
  },
  text: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  project: {
    type: Sequelize.STRING,
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

module.exports = card;
