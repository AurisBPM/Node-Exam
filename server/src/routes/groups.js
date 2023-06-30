const express = require('express');
const mysql = require('mysql2');
const DB_CONFIG = require('../config/db-config');
const router = express.Router();
const mysqlPool = mysql.createPool(DB_CONFIG).promise();
const { authenticate } = require("./middleware");
require("dotenv").config();

router.get("/groups", authenticate, async (req, res) => {
    try {
        const user = req.user;
        console.log(user);
      const [groups] = await mysqlPool.execute(
        "SELECT * FROM `groups` left join accounts on groups.id = accounts.group_id where user_id =" + user.id, 
      );
     
      return res.json(groups);
    } catch (error) {
      console.log(error);
      return res.status(500).end();
    }
  });

  router.post("/groups", authenticate, async (req, res) => {
    const payload = req.body;
    console.log(payload);
    try {
      const [response] = await mysqlPool.execute(
        "INSERT INTO `groups` (name) VALUES (?)",
        [payload.name],
      );
      res.status(200).json(response);
    } catch (err) {
      console.log(err);
      res.redirect("/");
    }
  });

module.exports = router;