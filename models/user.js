const Sequelize = require("sequelize");

const sequelize = require("../utils/database");
const project = require("./project");

const user = sequelize.define(`user`, {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: Sequelize.INTEGER,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  restoreToken: {
    type: Sequelize.STRING,
  },
  restoreTokenExp: {
    type: Sequelize.DATE,
  },
});

user.hasMany(project);

module.exports = user;
