// 1. Initialize connection
const { DataTypes } = require("sequelize");
const sequelize = require("../connection.js");

// 2. Define User model
const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.CHAR(20),
      allowNull: false,
    },
    firstname: { type: DataTypes.CHAR(20) },
    lastname: { type: DataTypes.CHAR(20) },
    email: { type: DataTypes.CHAR(40) },
  },
  {
    tableName: "Users",
    timestamps: true,
  },
);

// // 3. Define Car model
// const Car = sequelize.define('Car', {
//   make: DataTypes.STRING,
//   model: DataTypes.STRING
// });

// // 4. Set up associations
// User.hasMany(Car, { foreignKey: 'userId' });

module.exports = User;
