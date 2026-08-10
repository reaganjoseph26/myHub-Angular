require("dotenv").config();
const { Sequelize } = require("sequelize");

let sequelize;

sequelize = new Sequelize({
  dialect: "mssql",
  // Directs Sequelize to use msnodesqlv8 instead of tedious
  dialectModule: require("msnodesqlv8/lib/sequelize"),
  host: "localhost",
  database: process.env.DB_NAME,
  dialectOptions: {
    options: {
      instanceName: "SQLEXPRESS", // Targets the \SQLEXPRESS instance
      encrypt: false, // Disables encryption for the connection
    },
  },
});

module.exports = sequelize;
