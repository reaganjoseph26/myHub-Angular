const { DataTypes } = require("sequelize");
const sequelize = require("../connection.js");

const follows = sequelize.define(
  "follows",
  {
    follower_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "Users", // Matches target table name
        key: "id",
      },
      onDelete: "CASCADE",
    },
    following_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "Users", // Matches target table name
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "follows",
    timestamps: true, // Keeps Sequelize from trying to auto-manage timestamps if you handle defaults manually
  },
);

module.exports = follows;
