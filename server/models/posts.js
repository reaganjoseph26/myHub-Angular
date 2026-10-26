// 1. Initialize connection
const { DataTypes } = require("sequelize");
const sequelize = require("../connection.js");
const User = require("./user.js");

// 2. Define User model
const post = sequelize.define(
  "posts",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    post: {
      type: DataTypes.CHAR(15),
      allowNull: false,
    },
    replyToId: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: "posts", // targets itself
        key: "id",
      },
    },
    // user: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   defaultValue: true,
    // },
  },
  {
    tableName: "posts",
    timestamps: true,
  },
);

post.belongsTo(User, {
  foreignKey: "user", // Customizes the column name to 'userId' instead of 'UserId'
  targetKey: "id", // References the 'id' column on the User model
});
post.hasMany(post, { as: "replies", foreignKey: "replyToId" });

module.exports = post;
