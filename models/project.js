const Sequelize = require("sequelize");

const sequelize = require("../utils/database");
const todo = require("./todo");

const project = sequelize.define(`project`, {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: Sequelize.INTEGER,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

project.hasMany(todo);


module.exports = project;
