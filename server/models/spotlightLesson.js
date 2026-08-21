const { DataTypes } = require("sequelize");
const sequelize = require("../connection.js");

const SpotlightLesson = sequelize.define(
  "spotlightLessons",
  {
    sys_id: {
      type: DataTypes.UUID,
      primaryKey: true,

      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    title: {
      type: DataTypes.CHAR(125),
      allowNull: false,
    },
    url: {
      type: DataTypes.CHAR(255),
      allowNull: false,
    },
  },
  {
    tableName: "spotlightLessons",
    timestamps: false,
    // 1. Automatically hide sys_id when querying lessons
    defaultScope: {
      attributes: { exclude: ["sys_id"] },
    },
  },
);

module.exports = SpotlightLesson;
