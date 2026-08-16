const express = require("express");
const router = require("express").Router();
const User = require("../models/user.js");

router.get("users/:userId", (req, res) => {
  User.findOne({ where: { id: req.params.userId } })
    .then((users) => res.json(users))
    .catch((err) => {
      console.log("Error fetching all users. Error: ", error);
    });
});

router.get("getActiveUsers", (req, res) => {
  User.findAll({ attributes: { exclude: ["password"] } })
    .then((users) => res.json(users))
    .catch((err) => {
      console.log("Error fetching all users. Error: ", error);
    });
});

router.post("/", (req, res) => {
  console.log("req post user", req.body);
  User.create({
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
  })
    .then((newUser) => res.json(newUser))
    .catch((err) => {
      console.log("Error creating new user.Error: ", error);
    });
});

module.exports = router;
