// 1. Initialize connection
const { DataTypes } = require("sequelize");
const sequelize = require("../connection.js");

// 2. Define User model
const menuItem = sequelize.define(
  "menuItem",
  {
    sys_id: {
      type: DataTypes.UUID,
      defaultValue: sequelize.literal("UNIQUEIDENTIFIER DEFAULT NEWSEQUENTIALID()"),
      primaryKey: true,
      allowNull: false,
    },
    header: {
      type: DataTypes.CHAR(40),
      allowNull: false,
    },
    subMenu: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "menu_items",
    timestamps: false,
  },
);

module.exports = menuItem;
