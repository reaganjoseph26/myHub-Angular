const express = require("express");
const { Sequelize } = require("sequelize");
const path = require("path");
// const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const sequelize = require("./connection.js");
const User = require("./models/user.js");
const SpotlightLesson = require("./models/spotlightLesson.js");

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
  var payload = user.dataValues;
  console.log(payload, " user in generate token ");

  const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7m",
  });

  res.cookie("jwt", token, {
    httpOnly: true, // ensure users browser or others cant use javascript to access it
    secure: true,
    sameSite: "strict", // stops browsers from sending cross browser cookie to prevent attack
    maxAge: 420000,
  });
  return token;
}

function authenticateToken(req, res, next) {
  //console.log(req.headers);
  console.log(req.query, "#####");
  const authHeader = req.headers["cookie"];
  const token = authHeader && authHeader.split("jwt=")[1];

  if (!token) {
    return res.status(401).json({ message: "No token found." }); //do not have token and not authorized
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
    const currentUser = await User.findOne({
      where: { username: user.username },
    });

    if (err || !currentUser) {
      //attempt to give user refresh token TBD

      if (err?.name === "TokenExpiredError") {
        console.log("expired");
        // const response = await fetch("http://localhost:3000/api/token", {
        //   method: "GET",
        //   headers: { "Content-Type": "application/json" },
        //   body: { token: user.token },
        // });

        // const newToken = await response.json();
        // //res.json(data); // Send data back to the client
        // console.log(newToken, " newToken");
      }

      return res.status(403).json({ message: " Token has expired." }); // have token but expired
    }

    res.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate",
    );
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    res.set("Surrogate-Control", "no-store");
    req.user = user;
    next();
  });
}

app.get("/api/validateToken", authenticateToken, async (req, res) => {
  try {
    res.status(200).json(true);
  } catch (error) {
    console.log("Error: ", error);
    return res
      .status(500)
      .send("Error attempting to validate user token. Error: ", error);
  }
});

app.post("/api/signup", async (req, res) => {
  try {
    console.log("### ", req.body);

    const newUser = await User.create(req.body);
    const token = generateToken(newUser, res);
    newUser.token = token;
    //const refreshToken = jwt.sign(newUser, process.env.REFRESH_TOKEN_SECRET);
    //refreshTokensArr.push(refreshToken);

    res.status(201).json(newUser);
  } catch (error) {
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
  console.log("### body", req.body);

  try {
    const foundUser = await User.findOne({
      where: { username: req.body.username },
      attributes: { include: ["password"] },
    });

    if (!foundUser) {
      return res
        .status(400)
        .json({ message: "Incorrect username or password." });
    }

    if (await bcrypt.compare(req.body.password, foundUser.password)) {
      const token = generateToken(foundUser, res);

      console.log(foundUser.dataValues, " foundUser");

      var userObj = foundUser.dataValues;
      // userObj.token = token;
      delete userObj["password"];
      //console.log(userObj, " userObj");
      // const refreshToken = jwt.sign(
      //   foundUser,
      //   process.env.REFRESH_TOKEN_SECRET,
      // );

      //refreshTokensArr.push(refreshToken);

      return res.status(200).json({ user: userObj, token: token });
    } else {
      return res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({ error: error.message });
  }
});

app.post("/api/logOut", async (req, res) => {
  try {
    //remove refreshToken
    //console.log(refreshTokensArr, " refreshTokensArr ");
    //refreshTokensArr = refreshTokensArr.filter(token !== req.body.token);

    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0), // expire the cookie immediately/current time
      sameSite: "strict",
    });

    return res.status(200).json({
      status: "success",
      message: "SuccessfullyLoggedOut",
    });
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).send();
  }
});

app.get("/api/getUserData", authenticateToken, (req, res) => {
  User.findOne({ where: { username: req.user.username.trim() }, raw: true })
    .then((user) => res.json(user))
    .catch((err) => {
      console.log("Error fetching user profile data. Error: ", err);
      res.status(500).json({ error: "Failed to fetch userdata" });
    });
});

app.get("/api/getHomeData", authenticateToken, async (req, res) => {
  try {
    const [lessons, topDevs] = await Promise.all([
      SpotlightLesson.findAll({ where: { active: true }, raw: true }),
      User.findAll({ where: { top_developer: true }, raw: true }),
    ]);

    res.json({
      lessons,
      topDevs,
    });
  } catch (error) {
    console.log("Error querying SpotlightLesson. Error: ", err);
    res.status(500).json({ error: "Failed to fetch home data" });
  }

  // SpotlightLesson.findAll({ where: { active: true }, raw: true })
  //   .then((lessons) => res.json(lessons))
  //   .catch((err) => {
  //     console.log("Error querying SpotlightLesson. Error: ", err);
  //   });
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
  User.findAll({ attributes: { exclude: ["password"] }, raw: true })
    .then((users) => res.json(users))
    .catch((err) => {
      console.log("Error fetching all users. Error: ", error);
    });
});

sequelize.sync({ force: false }).then(async () => {
  try {
    await sequelize.authenticate();

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
