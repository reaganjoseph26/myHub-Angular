const express = require("express");
const { Sequelize } = require("sequelize");
// const path = require("path");
// const fs = require("fs");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");
require("dotenv").config();

//creates a signed cookie that prevents client-side tampering; if the value is changed, the server will detect the signature mismatch and reject it.
// const cookieParser = require("cookie-parser");
const app = express();
const PORT = process.env.PORT; // Define a port number
// var refreshTokensArr = getRefreshTokens();
// const userRoutes = require("./public/routes/userRoutes.js");
// const menuItems = require("./public/models/menuItems.js");
// const {
//   attribute,
// } = require("@sequelize/core/_non-semver-use-at-your-own-risk_/expression-builders/attribute.js");

app.use(express.json());
// app.use(express.urlencoded({ limit: "50mb", extended: true }));

// app.use(express.static(__dirname + "/public"));
// app.use(express.static(__dirname + "/public/componets/login"));
// app.use(express.static(__dirname + "/public/componets/sign-up"));
// app.use(express.json());
// app.use(cookieParser());

// app.use("/users", userRoutes);

// app.use((req, res) => {
//   res.status(404).sendFile(path.join(__dirname, "public/views/404.html"));
// });

const sequelize = new Sequelize({
  dialect: "mssql",
  // Directs Sequelize to use msnodesqlv8 instead of tedious
  dialectModule: require("msnodesqlv8/lib/sequelize"),
  host: "localhost",
  database: process.env.DB_NAME,
  dialectOptions: {
    options: {
      instanceName: "SQLEXPRESS", // Targets the \SQLEXPRESS instance
      encrypt: false, // Disables encryption for the connection
    },
  },
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Node and Sequelize are connected!" });
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
