const { DataTypes } = require("sequelize");
const sequelize = require("../connection.js");
const User = require("./user.js");
const Roles = require("./roles.js");
const Follows = require("./follows.js");

const userProfile = sequelize.define(
  "user_profile",
  {
    sys_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    img: {
      type: DataTypes.BLOB("long"),
      allowNull: true,
    },
    bio: {
      type: DataTypes.STRING(120),
      allowNull: true,
      defaultValue: "",
    },
    portfolio_link: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    linkedin_link: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    role: {
      type: DataTypes.UUID, // or INTEGER / UNIQUEIDENTIFIER depending on your MSSQL setup
      allowNull: true,
      references: {
        model: 'roles', // matches the table name of the role model
        key: "sys_id",
      },
    },
  },
  {
    tableName: "user_profile",
    timestamps: true,
  },
);

userProfile.associate = (models) => {
  userProfile.belongsTo(models.User, { foreignKey: "userId" });
  // userProfile.belongsTo(models.Roles, {
  //   foreignKey: {
  //     name: "role",
  //     as: 'role'
  //   },
  // });

  userProfile.belongsTo(models.roles, {
    foreignKey: "role",
    targetKey: "sys_id",
  });

  userProfile.belongsToMany(userProfile, {
    as: "Followers",
    through: Follows,
    foreignKey: "following_id",
    otherKey: "follower_id",
  });

  userProfile.belongsToMany(userProfile, {
    as: "Following",
    through: Follows,
    foreignKey: "follower_id",
    otherKey: "following_id",
  });
};

// userSettings.belongsTo(User, {
//   foreignKey: "userId", // Customizes the column name to 'userId' instead of 'UserId'
//   targetKey: "id", // References the 'id' column on the User model
// });

module.exports = userProfile;
