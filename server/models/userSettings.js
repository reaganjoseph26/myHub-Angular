const { DataTypes } = require("sequelize");
const sequelize = require("../connection.js");
const User = require("./user.js");

const userSettings = sequelize.define(
  "user_settings",
  {
    sys_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    // userId: {
    //   type: DataTypes.CHAR(15),
    //   allowNull: false,
    // },
    allow_search: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    allow_nominations: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    allow_like_followers_alerts: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    allow_post_replies_alerts: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    allow_weekly_changes_alerts: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    show_location: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    show_likes: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    show_followers: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    show_achievements: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    show_socials: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "user_settings",
    timestamps: false,
  },
);

userSettings.associate = (models) => {
  userSettings.belongsTo(models.User, { foreignKey: "userId" });
};

// userSettings.belongsTo(User, {
//   foreignKey: "userId", // Customizes the column name to 'userId' instead of 'UserId'
//   targetKey: "id", // References the 'id' column on the User model
// });

module.exports = userSettings;
