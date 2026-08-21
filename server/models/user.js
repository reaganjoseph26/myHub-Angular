// 1. Initialize connection
const { DataTypes } = require("sequelize");
const sequelize = require("../connection.js");
const bcrypt = require("bcrypt");

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
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstname: { type: DataTypes.CHAR(20), allowNull: false },
    lastname: { type: DataTypes.CHAR(20), allowNull: false },
    email: {
      type: DataTypes.CHAR(40),
      allowNull: true,
      unique: true,
      validate: {
        isEmailTrueOrEmpty(value) {
          if (value !== null && value !== "" && value !== undefined) {
            const validator = require("validator");
            if (!validator.isEmail(value.trim())) {
              throw new Error("Must be a valid email address");
            }
          }
        },
      },
    },
    top_developer: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    // 1. Automatically hide password when querying users
    defaultScope: {
      attributes: { exclude: ["password", "createdAt", "updatedAt"] },
    },
    scopes: {
      withPassword: {
        attributes: { include: ["password"] },
      },
    },
    hooks: {
      // 2. Hash the password before saving a new user
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
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
