const express = require("express");
const { Sequelize } = require("sequelize");
const path = require("path");
// const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const sequelize = require("./connection.js");
const User = require("./models/user.js");

//creates a signed cookie that prevents client-side tampering; if the value is changed, the server will detect the signature mismatch and reject it.
const cookieParser = require("cookie-parser");
const app = express();
const PORT = process.env.PORT; // Define a port number
const menuItems = require("./models/menuItem.js");
// var refreshTokensArr = getRefreshTokens();
const userRoutes = require("./routes/userRoutes.js");
const cors = require("cors");
// const menuItems = require("./public/models/menuItems.js");
// const {
//   attribute,
// } = require("@sequelize/core/_non-semver-use-at-your-own-risk_/expression-builders/attribute.js");

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

//app.use("/api", userRoutes);
function generateToken(user, res) {
  var payload = user;

  const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7m",
  });

  res.cookie("jwt", token, {
    httpOnly: true, // ensure users browser or others cant use javascript to access it
    secure: true,
    sameSite: "strict", // stops browsers from sending cross browser cookie to prevent attack
    maxAge: 2 * 60 * 60 * 1000, //420000,
  });
  return token;
}

app.post("/api/signup", async (req, res) => {
  try {
    console.log("### ", req.body);

    const newUser = await User.create(req.body);

    // var currentUsers = await getAllUsers();
    // var updatedUsers = currentUsers.concat(newUser);

    // const token = generateToken(newUser, res);
    //const refreshToken = jwt.sign(newUser, process.env.REFRESH_TOKEN_SECRET);
    //refreshTokensArr.push(refreshToken);

    res.status(201).json(newUser);
  } catch (error) {
    // console.log("Error ValidationErrorItem: ", error?.errors[0].message);
    // console.log("Error: ", error?.name);
    console.log("Error: ", error);

    if (
      error?.name === "SequelizeUniqueConstraintError" &&
      error?.errors[0].message === "UQ_Users_username must be unique"
    ) {
      return res.status(409).send("Username is already taken.");
    } else if (
      error?.name === "SequelizeUniqueConstraintError" &&
      error?.errors[0].message === "UQ_email must be unique"
    ) {
      return res.status(409).send("Email is already taken.");
    } else {
      return res
        .status(500)
        .send("Your profile cannot be created at this time.");
    }
  }
});

app.post("/api/login", async (req, res) => {
  console.log("### bodyy", req.body);
  console.log("### username", req.body.username);
  console.log("### password", req.body.password);

  const foundUser = await User.findOne({
    where: { username: req.body.username },
  });

  if (!foundUser) {
    return res.status(400).json({ message: "User does not exist" });
  }

  //If user exist compare password
  try {
    //if password is the same
    if (await bcrypt.compare(req.body.password, foundUser.password)) {
      const token = generateToken(foundUser, res);
      // const refreshToken = jwt.sign(
      //   foundUser,
      //   process.env.REFRESH_TOKEN_SECRET,
      // );

      //refreshTokensArr.push(refreshToken);

      return res.status(200).json({
        status: "success",
        message: "Login Successful",
        redirectTo: "/home",
        data: {
          user: { username: foundUser.username, userId: foundUser.id },
        },
        accessToken: token,
        //refreshToken: refreshToken,
      });
      //res.redirect("/home");
    } else {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).send();
  }
});

app.get("/api/home", (req, res) => {
  const testData = {
    id: 1,
    username: "testuser",
    firstname: "Test",
    lastname: "User",
    email: "testuser@test.com",
  };
  res.json(testData);
});

app.get("api/profile/:username", (req, res) => {
  console.log("%%%", req.body);
  User.findOne({ where: { username: req.body.user.username } })
    .then((user) => res.json(user))
    .catch((err) => {
      console.log("Error fetching user profile data. Error: ", error);
    });
});

app.get("/api/getDefaultTheme", async (req, res) => {
  try {
    const defaultTheme = {};
    const queryData = await sequelize.query(
      `
     SELECT style, options FROM themes WHERE [default] = 1
    `,
      { plain: true },
    );

    //console.log(queryData, " query data");

    defaultTheme.style = queryData.style;
    defaultTheme.options = {
      ...JSON.parse(queryData.options),
      color: Number(JSON.parse(queryData.options).color),
      color1: Number(JSON.parse(queryData.options)?.color1),
      color2: Number(JSON.parse(queryData.options)?.color2),
      backgroundColor: Number(JSON.parse(queryData.options)?.backgroundColor),
      activeColor: Number(JSON.parse(queryData.options)?.activeColor),
    };

    res.json(defaultTheme);
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({ error: "Theme not found" });
  }
});

app.get("/api/getActiveUsers", (req, res) => {
  User.findAll({ attributes: { exclude: ["password"] } })
    .then((users) => res.json(users))
    .catch((err) => {
      console.log("Error fetching all users. Error: ", error);
    });
});

// app.listen(PORT, () => console.log('Now listening'));
sequelize.sync({ force: false }).then(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    // const activeMenuItems = await menuItems.findAll({
    //   attributes: { exclude: ["sys_id"] },
    // });
    // console.log(
    //   activeMenuItems.map((item) => item.toJSON()),
    //   " activeMenuItems",
    // );
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
